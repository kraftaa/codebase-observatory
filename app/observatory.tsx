"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { repoData } from "./generated/repo-data";

type Module = {
  id: string;
  label: string;
  files: number;
  churn: number;
  risk: number;
  owner: string;
  x: number;
  y: number;
  radius: number;
};

type FileNode = {
  id: string;
  path: string;
  module: string;
  role: string;
  created: string;
  owner: string;
  touches: number;
  importers: number;
  dbtDownstream: number;
  dbtRefs: string[];
  bugFixes: number;
  coupling: string[];
  summary: string;
  x: number;
  y: number;
};

type Event = {
  month: string;
  title: string;
  detail: string;
  module: string;
};

type ModuleLink = {
  source: string;
  target: string;
  weight: number;
  kind: string;
};

type BranchReview = {
  base: string;
  head: string;
  changedFiles: number;
  commits: number;
  impactScore: number;
  riskLevel: string;
  evidence: {
    linesAdded: number;
    linesDeleted: number;
    upstreamRefs: number;
    downstreamRefs: number;
  };
  review: {
    scope: string;
    blastRadius: string;
    sensitivity: string;
    adapter: string;
    adapterLabel: string;
    attentionScore: number;
    summary: string;
    reasons: string[];
    actions: Array<{
      title: string;
      detail: string;
      command: string;
    }>;
    focus: string;
  };
  changedModules: Array<{
    id: string;
    label: string;
    changedFiles: number;
    risk: number;
    totalFiles: number;
  }>;
  changedFilesList: Array<{
    path: string;
    module: string;
    adapter: string;
    role: string;
    added: number;
    deleted: number;
    touches: number;
    importers: number;
    dbtDownstream: number;
    risk: number;
    moduleRisk: number;
    upstream: string[];
    downstream: string[];
  }>;
  touchedHotspots: Array<{
    path: string;
    module: string;
    touches: number;
    importers: number;
    dbtDownstream: number;
    bugFixes: number;
  }>;
  recentCommits: Array<{
    hash: string;
    date: string;
    author: string;
    subject: string;
  }>;
};

const nextIdeas = [
  {
    name: "Debugging Olympics",
    line: "Timed production-failure challenges built from logs, traces, commits, and dashboards.",
  },
  {
    name: "AI Agent Security Gym",
    line: "CTF-style levels for prompt injection, tool abuse, memory poisoning, and sandbox defense.",
  },
];

const adapterRoadmap = [
  {
    name: "Rust",
    signal: "crates, traits, lifetimes, unsafe blocks, feature flags",
  },
  {
    name: "ML/Data Science",
    signal: "datasets, features, notebooks, training, metrics, inference",
  },
  {
    name: "Terraform",
    signal: "resource replacement, module inputs, plans, environments",
  },
  {
    name: "Rails/Ruby",
    signal: "routes, controllers, callbacks, policies, serializers, views",
  },
];

function riskLabel(score: number) {
  if (score >= 80) return "critical";
  if (score >= 65) return "watch";
  return "stable";
}

const modules = repoData.modules as unknown as Module[];
const files = repoData.files as unknown as FileNode[];
const links = repoData.links as unknown as ModuleLink[];
const events = repoData.events as unknown as Event[];
const branchReview = repoData.branchReview as unknown as BranchReview | null;

function shortPath(filePath: string) {
  const fileName = filePath.split("/").pop() ?? filePath;
  const cleaned = fileName
    .replace(/\.(sql|tsx?|jsx?|rb|haml|erb|ya?ml|json|md)$/i, "")
    .replace(/^silver_/, "")
    .replace(/_daily/g, "")
    .replace(/_by_model/g, "");
  return cleaned.length > 28 ? `${cleaned.slice(0, 25)}...` : cleaned;
}

