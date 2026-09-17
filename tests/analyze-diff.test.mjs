import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rename, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function git(repo, ...args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

async function put(repo, file, content) {
  const target = path.join(repo, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}

test("analyze-diff reports exact files, line counts, and renames", async () => {
  const repo = await mkdtemp(path.join(tmpdir(), "observatory-diff-"));
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "Fixture Author");
  git(repo, "config", "user.email", "fixture@example.test");

  await put(repo, "src/core.ts", "export const core = 1;\n");
  await put(repo, "src/consumer.ts", "import { core } from './core';\nexport const value = core;\n");
  await put(repo, "tests/core.test.ts", "// baseline\n");
  await put(repo, "docs/guide.md", "# Guide\n");
  await put(repo, "old.config.json", "{\"enabled\":true}\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "initial fixture");

  await put(repo, "src/core.ts", "export const core = 2;\nexport const extra = true;\n");
  await put(repo, "src/consumer.ts", "import { core } from './core';\nexport const value = core + 1;\n");
  await put(repo, "src/new-runtime.ts", "export const fresh = true;\n");
  await put(repo, "tests/core.test.ts", "// changed\n// assertion\n");
  await put(repo, "tests/consumer.spec.ts", "// new test\n");
  await put(repo, "docs/guide.md", "# Guide\nUpdated.\n");
  await rename(path.join(repo, "old.config.json"), path.join(repo, "renamed.config.json"));
  git(repo, "add", "-A");
  git(repo, "commit", "-m", "fix fixture behavior");

  const output = path.join(repo, "diff-data.ts");
  execFileSync(process.execPath, [path.join(root, "scripts/analyze-diff.mjs"), "HEAD~1...HEAD", "--repo", repo, "--output", output], {
    cwd: root,
    encoding: "utf8",
  });
  const source = await readFile(output, "utf8");
  const data = JSON.parse(source.replace(/^export const diffReviewMap = /, "").replace(/ as const;\s*$/, ""));
  execFileSync(process.execPath, [path.join(root, "scripts/analyze-diff.mjs"), "HEAD~1...HEAD", "--repo", repo, "--output", output], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(await readFile(output, "utf8"), source, "identical inputs should produce identical review data");

  assert.equal(data.summary.filesChanged, 7);
  assert.equal(data.summary.additions, 8);
  assert.equal(data.summary.deletions, 3);
  assert.deepEqual(data.changedFiles.map((file) => file.path).sort(), [
    "docs/guide.md", "renamed.config.json", "src/consumer.ts", "src/core.ts",
    "src/new-runtime.ts", "tests/consumer.spec.ts", "tests/core.test.ts",
  ]);
  const renamed = data.changedFiles.find((file) => file.path === "renamed.config.json");
  assert.equal(renamed.status, "renamed");
  assert.equal(renamed.previousPath, "old.config.json");
  assert.deepEqual(data.changedFiles.find((file) => file.path === "src/core.ts").changedLineRanges, [{ start: 1, end: 2 }]);
  const coreSymbols = data.changedFiles.find((file) => file.path === "src/core.ts").changedSymbols;
  assert.deepEqual(coreSymbols.map((symbol) => [symbol.name, symbol.changeType]), [
    ["core", "modified"],
    ["extra", "added"],
  ]);
  assert.deepEqual(coreSymbols.find((symbol) => symbol.name === "core").directConsumers, [
    { file: "src/consumer.ts", symbol: "value" },
  ]);
  const runtimeUnit = data.reviewUnits.find((unit) => unit.files.includes("src/core.ts"));
  assert.equal(runtimeUnit.externallyUsedChangedSymbols, 1);
  assert.deepEqual(runtimeUnit.affectedConsumers, ["src/consumer.ts"]);
});

test("analyze-diff reports coverage and GitHub Actions findings without calling unknown config low risk", async () => {
  const repo = await mkdtemp(path.join(tmpdir(), "observatory-workflow-"));
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "Workflow Fixture");
  git(repo, "config", "user.email", "workflow@example.test");
  await put(repo, "README.md", "# Fixture\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "initial fixture");

  const filler = Array.from({ length: 95 }, (_, index) => `      # review line ${index + 1}`).join("\n");
  await put(repo, ".github/workflows/release.yml", `name: Release
on:
  pull_request_target:
permissions: write-all
jobs:
  deploy:
    permissions:
      id-token: write
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo \"${"${{ secrets.DEPLOY_TOKEN }}"}\"
${filler}
`);
  await put(repo, "settings.yml", "feature: enabled\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "add release workflow");

  const output = path.join(repo, "diff-data.ts");
  execFileSync(process.execPath, [path.join(root, "scripts/analyze-diff.mjs"), "HEAD~1...HEAD", "--repo", repo, "--output", output], {
    cwd: root,
    encoding: "utf8",
  });
  const source = await readFile(output, "utf8");
  const data = JSON.parse(source.replace(/^export const diffReviewMap = /, "").replace(/ as const;\s*$/, ""));

  const workflow = data.changedFiles.find((file) => file.path === ".github/workflows/release.yml");
  assert.equal(workflow.analysisCoverage.status, "partial");
  assert.deepEqual(workflow.workflowAnalysis.changedJobs, ["deploy"]);
  assert.deepEqual(workflow.workflowAnalysis.changedTriggers, ["pull_request_target"]);
  assert.deepEqual(workflow.workflowAnalysis.secretNames, ["DEPLOY_TOKEN"]);
  assert.ok(workflow.workflowAnalysis.findings.some((finding) => finding.id === "pull-request-target" && finding.severity === "high"));
  assert.ok(workflow.workflowAnalysis.findings.some((finding) => finding.id === "write-all" && finding.severity === "high"));
  const idToken = workflow.workflowAnalysis.findings.find((finding) => finding.id === "write-permission-id-token");
  assert.equal(idToken.title, "Added workflow requests `id-token: write`");
  assert.equal(idToken.changeType, "added");
  assert.equal(idToken.scope, "line");
  assert.equal(idToken.evidence, "id-token: write");
  assert.ok(workflow.workflowAnalysis.findings.some((finding) => finding.id === "unpinned-action-actions/checkout"));
  assert.ok(workflow.workflowAnalysis.findings.some((finding) => finding.id === "large-workflow-added"));
  assert.ok(workflow.workflowAnalysis.findings.every((finding) => finding.changeType === "added"));

  const workflowUnit = data.reviewUnits.find((unit) => unit.id === "github-actions");
  assert.equal(workflowUnit.priority, "high");
  assert.equal(workflowUnit.analysisCoverage, "partial");
  assert.ok(workflowUnit.workflowFindings.length >= 5);

  const configUnit = data.reviewUnits.find((unit) => unit.id === "config");
  assert.equal(configUnit.priority, "unassessed");
  assert.equal(configUnit.analysisCoverage, "unassessed");
  assert.equal(data.summary.partiallyAnalyzedFiles, 1);
  assert.equal(data.summary.unassessedFiles, 1);
});

test("workflow findings ignore unchanged configuration and describe modified lines neutrally", async () => {
  const repo = await mkdtemp(path.join(tmpdir(), "observatory-workflow-diff-"));
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "Workflow Diff Fixture");
  git(repo, "config", "user.email", "workflow-diff@example.test");
  await put(repo, ".github/workflows/check.yml", `name: Check
on: push
permissions:
  id-token: write
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: echo stable
`);
  git(repo, "add", ".");
  git(repo, "commit", "-m", "add baseline workflow");

  await put(repo, ".github/workflows/check.yml", `name: Check
on: push
permissions:
  id-token: write
  contents: read
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: echo changed
`);
  git(repo, "add", ".");
  git(repo, "commit", "-m", "change workflow command");

  const output = path.join(repo, "diff-data.ts");
  execFileSync(process.execPath, [path.join(root, "scripts/analyze-diff.mjs"), "HEAD~1...HEAD", "--repo", repo, "--output", output], {
    cwd: root,
    encoding: "utf8",
  });
  const source = await readFile(output, "utf8");
  const data = JSON.parse(source.replace(/^export const diffReviewMap = /, "").replace(/ as const;\s*$/, ""));
  const workflow = data.changedFiles.find((file) => file.path === ".github/workflows/check.yml");

  assert.deepEqual(workflow.workflowAnalysis.changedJobs, ["check"]);
  assert.equal(workflow.workflowAnalysis.findings.some((finding) => finding.id === "write-permission-id-token"), false);
  assert.deepEqual(workflow.workflowAnalysis.findings, []);
  assert.equal(data.reviewUnits.find((unit) => unit.id === "github-actions").priority, "medium");
});
