# Usage

`--repo` must point to the repository being analyzed; use `--repo "$PWD"` only
when the terminal is currently inside that target repository.

## Install the CLI

```bash
brew install kraftaa/tap/observatory
```

The Homebrew package includes Node.js, the TypeScript parser, and the standalone
review visualization.

## Open The Review Map

Analyze staged, unstaged, deleted, renamed, and untracked work, then open the
interactive visualization:

```bash
observatory review \
  --repo "/absolute/path/to/target-repository" \
  --base HEAD \
  --working-tree
```

Analyze committed branch changes instead:

```bash
observatory review \
  --repo "/absolute/path/to/target-repository" \
  --base origin/main \
  --head HEAD
```

The local server listens only on `127.0.0.1`, opens the browser automatically,
and runs until you press `Ctrl+C`. Use `--no-open` to print the URL without
opening it, or `--port 0` to select any available port.

The review map reports analysis coverage per file:

- `analyzed`: semantic impact analysis ran for the supported file type
- `partial`: a bounded semantic analyzer ran, but important behavior remains outside its scope
- `classified`: the file was categorized and measured only
- `unassessed`: Observatory has no semantic analyzer for the file type

`unassessed` is deliberately not a low-risk verdict.

## Generate Agent Impact JSON

Analyze staged, unstaged, deleted, renamed, and untracked work:

```bash
observatory impact \
  --repo "/absolute/path/to/target-repository" \
  --base HEAD \
  --working-tree \
  --json > /tmp/impact.json
```

Analyze a committed branch range:

```bash
observatory impact \
  --repo "/absolute/path/to/target-repository" \
  --base origin/main \
  --head HEAD \
  --json > /tmp/impact.json
```

Use the target branch as `--base` with `--working-tree` to include both feature
branch commits and additional uncommitted edits.

Add `--fail-on-attention` for a completion gate. Exit code `2` means attention
items exist; the output remains valid JSON. It is a prompt to inspect evidence,
not a failed safety check. Other nonzero codes indicate analysis failure.

From a source checkout, the equivalent npm command begins with
`npm run --silent impact --`. Keep
`--silent` when redirecting stdout so npm output does not precede the JSON.

## Inspect Impact JSON

Show the change, summary, and attention items:

```bash
jq '{change, summary, attention}' /tmp/impact.json
```

Show changed symbols and high-priority attention:

```bash
jq '.changed_symbols' /tmp/impact.json
jq '.attention[] | select(.priority == "high")' /tmp/impact.json
```

If files changed but no runtime files or symbols appear, inspect category counts
and the largest changes:

```bash
jq '[.changed_files[].category]
  | group_by(.)
  | map({category: .[0], count: length})' /tmp/impact.json

jq '[.changed_files[]
  | {path, status, category, lines: (.additions + .deletions)}]
  | sort_by(-.lines)
  | .[:25]' /tmp/impact.json
```

An empty symbol list may mean the diff contains documentation, generated files,
binary assets, or languages outside the current JavaScript/TypeScript analyzer.
Changed GitHub Actions workflows include partial analysis of triggers,
permissions, secrets, action pins, environments, and selected shell patterns.
Line findings are emitted only when the relevant syntax intersects the diff.
Each finding records whether the evidence came from an added or modified file,
the exact line, and the line text. These labels describe the selected range;
they do not claim who authored the change.
See [IMPACT_SCHEMA.md](IMPACT_SCHEMA.md) for field definitions and interpretation
limits, and [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) for a reusable agent prompt.

## Develop The Full UI From Source

Generate architecture and repository-history data:

```bash
npm run analyze -- /absolute/path/to/target-repository
```

This writes `app/generated/repo-data.ts` from tracked files, Git history,
authors, churn, co-change patterns, and JavaScript/TypeScript imports.

Generate deterministic review units for a branch diff:

```bash
npm run analyze-diff -- main...HEAD
```

This writes `app/generated/diff-data.ts`, which powers `/review`. It classifies
runtime, test, generated, documentation, and configuration changes; records
exact diff statistics and line ranges; identifies changed symbols and detected
consumers; and adds historical evidence. Generated output excludes itself, and
time-based history is anchored to the analyzed HEAD for repeatable results.

Configure generated-file patterns and priority thresholds in
`observatory.config.json`.

Start the app:

```bash
npm run dev
```

## Measure Review Compression

Collect a pull request's machine-measured review surface:

```bash
npm run review-study -- collect \
  --id PR-1842 --repo /path/to/repo --range main...feature-branch
```

Record paired review sessions and generate the report:

```bash
npm run review-study -- session \
  --id PR-1842 --mode baseline --time-to-understanding 31 \
  --review-time 54 --issues-found 3 --issues-missed 0

npm run review-study -- session \
  --id PR-1842 --mode observatory --time-to-understanding 12 \
  --review-time 29 --issues-found 3 --issues-missed 0

npm run review-study -- report
```

See [the methodology](../experiments/METHODOLOGY.md) for study selection,
counterbalancing, and interpretation guardrails.

## Command Reference

```bash
npm run analyze -- /path/to/repo
npm run analyze-diff -- main...HEAD
observatory impact --base main --head HEAD --json
observatory review --base main --head HEAD
npm run review-study -- report
npm run dev
npm test
npm run lint
```
