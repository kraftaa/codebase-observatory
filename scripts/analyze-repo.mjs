import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--")) ?? projectRoot;
function optionValue(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
}
const targetPath = path.resolve(targetArg);
const outputPath = path.join(projectRoot, "app", "generated", "repo-data.ts");
const maxCommits = Number(process.env.OBSERVATORY_MAX_COMMITS ?? 800);
const maxTrackedFiles = Number(process.env.OBSERVATORY_MAX_FILES ?? 6000);
const baseRef = optionValue("--base");
const headRef = optionValue("--head");

const sourceExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".erb",
  ".haml",
  ".json",
  ".md",
  ".ipynb",
  ".py",
  ".rake",
  ".rb",
  ".rs",
  ".sh",
  ".sql",
  ".tf",
  ".tfvars",
  ".toml",
  ".yaml",
  ".yml",
]);

const ignoredParts = new Set([
  ".git",
  ".next",
  ".vinext",
  ".wrangler",
  "dist",
  "node_modules",
]);

function runGit(args, options = {}) {
  return execFileSync("git", args, {
    cwd: options.cwd ?? targetPath,
    encoding: "utf8",
    maxBuffer: 128 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function shellQuote(value) {
  return JSON.stringify(value);
}

function normalizeId(value) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "root"
  );
}

function titleize(value) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function riskLabel(score) {
  if (score >= 80) return "critical";
  if (score >= 65) return "watch";
  return "stable";
}

function isUsefulFile(relativePath) {
  const parts = relativePath.split("/");
  if (parts.some((part) => ignoredParts.has(part))) return false;
  if (relativePath.includes("/.")) return false;
  return sourceExtensions.has(path.extname(relativePath));
}

function moduleFor(relativePath) {
  const parts = relativePath.split("/");
  if (parts[0] === "app") {
    if (parts[1] === "generated") return "app/generated";
    return "app";
  }
  if (parts[0] === "public") return "public";
  if (parts.length === 1) return "root";
  return parts[0] ?? "root";
}

function roleFor(relativePath) {
  const ext = path.extname(relativePath);
  if (relativePath.includes("/app/") || relativePath.startsWith("app/")) {
    if (relativePath.endsWith("page.tsx")) return "Route surface";
    if (relativePath.endsWith("layout.tsx")) return "Application shell";
    if (ext === ".css") return "Visual system";
    return "Interface logic";
  }
  if (relativePath.includes("test")) return "Render verification";
  if (ext === ".sql") return "Data model";
  if (ext === ".tf" || ext === ".tfvars") return "Infrastructure definition";
  if (relativePath.endsWith("Cargo.toml")) return "Rust package manifest";
  if (ext === ".rs") return "Rust system logic";
  if (ext === ".ipynb") return "Notebook experiment";
  if (
    ext === ".py" &&
    /\b(train|training|model|feature|dataset|pipeline|inference|predict|eval|notebook)\b/i.test(
      relativePath,
    )
  ) {
    return "ML pipeline logic";
  }
  if (ext === ".py") return "Python application logic";
  if (ext === ".rb") return "Ruby application logic";
  if (ext === ".haml" || ext === ".erb") return "Server-rendered view";
  if (ext === ".yml" || ext === ".yaml") return "Configuration";
  if (relativePath.includes("schema")) return "Data schema";
  if (relativePath.includes("worker")) return "Worker entrypoint";
  if (ext === ".md") return "Project documentation";
  if (ext === ".json") return "Project metadata";
  return "Source file";
}

function adapterFor(relativePath) {
  const ext = path.extname(relativePath);
  const mlPattern =
    /\b(ml|machine-learning|machine_learning|model|models|train|training|feature|features|dataset|datasets|pipeline|inference|predict|prediction|eval|experiment|notebook)\b/i;
  if (ext === ".sql" || relativePath.includes("dbt/")) {
    return "dbt";
  }
  if (
    ext === ".ipynb" ||
    ((ext === ".py" || ext === ".yaml" || ext === ".yml" || ext === ".toml") &&
      mlPattern.test(relativePath))
  ) {
    return "ml";
  }
  if (ext === ".rs" || relativePath.endsWith("Cargo.toml")) {
    return "rust";
  }
  if (
    ext === ".rb" ||
    ext === ".rake" ||
    relativePath.includes("/app/controllers/") ||
    relativePath.includes("/app/models/") ||
    relativePath.includes("/app/views/") ||
    relativePath.includes("config/routes")
  ) {
    return "rails";
  }
  if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
    if (
      relativePath.includes("/components/") ||
      relativePath.includes("/app/") ||
      relativePath.endsWith("page.tsx") ||
      relativePath.endsWith("layout.tsx")
    ) {
      return "react";
    }
    return "typescript";
  }
  if (ext === ".py") return "python";
  if (ext === ".tf" || ext === ".tfvars") return "terraform";
  return "generic";
}

