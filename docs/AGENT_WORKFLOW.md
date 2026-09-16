# Coding Agent Completion Check

Give the following instruction to a coding agent working in a repository where
Observatory is available:

```text
Before declaring the task complete:

1. Run the repository's relevant tests and checks.
2. Run:
   ./bin/observatory.mjs impact --base HEAD --working-tree --json
3. Read every attention item and inspect the relevant changed symbol and
   affected consumer files when they matter to the task.
4. Update implementation or tests when the evidence exposes an omission.
5. In the final response, summarize how each relevant attention item was
   handled or explain why no change was needed.

Do not treat an empty attention list as proof that the change is safe.
Do not describe an unmodified consumer as uninspected unless file-read or tool
trace evidence independently establishes that fact.
```

Use the JSON command without `--fail-on-attention` during initial experiments.
The gate's exit code `2` only means that attention items exist; it cannot know
whether the agent inspected and reasonably dismissed them.
