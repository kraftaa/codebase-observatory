"use client";

import { useState } from "react";
import Link from "next/link";
import { diffReviewMap } from "../generated/diff-data";

type Priority = "high" | "medium" | "unassessed" | "low";
type AnalysisCoverage = {
  status: "analyzed" | "partial" | "classified" | "unassessed";
  analyzer: string | null;
  explanation: string;
};
type WorkflowFinding = {
  id: string;
  severity: "high" | "medium";
  title: string;
  detail: string;
  line: number;
  file: string;
  scope?: "line" | "file";
  changeType?: "added" | "modified" | "deleted";
  evidence?: string;
};
type ChangedSymbol = {
  file: string;
  name: string;
  kind: string;
  changeType: "added" | "modified" | "deleted";
  exported: boolean;
  changedLines: readonly number[];
  directConsumers: readonly { file: string; symbol?: string }[];
};
type ReviewUnit = {
  id: string;
  title: string;
  files: readonly string[];
  reason: readonly string[];
  blastRadius: number;
  untestedRuntimeFiles: readonly string[];
  changedSymbols: readonly ChangedSymbol[];
  externallyUsedChangedSymbols: number;
  affectedConsumers: readonly string[];
  workflowFindings?: readonly WorkflowFinding[];
  analysisCoverage?: string;
  priority: Priority;
};