function adapterLabel(adapter) {
  const labels = {
    dbt: "dbt",
    rails: "Rails/Ruby",
    react: "React/TypeScript",
    typescript: "TypeScript",
    rust: "Rust",
    ml: "ML/Data Science",
    python: "Python",
    terraform: "Terraform",
    generic: "Generic",
  };
  return labels[adapter] ?? titleize(adapter);
}

function resolveImport(fromFile, specifier, fileSet) {
  if (!specifier.startsWith(".")) return null;
  const base = path.posix.dirname(fromFile);
  const raw = path.posix.normalize(path.posix.join(base, specifier));
  const candidates = [
    raw,
    `${raw}.ts`,
    `${raw}.tsx`,
    `${raw}.js`,
    `${raw}.jsx`,
    `${raw}.mjs`,
    `${raw}.cjs`,
    path.posix.join(raw, "index.ts"),
    path.posix.join(raw, "index.tsx"),
    path.posix.join(raw, "index.js"),
  ];
  return candidates.find((candidate) => fileSet.has(candidate)) ?? null;
}

function parseImports(relativePath, source, fileSet) {
  const imports = new Set();
  const patterns = [
    /import\s+(?:[^'"]+\s+from\s+)?["']([^"']+)["']/g,
    /export\s+[^'"]+\s+from\s+["']([^"']+)["']/g,
    /require\(["']([^"']+)["']\)/g,
    /import\(["']([^"']+)["']\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const resolved = resolveImport(relativePath, match[1], fileSet);
      if (resolved) imports.add(resolved);
    }
  }
  return [...imports];
}

function dbtModelName(relativePath) {
  return path.basename(relativePath, path.extname(relativePath));
}

function dbtBuildCommand(relativePath) {
  const parts = relativePath.split("/");
  const modelsIndex = parts.lastIndexOf("models");
  const projectDirectory = modelsIndex > 0 ? parts.slice(0, modelsIndex).join("/") : "";
  const build = `dbt build --select ${dbtModelName(relativePath)}+`;
  return projectDirectory ? `cd ${projectDirectory} && ${build}` : build;
}

function parseDbtRefs(source) {
  const refs = new Set();
  const patterns = [
    /ref\(\s*['"]([^'"]+)['"]\s*\)/g,
    /ref\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      refs.add(match[1]);
    }
  }
  return [...refs];
}

async function loadDbtManifestLineage(rootPath, fileSet) {
  const candidates = [path.join(rootPath, "target", "manifest.json")];
  try {
    const entries = await readdir(rootPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        candidates.push(path.join(rootPath, entry.name, "target", "manifest.json"));
      }
    }
  } catch {
    // Fall back to the root target candidate.
  }

  for (const manifestPath of candidates) {
    try {
      const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
      const manifestDir = path.dirname(path.dirname(manifestPath));
      const projectPrefix = toPosix(path.relative(rootPath, manifestDir));
      const prefix = projectPrefix && projectPrefix !== "." ? `${projectPrefix}/` : "";
      const modelNodes = Object.values(manifest.nodes ?? {}).filter(
        (node) => node.resource_type === "model" && node.original_file_path,
      );
      const uniqueIdToFile = new Map();
      const nameToFile = new Map();

      for (const node of modelNodes) {
        const file = `${prefix}${toPosix(node.original_file_path)}`;
        if (!fileSet.has(file)) continue;
        uniqueIdToFile.set(node.unique_id, file);
        nameToFile.set(node.name, file);
      }

      const refsByFile = new Map();
      const downstreamByFile = new Map();
      for (const node of modelNodes) {
        const file = uniqueIdToFile.get(node.unique_id);
        if (!file) continue;
        const refs = [];
        for (const dependencyId of node.depends_on?.nodes ?? []) {
          const upstreamFile = uniqueIdToFile.get(dependencyId);
          if (upstreamFile) {
            refs.push(upstreamFile);
            downstreamByFile.set(upstreamFile, [
              ...(downstreamByFile.get(upstreamFile) ?? []),
              file,
            ]);
          }
        }
        refsByFile.set(file, refs);
      }

      return {
        path: manifestPath,
        refsByFile,
        downstreamByFile,
        nameToFile,
      };
    } catch {
      // Try the next common manifest location.
    }
  }

  return null;
}

function formatDate(raw) {
  if (!raw) return "Unknown";
  return raw.slice(0, 10);
}

function monthLabel(raw) {
  if (!raw) return "Now";
  return new Date(raw).toLocaleString("en-US", { month: "short" });
}

function importableTs(value) {
  return JSON.stringify(value, null, 2);
}

function changedFilesForRange(gitRoot, targetPrefix, base, head) {
  if (!base || !head) return [];
  const diffRaw = runGit(
    ["diff", "--name-only", `${base}...${head}`, "--", targetPrefix || "."],
    { cwd: gitRoot },
  );
  return diffRaw
    ? diffRaw
        .split("\n")
        .filter(Boolean)
        .map((file) =>
          targetPrefix && file.startsWith(`${targetPrefix}/`)
            ? file.slice(targetPrefix.length + 1)
            : file,
        )
        .filter((file) => file && isUsefulFile(file))
    : [];
}

function diffStatsForRange(gitRoot, targetPrefix, base, head) {
  if (!base || !head) return new Map();
  const diffRaw = runGit(
    ["diff", "--numstat", `${base}...${head}`, "--", targetPrefix || "."],
    { cwd: gitRoot },
  );
  const stats = new Map();
  if (!diffRaw) return stats;
  for (const line of diffRaw.split("\n").filter(Boolean)) {
    const [addedRaw, deletedRaw, gitFile] = line.split("\t");
    const file =
      targetPrefix && gitFile.startsWith(`${targetPrefix}/`)
        ? gitFile.slice(targetPrefix.length + 1)
        : gitFile;
    if (!file || !isUsefulFile(file)) continue;
    stats.set(file, {
      added: addedRaw === "-" ? 0 : Number(addedRaw),
      deleted: deletedRaw === "-" ? 0 : Number(deletedRaw),
    });
  }
  return stats;
}

function commitsForRange(gitRoot, targetPrefix, base, head) {
  if (!base || !head) return [];
  const rangeRaw = runGit(
    [
      "log",
      "--max-count=200",
      "--date=short",
      "--format=%H%x09%ad%x09%an%x09%s",
      `${base}..${head}`,
      "--",
      targetPrefix || ".",
    ],
    { cwd: gitRoot },
  );
  return rangeRaw
    ? rangeRaw.split("\n").filter(Boolean).map((line) => {
        const [hash, date, author, subject] = line.split("\t");
        return { hash, date, author, subject };
      })
    : [];
}

const gitRoot = runGit(["rev-parse", "--show-toplevel"]);
const targetPrefix = toPosix(path.relative(gitRoot, targetPath));
if (baseRef) runGit(["rev-parse", "--verify", baseRef], { cwd: gitRoot });
if (headRef) runGit(["rev-parse", "--verify", headRef], { cwd: gitRoot });
const trackedRaw = runGit(["ls-files", targetPrefix || "."], { cwd: gitRoot });
const trackedGitFiles = trackedRaw
  ? trackedRaw.split("\n").filter(Boolean)
  : [];

const relativeFiles = trackedGitFiles
  .map((file) =>
    targetPrefix && file.startsWith(`${targetPrefix}/`)
      ? file.slice(targetPrefix.length + 1)
      : file,
  )
  .filter((file) => file && isUsefulFile(file))
  .sort()
  .slice(0, maxTrackedFiles);

const fileSet = new Set(relativeFiles);
const gitLogRaw = runGit(
  [
    "log",
    `--max-count=${maxCommits}`,
    "--date=short",
    "--format=@@commit@@%H%x09%ad%x09%an%x09%s",
    "--name-only",
    "--",
    targetPrefix || ".",
  ],
  { cwd: gitRoot },
);

const commits = [];
for (const block of gitLogRaw.split("@@commit@@").filter(Boolean)) {
  const [header, ...nameLines] = block.trim().split("\n");
  const [hash, date, author, subject] = header.split("\t");
  const files = nameLines
    .map((file) =>
      targetPrefix && file.startsWith(`${targetPrefix}/`)
        ? file.slice(targetPrefix.length + 1)
        : file,
    )
    .filter((file) => fileSet.has(file));
  if (files.length) commits.push({ hash, date, author, subject, files });
}

const statsByFile = new Map(
  relativeFiles.map((file) => [
    file,
    {
      path: file,
      touches: 0,
      bugFixes: 0,
      authors: new Map(),
      firstDate: "",
      lastDate: "",
      coChanges: new Map(),
      imports: [],
      dbtRefs: [],
      importers: 0,
      dbtDownstream: 0,
    },
  ]),
);

for (const commit of commits) {
  const isBugFix = /\b(fix|bug|rollback|hotfix|regression|patch)\b/i.test(
    commit.subject,
  );
  for (const file of commit.files) {
    const stat = statsByFile.get(file);
    if (!stat) continue;
    stat.touches += 1;
    stat.bugFixes += isBugFix ? 1 : 0;
    stat.authors.set(commit.author, (stat.authors.get(commit.author) ?? 0) + 1);
    stat.firstDate = stat.firstDate || commit.date;
    stat.lastDate = commit.date;
    for (const peer of commit.files) {
      if (peer !== file) {
        stat.coChanges.set(peer, (stat.coChanges.get(peer) ?? 0) + 1);
      }
    }
  }
}

for (const file of relativeFiles) {
  const ext = path.extname(file);
  if (![".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".sql"].includes(ext)) continue;
  try {
    const source = await readFile(path.join(targetPath, file), "utf8");
    const stat = statsByFile.get(file);
    if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext)) {
      stat.imports = parseImports(file, source, fileSet);
    }
    if (ext === ".sql") {
      stat.dbtRefs = parseDbtRefs(source);
    }
  } catch {
    // Ignore unreadable files; Git already told us they exist.
  }
}

const dbtModelToFile = new Map(
  relativeFiles
    .filter((file) => path.extname(file) === ".sql")
    .map((file) => [dbtModelName(file), file]),
);
const dbtManifestLineage = await loadDbtManifestLineage(targetPath, fileSet);
if (dbtManifestLineage) {
  for (const [modelName, file] of dbtManifestLineage.nameToFile) {
    dbtModelToFile.set(modelName, file);
  }
}
const dbtDownstreamByFile = new Map();
if (dbtManifestLineage) {
  for (const [file, refs] of dbtManifestLineage.refsByFile) {
    const stat = statsByFile.get(file);
    if (stat) stat.dbtRefs = refs;
  }
  for (const [file, downstream] of dbtManifestLineage.downstreamByFile) {
    dbtDownstreamByFile.set(file, downstream);
  }
} else {
  for (const [file, stat] of statsByFile) {
    for (const refName of stat.dbtRefs) {
      const upstreamFile = dbtModelToFile.get(refName);
      if (!upstreamFile) continue;
      dbtDownstreamByFile.set(upstreamFile, [
        ...(dbtDownstreamByFile.get(upstreamFile) ?? []),
        file,
      ]);
    }
  }
}
for (const [file, downstream] of dbtDownstreamByFile) {
  const stat = statsByFile.get(file);
  if (stat) stat.dbtDownstream = downstream.length;
}

for (const stat of statsByFile.values()) {
  for (const imported of stat.imports) {
    const target = statsByFile.get(imported);
    if (target) target.importers += 1;
  }
}

const maxTouches = Math.max(1, ...[...statsByFile.values()].map((s) => s.touches));
const maxImporters = Math.max(1, ...[...statsByFile.values()].map((s) => s.importers));
const maxDownstream = Math.max(
  1,
  ...[...statsByFile.values()].map((s) => s.dbtDownstream),
);
const maxCoupling = Math.max(
  1,
  ...[...statsByFile.values()].map((s) =>
    Math.max(0, ...[...s.coChanges.values()]),
  ),
);

const modulesById = new Map();
for (const file of relativeFiles) {
  const modulePath = moduleFor(file);
  const id = normalizeId(modulePath);
  if (!modulesById.has(id)) {
    modulesById.set(id, {
      id,
      label: titleize(modulePath),
      sourcePath: modulePath,
      files: 0,
      churnTotal: 0,
      riskTotal: 0,
      authorCounts: new Map(),
      imports: new Map(),
    });
  }
  const moduleInfo = modulesById.get(id);
  const stat = statsByFile.get(file);
  moduleInfo.files += 1;
  moduleInfo.churnTotal += stat.touches;
  for (const [author, count] of stat.authors) {
    moduleInfo.authorCounts.set(
      author,
      (moduleInfo.authorCounts.get(author) ?? 0) + count,
    );
  }
}

for (const [file, stat] of statsByFile) {
  const from = normalizeId(moduleFor(file));
  for (const imported of stat.imports) {
    const to = normalizeId(moduleFor(imported));
    if (from !== to) {
      const moduleInfo = modulesById.get(from);
      moduleInfo.imports.set(to, (moduleInfo.imports.get(to) ?? 0) + 1);
    }
  }
}

const moduleList = [...modulesById.values()]
  .sort((a, b) => b.files - a.files)
  .slice(0, 9);
const moduleIds = new Set(moduleList.map((module) => module.id));

const modules = moduleList.map((module, index) => {
  const angle = (Math.PI * 2 * index) / Math.max(moduleList.length, 1) - Math.PI / 2;
  const x = Math.round(490 + Math.cos(angle) * 295);
  const y = Math.round(325 + Math.sin(angle) * 210);
  const owner =
    [...module.authorCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "Unknown";
  const churn = clamp(Math.round((module.churnTotal / maxTouches) * 80), 8, 100);
  const coupling = [...module.imports.values()].reduce((sum, count) => sum + count, 0);
  const risk = clamp(Math.round(churn * 0.55 + coupling * 9 + module.files * 0.6), 12, 92);
  module.riskTotal = risk;
  return {
    id: module.id,
    label: module.label,
    files: module.files,
    churn,
    risk,
    owner,
    x,
    y,
    radius: clamp(Math.round(38 + Math.sqrt(module.files) * 7), 42, 78),
  };
});

const links = [];
for (const moduleInfo of moduleList) {
  for (const [target, count] of moduleInfo.imports) {
    if (moduleIds.has(target)) {
      links.push({
        source: moduleInfo.id,
        target,
        weight: count,
        kind: "imports",
      });
    }
  }
}

const cochangeLinks = new Map();
for (const commit of commits) {
  const commitModules = [
    ...new Set(commit.files.map((file) => normalizeId(moduleFor(file)))),
  ].filter((moduleId) => moduleIds.has(moduleId));
  for (let i = 0; i < commitModules.length; i += 1) {
    for (let j = i + 1; j < commitModules.length; j += 1) {
      const pair = [commitModules[i], commitModules[j]].sort();
      const key = pair.join("::");
      cochangeLinks.set(key, {
        source: pair[0],
        target: pair[1],
        weight: (cochangeLinks.get(key)?.weight ?? 0) + 1,
        kind: "cochange",
      });
    }
  }
}

for (const link of [...cochangeLinks.values()]
  .sort((a, b) => b.weight - a.weight)
  .slice(0, 12)) {
  const duplicate = links.some(
    (existing) =>
      (existing.source === link.source && existing.target === link.target) ||
      (existing.source === link.target && existing.target === link.source),
  );
  if (!duplicate) links.push(link);
}

const rankedFiles = [...statsByFile.values()]
  .map((stat) => {
    const couplingScore =
      commits.length >= 3 ? Math.max(0, ...[...stat.coChanges.values()]) : 0;
    const risk = Math.round(
      (stat.touches / maxTouches) * 45 +
        (stat.importers / maxImporters) * 30 +
        (stat.dbtDownstream / maxDownstream) * 25 +
        (couplingScore / maxCoupling) * 20 +
        stat.bugFixes * 5,
    );
    return { ...stat, risk };
  })
  .sort((a, b) => b.risk - a.risk || b.importers - a.importers)
  .slice(0, 10);

const files = rankedFiles.map((stat, index) => {
  const moduleId = normalizeId(moduleFor(stat.path));
  const parent = modules.find((moduleInfo) => moduleInfo.id === moduleId) ?? modules[0];
  const localIndex = index + 1;
  const angle = localIndex * 2.399963;
  const distance = Math.min(parent.radius - 12, 18 + localIndex * 3);
  const owner =
    [...stat.authors.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Unknown";
  const coupling = [...stat.coChanges.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([file]) => file);
  return {
    id: normalizeId(stat.path),
    path: stat.path,
    module: parent.id,
    role: roleFor(stat.path),
    created: formatDate(stat.firstDate),
    owner,
    touches: stat.touches,
    importers: stat.importers,
    dbtDownstream: stat.dbtDownstream,
    dbtRefs: stat.dbtRefs.slice(0, 5),
    bugFixes: stat.bugFixes,
    coupling,
    summary: `${stat.path} is a ${roleFor(stat.path).toLowerCase()} in ${parent.label}. It has ${stat.touches} Git touch${stat.touches === 1 ? "" : "es"}, ${stat.importers} direct importer${stat.importers === 1 ? "" : "s"}, ${stat.dbtDownstream} dbt downstream model${stat.dbtDownstream === 1 ? "" : "s"}, and a ${riskLabel(stat.risk)} risk signal from churn, coupling, and ownership.`,
    x: Math.round(parent.x + Math.cos(angle) * distance),
    y: Math.round(parent.y + Math.sin(angle) * distance),
  };
});

const events = commits.slice(0, 6).reverse().map((commit) => {
  const firstFile = commit.files[0] ?? relativeFiles[0] ?? "";
  return {
    month: monthLabel(commit.date),
    title: commit.subject || commit.hash.slice(0, 7),
    detail: `${commit.files.length} tracked file${commit.files.length === 1 ? "" : "s"} changed by ${commit.author}.`,
    module: normalizeId(moduleFor(firstFile)),
  };
});

if (!events.length) {
  events.push({
    month: "Now",
    title: "No commits found",
    detail: "The analyzer found files but no Git commits for the selected path.",
    module: modules[0]?.id ?? "root",
  });
}

const branchChangedFiles = changedFilesForRange(gitRoot, targetPrefix, baseRef, headRef);
const branchDiffStats = diffStatsForRange(gitRoot, targetPrefix, baseRef, headRef);
const branchCommits = commitsForRange(gitRoot, targetPrefix, baseRef, headRef);
const changedModuleCounts = new Map();
const changedFileSet = new Set(branchChangedFiles);
for (const file of branchChangedFiles) {
  const moduleId = normalizeId(moduleFor(file));
  changedModuleCounts.set(moduleId, (changedModuleCounts.get(moduleId) ?? 0) + 1);
}

const branchModules = [...changedModuleCounts.entries()]
  .map(([id, changedFiles]) => {
    const moduleInfo = modules.find((item) => item.id === id);
    return {
      id,
      label: moduleInfo?.label ?? titleize(moduleFor(branchChangedFiles.find((file) => normalizeId(moduleFor(file)) === id) ?? id)),
      changedFiles,
      risk: moduleInfo?.risk ?? 0,
      totalFiles: moduleInfo?.files ?? changedFiles,
    };
  })
  .sort((a, b) => b.changedFiles - a.changedFiles)
  .slice(0, 8);

const touchedHotspots = files
  .filter((file) => changedFileSet.has(file.path))
  .map((file) => ({
    path: file.path,
    module: file.module,
    touches: file.touches,
    importers: file.importers,
    dbtDownstream: file.dbtDownstream,
    bugFixes: file.bugFixes,
  }));

const branchFileDetails = branchChangedFiles
  .map((file) => {
    const stat = statsByFile.get(file);
    const moduleId = normalizeId(moduleFor(file));
    const moduleInfo = modules.find((item) => item.id === moduleId);
    const diff = branchDiffStats.get(file) ?? { added: 0, deleted: 0 };
    const downstreamFiles = (dbtDownstreamByFile.get(file) ?? []).slice(0, 8);
    const upstreamFiles = (stat?.dbtRefs ?? [])
      .map((refName) =>
        fileSet.has(refName) ? refName : dbtModelToFile.get(refName) ?? refName,
      )
      .slice(0, 8);
    return {
      path: file,
      module: moduleId,
      adapter: adapterFor(file),
      role: roleFor(file),
      added: diff.added,
      deleted: diff.deleted,
      touches: stat?.touches ?? 0,
      importers: stat?.importers ?? 0,
      dbtDownstream: stat?.dbtDownstream ?? downstreamFiles.length,
      risk: stat
        ? clamp(
            Math.round(
              (stat.touches / maxTouches) * 25 +
                (stat.importers / maxImporters) * 15 +
                Math.min(stat.dbtRefs.length, 6) * 7 +
                stat.dbtDownstream * 16 +
                ((diff.added + diff.deleted) / 250) * 12,
            ),
            5,
            100,
          )
        : clamp(Math.round((diff.added + diff.deleted) / 2), 5, 85),
      moduleRisk: moduleInfo?.risk ?? 0,
      upstream: upstreamFiles,
      downstream: downstreamFiles,
    };
  })
  .sort((a, b) => b.risk - a.risk || b.added + b.deleted - (a.added + a.deleted))
  .slice(0, 20);

const branchEvidence = {
  linesAdded: [...branchDiffStats.values()].reduce((sum, stat) => sum + stat.added, 0),
  linesDeleted: [...branchDiffStats.values()].reduce(
    (sum, stat) => sum + stat.deleted,
    0,
  ),
  upstreamRefs: branchFileDetails.reduce(
    (sum, file) => sum + file.upstream.length,
    0,
  ),
  downstreamRefs: branchFileDetails.reduce(
    (sum, file) => sum + file.downstream.length,
    0,
  ),
};

const branchImpactScore = clamp(
  Math.round(
    branchChangedFiles.length * 4 +
      branchModules.reduce((sum, module) => sum + module.risk, 0) /
        Math.max(branchModules.length, 1) *
        0.25 +
      touchedHotspots.length * 15 +
      branchEvidence.downstreamRefs * 10 +
      Math.min(branchEvidence.linesAdded + branchEvidence.linesDeleted, 500) * 0.04,
  ),
  0,
  100,
);

function scopeLevel(changedFiles) {
  if (changedFiles <= 3) return "small";
  if (changedFiles <= 15) return "medium";
  return "large";
}

function blastRadiusLevel(evidence, modulesTouched, hotspotsTouched) {
  const radiusUnits =
    evidence.downstreamRefs + modulesTouched * 0.5 + hotspotsTouched * 2;
  if (radiusUnits <= 2) return "small";
  if (radiusUnits <= 8) return "medium";
  return "large";
}

function sensitivityLevel(filesForBranch) {
  const sensitivePattern =
    /\b(revenue|invoice|payment|billing|gold|auth|security|permission|customer|order)\b/i;
  const hasSensitivePath = filesForBranch.some(
    (file) =>
      sensitivePattern.test(file.path) ||
      file.upstream.some((item) => sensitivePattern.test(item)) ||
      file.downstream.some((item) => sensitivePattern.test(item)),
  );
  const touchesGoldModel = filesForBranch.some((file) =>
    file.downstream.some((item) => item.includes("/gold/")),
  );
  if (hasSensitivePath && touchesGoldModel) return "medium";
  if (hasSensitivePath) return "medium";
  return "low";
}

function commandForReview(file) {
  if (file.adapter === "dbt") {
    return {
      label: "dbt targeted build",
      command: dbtBuildCommand(file.path),
    };
  }
  if (file.adapter === "react" || file.adapter === "typescript") {
    return {
      label: "type and test pass",
      command: "npm run lint && npm test",
    };
  }
  if (file.adapter === "rails") {
    return {
      label: "ruby focused spec",
      command: `bundle exec rspec ${file.path}`,
    };
  }
  if (file.adapter === "rust") {
    return {
      label: "rust checks",
      command: "cargo fmt --check && cargo clippy --all-targets -- -D warnings && cargo test",
    };
  }
  if (file.adapter === "ml") {
    return {
      label: "ml validation pass",
      command: "pytest && run the affected training/inference smoke check",
    };
  }
  if (file.adapter === "python") {
    return {
      label: "python focused tests",
      command: "pytest",
    };
  }
  if (file.adapter === "terraform") {
    return {
      label: "terraform plan",
      command: "terraform fmt -check && terraform plan",
    };
  }
  return {
    label: "focused file review",
    command: `git diff ${baseRef}...${headRef} -- ${file.path}`,
  };
}

function dominantAdapter(filesForBranch) {
  const counts = new Map();
  for (const file of filesForBranch) {
    counts.set(file.adapter, (counts.get(file.adapter) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "generic";
}

function reviewActions(filesForBranch, evidence, sensitivity) {
  if (!filesForBranch.length) return [];
  const actions = [];
  const primary = filesForBranch[0];
  const adapter = dominantAdapter(filesForBranch);
  actions.push({
    title: "Read the changed logic first",
    detail: `${primary.path} carries the branch change. Start with the diff and confirm the intended behavior before scanning the wider map.`,
    command: `git diff ${baseRef}...${headRef} -- ${primary.path}`,
  });

  if (adapter === "dbt" && primary.upstream.length) {
    actions.push({
      title: "Validate upstream assumptions",
      detail: `This model reads ${primary.upstream.length} upstream input${primary.upstream.length === 1 ? "" : "s"}. Check grain, null handling, joins, and filters against the new logic.`,
      command: commandForReview(primary).command,
    });
  }

  if (adapter === "dbt" && primary.downstream.length) {
    actions.push({
      title: "Check downstream output",
      detail: `${primary.downstream[0]} is downstream of the changed model. Compare row counts and key revenue totals before and after the branch.`,
      command: dbtBuildCommand(primary.path),
    });
  }

  if (adapter === "rails") {
    actions.push({
      title: "Trace request and permission paths",
      detail: "For Rails changes, inspect the route/controller/action flow plus authorization, callbacks, serializers, and views that can change user-visible behavior.",
      command: commandForReview(primary).command,
    });
  }

  if (adapter === "react" || adapter === "typescript") {
    actions.push({
      title: "Check imports and rendered states",
      detail: "For TypeScript UI changes, inspect call sites, props/state shape, loading/error/empty states, and any shared hook or client boundary touched by the diff.",
      command: commandForReview(primary).command,
    });
  }

  if (adapter === "python") {
    actions.push({
      title: "Check data and runtime contracts",
      detail: "For Python changes, inspect function signatures, config/env assumptions, file or data inputs, and focused tests around the changed module.",
      command: commandForReview(primary).command,
    });
  }

  if (adapter === "rust") {
    actions.push({
      title: "Check public API and safety boundaries",
      detail: "For Rust changes, inspect trait signatures, lifetimes, feature flags, unsafe blocks, serialization formats, and error propagation at crate boundaries.",
      command: commandForReview(primary).command,
    });
  }

  if (adapter === "ml") {
    actions.push({
      title: "Check data, model, and metric drift",
      detail: "For ML changes, inspect dataset assumptions, feature transforms, seeds, checkpoint compatibility, metric movement, and training/inference skew.",
      command: commandForReview(primary).command,
    });
  }

  if (adapter === "terraform") {
    actions.push({
      title: "Review infrastructure blast radius",
      detail: "For Terraform changes, inspect resources, module inputs, environment targeting, and plan output before applying anything.",
      command: commandForReview(primary).command,
    });
  }

  if (sensitivity !== "low") {
    actions.push({
      title: "Run a business-value smoke check",
      detail: "Because this touches revenue-sensitive lineage, review aggregate totals by date/model and confirm the change does not shift unrelated cohorts.",
      command: "compare affected revenue totals before/after the branch",
    });
  }

  if (evidence.linesAdded + evidence.linesDeleted > 80) {
    actions.push({
      title: "Scan for accidental scope creep",
      detail: `${evidence.linesAdded + evidence.linesDeleted} lines changed in a small branch. Separate mechanical edits from business logic so review stays precise.`,
      command: `git diff --stat ${baseRef}...${headRef}`,
    });
  }

  return actions.slice(0, 5);
}

function reviewFocus(adapter, sensitivity) {
  if (adapter === "dbt") {
    return "Check dbt grain, aggregation behavior, and downstream revenue output.";
  }
  if (adapter === "rails") {
    return "Check request flow, authorization, callbacks, serializers, and user-visible views.";
  }
  if (adapter === "react" || adapter === "typescript") {
    return "Check call sites, prop/state contracts, loading/error states, and shared client boundaries.";
  }
  if (adapter === "rust") {
    return "Check crate API contracts, ownership/lifetime changes, unsafe boundaries, and error handling.";
  }
  if (adapter === "ml") {
    return "Check dataset assumptions, feature transforms, reproducibility, metric movement, and inference compatibility.";
  }
  if (adapter === "python") {
    return "Check runtime contracts, config assumptions, data inputs, and focused tests.";
  }
  if (adapter === "terraform") {
    return "Check plan output, resource replacement risk, module inputs, and environment targeting.";
  }
  return sensitivity === "medium"
    ? "Check domain behavior, downstream references, and high-value output changes."
    : "Check local correctness and affected downstream references.";
}

const branchScopeLevel = scopeLevel(branchChangedFiles.length);
const branchBlastRadiusLevel = blastRadiusLevel(
  branchEvidence,
  branchModules.length,
  touchedHotspots.length,
);
const branchSensitivityLevel = sensitivityLevel(branchFileDetails);
const branchDominantAdapter = dominantAdapter(branchFileDetails);
const branchReviewActions = reviewActions(
  branchFileDetails,
  branchEvidence,
  branchSensitivityLevel,
);
const branchReviewReasons = [
  `${branchChangedFiles.length} changed file${branchChangedFiles.length === 1 ? "" : "s"}`,
  `${adapterLabel(branchDominantAdapter)} review adapter`,
  `${branchEvidence.downstreamRefs} known downstream model${branchEvidence.downstreamRefs === 1 ? "" : "s"}`,
  `${branchEvidence.upstreamRefs} upstream input${branchEvidence.upstreamRefs === 1 ? "" : "s"}`,
  `${branchEvidence.linesAdded + branchEvidence.linesDeleted} changed line${branchEvidence.linesAdded + branchEvidence.linesDeleted === 1 ? "" : "s"}`,
];

const branchReview =
  baseRef && headRef
    ? {
        base: baseRef,
        head: headRef,
        changedFiles: branchChangedFiles.length,
        commits: branchCommits.length,
        impactScore: branchImpactScore,
        changedModules: branchModules,
        changedFilesList: branchFileDetails,
        touchedHotspots,
        evidence: branchEvidence,
        review: {
          scope: branchScopeLevel,
          blastRadius: branchBlastRadiusLevel,
          sensitivity: branchSensitivityLevel,
          adapter: branchDominantAdapter,
          adapterLabel: adapterLabel(branchDominantAdapter),
          attentionScore: branchImpactScore,
          summary:
            branchScopeLevel === "small" && branchBlastRadiusLevel === "small"
              ? `Small branch. Review attention is driven by ${branchSensitivityLevel} sensitivity, not broad file spread.`
              : `${titleize(branchScopeLevel)} scope with ${branchBlastRadiusLevel} blast radius and ${branchSensitivityLevel} sensitivity.`,
          reasons: branchReviewReasons,
          actions: branchReviewActions,
          focus: reviewFocus(branchDominantAdapter, branchSensitivityLevel),
        },
        recentCommits: branchCommits.slice(0, 6),
        riskLevel:
          branchImpactScore >= 70
            ? "high"
            : branchImpactScore >= 35
              ? "medium"
              : "low",
      }
    : null;

const repoData = {
  repoName: path.basename(targetPath),
  targetPath: path.basename(targetPath),
  generatedAt: new Date().toISOString(),
  stats: {
    trackedFiles: relativeFiles.length,
    commits: commits.length,
    dbtManifest: Boolean(dbtManifestLineage),
  },
  modules,
  files,
  links,
  events,
  branchReview,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  `export const repoData = ${importableTs(repoData)} as const;\n`,
);

console.log(`Analyzed ${shellQuote(targetPath)}`);
if (branchReview) {
  console.log(
    `Compared ${shellQuote(branchReview.base)}...${shellQuote(branchReview.head)} (${branchReview.changedFiles} files)`,
  );
}
console.log(`Wrote ${shellQuote(outputPath)}`);
