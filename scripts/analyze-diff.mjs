import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const argv = process.argv.slice(2);

function option(name, fallback = null) {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : fallback;
}

const optionNames = new Set(["--repo", "--output", "--config"]);
const positional = argv.filter((value, index) => {
  if (value.startsWith("--")) return false;
  return index === 0 || !optionNames.has(argv[index - 1]);
});
const range = positional[0] ?? "main...HEAD";
const workingTree = argv.includes("--working-tree");
const repoArgument = await realpath(path.resolve(option("--repo", process.cwd())));
const outputPath = path.resolve(
  option("--output", path.join(projectRoot, "app", "generated", "diff-data.ts")),
);
const configPath = path.resolve(
  option("--config", path.join(repoArgument, "observatory.config.json")),
);

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function globRegex(pattern) {
  let source = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "*" && pattern[index + 1] === "*") {
      source += pattern[index + 2] === "/" ? "(?:.*/)?" : ".*";
      index += pattern[index + 2] === "/" ? 2 : 1;
    } else if (character === "*") source += "[^/]*";
    else if (character === "?") source += "[^/]";
    else source += character.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
  }
  return new RegExp(`^${source}$`);
}

const defaultConfig = {
  generatedPatterns: ["**/*.generated.ts", "**/*.pb.ts", "**/generated/**", "dist/**"],
  highPriorityDependentThreshold: 10,
  highPriorityBugFixThreshold: 2,
  strongCoChangeThreshold: 2,
};

