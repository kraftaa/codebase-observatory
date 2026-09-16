import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "scripts/review-study.mjs");

function run(repo, ...args) {
  return execFileSync(process.execPath, [cli, ...args], { cwd: repo, encoding: "utf8" });
}

function git(repo, ...args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

test("review study collects machine metrics and reports paired human results", async () => {
  const repo = await mkdtemp(path.join(tmpdir(), "observatory-study-repo-"));
  const studyDirectory = await mkdtemp(path.join(tmpdir(), "observatory-study-data-"));
  const study = path.join(studyDirectory, "study.json");
  const report = path.join(studyDirectory, "report.md");
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "Study Fixture");
  git(repo, "config", "user.email", "study@example.test");
  await mkdir(path.join(repo, "src"));
  await writeFile(path.join(repo, "src/core.ts"), "export const value = 1;\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "initial");
  await writeFile(path.join(repo, "src/core.ts"), "export const value = 2;\nexport const added = true;\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "change core");

  run(repo, "collect", "--id", "PR-42", "--range", "HEAD~1...HEAD", "--repo", repo, "--study", study);
  let data = JSON.parse(await readFile(study, "utf8"));
  assert.equal(data.cases[0].prSize.filesChanged, 1);
  assert.equal(data.cases[0].observatory.runtimeFiles, 1);
  assert.equal(data.cases[0].observatory.changedSymbols, 2);

  run(repo, "session", "--id", "PR-42", "--mode", "baseline", "--reviewer", "a", "--time-to-understanding", "30", "--review-time", "50", "--issues-found", "2", "--issues-missed", "1", "--study", study);
  run(repo, "session", "--id", "PR-42", "--mode", "observatory", "--reviewer", "b", "--time-to-understanding", "12", "--review-time", "25", "--issues-found", "3", "--issues-missed", "0", "--study", study);
  run(repo, "report", "--study", study, "--output", report);

  data = JSON.parse(await readFile(study, "utf8"));
  assert.equal(data.cases[0].sessions.length, 2);
  const markdown = await readFile(report, "utf8");
  assert.match(markdown, /Paired cases completed: 1 \/ 10/);
  assert.match(markdown, /Mean time-to-understanding reduction: 60%/);
  assert.match(markdown, /Mean total-review-time reduction: 50%/);
  assert.match(markdown, /PR-42/);
});