type ReviewFile = (typeof diffReviewMap.changedFiles)[number] & {
  analysisCoverage?: AnalysisCoverage;
};
const changedFiles = diffReviewMap.changedFiles as unknown as readonly ReviewFile[];
const units = (diffReviewMap.reviewUnits as unknown as readonly ReviewUnit[]).map((unit) => {
  if (unit.analysisCoverage) return unit;
  if (unit.id.startsWith("runtime-")) return { ...unit, analysisCoverage: "analyzed" };
  if (unit.id === "config" || unit.id === "unknown") {
    return { ...unit, analysisCoverage: "unassessed", priority: "unassessed" as const };
  }
  return { ...unit, analysisCoverage: "classified" };
});
const coverageSummary = diffReviewMap.summary as typeof diffReviewMap.summary & {
  analyzedFiles?: number;
  partiallyAnalyzedFiles?: number;
  classifiedOnlyFiles?: number;
  unassessedFiles?: number;
};
const inferredCoverage = {
  analyzed: changedFiles.filter((file) => file.category === "runtime").length,
  partial: changedFiles.filter((file) => file.analysisCoverage?.status === "partial").length,
  classified: changedFiles.filter((file) => ["test", "docs", "generated"].includes(file.category)).length,
  unassessed: changedFiles.filter((file) => ["config", "unknown"].includes(file.category) && file.analysisCoverage?.status !== "partial").length,
};

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ReviewMap() {
  const [selectedId, setSelectedId] = useState(units[0]?.id ?? "");
  const selected = units.find((unit) => unit.id === selectedId) ?? units[0];
  const selectedFiles = selected
    ? changedFiles.filter((file) => selected.files.includes(file.path))
    : [];
  const categorizedLines = (category: string) =>
    changedFiles
      .filter((file) => file.category === category)
      .reduce((total, file) => total + file.additions + file.deletions, 0);

  return (
    <main className="review-shell">
      <nav className="topbar" aria-label="Review map navigation">
        <Link href="/">← Architecture map</Link>
        <span>Deterministic diff analysis</span>
        <span>{diffReviewMap.baseRef} → {diffReviewMap.headRef}</span>
      </nav>

      <header className="review-overview">
        <div>
          <p className="eyebrow">Diff Review Map</p>
          <h1>{units.length} review unit{units.length === 1 ? "" : "s"} across {diffReviewMap.summary.filesChanged} changed file{Number(diffReviewMap.summary.filesChanged) === 1 ? "" : "s"}</h1>
          <p>
            Deterministic evidence only. Unassessed files are called out explicitly
            instead of being labeled low risk.
          </p>
        </div>
        <div className="review-total">
          <strong>{diffReviewMap.summary.filesChanged}</strong>
          <span>files changed</span>
          <code>+{diffReviewMap.summary.additions.toLocaleString()} / −{diffReviewMap.summary.deletions.toLocaleString()}</code>
        </div>
      </header>

      <section className="coverage-summary" aria-label="Analysis coverage">
        {[
          ["Analyzed", coverageSummary.analyzedFiles ?? inferredCoverage.analyzed, "analyzed"],
          ["Partial", coverageSummary.partiallyAnalyzedFiles ?? inferredCoverage.partial, "partial"],
          ["Classified only", coverageSummary.classifiedOnlyFiles ?? inferredCoverage.classified, "classified"],
          ["Unassessed", coverageSummary.unassessedFiles ?? inferredCoverage.unassessed, "unassessed"],
        ].map(([name, count, status]) => (
          <article className={`coverage-card-${status}`} key={String(status)}>
            <span>{name}</span><strong>{count}</strong>
          </article>
        ))}
      </section>

      <section className="review-breakdown" aria-label="Diff categories">
        {[
          ["Runtime", diffReviewMap.summary.runtimeFiles, categorizedLines("runtime")],
          ["Tests", diffReviewMap.summary.testFiles, categorizedLines("test")],
          ["Generated", diffReviewMap.summary.generatedFiles, categorizedLines("generated")],
          ["Docs / config", diffReviewMap.summary.docsFiles + diffReviewMap.summary.configFiles, categorizedLines("docs") + categorizedLines("config")],
        ].map(([name, count, lines]) => (
          <article key={String(name)}>
            <span>{name}</span>
            <strong>{count}</strong>
            <small>{Number(lines).toLocaleString()} changed lines</small>
          </article>
        ))}
      </section>

      {units.length ? (
        <section className="review-workbench">
          <div className="review-units">
            <div className="review-section-head">
              <div>
                <p className="eyebrow">Review first</p>
                <h2>{units.length} explainable review unit{units.length === 1 ? "" : "s"}</h2>
              </div>
              <span>Connected components from imports + strong co-change</span>
            </div>
            <div className="unit-list">
              {units.map((unit) => (
                <button
                  className={`review-unit ${selected?.id === unit.id ? "active" : ""}`}
                  key={unit.id}
                  onClick={() => setSelectedId(unit.id)}
                  type="button"
                >
                  <span className={`priority priority-${unit.priority}`}>{unit.priority}</span>
                  <strong>{unit.title}</strong>
                  <span>{unit.files.length} file{unit.files.length === 1 ? "" : "s"}</span>
                  <p>{unit.reason[0]}</p>
                  <small>{unit.changedSymbols.length ? `${unit.changedSymbols.length} changed symbols · ${unit.affectedConsumers.length} affected consumers` : unit.workflowFindings?.length ? `${unit.workflowFindings.length} workflow findings · ${unit.analysisCoverage} analysis` : unit.blastRadius ? `${unit.blastRadius} downstream files` : `${unit.analysisCoverage ?? "classified"} change set`}</small>
                </button>
              ))}
            </div>
          </div>

          {selected ? (
            <aside className="review-detail">
              <p className={`priority priority-${selected.priority}`}>{selected.priority} priority</p>
              <h2>{selected.title}</h2>
              <div className="reason-list">
                {selected.reason.map((reason) => <p key={reason}>• {reason}</p>)}
              </div>
              {selected.workflowFindings && selected.workflowFindings.length > 0 && (
                <>
                  <h3>Workflow findings</h3>
                  <div className="workflow-findings">
                    {selected.workflowFindings.map((finding) => (
                      <article className={`workflow-finding finding-${finding.severity}`} key={`${finding.file}:${finding.id}:${finding.line}`}>
                        <div>
                          <span className={`priority priority-${finding.severity}`}>{finding.severity}</span>
                          <strong>{finding.title}</strong>
                          <code>{finding.file}:{finding.line}</code>
                        </div>
                        <p>{finding.detail}</p>
                        {finding.evidence && (
                          <div className="finding-evidence">
                            <span>{finding.changeType ?? "changed"} {finding.scope ?? "line"} evidence</span>
                            <code>{finding.evidence}</code>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </>
              )}
              {selected.changedSymbols.length > 0 && (
                <>
                  <h3>Changed symbols</h3>
                  <div className="changed-symbols">
                    {selected.changedSymbols.map((symbol) => (
                      <article key={`${symbol.file}:${symbol.kind}:${symbol.name}`}>
                        <div>
                          <strong>{symbol.name}{symbol.kind === "function" || symbol.kind === "method" ? "()" : ""}</strong>
                          <span>{symbol.changeType} · {symbol.kind}{symbol.exported ? " · exported" : ""}</span>
                        </div>
                        <code>{symbol.file}{symbol.changedLines.length ? `:${Math.min(...symbol.changedLines)}${symbol.changedLines.length > 1 ? `–${Math.max(...symbol.changedLines)}` : ""}` : ""}</code>
                        {symbol.directConsumers.length > 0 ? (
                          <ul>
                            {symbol.directConsumers.map((consumer) => (
                              <li key={`${consumer.file}:${consumer.symbol ?? "file"}`}>
                                {consumer.file}{consumer.symbol ? ` → ${consumer.symbol}` : ""}
                              </li>
                            ))}
                          </ul>
                        ) : <p>No direct external symbol consumers found.</p>}
                      </article>
                    ))}
                  </div>
                </>
              )}
              <h3>Files and evidence</h3>
              <div className="review-files">
                {selectedFiles.map((file) => (
                  <article key={file.path}>
                    <div>
                      <code>{file.path}</code>
                      <span>{label(file.status)} · {file.category} · +{file.additions} / −{file.deletions}</span>
                    </div>
                    {file.analysisCoverage && (
                      <div className="file-coverage">
                        <span className={`coverage coverage-${file.analysisCoverage.status}`}>{file.analysisCoverage.status}</span>
                        <span>{file.analysisCoverage.explanation}</span>
                      </div>
                    )}
                    <dl>
                      <div><dt>Downstream</dt><dd>{file.transitiveDependentCount}</dd></div>
                      <div><dt>Commits / 90d</dt><dd>{file.history.commitsLast90Days}</dd></div>
                      <div><dt>Authors</dt><dd>{file.history.uniqueAuthors}</dd></div>
                      <div><dt>Bug fixes</dt><dd>{file.history.recentBugFixCommits}</dd></div>
                    </dl>
                    {file.changedLineRanges.length > 0 && (
                      <p className="line-ranges">Changed lines: {file.changedLineRanges.map((range) => range.start === range.end ? range.start : `${range.start}–${range.end}`).join(", ")}</p>
                    )}
                    {file.riskSignals.length > 0 && (
                      <ul>{file.riskSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
                    )}
                    {file.ownership.length > 0 && <p className="ownership">Recent ownership: {file.ownership.slice(0, 3).join(", ")}</p>}
                  </article>
                ))}
              </div>
            </aside>
          ) : null}
        </section>
      ) : (
        <section className="empty-review">
          <p className="eyebrow">No changed files</p>
          <h2>This range is empty for the analyzed project path.</h2>
          <p>Run <code>npm run analyze-diff -- main...HEAD</code> on a branch with changes, then refresh this page.</p>
        </section>
      )}
    </main>
  );
}