let userConfig = {};
try {
  userConfig = JSON.parse(await readFile(configPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const config = { ...defaultConfig, ...userConfig };
const generatedMatchers = config.generatedPatterns.map(globRegex);

const gitRoot = git(["rev-parse", "--show-toplevel"], repoArgument);
const repoPrefix = toPosix(path.relative(gitRoot, repoArgument));
const pathspec = repoPrefix && repoPrefix !== "." ? ["--", repoPrefix] : [];
const relativeOutput = toPosix(path.relative(repoArgument, outputPath));
const outputIsInsideRepo = relativeOutput !== ".." && !relativeOutput.startsWith("../");
const [requestedBaseRef, requestedHeadRef] = range.includes("...")
  ? range.split("...")
  : range.includes("..")
    ? range.split("..")
    : [range, "HEAD"];
const diffHeadCommit = git(["rev-parse", workingTree ? "HEAD" : requestedHeadRef || "HEAD"], gitRoot);
const diffBaseCommit = workingTree
  ? git(["merge-base", requestedBaseRef, "HEAD"], gitRoot)
  : range.includes("...")
    ? git(["merge-base", requestedBaseRef, requestedHeadRef || "HEAD"], gitRoot)
  : git(["rev-parse", requestedBaseRef], gitRoot);
const diffComparison = workingTree ? diffBaseCommit : range;

try {
  git(["rev-parse", "--verify", workingTree ? requestedBaseRef : range], gitRoot);
} catch {
  // A three-dot range is not itself an object; diff below provides the useful error.
}

function relativeToRepo(file) {
  if (!repoPrefix || repoPrefix === ".") return file;
  return file.startsWith(`${repoPrefix}/`) ? file.slice(repoPrefix.length + 1) : file;
}

function parseNameStatus(raw) {
  const tokens = raw.split("\0").filter(Boolean);
  const entries = [];
  for (let index = 0; index < tokens.length;) {
    const code = tokens[index++];
    const kind = code[0];
    const first = tokens[index++];
    const second = kind === "R" || kind === "C" ? tokens[index++] : null;
    entries.push({
      status: kind === "A" ? "added" : kind === "D" ? "deleted" : kind === "R" ? "renamed" : "modified",
      path: relativeToRepo(kind === "R" ? second : first),
      previousPath: kind === "R" ? relativeToRepo(first) : null,
    });
  }
  return entries;
}

function parseNumstat(raw) {
  const values = new Map();
  const tokens = raw.split("\0");
  for (let index = 0; index < tokens.length;) {
    const token = tokens[index++];
    if (!token) continue;
    const [added, deleted, fileInToken] = token.split("\t");
    let file = fileInToken;
    if (!file) {
      index += 1; // Skip the old name.
      file = tokens[index++];
    }
    values.set(relativeToRepo(file), {
      additions: added === "-" ? 0 : Number(added),
      deletions: deleted === "-" ? 0 : Number(deleted),
    });
  }
  return values;
}

const nameEntries = parseNameStatus(
  git(["diff", "--name-status", "-z", "--find-renames", diffComparison, ...pathspec], gitRoot),
).filter((entry) => !outputIsInsideRepo || entry.path !== relativeOutput);
const numstat = parseNumstat(
  git(["diff", "--numstat", "-z", "--find-renames", diffComparison, ...pathspec], gitRoot),
);

if (workingTree) {
  const untracked = git([
    "ls-files", "--others", "--exclude-standard", "-z",
    ...(repoPrefix && repoPrefix !== "." ? ["--", repoPrefix] : []),
  ], gitRoot).split("\0").filter(Boolean).map(relativeToRepo);
  const existing = new Set(nameEntries.map((entry) => entry.path));
  for (const file of untracked) {
    if (existing.has(file) || (outputIsInsideRepo && file === relativeOutput)) continue;
    nameEntries.push({ status: "added", path: file, previousPath: null });
    try {
      const source = readFileSync(path.join(repoArgument, file), "utf8");
      numstat.set(file, { additions: source ? source.split("\n").length - (source.endsWith("\n") ? 1 : 0) : 0, deletions: 0 });
    } catch {
      numstat.set(file, { additions: 0, deletions: 0 });
    }
  }
  nameEntries.sort((a, b) => a.path.localeCompare(b.path));
}

function classify(file) {
  const lower = file.toLowerCase();
  const name = path.posix.basename(lower);
  if (generatedMatchers.some((matcher) => matcher.test(file))) return "generated";
  if (/^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?)$/.test(name)) return "config";
  if (/\.mdx?$/.test(lower) || lower.startsWith("docs/")) return "docs";
  if (/(^|\/)(tests?|__tests__)(\/|$)/.test(lower) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(lower)) return "test";
  if (
    /(^|\/)(\.github|config)(\/|$)/.test(lower) ||
    /(^|\/)(package\.json|tsconfig[^/]*\.json|[^/]*config\.[cm]?[jt]s|\.env[^/]*)$/.test(lower) ||
    /\.(ya?ml|toml|ini)$/.test(lower)
  ) return "config";
  if (/\.[cm]?[jt]sx?$/.test(lower)) return "runtime";
  return "unknown";
}

function isGitHubWorkflow(file) {
  return /^\.github\/workflows\/[^/]+\.ya?ml$/i.test(file);
}

function analysisCoverage(file) {
  const category = classify(file);
  if (isGitHubWorkflow(file)) {
    return {
      status: "partial",
      analyzer: "github-actions",
      explanation: "Workflow triggers, permissions, secret references, action pins, environments, and dangerous shell patterns were inspected.",
    };
  }
  if (category === "runtime") {
    return {
      status: "analyzed",
      analyzer: "javascript-typescript",
      explanation: "Changed symbols, relative imports, consumers, dependents, history, and nearby-test signals were inspected.",
    };
  }
  if (["test", "docs", "generated"].includes(category)) {
    return {
      status: "classified",
      analyzer: "file-classification",
      explanation: "The file was classified and measured, but its contents were not semantically analyzed.",
    };
  }
  return {
    status: "unassessed",
    analyzer: null,
    explanation: "The file was measured but Observatory has no semantic analyzer for this file type.",
  };
}

function showAtRef(file, ref) {
  const fullPath = repoPrefix && repoPrefix !== "." ? `${repoPrefix}/${file}` : file;
  try {
    return git(["show", `${ref}:${fullPath}`], gitRoot);
  } catch {
    return "";
  }
}

function showAtHead(file) {
  if (workingTree) {
    try {
      return readFileSync(path.join(repoArgument, file), "utf8");
    } catch {
      return "";
    }
  }
  return showAtRef(file, diffHeadCommit);
}

const allTracked = workingTree
  ? git([
      "ls-files", "--cached", "--others", "--exclude-standard", "-z",
      ...(repoPrefix && repoPrefix !== "." ? ["--", repoPrefix] : []),
    ], gitRoot).split("\0").filter(Boolean).map(relativeToRepo)
  : git(["ls-tree", "-r", "--name-only", diffHeadCommit, ...pathspec], gitRoot)
      .split("\n").filter(Boolean).map(relativeToRepo);
const trackedSet = new Set([
  ...allTracked,
  ...nameEntries.flatMap((entry) => [entry.path, entry.previousPath].filter(Boolean)),
]);

function resolveImport(from, specifier) {
  if (!specifier.startsWith(".")) return null;
  const raw = path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier));
  return [raw, `${raw}.ts`, `${raw}.tsx`, `${raw}.js`, `${raw}.jsx`, `${raw}.mjs`, `${raw}.cjs`,
    `${raw}/index.ts`, `${raw}/index.tsx`, `${raw}/index.js`].find((candidate) => trackedSet.has(candidate)) ?? null;
}

