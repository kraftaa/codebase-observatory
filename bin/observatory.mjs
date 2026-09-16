#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [command, ...args] = process.argv.slice(2);

if (command !== "impact") {
  process.stderr.write("Usage: observatory impact [--base main] [--head HEAD | --working-tree] [--repo /path] [--json] [--fail-on-attention]\n");
  process.exitCode = 1;
} else {
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "impact.mjs"), ...args], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
