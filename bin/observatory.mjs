#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [command, ...args] = process.argv.slice(2);
const { version } = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const usage = `Usage:
  observatory impact [--base main] [--head HEAD | --working-tree] [--repo /path] [--json] [--fail-on-attention]
  observatory review [--base main] [--head HEAD | --working-tree] [--repo /path] [--port 4173] [--no-open]
`;

if (command === "--version" || command === "-v") {
  process.stdout.write(`${version}\n`);
} else if (command === "--help" || command === "-h" || command == null) {
  process.stdout.write(usage);
} else if (command !== "impact" && command !== "review") {
  process.stderr.write(usage);
  process.exitCode = 1;
} else {
  const script = command === "review" ? "review.mjs" : "impact.mjs";
  const result = spawnSync(process.execPath, [path.join(root, "scripts", script), ...args], {
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