function importsFor(file, source) {
  const imports = new Set();
  const patterns = [
    /import\s+(?:[^'\"]+\s+from\s+)?["']([^"']+)["']/g,
    /export\s+[^'\"]+\s+from\s+["']([^"']+)["']/g,
    /require\(["']([^"']+)["']\)/g,
    /import\(["']([^"']+)["']\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const resolved = resolveImport(file, match[1]);
      if (resolved) imports.add(resolved);
    }
  }
  return [...imports];
}

function scriptKind(file) {
  if (/\.tsx$/i.test(file)) return ts.ScriptKind.TSX;
  if (/\.jsx$/i.test(file)) return ts.ScriptKind.JSX;
  if (/\.[cm]?js$/i.test(file)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

function isExported(node) {
  return Boolean(node.modifiers?.some((modifier) =>
    modifier.kind === ts.SyntaxKind.ExportKeyword || modifier.kind === ts.SyntaxKind.DefaultKeyword,
  ));
}

function isDefaultExported(node) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword));
}

function nodeName(node, fallback = "default") {
  if (!node?.name) return fallback;
  return node.name.getText().replace(/^['"]|['"]$/g, "");
}

function symbolInventory(file, source) {
  if (!source) return [];
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind(file));
  const symbols = [];
  const add = (node, name, kind, exported) => {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1;
    symbols.push({
      name,
      kind,
      exported,
      defaultExport: isDefaultExported(node),
      start,
      end,
      text: node.getText(sourceFile),
    });
  };

  for (const statement of sourceFile.statements) {
    if (ts.isFunctionDeclaration(statement)) add(statement, nodeName(statement), "function", isExported(statement));
    else if (ts.isClassDeclaration(statement)) {
      const className = nodeName(statement);
      const exported = isExported(statement);
      add(statement, className, "class", exported);
      for (const member of statement.members) {
        if (ts.isMethodDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member)) {
          add(member, `${className}.${nodeName(member)}`, "method", exported && !member.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword));
        }
      }
    } else if (ts.isInterfaceDeclaration(statement)) add(statement, nodeName(statement), "interface", isExported(statement));
    else if (ts.isTypeAliasDeclaration(statement)) add(statement, nodeName(statement), "type", isExported(statement));
    else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        add(declaration, nodeName(declaration), "variable", isExported(statement));
      }
    } else if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) add(element, nodeName(element), "export", true);
    }
  }
  return symbols;
}

function importBindings(file, source) {
  if (!source) return [];
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind(file));
  const bindings = [];
  for (const statement of sourceFile.statements) {
    if ((!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) ||
        !statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const dependency = resolveImport(file, statement.moduleSpecifier.text);
    if (!dependency) continue;
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause) bindings.push({ dependency, imported: "*", local: "*" });
      else if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          bindings.push({ dependency, imported: element.propertyName?.text ?? element.name.text, local: element.name.text });
        }
      }
      continue;
    }
    const clause = statement.importClause;
    if (!clause) continue;
    if (clause.name) bindings.push({ dependency, imported: "default", local: clause.name.text });
    if (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
      bindings.push({ dependency, imported: "*", local: clause.namedBindings.name.text });
    } else if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const element of clause.namedBindings.elements) {
        bindings.push({ dependency, imported: element.propertyName?.text ?? element.name.text, local: element.name.text });
      }
    }
  }
  return bindings;
}

function linesWithin(ranges, start, end) {
  const lines = [];
  for (const range of ranges) {
    for (let line = Math.max(range.start, start); line <= Math.min(range.end, end); line += 1) lines.push(line);
  }
  return [...new Set(lines)];
}

const importGraph = new Map();
const reverseGraph = new Map([...trackedSet].map((file) => [file, new Set()]));
const bindingsByDependency = new Map();
const headSymbolsByFile = new Map();
for (const file of allTracked.filter((value) => /\.[cm]?[jt]sx?$/.test(value))) {
  const source = showAtHead(file);
  const imports = importsFor(file, source);
  importGraph.set(file, imports);
  headSymbolsByFile.set(file, symbolInventory(file, source));
  for (const dependency of imports) reverseGraph.get(dependency)?.add(file);
  for (const binding of importBindings(file, source)) {
    const records = bindingsByDependency.get(binding.dependency) ?? [];
    records.push({ file, ...binding });
    bindingsByDependency.set(binding.dependency, records);
  }
}

function transitiveDependents(file, previousPath = null) {
  const seen = new Set();
  const queue = [
    ...(reverseGraph.get(file) ?? []),
    ...(previousPath ? reverseGraph.get(previousPath) ?? [] : []),
  ];
  while (queue.length) {
    const current = queue.shift();
    if (seen.has(current)) continue;
    seen.add(current);
    queue.push(...(reverseGraph.get(current) ?? []));
  }
  return seen;
}

const repositoryOutput = repoPrefix && repoPrefix !== "." ? `${repoPrefix}/${relativeOutput}` : relativeOutput;
const historyComparison = workingTree ? `${diffBaseCommit}..HEAD` : range;
const latestRelevantCommit = git([
  "log", "-1", "--format=%ct", historyComparison, "--",
  ...(repoPrefix && repoPrefix !== "." ? [repoPrefix] : ["."]),
  ...(outputIsInsideRepo ? [`:(exclude)${repositoryOutput}`] : []),
], gitRoot);
const historyAnchorEpoch = Number(latestRelevantCommit || git(["show", "-s", "--format=%ct", "HEAD"], gitRoot));
const historyStart = new Date((historyAnchorEpoch - 90 * 24 * 60 * 60) * 1000).toISOString();
const historyRaw = git([
  "log", `--since=${historyStart}`, "--date=short",
  "--format=@@%H%x09%ad%x09%an%x09%s", "--name-only", "--", ...(repoPrefix && repoPrefix !== "." ? [repoPrefix] : ["."]),
], gitRoot);
const history = [];
for (const block of historyRaw.split("@@").filter(Boolean)) {
  const [header, ...files] = block.trim().split("\n");
  const [hash, date, author, subject] = header.split("\t");
  history.push({ hash, date, author, subject, files: files.filter(Boolean).map(relativeToRepo) });
}

