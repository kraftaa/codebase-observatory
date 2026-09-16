import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, realpath, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const args = process.argv.slice(2);
const command = args[0];

function option(name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function required(name) {
  const value = option(name);
  if (!value) throw new Error(`Missing required option: ${name}`);
  return value;
}

function metric(name) {
  const value = Number(required(name));
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a non-negative number`);
  return value;
}

const studyPath = path.resolve(option("--study", path.join(projectRoot, "experiments", "review-study.json")));

async function loadStudy() {
  try {
    const study = JSON.parse(await readFile(studyPath, "utf8"));
    if (study.version !== 1 || !Array.isArray(study.cases)) throw new Error("Unsupported review study format");
    return study;
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, cases: [] };
    throw error;
  }
}

async function saveStudy(study) {
  await mkdir(path.dirname(studyPath), { recursive: true });
  const temporary = `${studyPath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(study, null, 2)}\n`);
  await rename(temporary, studyPath);
}

function git(repo, ...gitArgs) {
  return execFileSync("git", gitArgs, { cwd: repo, encoding: "utf8" }).trim();
}

function parseGenerated(source) {
  return JSON.parse(source.replace(/^export const diffReviewMap = /, "").replace(/ as const;\s*$/, ""));
}

async function collect() {
  const id = required("--id");
  const range = required("--range");
  const repo = await realpath(path.resolve(option("--repo", process.cwd())));
  const study = await loadStudy();
  const existingIndex = study.cases.findIndex((item) => item.id === id);
  if (existingIndex >= 0 && !args.includes("--replace")) {
    throw new Error(`Case ${id} already exists; pass --replace to refresh its machine metrics`);
  }

  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "observatory-study-"));
  const generatedPath = path.join(temporaryDirectory, "diff-data.ts");
  try {
    execFileSync(process.execPath, [path.join(scriptDir, "analyze-diff.mjs"), range, "--repo", repo, "--output", generatedPath], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const data = parseGenerated(await readFile(generatedPath, "utf8"));
    const headCommit = git(repo, "rev-parse", data.headRef || "HEAD");
    const previousCase = existingIndex >= 0 ? study.cases[existingIndex] : null;
    if (previousCase?.sessions.length && previousCase.headCommit !== headCommit && !args.includes("--reset-sessions")) {
      throw new Error(`Case ${id} now points to a different head commit; pass --reset-sessions to discard stale human measurements`);
    }
    const changedLines = data.summary.additions + data.summary.deletions;
    const runtime = data.changedFiles.filter((file) => file.category === "runtime");
    const caseRecord = {
      id,
      repository: path.basename(repo),
      range,
      headCommit,
      collectedAt: git(repo, "show", "-s", "--format=%cI", data.headRef || "HEAD"),
      prSize: {
        filesChanged: data.summary.filesChanged,
        changedLines,
        additions: data.summary.additions,
        deletions: data.summary.deletions,
      },
      observatory: {
        runtimeFiles: runtime.length,
        runtimeChangedLines: runtime.reduce((sum, file) => sum + file.additions + file.deletions, 0),
        changedSymbols: data.reviewUnits.reduce((sum, unit) => sum + unit.changedSymbols.length, 0),
        externallyUsedChangedSymbols: data.reviewUnits.reduce((sum, unit) => sum + unit.externallyUsedChangedSymbols, 0),
        affectedConsumers: new Set(data.reviewUnits.flatMap((unit) => unit.affectedConsumers)).size,
        reviewUnits: data.reviewUnits.length,
        highPriorityUnits: data.reviewUnits.filter((unit) => unit.priority === "high").length,
        classifiedFiles: {
          tests: data.summary.testFiles,
          generated: data.summary.generatedFiles,
          docs: data.summary.docsFiles,
          config: data.summary.configFiles,
        },
        runtimeSurfacePercent: changedLines ? Number(((runtime.reduce((sum, file) => sum + file.additions + file.deletions, 0) / changedLines) * 100).toFixed(1)) : 0,
      },
      sessions: args.includes("--reset-sessions") ? [] : previousCase?.sessions ?? [],
    };
    if (existingIndex >= 0) study.cases[existingIndex] = caseRecord;
    else study.cases.push(caseRecord);
    await saveStudy(study);
    console.log(`Collected ${id}: ${caseRecord.prSize.filesChanged} files / ${changedLines} lines -> ${caseRecord.observatory.changedSymbols} symbols / ${caseRecord.observatory.reviewUnits} units`);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

async function session() {
  const id = required("--id");
  const mode = required("--mode");
  if (!new Set(["baseline", "observatory"]).has(mode)) throw new Error("--mode must be baseline or observatory");
  const study = await loadStudy();
  const caseRecord = study.cases.find((item) => item.id === id);
  if (!caseRecord) throw new Error(`Unknown case: ${id}. Run collect first.`);
  caseRecord.sessions.push({
    mode,
    reviewer: option("--reviewer", "anonymous"),
    timeToFirstUnderstandingMinutes: metric("--time-to-understanding"),
    totalReviewMinutes: metric("--review-time"),
    issuesFound: metric("--issues-found"),
    issuesMissed: metric("--issues-missed"),
    notes: option("--notes", ""),
    recordedAt: new Date().toISOString(),
  });
  await saveStudy(study);
  console.log(`Recorded ${mode} session for ${id}`);
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function formatNumber(value, suffix = "") {
  return value === null ? "—" : `${Number(value.toFixed(1))}${suffix}`;
}

async function report() {
  const study = await loadStudy();
  const reportPath = path.resolve(option("--output", path.join(path.dirname(studyPath), "REPORT.md")));
  const rows = [];
  const pairedFirstUnderstandingSavings = [];
  const pairedReviewSavings = [];
  const pairedMissedIssueChanges = [];
  for (const item of study.cases) {
    const baseline = item.sessions.filter((session) => session.mode === "baseline");
    const observatory = item.sessions.filter((session) => session.mode === "observatory");
    const baselineFirst = average(baseline.map((session) => session.timeToFirstUnderstandingMinutes));
    const observatoryFirst = average(observatory.map((session) => session.timeToFirstUnderstandingMinutes));
    const baselineTotal = average(baseline.map((session) => session.totalReviewMinutes));
    const observatoryTotal = average(observatory.map((session) => session.totalReviewMinutes));
    const firstSavings = baselineFirst && observatoryFirst !== null ? ((baselineFirst - observatoryFirst) / baselineFirst) * 100 : null;
    const reviewSavings = baselineTotal && observatoryTotal !== null ? ((baselineTotal - observatoryTotal) / baselineTotal) * 100 : null;
    const baselineFound = average(baseline.map((session) => session.issuesFound));
    const observatoryFound = average(observatory.map((session) => session.issuesFound));
    const baselineMissed = average(baseline.map((session) => session.issuesMissed));
    const observatoryMissed = average(observatory.map((session) => session.issuesMissed));
    if (firstSavings !== null) pairedFirstUnderstandingSavings.push(firstSavings);
    if (reviewSavings !== null) pairedReviewSavings.push(reviewSavings);
    if (baselineMissed !== null && observatoryMissed !== null) pairedMissedIssueChanges.push(observatoryMissed - baselineMissed);
    rows.push(`| ${item.id} | ${item.prSize.filesChanged} / ${item.prSize.changedLines} | ${item.observatory.runtimeFiles} / ${item.observatory.changedSymbols} / ${item.observatory.reviewUnits} / ${item.observatory.highPriorityUnits} / ${item.observatory.classifiedFiles.generated} | ${formatNumber(baselineFirst, "m")} | ${formatNumber(observatoryFirst, "m")} | ${formatNumber(firstSavings, "%")} | ${formatNumber(baselineTotal, "m")} | ${formatNumber(observatoryTotal, "m")} | ${formatNumber(baselineFound)} / ${formatNumber(baselineMissed)} | ${formatNumber(observatoryFound)} / ${formatNumber(observatoryMissed)} |`);
  }
  const completedPairs = study.cases.filter((item) =>
    item.sessions.some((session) => session.mode === "baseline") && item.sessions.some((session) => session.mode === "observatory"),
  ).length;
  const markdown = `# Observatory Review Study\n\n` +
    `Cases collected: ${study.cases.length}  \nPaired cases completed: ${completedPairs} / 10\n\n` +
    `## Aggregate result\n\n` +
    `- Mean time-to-understanding reduction: ${formatNumber(average(pairedFirstUnderstandingSavings), "%")}\n` +
    `- Mean total-review-time reduction: ${formatNumber(average(pairedReviewSavings), "%")}\n` +
    `- Mean change in missed issues (Observatory − baseline): ${formatNumber(average(pairedMissedIssueChanges))}\n` +
    `- Treat these as directional until all ten paired cases are complete.\n\n` +
    `## Cases\n\n` +
    `| PR | Original files / lines | Runtime / symbols / units / high / generated | Baseline understanding | Observatory understanding | Change | Baseline review | Observatory review | Baseline found / missed | Observatory found / missed |\n` +
    `| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n` +
    `${rows.join("\n") || "| No cases recorded | — | — | — | — | — | — | — | — | — |"}\n\n` +
    `## Interpretation guardrails\n\n` +
    `Do not claim time savings from unpaired cases. Record issues missed only after adjudication against a shared issue set. Rotate tool order or use different reviewers to reduce learning effects. Preserve zero and negative results.\n`;
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, markdown);
  console.log(`Wrote ${reportPath}`);
}

if (command === "collect") await collect();
else if (command === "session") await session();
else if (command === "report") await report();
else {
  throw new Error("Usage: review-study <collect|session|report> [options]");
}
