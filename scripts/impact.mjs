import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const args = process.argv.slice(2);

function option(name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function git(repo, ...gitArgs) {
  return execFileSync("git", gitArgs, { cwd: repo, encoding: "utf8" }).trim();
}

function parseGenerated(source) {
  return JSON.parse(source.replace(/^export const diffReviewMap = /, "").replace(/ as const;\s*$/, ""));
}

function symbolKey(symbol) {
  return `${symbol.file}#${symbol.name ?? symbol.symbol}`;
}

const workingTree = args.includes("--working-tree");
const baseRef = option("--base", workingTree ? "HEAD" : "main");
const headRef = workingTree ? "WORKTREE" : option("--head", "HEAD");
const range = `${baseRef}...${headRef}`;
const repo = await realpath(path.resolve(option("--repo", process.cwd())));
const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "observatory-impact-"));
const generatedPath = path.join(temporaryDirectory, "diff-data.ts");

try {
  execFileSync(process.execPath, [
    path.join(scriptDir, "analyze-diff.mjs"),
    workingTree ? baseRef : range,
    "--repo", repo,
    "--output", generatedPath,
    ...(workingTree ? ["--working-tree"] : []),
  ], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const data = parseGenerated(await readFile(generatedPath, "utf8"));
  const changedPaths = new Set(data.changedFiles.map((file) => file.path));
  const fileByPath = new Map(data.changedFiles.map((file) => [file.path, file]));
  const rawSymbols = data.reviewUnits.flatMap((unit) => unit.changedSymbols);
  const changedSymbols = rawSymbols.map((symbol) => {
    const file = fileByPath.get(symbol.file);
    const directConsumerFiles = [...new Set(symbol.directConsumers.map((consumer) => consumer.file))].sort();
    return {
      file: symbol.file,
      symbol: symbol.name,
      kind: symbol.kind,
      change_type: symbol.changeType,
      exported: symbol.exported,
      changed_lines: symbol.changedLines,
      direct_consumers: symbol.directConsumers.map((consumer) => ({
        file: consumer.file,
        ...(consumer.symbol ? { symbol: consumer.symbol } : {}),
        modified_in_change: changedPaths.has(consumer.file),
      })),
      direct_consumer_files: directConsumerFiles.length,
      transitive_dependent_files: file?.transitiveDependentCount ?? 0,
      nearby_test_changed: Boolean(file?.nearbyTestChanges.length),
      nearby_test_changes: file?.nearbyTestChanges ?? [],
      recent_bugfix_commits: file?.history.recentBugFixCommits ?? 0,
    };
  }).sort((a, b) => a.file.localeCompare(b.file) || a.symbol.localeCompare(b.symbol));

  const consumerMap = new Map();
  for (const symbol of changedSymbols) {
    for (const consumer of symbol.direct_consumers) {
      const current = consumerMap.get(consumer.file) ?? {
        file: consumer.file,
        modified_in_change: consumer.modified_in_change,
        reached_by_changed_symbols: [],
      };
      current.reached_by_changed_symbols.push(symbolKey(symbol));
      consumerMap.set(consumer.file, current);
    }
  }
  const affectedConsumers = [...consumerMap.values()]
    .map((consumer) => ({
      ...consumer,
      reached_by_changed_symbols: [...new Set(consumer.reached_by_changed_symbols)].sort(),
    }))
    .sort((a, b) => a.file.localeCompare(b.file));

  const testSignals = data.changedFiles
    .filter((file) => file.category === "runtime")
    .map((file) => ({
      file: file.path,
      nearby_test_change: file.nearbyTestChanges.length ? "detected" : "not_detected",
      nearby_test_changes: file.nearbyTestChanges,
      statement: file.nearbyTestChanges.length
        ? "At least one deterministic nearby-test match changed."
        : "No deterministic nearby-test match changed; this does not prove the code is untested.",
    }))
    .sort((a, b) => a.file.localeCompare(b.file));

  const attention = [];
  for (const symbol of changedSymbols.filter((item) => item.exported)) {
    const unmodifiedConsumers = symbol.direct_consumers
      .filter((consumer) => !consumer.modified_in_change)
      .map((consumer) => consumer.file);
    if (unmodifiedConsumers.length) {
      attention.push({
        id: `changed-symbol-reaches-unmodified-consumers:${symbolKey(symbol)}`,
        priority: symbol.nearby_test_changed ? "medium" : "high",
        type: "changed_symbol_reaches_unmodified_consumers",
        file: symbol.file,
        symbol: symbol.symbol,
        reason: "A changed exported symbol reaches consumers that were not modified in this change.",
        evidence: {
          unmodified_consumer_files: [...new Set(unmodifiedConsumers)].sort(),
          nearby_test_changed: symbol.nearby_test_changed,
          transitive_dependent_files: symbol.transitive_dependent_files,
        },
      });
    } else if (symbol.direct_consumers.length && !symbol.nearby_test_changed) {
      attention.push({
        id: `changed-export-without-nearby-test-change:${symbolKey(symbol)}`,
        priority: "medium",
        type: "changed_export_without_nearby_test_change",
        file: symbol.file,
        symbol: symbol.symbol,
        reason: "An exported symbol with detected consumers changed without a deterministic nearby-test match changing.",
        evidence: {
          direct_consumer_files: symbol.direct_consumer_files,
          nearby_test_changed: false,
          transitive_dependent_files: symbol.transitive_dependent_files,
        },
      });
    }
  }
  for (const file of data.changedFiles.filter((item) =>
    item.category === "runtime" && item.transitiveDependentCount >= 10 && !item.nearbyTestChanges.length,
  )) {
    attention.push({
      id: `broad-file-impact-without-nearby-test-change:${file.path}`,
      priority: "high",
      type: "broad_file_impact_without_nearby_test_change",
      file: file.path,
      reason: "A changed runtime file has broad detected downstream impact and no deterministic nearby-test match changed.",
      evidence: {
        transitive_dependent_files: file.transitiveDependentCount,
        nearby_test_changed: false,
      },
    });
  }
  for (const file of data.changedFiles) {
    for (const finding of file.workflowAnalysis?.findings ?? []) {
      attention.push({
        id: `workflow:${file.path}:${finding.id}:${finding.line}`,
        priority: finding.severity,
        type: "github_actions_workflow_finding",
        file: file.path,
        reason: finding.title,
        evidence: {
          line: finding.line,
          detail: finding.detail,
          analysis_coverage: "partial",
        },
      });
    }
    if (file.analysisCoverage.status === "unassessed") {
      attention.push({
        id: `semantic-impact-unassessed:${file.path}`,
        priority: "medium",
        type: "semantic_impact_unassessed",
        file: file.path,
        reason: "Observatory measured this changed file but has no semantic analyzer for its file type.",
        evidence: {
          category: file.category,
          additions: file.additions,
          deletions: file.deletions,
        },
      });
    }
  }
  attention.sort((a, b) => ({ high: 0, medium: 1, low: 2 })[a.priority] - ({ high: 0, medium: 1, low: 2 })[b.priority] || a.id.localeCompare(b.id));

  const output = {
    schema_version: 1,
    analysis: "deterministic_static_impact",
    change: {
      base_ref: baseRef,
      head_ref: headRef,
      working_tree: workingTree,
      merge_base_commit: git(repo, "merge-base", baseRef, workingTree ? "HEAD" : headRef),
      head_commit: git(repo, "rev-parse", workingTree ? "HEAD" : headRef),
    },
    summary: {
      files_changed: data.summary.filesChanged,
      changed_lines: data.summary.additions + data.summary.deletions,
      runtime_files: data.summary.runtimeFiles,
      changed_symbols: changedSymbols.length,
      exported_changed_symbols: changedSymbols.filter((symbol) => symbol.exported).length,
      affected_consumer_files: affectedConsumers.length,
      unmodified_affected_consumer_files: affectedConsumers.filter((consumer) => !consumer.modified_in_change).length,
      review_units: data.reviewUnits.length,
      attention_items: attention.length,
      analyzed_files: data.summary.analyzedFiles,
      partially_analyzed_files: data.summary.partiallyAnalyzedFiles,
      classified_only_files: data.summary.classifiedOnlyFiles,
      unassessed_files: data.summary.unassessedFiles,
      workflow_findings: data.summary.workflowFindings,
    },
    changed_files: data.changedFiles.map((file) => ({
      path: file.path,
      ...(file.previousPath ? { previous_path: file.previousPath } : {}),
      status: file.status,
      category: file.category,
      analysis_coverage: file.analysisCoverage,
      ...(file.workflowAnalysis ? { workflow_analysis: file.workflowAnalysis } : {}),
      additions: file.additions,
      deletions: file.deletions,
      changed_line_ranges: file.changedLineRanges,
    })),
    changed_symbols: changedSymbols,
    affected_consumers: affectedConsumers,
    test_signals: testSignals,
    review_units: data.reviewUnits.map((unit) => ({
      id: unit.id,
      title: unit.title,
      priority: unit.priority,
      files: unit.files,
      changed_symbols: unit.changedSymbols.map(symbolKey).sort(),
      affected_consumers: unit.affectedConsumers,
      analysis_coverage: unit.analysisCoverage ?? "analyzed",
      workflow_findings: unit.workflowFindings ?? [],
      reasons: unit.reason,
    })),
    attention,
    analysis_limits: [
      "Consumer detection currently covers statically resolvable relative JavaScript and TypeScript imports.",
      "A consumer not modified in the change does not establish whether an agent or reviewer inspected it.",
      "No nearby-test change detected does not prove that behavior is untested or that tests were not run.",
      "GitHub Actions analysis is partial and pattern-based; it does not evaluate the behavior of executed actions or commands.",
      "Unassessed means semantic impact was not analyzed; it is not a low-risk verdict.",
      "This report is impact context, not a safety verdict.",
    ],
  };

  process.stdout.write(`${JSON.stringify(output, null, args.includes("--compact") ? 0 : 2)}\n`);
  if (args.includes("--fail-on-attention") && attention.length) process.exitCode = 2;
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