const historyByFile = new Map(nameEntries.map((entry) => [entry.path, {
  commits: 0, authors: new Map(), bugFixes: 0, coChanges: new Map(),
}]));
for (const commit of history) {
  const relevant = commit.files.filter((file) => historyByFile.has(file));
  for (const file of relevant) {
    const stat = historyByFile.get(file);
    stat.commits += 1;
    stat.authors.set(commit.author, (stat.authors.get(commit.author) ?? 0) + 1);
    if (/\b(fix|bug|hotfix|regression|revert)\b/i.test(commit.subject)) stat.bugFixes += 1;
    for (const peer of relevant) if (peer !== file) {
      stat.coChanges.set(peer, (stat.coChanges.get(peer) ?? 0) + 1);
    }
  }
}

function diffRanges(file) {
  const fullPath = repoPrefix && repoPrefix !== "." ? `${repoPrefix}/${file}` : file;
  const patch = git(["diff", "--unified=0", diffComparison, "--", fullPath], gitRoot);
  const oldRanges = [];
  const newRanges = [];
  for (const match of patch.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
    const oldStart = Number(match[1]);
    const oldCount = Number(match[2] ?? 1);
    const newStart = Number(match[3]);
    const newCount = Number(match[4] ?? 1);
    if (oldCount) oldRanges.push({ start: oldStart, end: oldStart + oldCount - 1 });
    if (newCount) newRanges.push({ start: newStart, end: newStart + newCount - 1 });
  }
  if (workingTree && !patch && nameEntries.find((entry) => entry.path === file)?.status === "added") {
    const additions = numstat.get(file)?.additions ?? 0;
    if (additions) newRanges.push({ start: 1, end: additions });
  }
  return { oldRanges, newRanges };
}

