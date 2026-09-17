import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "scripts/impact.mjs");
const executable = path.join(root, "bin/observatory.mjs");

function git(repo, ...args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

test("executable reports help and version", () => {
  const help = execFileSync(executable, ["--help"], { cwd: root, encoding: "utf8" });
  assert.match(help, /^Usage:/);
  assert.match(help, /observatory impact/);
  assert.match(help, /observatory review/);
  assert.equal(execFileSync(executable, ["--version"], { cwd: root, encoding: "utf8" }), "0.3.1\n");
});

test("review command ships its standalone interface", async () => {
  const [server, html, script, css] = await Promise.all([
    readFile(path.join(root, "scripts/review.mjs"), "utf8"),
    readFile(path.join(root, "ui/review.html"), "utf8"),
    readFile(path.join(root, "ui/review.js"), "utf8"),
    readFile(path.join(root, "ui/review.css"), "utf8"),
  ]);
  assert.match(server, /127\.0\.0\.1/);
  assert.match(html, /Diff Review Map/);
  assert.match(script, /Changed symbols/);
  assert.match(css, /review-workbench/);
});

test("impact emits deterministic agent-facing evidence and an optional gate", async () => {
  const repo = await mkdtemp(path.join(tmpdir(), "observatory-impact-"));
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "Impact Fixture");
  git(repo, "config", "user.email", "impact@example.test");
  await mkdir(path.join(repo, "src"));
  await mkdir(path.join(repo, "tests"));
  await writeFile(path.join(repo, "src/token.ts"), "export function validateToken(value: string) { return value.length > 0; }\n");
  await writeFile(path.join(repo, "src/session.ts"), "import { validateToken } from './token';\nexport function createSession(value: string) { return validateToken(value); }\n");
  await writeFile(path.join(repo, "tests/token.test.ts"), "// existing nearby test\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "initial token flow");
  await writeFile(path.join(repo, "src/token.ts"), "export function validateToken(value: string) { return value.length > 3; }\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "fix token validation");

  const command = [cli, "--base", "HEAD~1", "--head", "HEAD", "--repo", repo, "--json"];
  const first = execFileSync(process.execPath, command, { cwd: root, encoding: "utf8" });
  const second = execFileSync(process.execPath, command, { cwd: root, encoding: "utf8" });
  assert.equal(second, first);
  const executableOutput = execFileSync(executable, ["impact", "--base", "HEAD~1", "--head", "HEAD", "--repo", repo, "--json"], { cwd: root, encoding: "utf8" });
  assert.equal(executableOutput, first);

  const impact = JSON.parse(first);
  assert.equal(impact.schema_version, 1);
  assert.equal(impact.analysis, "deterministic_static_impact");
  assert.equal(impact.summary.changed_symbols, 1);
  assert.equal(impact.summary.analyzed_files, 1);
  assert.equal(impact.summary.unassessed_files, 0);
  assert.equal(impact.summary.affected_consumer_files, 1);
  assert.equal(impact.summary.unmodified_affected_consumer_files, 1);
  assert.deepEqual(impact.changed_symbols[0].direct_consumers, [{
    file: "src/session.ts",
    symbol: "createSession",
    modified_in_change: false,
  }]);
  assert.equal(impact.test_signals[0].nearby_test_change, "not_detected");
  assert.equal(impact.attention[0].type, "changed_symbol_reaches_unmodified_consumers");
  assert.doesNotMatch(first, /uninspected/i);
  assert.match(first, /does not establish whether an agent or reviewer inspected it/i);
  assert.match(first, /not a safety verdict/i);
  assert.match(first, /analysis_coverage/);

  const gated = spawnSync(process.execPath, [...command, "--fail-on-attention"], { cwd: root, encoding: "utf8" });
  assert.equal(gated.status, 2);
  assert.doesNotThrow(() => JSON.parse(gated.stdout));
});

test("impact analyzes staged, unstaged, renamed, deleted, and untracked working-tree changes", async () => {
  const repo = await mkdtemp(path.join(tmpdir(), "observatory-worktree-"));
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "Working Tree Fixture");
  git(repo, "config", "user.email", "working@example.test");
  await mkdir(path.join(repo, "src"));
  await writeFile(path.join(repo, "src/core.ts"), "export function core() { return 1; }\n");
  await writeFile(path.join(repo, "src/consumer.ts"), "import { core } from './core';\nexport const result = core();\n");
  await writeFile(path.join(repo, "src/old-name.ts"), "export function renamedValue() {\n  const stable = 1;\n  const alsoStable = 2;\n  return stable + alsoStable > 2;\n}\n");
  await writeFile(path.join(repo, "src/rename-consumer.ts"), "import { renamedValue } from './old-name';\nexport const aliasResult = renamedValue();\n");
  await writeFile(path.join(repo, "src/delete-me.ts"), "export const removed = true;\n");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "working tree baseline");

  await rename(path.join(repo, "src/old-name.ts"), path.join(repo, "src/renamed.ts"));
  await rm(path.join(repo, "src/delete-me.ts"));
  git(repo, "add", "-A");
  await writeFile(path.join(repo, "src/core.ts"), "export function core() { return 2; }\n");
  await writeFile(path.join(repo, "src/renamed.ts"), "export function renamedValue() {\n  const stable = 1;\n  const alsoStable = 2;\n  return stable + alsoStable > 3;\n}\n");
  await writeFile(path.join(repo, "src/untracked.ts"), "export const untracked = true;\n");

  const stdout = execFileSync(executable, ["impact", "--base", "HEAD", "--working-tree", "--repo", repo, "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  const impact = JSON.parse(stdout);
  const repeated = execFileSync(executable, ["impact", "--base", "HEAD", "--working-tree", "--repo", repo, "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(repeated, stdout);
  assert.equal(impact.change.working_tree, true);
  assert.equal(impact.change.head_ref, "WORKTREE");
  assert.equal(impact.summary.files_changed, 4);
  assert.deepEqual(impact.changed_files.map((file) => [file.path, file.status]), [
    ["src/core.ts", "modified"],
    ["src/delete-me.ts", "deleted"],
    ["src/renamed.ts", "renamed"],
    ["src/untracked.ts", "added"],
  ]);
  assert.equal(impact.changed_files.find((file) => file.path === "src/renamed.ts").previous_path, "src/old-name.ts");
  assert.deepEqual(impact.changed_files.find((file) => file.path === "src/untracked.ts").changed_line_ranges, [{ start: 1, end: 1 }]);
  assert.ok(impact.changed_symbols.some((symbol) => symbol.file === "src/core.ts" && symbol.change_type === "modified"));
  assert.ok(impact.changed_symbols.some((symbol) => symbol.file === "src/delete-me.ts" && symbol.change_type === "deleted"));
  assert.ok(impact.changed_symbols.some((symbol) => symbol.file === "src/untracked.ts" && symbol.change_type === "added"));
  const renamedSymbol = impact.changed_symbols.find((symbol) => symbol.file === "src/renamed.ts");
  assert.equal(renamedSymbol.change_type, "modified");
  assert.deepEqual(renamedSymbol.direct_consumers, [{
    file: "src/rename-consumer.ts",
    symbol: "aliasResult",
    modified_in_change: false,
  }]);
});
