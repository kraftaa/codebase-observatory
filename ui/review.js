const app = document.querySelector("#app");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function label(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function changedLines(file) {
  return file.additions + file.deletions;
}

function append(parent, ...children) {
  parent.append(...children.filter(Boolean));
  return parent;
}

function priorityBadge(priority) {
  return element("span", `priority priority-${priority}`, priority);
}

function coverageBadge(coverage) {
  return element("span", `coverage coverage-${coverage.status}`, coverage.status.replace("_", " "));
}

function categoryLines(data, categories) {
  return data.changedFiles
    .filter((file) => categories.includes(file.category))
    .reduce((total, file) => total + changedLines(file), 0);
}

function renderSymbol(symbol) {
  const card = element("article");
  const heading = element("div");
  const suffix = symbol.kind === "function" || symbol.kind === "method" ? "()" : "";
  append(
    heading,
    element("strong", "", `${symbol.name}${suffix}`),
    element("span", "", `${symbol.changeType} · ${symbol.kind}${symbol.exported ? " · exported" : ""}`),
  );
  card.append(heading);

  const location = symbol.changedLines.length
    ? `:${Math.min(...symbol.changedLines)}${symbol.changedLines.length > 1 ? `–${Math.max(...symbol.changedLines)}` : ""}`
    : "";
  card.append(element("code", "", `${symbol.file}${location}`));

  if (symbol.directConsumers.length) {
    const list = element("ul");
    for (const consumer of symbol.directConsumers) {
      list.append(element("li", "", `${consumer.file}${consumer.symbol ? ` → ${consumer.symbol}` : ""}`));
    }
    card.append(list);
  } else {
    card.append(element("p", "", "No direct external symbol consumers found."));
  }
  return card;
}

function renderFile(file) {
  const card = element("article");
  const heading = element("div");
  append(
    heading,
    element("code", "", file.path),
    element("span", "", `${label(file.status)} · ${file.category} · +${file.additions} / −${file.deletions}`),
  );
  card.append(heading);
  const coverage = element("div", "file-coverage");
  append(coverage, coverageBadge(file.analysisCoverage), element("span", "", file.analysisCoverage.explanation));
  card.append(coverage);

  const facts = [
    ["Downstream", file.transitiveDependentCount],
    ["Commits / 90d", file.history.commitsLast90Days],
    ["Authors", file.history.uniqueAuthors],
    ["Bug fixes", file.history.recentBugFixCommits],
  ];
  const details = element("dl");
  for (const [term, value] of facts) {
    const fact = element("div");
    append(fact, element("dt", "", term), element("dd", "", String(value)));
    details.append(fact);
  }
  card.append(details);

  if (file.changedLineRanges.length) {
    const ranges = file.changedLineRanges
      .map((range) => range.start === range.end ? range.start : `${range.start}–${range.end}`)
      .join(", ");
    card.append(element("p", "line-ranges", `Changed lines: ${ranges}`));
  }
  if (file.riskSignals.length) {
    const list = element("ul");
    for (const signal of file.riskSignals) list.append(element("li", "", signal));
    card.append(list);
  }
  if (file.ownership.length) {
    card.append(element("p", "ownership", `Recent ownership: ${file.ownership.slice(0, 3).join(", ")}`));
  }
  return card;
}

function renderWorkflowFinding(finding) {
  const card = element("article", `workflow-finding finding-${finding.severity}`);
  const heading = element("div");
  append(
    heading,
    priorityBadge(finding.severity),
    element("strong", "", finding.title),
    element("code", "", `${finding.file}:${finding.line}`),
  );
  append(card, heading, element("p", "", finding.detail));
  if (finding.evidence) {
    const evidence = element("div", "finding-evidence");
    append(
      evidence,
      element("span", "", `${finding.changeType ?? "changed"} ${finding.scope ?? "line"} evidence`),
      element("code", "", finding.evidence),
    );
    card.append(evidence);
  }
  return card;
}

function renderDetail(data, unit) {
  const detail = element("aside", "review-detail");
  append(detail, priorityBadge(unit.priority), element("h2", "", unit.title));

  const reasons = element("div", "reason-list");
  for (const reason of unit.reason) reasons.append(element("p", "", `• ${reason}`));
  detail.append(reasons);

  if (unit.workflowFindings?.length) {
    detail.append(element("h3", "", "Workflow findings"));
    const findings = element("div", "workflow-findings");
    for (const finding of unit.workflowFindings) findings.append(renderWorkflowFinding(finding));
    detail.append(findings);
  }

  if (unit.changedSymbols.length) {
    detail.append(element("h3", "", "Changed symbols"));
    const symbols = element("div", "changed-symbols");
    for (const symbol of unit.changedSymbols) symbols.append(renderSymbol(symbol));
    detail.append(symbols);
  }

  detail.append(element("h3", "", "Files and evidence"));
  const files = element("div", "review-files");
  for (const file of data.changedFiles.filter((item) => unit.files.includes(item.path))) {
    files.append(renderFile(file));
  }
  detail.append(files);
  return detail;
}

function render(data) {
  app.replaceChildren();

  const nav = element("nav", "topbar");
  nav.setAttribute("aria-label", "Review map navigation");
  const product = element("strong", "brand", "Codebase Observatory");
  const json = element("a", "", "Download analysis JSON");
  json.href = "/impact.json";
  json.download = "observatory-impact.json";
  append(nav, product, element("span", "", "Deterministic diff analysis"), element("span", "", `${data.baseRef} → ${data.headRef}`), json);
  app.append(nav);

  const hero = element("header", "review-overview");
  const heroCopy = element("div");
  append(
    heroCopy,
    element("p", "eyebrow", "Diff Review Map"),
    element("h1", "", `${data.reviewUnits.length} review unit${data.reviewUnits.length === 1 ? "" : "s"} across ${data.summary.filesChanged} changed file${data.summary.filesChanged === 1 ? "" : "s"}`),
    element("p", "", "Deterministic evidence only. Unassessed files are called out explicitly instead of being labeled low risk."),
  );
  const total = element("div", "review-total");
  append(
    total,
    element("strong", "", data.summary.filesChanged.toLocaleString()),
    element("span", "", "files changed"),
    element("code", "", `+${data.summary.additions.toLocaleString()} / −${data.summary.deletions.toLocaleString()}`),
  );
  append(hero, heroCopy, total);
  app.append(hero);

  const coverageSummary = element("section", "coverage-summary");
  coverageSummary.setAttribute("aria-label", "Analysis coverage");
  for (const [name, count, status] of [
    ["Analyzed", data.summary.analyzedFiles, "analyzed"],
    ["Partial", data.summary.partiallyAnalyzedFiles, "partial"],
    ["Classified only", data.summary.classifiedOnlyFiles, "classified"],
    ["Unassessed", data.summary.unassessedFiles, "unassessed"],
  ]) {
    const card = element("article", `coverage-card coverage-card-${status}`);
    append(card, element("span", "", name), element("strong", "", count.toLocaleString()));
    coverageSummary.append(card);
  }
  app.append(coverageSummary);

  const breakdown = element("section", "review-breakdown");
  breakdown.setAttribute("aria-label", "Diff categories");
  const categories = [
    ["Runtime", data.summary.runtimeFiles, ["runtime"]],
    ["Tests", data.summary.testFiles, ["test"]],
    ["Generated", data.summary.generatedFiles, ["generated"]],
    ["Docs / config", data.summary.docsFiles + data.summary.configFiles, ["docs", "config"]],
  ];
  for (const [name, count, kinds] of categories) {
    const card = element("article");
    append(
      card,
      element("span", "", name),
      element("strong", "", count.toLocaleString()),
      element("small", "", `${categoryLines(data, kinds).toLocaleString()} changed lines`),
    );
    breakdown.append(card);
  }
  app.append(breakdown);

  if (!data.reviewUnits.length) {
    const empty = element("section", "empty-review");
    append(
      empty,
      element("p", "eyebrow", "No changed files"),
      element("h2", "", "This range is empty for the analyzed project path."),
      element("p", "", "Stop the server and rerun observatory review with a range containing changes."),
    );
    app.append(empty);
    return;
  }

  const workbench = element("section", "review-workbench");
  const unitsPanel = element("div", "review-units");
  const sectionHead = element("div", "review-section-head");
  const heading = element("div");
  append(
    heading,
    element("p", "eyebrow", "Review first"),
    element("h2", "", `${data.reviewUnits.length} explainable review unit${data.reviewUnits.length === 1 ? "" : "s"}`),
  );
  append(sectionHead, heading, element("span", "", "Connected components from imports + strong co-change"));
  unitsPanel.append(sectionHead);

  const list = element("div", "unit-list");
  const detailSlot = element("div", "detail-slot");
  const buttons = [];
  const selectUnit = (unit, button) => {
    for (const item of buttons) {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    }
    detailSlot.replaceChildren(renderDetail(data, unit));
  };

  for (const [index, unit] of data.reviewUnits.entries()) {
    const button = element("button", "review-unit");
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    const signal = unit.changedSymbols.length
      ? `${unit.changedSymbols.length} changed symbols · ${unit.affectedConsumers.length} affected consumers`
      : unit.workflowFindings?.length
        ? `${unit.workflowFindings.length} workflow findings · ${unit.analysisCoverage} analysis`
      : unit.blastRadius
        ? `${unit.blastRadius} downstream files`
        : `${unit.analysisCoverage ?? "classified"} change set`;
    append(
      button,
      priorityBadge(unit.priority),
      element("strong", "", unit.title),
      element("span", "", `${unit.files.length} file${unit.files.length === 1 ? "" : "s"}`),
      element("p", "", unit.reason[0]),
      element("small", "", signal),
    );
    button.addEventListener("click", () => selectUnit(unit, button));
    buttons.push(button);
    list.append(button);
    if (index === 0) queueMicrotask(() => selectUnit(unit, button));
  }
  unitsPanel.append(list);
  append(workbench, unitsPanel, detailSlot);
  app.append(workbench);
}

try {
  const response = await fetch("/api/review", { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  render(await response.json());
} catch (error) {
  app.replaceChildren(
    element("p", "eyebrow", "Could not load review data"),
    element("h1", "error-title", error instanceof Error ? error.message : String(error)),
  );
}