function likelyTestMatches(file, changedTests) {
  const extensionless = file.replace(/\.[cm]?[jt]sx?$/, "");
  const base = path.posix.basename(extensionless);
  const withoutSrc = extensionless.replace(/^src\//, "");
  return changedTests.filter((test) =>
    test === `${extensionless}.test.ts` || test === `${extensionless}.spec.ts` ||
    test === `${extensionless}.test.tsx` || test === `${extensionless}.spec.tsx` ||
    test.startsWith(`tests/${withoutSrc}.`) || test.includes(`/${base}.test.`) || test.includes(`/${base}.spec.`),
  );
}

const changedTests = nameEntries.filter((entry) => classify(entry.path) === "test").map((entry) => entry.path);
const rangesByPath = new Map(nameEntries.map((entry) => [entry.path, diffRanges(entry.path)]));

function workflowAnalysisFor(entry) {
  if (!isGitHubWorkflow(entry.path)) return null;
  const source = entry.status === "deleted"
    ? showAtRef(entry.previousPath ?? entry.path, diffBaseCommit)
    : showAtHead(entry.path);
  const ranges = rangesByPath.get(entry.path);
  const relevantRanges = entry.status === "deleted" ? ranges.oldRanges : ranges.newRanges;
  const changed = (line) => relevantRanges.some((range) => line >= range.start && line <= range.end);
  const lines = source.split("\n");
  const findings = [];
  const changedJobs = new Set();
  const changedTriggers = new Set();
  const secretNames = new Set();
  let jobsIndent = null;
  let currentJob = null;
  let onIndent = null;
  let permissionsIndent = null;

  const addFinding = (id, severity, title, detail, line) => {
    if (findings.some((finding) => finding.id === id && finding.line === line)) return;
    findings.push({ id, severity, title, detail, line });
  };

  for (const [index, rawLine] of lines.entries()) {
    const line = index + 1;
    const indentation = rawLine.match(/^\s*/)[0].length;
    const text = rawLine.trim();
    if (!text || text.startsWith("#")) continue;

    if (/^jobs:\s*(?:#.*)?$/.test(text)) {
      jobsIndent = indentation;
      currentJob = null;
      continue;
    }
    if (jobsIndent != null && indentation <= jobsIndent && !/^jobs:/.test(text)) {
      jobsIndent = null;
      currentJob = null;
    } else if (jobsIndent != null && indentation === jobsIndent + 2) {
      const jobMatch = text.match(/^([A-Za-z0-9_-]+):/);
      if (jobMatch) currentJob = jobMatch[1];
    }
    if (currentJob && changed(line)) changedJobs.add(currentJob);

    const onDeclaration = text.match(/^(?:on|['"]on['"]):\s*([^#]*)/);
    if (onDeclaration) {
      onIndent = indentation;
      const inlineTriggers = onDeclaration[1].trim().replace(/^\[|\]$/g, "").split(",").map((value) => value.trim()).filter(Boolean);
      if (changed(line)) inlineTriggers.forEach((trigger) => changedTriggers.add(trigger));
      if (changed(line) && inlineTriggers.includes("pull_request_target")) {
        addFinding(
          "pull-request-target",
          "high",
          "pull_request_target trigger changed",
          "This trigger runs in the base repository context; review checkout behavior, permissions, and secret access carefully.",
          line,
        );
      }
      continue;
    }
    if (onIndent != null && indentation <= onIndent) onIndent = null;
    const isTopLevelTrigger = onIndent != null && indentation === onIndent + 2;
    if (isTopLevelTrigger && changed(line)) {
      const trigger = text.match(/^([A-Za-z0-9_-]+):?/i)?.[1];
      if (trigger) changedTriggers.add(trigger);
    }

    if (/^permissions:\s*(?:#.*)?$/i.test(text)) {
      permissionsIndent = indentation;
      continue;
    }
    if (permissionsIndent != null && indentation <= permissionsIndent) permissionsIndent = null;

    if (!changed(line)) continue;

    if (isTopLevelTrigger && /^pull_request_target:\s*/.test(text)) {
      changedTriggers.add("pull_request_target");
      addFinding(
        "pull-request-target",
        "high",
        "pull_request_target trigger changed",
        "This trigger runs in the base repository context; review checkout behavior, permissions, and secret access carefully.",
        line,
      );
    }
    if (/^permissions:\s*write-all\b/i.test(text)) {
      addFinding("write-all", "high", "Write-all permissions introduced", "The workflow grants write access across every available GitHub token scope.", line);
    }
    const permission = permissionsIndent != null
      ? text.match(/^(actions|checks|contents|deployments|id-token|packages|pages|pull-requests|security-events|statuses):\s*write\b/i)
      : null;
    if (permission) {
      addFinding(
        `write-permission-${permission[1].toLowerCase()}`,
        permission[1].toLowerCase() === "id-token" ? "high" : "medium",
        `${permission[1]} write permission changed`,
        "A GitHub token scope with write access was added or modified.",
        line,
      );
    }

    for (const match of text.matchAll(/secrets\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
      secretNames.add(match[1]);
      addFinding(
        `secret-${match[1]}`,
        "medium",
        `Secret reference changed: ${match[1]}`,
        "Confirm the triggering events and job conditions cannot expose this secret to untrusted code.",
        line,
      );
    }

    const action = text.match(/^(?:-\s*)?uses:\s*([^\s#]+)@([^\s#]+)/i);
    if (action && !/^[0-9a-f]{40}$/i.test(action[2]) && !action[1].startsWith("./")) {
      addFinding(
        `unpinned-action-${action[1]}`,
        "medium",
        `Action is not commit-pinned: ${action[1]}`,
        `The mutable reference @${action[2]} can resolve to different code over time; prefer a full commit SHA for stronger supply-chain control.`,
        line,
      );
    }

    const environment = text.match(/^environment:\s*([^#]+?)\s*$/i);
    if (environment) {
      addFinding(
        `environment-${environment[1].trim()}`,
        "medium",
        `Deployment environment changed: ${environment[1].trim()}`,
        "Review protection rules, required reviewers, and environment-scoped secrets.",
        line,
      );
    }

    if (/(?:curl|wget)\b[^|\n]*\|\s*(?:sudo\s+)?(?:ba)?sh\b/i.test(text) || /\bchmod\s+777\b|\beval\s+/i.test(text)) {
      addFinding(
        "dangerous-shell",
        "high",
        "Dangerous shell execution pattern changed",
        "The changed command downloads or evaluates code directly, or grants overly broad permissions.",
        line,
      );
    }
  }

  const lineCount = relevantRanges.reduce((total, range) => total + range.end - range.start + 1, 0);
  if (entry.status === "added" && lineCount >= 100) {
    addFinding(
      "large-workflow-added",
      "medium",
      "Large workflow added",
      `${lineCount.toLocaleString()} workflow lines were added; review triggers, permissions, jobs, and external actions as a complete execution path.`,
      1,
    );
  }

  const findingOrder = { high: 0, medium: 1 };
  findings.sort((a, b) => findingOrder[a.severity] - findingOrder[b.severity] || a.line - b.line || a.id.localeCompare(b.id));
  return {
    status: "partial",
    changedJobs: [...changedJobs].sort(),
    changedTriggers: [...changedTriggers].sort(),
    secretNames: [...secretNames].sort(),
    findings,
  };
}

const changedFiles = nameEntries.map((entry) => {
  const stats = numstat.get(entry.path) ?? { additions: 0, deletions: 0 };
  const historyStat = historyByFile.get(entry.path);
  const direct = [...new Set([
    ...(reverseGraph.get(entry.path) ?? []),
    ...(entry.previousPath ? reverseGraph.get(entry.previousPath) ?? [] : []),
  ])].sort();
  const transitive = [...transitiveDependents(entry.path, entry.previousPath)].sort();
  const nearbyTests = classify(entry.path) === "runtime" ? likelyTestMatches(entry.path, changedTests) : [];
  const coverage = analysisCoverage(entry.path);
  const workflowAnalysis = workflowAnalysisFor(entry);
  const signals = [];
  if (classify(entry.path) === "runtime") signals.push("runtime source changed");
  if (transitive.length) signals.push(`${transitive.length} transitive dependent${transitive.length === 1 ? "" : "s"}`);
  if (historyStat.commits) signals.push(`${historyStat.commits} commit${historyStat.commits === 1 ? "" : "s"} in the last 90 days`);
  if (historyStat.bugFixes) signals.push(`${historyStat.bugFixes} recent bug-fix commit${historyStat.bugFixes === 1 ? "" : "s"}`);
  if (classify(entry.path) === "runtime" && !nearbyTests.length) signals.push("no nearby test file changed");
  if (workflowAnalysis) signals.push(...workflowAnalysis.findings.map((finding) => finding.title));
  if (coverage.status === "unassessed") signals.push("semantic impact not assessed");
  return {
    path: entry.path,
    previousPath: entry.previousPath,
    status: entry.status,
    additions: stats.additions,
    deletions: stats.deletions,
    changedLineRanges: entry.status === "deleted"
      ? rangesByPath.get(entry.path).oldRanges
      : rangesByPath.get(entry.path).newRanges,
    category: classify(entry.path),
    analysisCoverage: coverage,
    workflowAnalysis,
    churnScore: historyStat.commits,
    history: {
      commitsLast90Days: historyStat.commits,
      uniqueAuthors: historyStat.authors.size,
      recentBugFixCommits: historyStat.bugFixes,
    },
    ownership: [...historyStat.authors.entries()].sort((a, b) => b[1] - a[1]).map(([author]) => author),
    directDependents: direct,
    transitiveDependentCount: transitive.length,
    coChangedFiles: [...historyStat.coChanges.entries()].sort((a, b) => b[1] - a[1]).map(([file, count]) => ({ path: file, count })),
    nearbyTestChanges: nearbyTests,
    riskSignals: signals,
  };
});

function containingConsumerSymbols(file, localName) {
  if (localName === "*") return [];
  const source = showAtHead(file);
  const inventory = headSymbolsByFile.get(file) ?? [];
  if (!source || !inventory.length) return [];
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind(file));
  const found = new Set();
  const visit = (node) => {
    if (ts.isIdentifier(node) && node.text === localName) {
      let ancestor = node.parent;
      let isImport = false;
      while (ancestor) {
        if (ts.isImportDeclaration(ancestor) || ts.isExportDeclaration(ancestor)) isImport = true;
        ancestor = ancestor.parent;
      }
      if (!isImport) {
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
        const containing = inventory
          .filter((symbol) => line >= symbol.start && line <= symbol.end)
          .sort((a, b) => (a.end - a.start) - (b.end - b.start))[0];
        if (containing) found.add(containing.name);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return [...found];
}

function directConsumersFor(file, symbol, previousPath = null) {
  if (!symbol.exported) return [];
  const importedName = symbol.defaultExport
    ? "default"
    : symbol.kind === "method" ? symbol.name.split(".")[0] : symbol.name;
  const consumers = [];
  const bindings = [
    ...(bindingsByDependency.get(file) ?? []),
    ...(previousPath ? bindingsByDependency.get(previousPath) ?? [] : []),
  ];
  for (const binding of bindings) {
    if (binding.imported !== "*" && binding.imported !== importedName) continue;
    const consumerSymbols = containingConsumerSymbols(binding.file, binding.local);
    if (consumerSymbols.length) {
      for (const consumerSymbol of consumerSymbols) consumers.push({ file: binding.file, symbol: consumerSymbol });
    } else consumers.push({ file: binding.file });
  }
  return consumers.filter((consumer, index) => consumers.findIndex((candidate) =>
    candidate.file === consumer.file && candidate.symbol === consumer.symbol,
  ) === index);
}

function changedSymbolsFor(entry) {
  if (classify(entry.path) !== "runtime") return [];
  const ranges = rangesByPath.get(entry.path);
  const oldPath = entry.previousPath ?? entry.path;
  const baseSymbols = symbolInventory(oldPath, showAtRef(oldPath, diffBaseCommit));
  const headSymbols = symbolInventory(entry.path, showAtHead(entry.path));
  const baseByKey = new Map(baseSymbols.map((symbol) => [`${symbol.kind}:${symbol.name}`, symbol]));
  const headByKey = new Map(headSymbols.map((symbol) => [`${symbol.kind}:${symbol.name}`, symbol]));
  const changed = [];

  for (const symbol of headSymbols) {
    const baseSymbol = baseByKey.get(`${symbol.kind}:${symbol.name}`);
    const newLines = linesWithin(ranges.newRanges, symbol.start, symbol.end);
    const oldLines = baseSymbol ? linesWithin(ranges.oldRanges, baseSymbol.start, baseSymbol.end) : [];
    if (!baseSymbol && (newLines.length || entry.status === "added")) {
      changed.push({ ...symbol, changeType: "added", changedLines: newLines });
    } else if (baseSymbol && baseSymbol.text !== symbol.text && (newLines.length || oldLines.length)) {
      changed.push({ ...symbol, changeType: "modified", changedLines: newLines.length ? newLines : oldLines });
    }
  }
  for (const symbol of baseSymbols) {
    if (headByKey.has(`${symbol.kind}:${symbol.name}`)) continue;
    const oldLines = linesWithin(ranges.oldRanges, symbol.start, symbol.end);
    if (oldLines.length || entry.status === "deleted") {
      changed.push({ ...symbol, changeType: "deleted", changedLines: oldLines });
    }
  }

  const withoutParentDuplicates = changed.filter((symbol) => {
    if (symbol.kind !== "class") return true;
    const childMethods = changed.filter((candidate) =>
      candidate.kind === "method" && candidate.name.startsWith(`${symbol.name}.`),
    );
    return !symbol.changedLines.length || !symbol.changedLines.every((line) =>
      childMethods.some((method) => line >= method.start && line <= method.end),
    );
  });

  return withoutParentDuplicates.map((symbol) => ({
    file: entry.path,
    name: symbol.name,
    kind: symbol.kind,
    changeType: symbol.changeType,
    exported: symbol.exported,
    changedLines: symbol.changedLines,
    directConsumers: directConsumersFor(entry.path, symbol, entry.previousPath),
  }));
}

for (const file of changedFiles) {
  const entry = nameEntries.find((candidate) => candidate.path === file.path);
  file.changedSymbols = changedSymbolsFor(entry);
}

const changedByPath = new Map(changedFiles.map((file) => [file.path, file]));
const runtimeFiles = changedFiles.filter((file) => file.category === "runtime");
const adjacency = new Map(runtimeFiles.map((file) => [file.path, new Set()]));
for (const file of runtimeFiles) {
  for (const dependency of importGraph.get(file.path) ?? []) {
    if (adjacency.has(dependency)) {
      adjacency.get(file.path).add(dependency);
      adjacency.get(dependency).add(file.path);
    }
  }
  for (const peer of file.coChangedFiles) {
    if (peer.count >= config.strongCoChangeThreshold && adjacency.has(peer.path)) {
      adjacency.get(file.path).add(peer.path);
      adjacency.get(peer.path).add(file.path);
    }
  }
}

const components = [];
const visited = new Set();
for (const file of runtimeFiles) {
  if (visited.has(file.path)) continue;
  const component = [];
  const queue = [file.path];
  while (queue.length) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    component.push(current);
    queue.push(...adjacency.get(current));
  }
  components.push(component.sort());
}

function commonTitle(paths) {
  const directories = paths.map((file) => path.posix.dirname(file).split("/"));
  const common = directories[0]?.filter((part, index) => directories.every((value) => value[index] === part)) ?? [];
  const raw = common.at(-1) ?? path.posix.basename(paths[0], path.posix.extname(paths[0]));
  return raw.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const reviewUnits = components.map((paths, index) => {
  const files = paths.map((file) => changedByPath.get(file));
  const changedSymbols = files.flatMap((file) => file.changedSymbols);
  const externallyUsedChangedSymbols = changedSymbols.filter((symbol) =>
    symbol.exported && symbol.directConsumers.length > 0,
  ).length;
  const affectedConsumers = [...new Set(changedSymbols.flatMap((symbol) =>
    symbol.directConsumers.map((consumer) => consumer.file),
  ))].sort();
  const blastRadius = Math.max(0, ...files.map((file) => file.transitiveDependentCount));
  const untestedRuntimeFiles = files.filter((file) => !file.nearbyTestChanges.length).map((file) => file.path);
  const bugFixes = files.reduce((sum, file) => sum + file.history.recentBugFixCommits, 0);
  const historySignal = files.some((file) => file.history.commitsLast90Days > 0 || file.history.recentBugFixCommits > 0);
  const dependencySignal = files.some((file) => file.transitiveDependentCount > 0);
  const priority = untestedRuntimeFiles.length &&
    (blastRadius >= config.highPriorityDependentThreshold || bugFixes >= config.highPriorityBugFixThreshold)
    ? "high" : dependencySignal || historySignal ? "medium" : "low";
  const reason = [`${files.length} runtime file${files.length === 1 ? "" : "s"} changed`];
  if (changedSymbols.length) reason.push(`${changedSymbols.length} changed symbol${changedSymbols.length === 1 ? "" : "s"}`);
  if (externallyUsedChangedSymbols) reason.push(`${externallyUsedChangedSymbols} externally used changed symbol${externallyUsedChangedSymbols === 1 ? "" : "s"}`);
  if (affectedConsumers.length) reason.push(`${affectedConsumers.length} direct symbol consumer${affectedConsumers.length === 1 ? "" : "s"} affected`);
  if (blastRadius) reason.push(`${blastRadius} downstream file${blastRadius === 1 ? "" : "s"} at the broadest point`);
  if (bugFixes) reason.push(`${bugFixes} recent bug-fix commit${bugFixes === 1 ? "" : "s"}`);
  if (untestedRuntimeFiles.length) reason.push(`${untestedRuntimeFiles.length} runtime change${untestedRuntimeFiles.length === 1 ? "" : "s"} without a nearby test change`);
  if (paths.length > 1) reason.push("grouped by imports or strong historical co-change");
  return { id: `runtime-${index + 1}`, title: commonTitle(paths), files: paths, reason, blastRadius, untestedRuntimeFiles, changedSymbols, externallyUsedChangedSymbols, affectedConsumers, priority };
});

const workflowFiles = changedFiles.filter((file) => file.workflowAnalysis);
if (workflowFiles.length) {
  const findings = workflowFiles.flatMap((file) => file.workflowAnalysis.findings.map((finding) => ({ ...finding, file: file.path })));
  const highFindings = findings.filter((finding) => finding.severity === "high");
  const changedJobs = [...new Set(workflowFiles.flatMap((file) => file.workflowAnalysis.changedJobs))].sort();
  const changedTriggers = [...new Set(workflowFiles.flatMap((file) => file.workflowAnalysis.changedTriggers))].sort();
  const reason = [`${workflowFiles.length} GitHub Actions workflow${workflowFiles.length === 1 ? "" : "s"} changed`];
  if (highFindings.length) reason.push(`${highFindings.length} high-attention workflow finding${highFindings.length === 1 ? "" : "s"}`);
  if (findings.length) reason.push(`${findings.length} deterministic workflow finding${findings.length === 1 ? "" : "s"}`);
  if (changedJobs.length) reason.push(`${changedJobs.length} changed job${changedJobs.length === 1 ? "" : "s"}: ${changedJobs.join(", ")}`);
  if (changedTriggers.length) reason.push(`changed triggers: ${changedTriggers.join(", ")}`);
  reason.push("workflow analysis is partial and does not establish runtime safety");
  reviewUnits.push({
    id: "github-actions",
    title: "GitHub Actions",
    files: workflowFiles.map((file) => file.path),
    reason,
    blastRadius: 0,
    untestedRuntimeFiles: [],
    changedSymbols: [],
    externallyUsedChangedSymbols: 0,
    affectedConsumers: [],
    workflowFindings: findings,
    analysisCoverage: "partial",
    priority: highFindings.length ? "high" : "medium",
  });
}

for (const category of ["generated", "test", "docs", "config", "unknown"]) {
  const files = changedFiles.filter((file) => file.category === category && !file.workflowAnalysis);
  if (!files.length) continue;
  const lines = files.reduce((sum, file) => sum + file.additions + file.deletions, 0);
  reviewUnits.push({
    id: category,
    title: category === "generated" ? "Generated changes" : category === "test" ? "Test changes" : category === "docs" ? "Documentation" : category === "config" ? "Configuration" : "Other changes",
    files: files.map((file) => file.path),
    reason: [`${files.length} ${category} file${files.length === 1 ? "" : "s"}`, `${lines.toLocaleString()} changed line${lines === 1 ? "" : "s"}`],
    blastRadius: 0,
    untestedRuntimeFiles: [],
    changedSymbols: [],
    externallyUsedChangedSymbols: 0,
    affectedConsumers: [],
    workflowFindings: [],
    analysisCoverage: files.some((file) => file.analysisCoverage.status === "unassessed") ? "unassessed" : "classified",
    priority: files.some((file) => file.analysisCoverage.status === "unassessed") ? "unassessed" : "low",
  });
}

const priorityOrder = { high: 0, medium: 1, unassessed: 2, low: 3 };
reviewUnits.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || b.blastRadius - a.blastRadius || a.title.localeCompare(b.title));
const summary = {
  filesChanged: changedFiles.length,
  additions: changedFiles.reduce((sum, file) => sum + file.additions, 0),
  deletions: changedFiles.reduce((sum, file) => sum + file.deletions, 0),
  runtimeFiles: changedFiles.filter((file) => file.category === "runtime").length,
  testFiles: changedFiles.filter((file) => file.category === "test").length,
  generatedFiles: changedFiles.filter((file) => file.category === "generated").length,
  configFiles: changedFiles.filter((file) => file.category === "config").length,
  docsFiles: changedFiles.filter((file) => file.category === "docs").length,
  analyzedFiles: changedFiles.filter((file) => file.analysisCoverage.status === "analyzed").length,
  partiallyAnalyzedFiles: changedFiles.filter((file) => file.analysisCoverage.status === "partial").length,
  classifiedOnlyFiles: changedFiles.filter((file) => file.analysisCoverage.status === "classified").length,
  unassessedFiles: changedFiles.filter((file) => file.analysisCoverage.status === "unassessed").length,
  workflowFindings: changedFiles.reduce((sum, file) => sum + (file.workflowAnalysis?.findings.length ?? 0), 0),
};
const baseRef = requestedBaseRef;
const headRef = workingTree ? "WORKTREE" : requestedHeadRef;
const diffReviewMap = { baseRef, headRef, range: workingTree ? `${baseRef}...WORKTREE` : range, workingTree, summary, changedFiles, reviewUnits };

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `export const diffReviewMap = ${JSON.stringify(diffReviewMap, null, 2)} as const;\n`);
console.log(`Review map: ${summary.filesChanged} files, +${summary.additions} / -${summary.deletions}`);
console.log(`Wrote ${outputPath}`);
