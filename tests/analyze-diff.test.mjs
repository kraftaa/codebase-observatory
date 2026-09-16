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