export function Observatory() {
  const [selectedId, setSelectedId] = useState(files[0]?.id ?? "");
  const [monthIndex, setMonthIndex] = useState(3);
  const selectedFile = files.find((file) => file.id === selectedId) ?? files[0];
  const selectedModule =
    modules.find((module) => module.id === selectedFile.module) ?? modules[0];
  const dataDepth = repoData.stats.commits < 5 ? "shallow" : "deep";
  const riskAverage = Math.round(
    modules.reduce((total, module) => total + module.risk, 0) /
      Math.max(modules.length, 1),
  );
  const topRiskModules = [...modules]
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 3);
  const topBranchFiles = branchReview?.changedFilesList.slice(0, 4) ?? [];
  const connectionCount = links.length;
  const strongestConnections = [...links]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);
  const activeBranchModules = new Set(
    branchReview?.changedModules.map((module) => module.id) ?? [],
  );
  const lineageFocusFile = branchReview?.changedFilesList.find(
    (file) => file.upstream.length || file.downstream.length,
  );
  const lineageModule = lineageFocusFile
    ? modules.find((item) => item.id === lineageFocusFile.module)
    : null;
  const branchLineage =
    lineageFocusFile && lineageModule
      ? {
          focusFile: lineageFocusFile,
          module: lineageModule,
          upstream: lineageFocusFile.upstream.slice(0, 5).map((pathName) => ({
            path: pathName,
            label: shortPath(pathName),
          })),
          downstream: lineageFocusFile.downstream.slice(0, 4).map((pathName) => ({
            path: pathName,
            label: shortPath(pathName),
          })),
        }
      : null;

  const safeMonthIndex = Math.min(monthIndex, Math.max(events.length - 1, 0));
  const activeEvent = events[safeMonthIndex] ?? {
    month: "Now",
    title: "No Git history",
    detail: "Run the analyzer inside a Git repository to populate the timeline.",
    module: selectedModule.id,
  };
  const focusModule = activeEvent.module;

  const visibleModules = useMemo(
    () =>
      modules.map((module) => ({
        ...module,
        pulse:
          module.id === focusModule ||
          module.id === selectedModule.id ||
          selectedFile.coupling.some((item) =>
            item.toLowerCase().includes(module.label.toLowerCase()),
          ),
      })),
    [focusModule, selectedFile.coupling, selectedModule.id],
  );

  return (
    <main className="observatory-shell">
      <div className="topbar" aria-label="Observatory status">
        <span>Codebase Observatory</span>
        <span>{repoData.repoName}</span>
        <Link href="/review">Diff review map →</Link>
        <span>
          {branchReview
            ? `${branchReview.base} -> ${branchReview.head}`
            : dataDepth === "shallow"
              ? "shallow history"
              : "deep history"}
        </span>
      </div>

      <section className="hero-panel" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Live Repository Scan</p>
          <h1 id="hero-title">
            {branchReview
              ? "Branch impact, architecture, and risk in one field of view."
              : "Architecture, history, and risk in one field of view."}
          </h1>
          <p>
            Now pointed at <code>{repoData.repoName}</code>. It maps real files,
            Git churn, imports, ownership signals, file biographies, and blast
            radius from the local repository data.
          </p>
        </div>
        <div className="hero-metrics" aria-label="Repository summary">
          <div>
            <span>{repoData.stats.trackedFiles.toLocaleString()}</span>
            <p>tracked files</p>
          </div>
          <div>
            <span>{repoData.modules.length}</span>
            <p>module clusters</p>
          </div>
          <div>
            <span>{branchReview?.changedFiles ?? riskAverage}</span>
            <p>{branchReview ? "branch files" : "risk field"}</p>
          </div>
        </div>
      </section>

      {branchReview ? (
        <section className="branch-impact" aria-label="Branch impact review">
          <div>
            <p className="eyebrow">Branch Impact Review</p>
            <h2>
              {branchReview.head} against {branchReview.base}
            </h2>
          </div>
          <div className="impact-stats">
            <div>
              <span>{branchReview.review.scope}</span>
              <p>
                {branchReview.changedFiles} changed file
                {branchReview.changedFiles === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <span>{branchReview.review.blastRadius}</span>
              <p>
                {branchReview.evidence.downstreamRefs} downstream model
                {branchReview.evidence.downstreamRefs === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <span>{branchReview.review.adapterLabel}</span>
              <p>review adapter</p>
            </div>
          </div>
          <div className="impact-evidence" aria-label="Branch evidence">
            <span>
              +{branchReview.evidence.linesAdded.toLocaleString()} / -
              {branchReview.evidence.linesDeleted.toLocaleString()} lines
            </span>
            <span>{branchReview.evidence.upstreamRefs} upstream refs</span>
            <span>{branchReview.evidence.downstreamRefs} downstream refs</span>
            <span>{branchReview.review.sensitivity} sensitivity</span>
            <span>{branchReview.review.attentionScore}/100 attention score</span>
          </div>
          <p className="impact-summary">{branchReview.review.summary}</p>
        </section>
      ) : null}

      <section className="workbench" aria-label="Repository observatory">
        <div className="map-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Architecture Field</p>
              <h2>{repoData.targetPath}</h2>
            </div>
            <div className="mode-pills" aria-label="Active overlays">
              <span>churn</span>
              <span>{connectionCount} links</span>
              <span>
                {repoData.stats.dbtManifest ? "dbt manifest" : "source scan"}
              </span>
            </div>
          </div>

          <svg
            className="system-map"
            viewBox="0 0 980 650"
            role="img"
            aria-label="Module graph showing dependency links and risk heat"
          >
            <defs>
              <radialGradient id="riskGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.74" />
                <stop offset="52%" stopColor="#ef4444" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#0b1020" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="calmGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#0b1020" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="beamGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#a78bfa" stopOpacity="0.36" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <rect className="deep-field" x="0" y="0" width="980" height="650" />
            <g className="scan-rings">
              <circle cx="490" cy="325" r="105" />
              <circle cx="490" cy="325" r="205" />
              <circle cx="490" cy="325" r="305" />
            </g>
            <g className="star-noise" aria-hidden="true">
              {Array.from({ length: 48 }).map((_, index) => (
                <circle
                  key={`star-${index}`}
                  cx={90 + ((index * 73) % 800)}
                  cy={78 + ((index * 137) % 500)}
                  r={index % 5 === 0 ? 1.8 : 1}
                />
              ))}
            </g>
            <g className="map-grid">
              {Array.from({ length: 11 }).map((_, index) => (
                <line
                  key={`v-${index}`}
                  x1={80 + index * 82}
                  x2={80 + index * 82}
                  y1="70"
                  y2="590"
                />
              ))}
              {Array.from({ length: 7 }).map((_, index) => (
                <line
                  key={`h-${index}`}
                  x1="80"
                  x2="900"
                  y1={90 + index * 80}
                  y2={90 + index * 80}
                />
              ))}
            </g>

            <g className="links">
              {links.map((link, index) => {
                const a = modules.find((module) => module.id === link.source);
                const b = modules.find((module) => module.id === link.target);
                if (!a || !b) return null;
                const active =
                  link.source === selectedModule.id ||
                  link.target === selectedModule.id ||
                  link.source === focusModule ||
                  link.target === focusModule ||
                  activeBranchModules.has(link.source) ||
                  activeBranchModules.has(link.target);
                const midX = (a.x + b.x) / 2;
                const midY = (a.y + b.y) / 2 - 34 - index * 3;
                return (
                  <path
                    key={`${link.source}-${link.target}-${link.kind}`}
                    d={`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`}
                    className={`${active ? "active-link" : ""} ${link.kind}`}
                    style={{
                      strokeWidth: active
                        ? Math.min(7, 3 + link.weight * 0.35)
                        : Math.min(4, 1.3 + link.weight * 0.18),
                    }}
                  />
                );
              })}
            </g>

            <g className="selected-beam">
              <line
                x1={selectedModule.x}
                y1={selectedModule.y}
                x2={selectedFile.x}
                y2={selectedFile.y}
              />
              <circle cx={selectedFile.x} cy={selectedFile.y} r="31" />
            </g>

            <g className="modules">
              {visibleModules.map((module) => (
                <g key={module.id}>
                  <circle
                    className={
                      activeBranchModules.has(module.id)
                        ? "branch-halo"
                        : module.risk > 70
                          ? "risk-halo"
                          : "calm-halo"
                    }
                    cx={module.x}
                    cy={module.y}
                    r={module.radius + 42}
                  />
                  <circle
                    className={`module-node ${module.pulse ? "is-active" : ""} ${
                      activeBranchModules.has(module.id) ? "branch-active" : ""
                    }`}
                    cx={module.x}
                    cy={module.y}
                    r={module.radius}
                  />
                  <text x={module.x} y={module.y - 4} textAnchor="middle">
                    {module.label}
                  </text>
                  <text
                    className="node-meta"
                    x={module.x}
                    y={module.y + 22}
                    textAnchor="middle"
                  >
                    {module.files} files · {riskLabel(module.risk)}
                  </text>
                  <text
                    className="node-risk"
                    x={module.x}
                    y={module.y + 42}
                    textAnchor="middle"
                  >
                    risk {module.risk}
                  </text>
                </g>
              ))}
            </g>

            <g className="file-points">
              {files.map((file) => (
                <g
                  key={file.id}
                  role="button"
                  tabIndex={0}
                  className="svg-button"
                  aria-label={`Inspect ${file.path}`}
                  onClick={() => setSelectedId(file.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedId(file.id);
                    }
                  }}
                >
                  <circle
                    className={file.id === selectedId ? "file-dot active" : "file-dot"}
                    cx={file.x}
                    cy={file.y}
                    r="9"
                  />
                </g>
              ))}
            </g>
          </svg>

          {branchLineage ? (
            <div className="lineage-strip" aria-label="dbt lineage flow">
              <div className="lineage-group">
                <span>feeds from</span>
                <div>
                  {branchLineage.upstream.map((node) => (
                    <strong key={node.path}>{node.label}</strong>
                  ))}
                </div>
              </div>
              <div className="lineage-change">
                <span>changed model</span>
                <strong>{shortPath(branchLineage.focusFile.path)}</strong>
              </div>
              <div className="lineage-group downstream">
                <span>feeds</span>
                <div>
                  {branchLineage.downstream.map((node) => (
                    <strong key={node.path}>{node.label}</strong>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {strongestConnections.length ? (
            <div className="connection-strip" aria-label="Strongest module links">
              <span>strongest module links</span>
              {strongestConnections.map((link) => {
                const source = modules.find((module) => module.id === link.source);
                const target = modules.find((module) => module.id === link.target);
                if (!source || !target) return null;
                return (
                  <strong key={`${link.source}-${link.target}`}>
                    {source.label} {"->"} {target.label} · {link.weight}{" "}
                    {link.kind}
                  </strong>
                );
              })}
            </div>
          ) : null}

          <div className="timeline" aria-label="Architecture timeline">
            <div className="timeline-top">
              <span>{activeEvent.month}</span>
              <p>
                <strong>{activeEvent.title}</strong> {activeEvent.detail}
              </p>
            </div>
            <input
              aria-label="Scrub repository history"
              type="range"
              min="0"
              max={events.length - 1}
              value={safeMonthIndex}
              onChange={(event) => setMonthIndex(Number(event.target.value))}
            />
            <div className="ticks">
              {events.map((event, index) => (
                <span key={`${event.month}-${index}`}>{event.month}</span>
              ))}
            </div>
          </div>
        </div>

        <aside className="inspector" aria-label="Selected file biography">
          {branchReview ? (
            <div className="branch-card">
              <span>Branch review</span>
              <strong>
                {branchReview.review.scope} scope ·{" "}
                {branchReview.review.blastRadius} blast radius
              </strong>
              <em>{branchReview.review.adapterLabel} adapter</em>
              <p>{branchReview.review.focus}</p>
              <ul>
                {branchReview.review.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="depth-card">
            <span>Data depth</span>
            <strong>{dataDepth}</strong>
            <p>
              {repoData.stats.commits} commit scanned. More history will make
              churn, coupling, and ownership signals sharper.
            </p>
          </div>

          <div className="panel-head">
            <div>
              <p className="eyebrow">File Biography</p>
              <h2>{selectedFile.path}</h2>
            </div>
            <span className={`risk-badge ${riskLabel(selectedModule.risk)}`}>
              {riskLabel(selectedModule.risk)}
            </span>
          </div>

          <p className="summary">{selectedFile.summary}</p>

          <div className="bio-grid">
            <div>
              <span>created</span>
              <strong>{selectedFile.created}</strong>
            </div>
            <div>
              <span>owner</span>
              <strong>{selectedFile.owner}</strong>
            </div>
            <div>
              <span>touches</span>
              <strong>{selectedFile.touches}</strong>
            </div>
            <div>
              <span>importers</span>
              <strong>{selectedFile.importers}</strong>
            </div>
            <div>
              <span>dbt downstream</span>
              <strong>{selectedFile.dbtDownstream}</strong>
            </div>
          </div>

          <div className="signal-list">
            <h3>Why it matters</h3>
            <p>
              {selectedFile.bugFixes} bug-fix commits, {selectedModule.churn}%
              churn pressure, and {selectedModule.owner} ownership context.
            </p>
            <h3>Usually changes with</h3>
            <ul>
              {selectedFile.coupling.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="blast-radius">
            <h3>Blast radius estimate</h3>
            <p>
              Editing this file may affect {selectedFile.importers} direct
              importers, {selectedFile.coupling.length} historically coupled
              files, {selectedFile.dbtDownstream} downstream dbt models, and
              the {selectedModule.label.toLowerCase()} module.
            </p>
          </div>

          <div className="risk-stack">
            <h3>Risk stack</h3>
            {topRiskModules.map((module) => (
              <div key={module.id}>
                <span>{module.label}</span>
                <meter min="0" max="100" value={module.risk} />
                <strong>{module.risk}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {branchReview ? (
        <section className="branch-details" aria-label="Changed branch modules">
          <article className="changed-files-card">
            <span>Changed files x-ray</span>
            {topBranchFiles.map((file) => (
              <div key={file.path}>
                <strong>{file.path}</strong>
                <p>
                  {file.role} · +{file.added} / -{file.deleted} · file risk{" "}
                  {file.risk} · {file.adapter}
                </p>
                {file.upstream.length || file.downstream.length ? (
                  <small>
                    {file.upstream.length ? `feeds from ${file.upstream.join(", ")}` : ""}
                    {file.upstream.length && file.downstream.length ? " · " : ""}
                    {file.downstream.length
                      ? `feeds ${file.downstream.join(", ")}`
                      : ""}
                  </small>
                ) : null}
              </div>
            ))}
          </article>
          <article className="review-plan-card">
            <span>Review plan</span>
            {branchReview.review.actions.map((action, index) => (
              <div key={`${action.title}-${index}`}>
                <strong>
                  {String(index + 1).padStart(2, "0")} · {action.title}
                </strong>
                <p>{action.detail}</p>
                <code>{action.command}</code>
              </div>
            ))}
          </article>
          <article>
            <span>Changed modules</span>
            {branchReview.changedModules.map((module) => (
              <div key={module.id}>
                <strong>{module.label}</strong>
                <p>
                  {module.changedFiles} changed of {module.totalFiles} files ·
                  risk {module.risk}
                </p>
              </div>
            ))}
          </article>
          <article>
            <span>Touched hotspots</span>
            {branchReview.touchedHotspots.length ? (
              branchReview.touchedHotspots.map((file) => (
                <div key={file.path}>
                  <strong>{file.path}</strong>
                  <p>
                    {file.touches} touches · {file.importers} importers ·{" "}
                    {file.dbtDownstream} dbt downstream · {file.bugFixes} bug
                    fixes
                  </p>
                </div>
              ))
            ) : (
              <p>No top hotspot files are directly changed by this branch.</p>
            )}
          </article>
          <article>
            <span>Recent branch commits</span>
            {branchReview.recentCommits.map((commit) => (
              <div key={commit.hash}>
                <strong>{commit.subject}</strong>
                <p>
                  {commit.date} · {commit.author}
                </p>
              </div>
            ))}
          </article>
        </section>
      ) : null}

      <section className="question-strip" aria-label="Product questions">
        <article>
          <span>01</span>
          <h2>What changed recently?</h2>
          <p>Scrub the timeline to see modules appear, heat up, and drift.</p>
        </article>
        <article>
          <span>02</span>
          <h2>What is risky?</h2>
          <p>Risk combines churn, coupling, ownership gaps, and bug-fix history.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Why does this file matter?</h2>
          <p>Every selected node gets a biography and blast-radius summary.</p>
        </article>
      </section>

      <section className="adapter-roadmap" aria-label="Framework adapters">
        <div>
          <p className="eyebrow">Framework-Aware Review</p>
          <h2>Same cockpit, different reasoning model per stack.</h2>
        </div>
        <div className="adapter-grid">
          {adapterRoadmap.map((adapter) => (
            <article key={adapter.name}>
              <strong>{adapter.name}</strong>
              <p>{adapter.signal}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="next-labs" aria-label="Other standout ideas">
        <div>
          <p className="eyebrow">Next labs, not forgotten</p>
          <h2>Two other ideas stay in the orbit.</h2>
        </div>
        <div className="lab-list">
          {nextIdeas.map((idea) => (
            <article key={idea.name}>
              <h3>{idea.name}</h3>
              <p>{idea.line}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
