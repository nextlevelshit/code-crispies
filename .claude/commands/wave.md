---
description: Run Wave multi-agent pipelines
---

## User Input

```text
$ARGUMENTS
```

## Instructions

You are invoking the Wave multi-agent pipeline orchestrator. Parse the user's arguments to determine which subcommand to run.

### Subcommand Routing

Based on the arguments provided:

**If arguments start with "run"** (e.g., `/wave run impl-issue -- "fix bug"`):
- Execute: `wave run <remaining arguments>`
- Example: `wave run -v impl-issue -- "implement feature X"`

**If arguments start with "status"** (e.g., `/wave status`):
- Execute: `wave list runs --limit 10`
- Show the output to the user in a readable format

**If arguments start with "list"** (e.g., `/wave list`):
- Execute: `wave list pipelines`
- Show available pipelines to the user

**If arguments start with "logs"** (e.g., `/wave logs <run-id>`):
- Execute: `wave logs <run-id>`
- Show the pipeline run logs

**If no arguments or "help"**:
- Show available subcommands: run, status, list, logs
- Example usage for each subcommand
