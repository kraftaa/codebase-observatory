# Review-map showcase

This example comes from an actual Codebase Observatory development diff. It is
included to make the product output concrete; it is not presented as proof that
review time was reduced.

![A 23-file diff grouped into nine explainable review units](assets/review-map.jpg)

## Starting review surface

The original Git diff contained:

- 23 changed files
- 2,420 added and 371 deleted lines
- 8 runtime files
- 4 test files
- 1 generated file
- 7 documentation or configuration files

A reviewer starting from the file list still has to decide which changes belong
together, which declarations changed, and which consumers may be affected.

## Observatory output

Observatory grouped the change into nine review units using imports and strong
historical co-change. For the selected unit it surfaced:

- 2 connected runtime files
- 7 changed symbols
- 1 exported changed symbol
- 1 direct consumer
- 2 runtime changes without a nearby test change
- exact changed symbol and line locations
- churn, ownership, bug-fix, and downstream evidence

This changes the first review question from “Which of these 23 files matter?” to
“Does this behavior change still work for this consumer, and is the absent
nearby-test change justified?”

## What the example proves—and does not prove

It proves that Observatory can deterministically transform a mixed diff into a
smaller set of connected, evidence-backed review units. Every displayed reason
can be traced to Git history, changed syntax, imports, or configured rules.

It does not prove that the change is safe or that the review is complete. The
current product experiment is to measure whether reviewers reach an accurate
understanding faster without missing issues. See
[the study methodology](../experiments/METHODOLOGY.md).

## Reproduce the UI

From a source checkout:

```bash
npm install
npm run analyze -- /absolute/path/to/target-repository
npm run analyze-diff -- main...HEAD
npm run dev
```

Open `http://localhost:3000/review`. If that port is occupied, use the local URL
printed by the development server.
