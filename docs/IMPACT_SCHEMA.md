# Agent Impact JSON

`./bin/observatory.mjs impact --base main --head HEAD --json` emits a deterministic
JSON document to standard output. The external contract is independent from the UI's
generated TypeScript data.

For an agent's uncommitted changes, use `--base HEAD --working-tree`. Working
tree mode includes staged, unstaged, deleted, renamed, and untracked files.

## Versioning

`schema_version` is currently `1`. Additive fields may appear within version 1.
Removing a field, changing its meaning, or changing a field's type requires a
new schema version.

## Top-level fields

- `analysis`: always `deterministic_static_impact` in version 1.
- `change`: requested refs plus resolved merge-base and head commits.
- `summary`: counts for files, lines, symbols, consumers, units, and attention.
- `changed_files`: exact status, category, line counts, changed ranges, analysis
  coverage, and optional workflow findings for every file in the effective diff.
- `changed_symbols`: changed declarations and detected direct consumers for
  JavaScript/TypeScript plus the bounded Python, Ruby/Rails, and Rust adapters.
- `affected_consumers`: consumer files reached by changed symbols and whether
  each file was modified in the analyzed change.
- `test_signals`: deterministic nearby-test matches for each runtime file.
- `review_units`: connected runtime changes plus classified non-runtime units.
- `attention`: evidence-backed conditions an agent should consider before
  declaring completion.
- `analysis_limits`: mandatory qualifications for interpreting absent evidence.

## Attention semantics

Version 1 may emit:

- `changed_symbol_reaches_unmodified_consumers`
- `changed_export_without_nearby_test_change`
- `broad_file_impact_without_nearby_test_change`
- `github_actions_workflow_finding`
- `semantic_impact_unassessed`

Attention priority is a transparent rule classification, not a risk score.
Every item includes a human-readable reason and the evidence used by the rule.

`modified_in_change: false` means only that the consumer does not appear in the
Git diff. It does not establish whether a coding agent inspected that file.

`nearby_test_change: "not_detected"` means no deterministic path/name match was
changed. It does not prove that tests are absent, inadequate, or were not run.

## Analysis coverage

Every changed file includes `analysis_coverage`:

- `analyzed`: supported semantic analysis ran, currently for JavaScript and
  TypeScript symbol impact.
- `partial`: a bounded analyzer ran. Python, Ruby/Rails, and Rust report changed
  declarations, statically resolved local dependencies, direct consumers, and
  nearby-test signals without claiming runtime dispatch coverage. GitHub Actions
  analysis checks changed triggers, token permissions, secret references,
  mutable action references, environments, workflow size, and selected shell
  patterns.
- `classified`: the file was categorized and measured, without semantic analysis.
- `unassessed`: Observatory has no semantic analyzer for the file type.

Neither `partial`, `classified`, nor `unassessed` is a safety or risk verdict.

GitHub Actions line findings intersect the selected diff and include `line`,
`changeType`, `scope`, and exact `evidence`. An added-workflow finding describes
configuration present in the newly added file; it does not attribute authorship
to a person. File-level findings such as workflow size use `scope: "file"`.

## Exit codes

- `0`: analysis completed; no gate condition was requested, or no attention
  items were found.
- `2`: `--fail-on-attention` was supplied and attention items were found. JSON
  is still written to standard output.
- Any other nonzero code indicates that analysis could not be completed.

The command does not claim that a change is safe.
