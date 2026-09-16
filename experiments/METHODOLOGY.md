# Review Compression Study

The study asks one question: does Observatory reduce the effort required to
understand and review a large change without increasing missed issues?

Use ten real, non-trivial pull requests. Prefer changes with at least 20 files
or 1,000 changed lines and a mix of runtime, test, generated, documentation, or
configuration changes. Do not select only PRs where Observatory looks useful.

For each PR:

1. Collect machine metrics before either review session.
2. Run one baseline review using the normal diff workflow.
3. Run one Observatory-assisted review with an independent, comparably
   experienced reviewer. Never ask one person to review the same PR twice.
4. Rotate which mode happens first across cases.
5. Stop the clock at the same review-completeness standard in both modes.
6. Adjudicate found and missed issues against one shared issue list afterward.

Record zero and negative results. A smaller review surface is not automatically
a better review: time savings only matter if missed issues do not increase.
If a collected case moves to another head commit, recollect it with
`--replace --reset-sessions`; measurements from the old commit are discarded.

## Commands

```bash
npm run review-study -- collect \
  --id PR-1842 --repo /path/to/repo --range main...feature-branch

npm run review-study -- session \
  --id PR-1842 --mode baseline --reviewer reviewer-a \
  --time-to-understanding 31 --review-time 54 \
  --issues-found 3 --issues-missed 0

npm run review-study -- session \
  --id PR-1842 --mode observatory --reviewer reviewer-b \
  --time-to-understanding 12 --review-time 29 \
  --issues-found 3 --issues-missed 0

npm run review-study -- report
```

The report is written to `experiments/REPORT.md`. The study JSON remains the
source of truth and includes original size, Observatory compression metrics,
both human sessions, and optional notes.
