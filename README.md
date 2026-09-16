# Codebase Observatory

Understand what a code change affects before you merge it.

Codebase Observatory turns a Git diff into deterministic evidence for human
reviewers and coding agents:

```text
git diff
  -> changed symbols
  -> direct consumers and file-level dependents
  -> historical and test signals
  -> explainable review units
```

It helps answer which behavior changed, what uses it, where the blast radius is
widest, and where a nearby test change was not detected. Every priority includes
its reasons; Observatory does not produce an opaque risk score or claim that a
change is safe.

## What It Reports

- exact files, line counts, changed ranges, and change types
- changed JavaScript and TypeScript symbols
- direct consumers and file-level downstream impact
- nearby-test change signals
- churn, coupling, ownership, and recent bug-fix evidence
- review units with explicit priority reasons

The project also includes an interactive architecture map, repository timeline,
and file biographies as supporting evidence.

## Quick Start

Install dependencies in the Observatory repository:

```bash
npm install
```

Analyze uncommitted work in another repository:

```bash
./bin/observatory.mjs impact \
  --repo "/absolute/path/to/target-repository" \
  --base HEAD \
  --working-tree \
  --json > /tmp/impact.json
```

Inspect the result:

```bash
jq '{change, summary, attention}' /tmp/impact.json
```

Working-tree mode includes staged, unstaged, deleted, renamed, and untracked
files. To analyze committed work instead, use `--base origin/main --head HEAD`.

## Explore The UI

Generate repository and diff data, then start the app:

```bash
npm run analyze -- /absolute/path/to/target-repository
npm run analyze-diff -- main...HEAD
npm run dev
```

The architecture view is available at `/`; the deterministic review map is at
`/review`.

## Documentation

- [Usage and command reference](docs/USAGE.md)
- [Coding-agent completion workflow](docs/AGENT_WORKFLOW.md)
- [Impact JSON schema](docs/IMPACT_SCHEMA.md)
- [Review-compression study methodology](experiments/METHODOLOGY.md)

## Current Scope

Symbol-level analysis currently targets `.js`, `.jsx`, `.ts`, and `.tsx`.
Missing static evidence is not proof of safety, test coverage, or runtime
behavior. Observatory is a review-compression aid, not a replacement for tests,
runtime validation, or reviewer judgment.

## Next Experiments

1. Measure review time and missed issues on ten real, large pull requests.
2. Validate symbols across re-exports, aliases, and barrel files.
3. Compare file-level and symbol-level blast-radius accuracy.
4. Improve test matching before adding hosted pull-request ingestion.
