import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderPath(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Codebase Observatory shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Codebase Observatory<\/title>/i);
  assert.match(
    html,
    /(?:Architecture|Branch impact), (?:history|architecture), and risk in one field of view/,
  );
  assert.match(html, /Architecture Field/);
  assert.match(html, /Data depth/);
  assert.match(html, /File Biography/);
  assert.match(html, /Blast radius estimate/);
  assert.match(html, /Framework-Aware Review/);
  assert.match(html, /Rust/);
  assert.match(html, /ML\/Data Science/);
  assert.match(html, /Debugging Olympics/);
  assert.match(html, /AI Agent Security Gym/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|SkeletonPreview/);
});

test("keeps the starter preview removed", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<Observatory \/>/);
  assert.match(layout, /title:\s*"Codebase Observatory"/);
  assert.doesNotMatch(page, /codex-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});

test("server-renders the deterministic diff review map", async () => {
  const response = await renderPath("/review");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Diff Review Map/);
  assert.match(html, /review unit/i);
  assert.match(html, /Unassessed files are called out explicitly/i);
  assert.match(html, /Analysis coverage/i);
  assert.match(html, /Runtime/);
  assert.match(html, /Generated/);
  assert.match(html, /Deterministic diff analysis/);
  assert.match(html, /Changed symbols/);
  assert.match(html, /affected consumers/i);
  assert.doesNotMatch(html, /this PR is safe/i);
});
