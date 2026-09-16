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
- `changed_files`: exact status, category, line counts, and changed ranges for
  every file in the effective diff.
- `changed_symbols`: changed JS/TS declarations and detected direct consumers.
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

Attention priority is a transparent rule classification, not a risk score.
Every item includes a human-readable reason and the evidence used by the rule.

`modified_in_change: false` means only that the consumer does not appear in the
Git diff. It does not establish whether a coding agent inspected that file.

`nearby_test_change: "not_detected"` means no deterministic path/name match was
changed. It does not prove that tests are absent, inadequate, or were not run.

## Exit codes

- `0`: analysis completed; no gate condition was requested, or no attention
  items were found.
- `2`: `--fail-on-attention` was supplied and attention items were found. JSON
  is still written to standard output.
- Any other nonzero code indicates that analysis could not be completed.

The command does not claim that a change is safe.
