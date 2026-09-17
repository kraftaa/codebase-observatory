import { execFileSync, spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const uiDirectory = path.join(projectRoot, "ui");
const args = process.argv.slice(2);

function option(name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function parseGenerated(source) {
  return JSON.parse(source.replace(/^export const diffReviewMap = /, "").replace(/ as const;\s*$/, ""));
}

function openBrowser(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const commandArgs = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(command, commandArgs, { detached: true, stdio: "ignore" });
  child.on("error", () => {
    process.stderr.write(`Could not open a browser automatically. Open ${url}\n`);
  });
  child.unref();
}

const workingTree = args.includes("--working-tree");
const baseRef = option("--base", workingTree ? "HEAD" : "main");
const headRef = workingTree ? "WORKTREE" : option("--head", "HEAD");
const repo = await realpath(path.resolve(option("--repo", process.cwd())));
const requestedPort = Number(option("--port", "4173"));

if (!Number.isInteger(requestedPort) || requestedPort < 0 || requestedPort > 65535) {
  throw new Error("--port must be an integer between 0 and 65535");
}

const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "observatory-review-"));
const generatedPath = path.join(temporaryDirectory, "diff-data.ts");
let server;

async function cleanup() {
  await rm(temporaryDirectory, { recursive: true, force: true });
}

try {
  const range = workingTree ? baseRef : `${baseRef}...${headRef}`;
  const analysis = execFileSync(process.execPath, [
    path.join(scriptDir, "analyze-diff.mjs"),
    range,
    "--repo", repo,
    "--output", generatedPath,
    ...(workingTree ? ["--working-tree"] : []),
  ], {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  const reviewData = parseGenerated(await readFile(generatedPath, "utf8"));
  const dataJson = JSON.stringify(reviewData);
  const routes = new Map([
    ["/review.js", [path.join(uiDirectory, "review.js"), "text/javascript; charset=utf-8"]],
    ["/review.css", [path.join(uiDirectory, "review.css"), "text/css; charset=utf-8"]],
  ]);

  server = createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'");
    response.setHeader("X-Content-Type-Options", "nosniff");

    if (pathname === "/api/review" || pathname === "/impact.json") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(dataJson);
      return;
    }

    const asset = routes.get(pathname);
    const filePath = asset?.[0] ?? (pathname === "/" || pathname === "/review" ? path.join(uiDirectory, "review.html") : null);
    const contentType = asset?.[1] ?? "text/html; charset=utf-8";
    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found\n");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    createReadStream(filePath).on("error", () => response.destroy()).pipe(response);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(requestedPort, "127.0.0.1", resolve);
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : requestedPort;
  const url = `http://127.0.0.1:${port}/review`;
  process.stdout.write(analysis);
  process.stdout.write(`Review UI: ${url}\n`);
  process.stdout.write("Press Ctrl+C to stop.\n");
  if (!args.includes("--no-open")) openBrowser(url);

  const stop = () => server.close(() => cleanup().finally(() => process.exit(0)));
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
} catch (error) {
  if (server?.listening) server.close();
  await cleanup();
  throw error;
}
