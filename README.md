# Codebase Observatory

Deterministic impact analysis for human and AI-generated code changes.

Coding agents know what they edited. Codebase Observatory shows what those
edits touch before the agent declares the task complete. The same evidence
turns a Git diff into a smaller, explainable plan for human reviewers:

- which symbols actually changed
- which consumers use those symbols
- which runtime changes have broad downstream impact
- why a review unit has its stated priority
- where nearby tests did—or did not—change

## Current Prototype

- deterministic diff review map
- changed-symbol and direct-consumer impact for JavaScript and TypeScript
- file-level blast-radius analysis
- nearby-test change detection
- churn, coupling, ownership, and bug-fix evidence
- module dependency graph
- interactive architecture map
- timeline scrubber and selected-file biography
- visible roadmap cards for Debugging Olympics and AI Agent Security Gym

## Give An Agent Impact Context

Run these commands from the Observatory repository. `--repo` must point to the
repository being analyzed; use `--repo "$PWD"` only when your terminal is
currently inside that target repository.

The normal agent workflow analyzes uncommitted work directly and saves the
result for the agent:

```bash
./bin/observatory.mjs impact \
  --repo "/absolute/path/to/target-repository" \
  --base HEAD \
  --working-tree \
  --json > /tmp/impact.json
```

This includes staged, unstaged, deleted, renamed, and untracked files. To
analyze a committed branch range instead:

```bash
./bin/observatory.mjs impact \
  --repo "/absolute/path/to/target-repository" \
  --base origin/main \
  --head HEAD \
  --json > /tmp/impact.json
```

Replace `origin/main` with the branch the change will merge into. To include
both feature-branch commits and additional uncommitted edits, combine the target
branch with working-tree mode:

```bash
./bin/observatory.mjs impact \
  --repo "/absolute/path/to/target-repository" \
  --base origin/main \
  --working-tree \
  --json > /tmp/impact.json
```

The report includes changed symbols, detected consumers, whether each consumer
was modified in the change, file-level downstream impact, nearby-test signals,
review units, and explicit attention items. It also includes analysis limits so
an agent cannot interpret missing static evidence as proof of safety.

Use the optional completion gate after an agent finishes editing:

```bash
./bin/observatory.mjs impact \
  --repo "/absolute/path/to/target-repository" \
  --base HEAD \
  --working-tree \
  --json \
  --fail-on-attention > /tmp/impact.json
```

The equivalent npm command starts with `npm run --silent impact --`. Keep
`--silent` when redirecting stdout so npm's banner does not precede the JSON
document.

Exit code `2` means the JSON contains one or more attention items; the output
remains valid JSON. It is a prompt to inspect evidence, not a failed safety
check. See `docs/IMPACT_SCHEMA.md` for the versioned contract.
See `docs/AGENT_WORKFLOW.md` for a completion-check prompt that can be given to
Claude, Codex, or another coding agent.

### Inspect The Result

Show the change, summary, and attention items:

```bash
jq '{change, summary, attention}' /tmp/impact.json
```

Show changed symbols:

```bash
jq '.changed_symbols' /tmp/impact.json
```

Show only high-priority attention items:

```bash
jq '.attention[] | select(.priority == "high")' /tmp/impact.json
```

If the result has changed files but no runtime files or symbols, inspect its
category breakdown and largest files:

```bash
jq '[.changed_files[].category]
  | group_by(.)
  | map({category: .[0], count: length})' /tmp/impact.json

jq '[.changed_files[]
  | {path, status, category, lines: (.additions + .deletions)}]
  | sort_by(-.lines)
  | .[:25]' /tmp/impact.json
```

### Give The Result To The Agent

Use this instruction after the agent has made its changes and run tests:

```text
Read /tmp/impact.json.

Review every attention item and the relevant changed symbols and consumers.
Inspect affected consumer files when they matter to the task.
Update implementation or tests if the evidence exposes an omission.
In the final response, explain how each relevant attention item was handled or
why no additional change was needed.

Do not assume that an empty attention list proves the change is safe. Do not
call an unmodified consumer "uninspected" without independent trace evidence.
```

An empty symbol list may mean the diff contains only documentation, generated
files, binary assets, or languages outside the current JS/TS symbol analyzer.

## Analyze A Real Repo

Generate UI data from a local Git repository:

```bash
npm run analyze -- /path/to/repo
```

The checked-in data currently points at this project itself:

```bash
npm run analyze -- /absolute/path/to/codebase-observatory
```

The analyzer reads tracked files, Git commits, authors, churn, co-change
patterns, and JavaScript/TypeScript imports, then writes:

```text
app/generated/repo-data.ts
```

## Build A Diff Review Map

Turn a branch diff into deterministic review units:

```bash
npm run analyze-diff -- main...HEAD
```

This writes `app/generated/diff-data.ts` and powers `/review`. It classifies
runtime, test, generated, documentation, and configuration changes; records
exact diff statistics and changed line ranges; identifies changed JS/TS symbols
and their direct consumers; calculates file-level JS/TS dependents;
adds recent churn, ownership, bug-fix, and co-change evidence; and groups
connected runtime changes into review units. Priorities always include their
reasons—there is no opaque risk score and no claim that a change is safe.
The generated output excludes itself from the report, and time-based history is
anchored to the analyzed HEAD commit so repeated runs produce identical data.

Customize generated-file detection and deliberately simple priority thresholds
in `observatory.config.json`.

## Measure Review Compression

The next milestone is evidence, not feature breadth. A paired ten-PR study
records the original review surface, Observatory's compressed review surface,
time to first understanding, total review time, and found or missed issues.

```bash
npm run review-study -- collect \
  --id PR-1842 --repo /path/to/repo --range main...feature-branch

npm run review-study -- session \
  --id PR-1842 --mode baseline --time-to-understanding 31 \
  --review-time 54 --issues-found 3 --issues-missed 0

npm run review-study -- session \
  --id PR-1842 --mode observatory --time-to-understanding 12 \
  --review-time 29 --issues-found 3 --issues-missed 0

npm run review-study -- report
```

See `experiments/METHODOLOGY.md` for selection criteria, counterbalancing, and
interpretation guardrails. The checked-in study starts empty: results should
come from real reviews, not illustrative data.

## Next Review Experiments

1. Measure review time and missed issues on real, large pull requests.
2. Validate changed-symbol detection across re-exports, aliases, and barrel files.
3. Compare file-level blast radius with symbol-level affected consumers.
4. Improve nearby-test matching using imports before adding coverage data.
5. Add GitHub PR ingestion only after the local workflow proves useful.

## Other Ideas To Keep

**Debugging Olympics**: timed production-failure challenges built from logs,
traces, commits, and dashboards.

**AI Agent Security Gym**: CTF-style levels for prompt injection, tool abuse,
memory poisoning, and sandbox defense.

## Commands

```bash
npm install
npm run analyze -- /path/to/repo
npm run analyze-diff -- main...HEAD
./bin/observatory.mjs impact --base main --head HEAD --json
npm run review-study -- report
npm run dev
npm test
```
