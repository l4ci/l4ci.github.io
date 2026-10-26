---
layout: rota/doc
title: "Parallel work"
description: "When work.isolation is set to \"worktree\", you can run multiple /rota-work sessions side by side from separate terminals. Each session gets its own directory…"
permalink: /rota/docs/usage/parallel-work/
source: docs/usage/parallel-work.md
---
{% raw %}
When `work.isolation` is set to `"worktree"`, you can run multiple [`/rota-work`](/rota/docs/usage/running-work/)
sessions side by side from separate terminals. Each session gets its own
directory and branch, so they don't step on each other. You start and watch each one yourself.

If you'd rather have one orchestrator assign issues to standing workers, wait on them and merge their
PRs, that is a [parallel round](/rota/docs/usage/parallel-rounds/). Use this page for two or three sessions you are
watching; use a round for a queue.

## When to use this

- Long-running cycles you don't want to block on while other work proceeds.
- Independent feature tracks that shouldn't share a branch.
- Keeping `main` clean while agents work in parallel.
- Batching unrelated bug fixes that gain nothing from sharing context.

## Setting it up

Flip `work.isolation` to `"worktree"` via `rota config set work.isolation worktree` or by editing
`.rota/config.json` directly. See [configuration](/rota/docs/usage/configuration/) for the full
option set. Once set, `/rota-work` creates a new directory under
`.claude/worktrees/<branch-name>` for each cycle instead of switching the
current worktree. The main worktree stays on `main` throughout.

## Two terminals, two streams

The IDs below are file-backend IDs; on the issues backend they are `#N` ([issue backend](/rota/docs/usage/issue-backend/)). Start each stream in its own terminal. [`/rota-work` (no argument)](/rota/docs/usage/picking-work/) picks items that aren't
already in progress, so the two sessions claim different work.

**Terminal 1** picks `[B02]` and `[F01]`:

```
/rota-work
# → suggests B02, F01
/rota-work
# → creates .claude/worktrees/fix/b02-timer-crash
#    and .claude/worktrees/feat/f01-dark-mode
```

**Terminal 2** picks `[F03]` (B02 and F01 are already in progress):

```
/rota-work
# → suggests F03 (B02 and F01 shown as In Progress, skipped)
/rota-work
# → creates .claude/worktrees/feat/f03-export-csv
```

See [running work](/rota/docs/usage/running-work/) for the full `/rota-work` lifecycle.

## How status.json stays consistent

Both sessions write to the same `.rota/status.json` in the main worktree,
but each owns different entries (one per active branch), so they don't
conflict under normal operation. `/rota-work` (no argument) in a third terminal sees both
streams as "In Progress" and skips those items. If it runs while another `/rota-work` is
mid-update, the last writer wins; the next run reconciles drift by validating status
against actual git state. See [picking work](/rota/docs/usage/picking-work/).

## Caveats

> Don't run `rota init` or `rota config set` from inside a worktree. Those write to
> `.rota/` and must run in the main worktree. `/rota-work` runs, with or without an argument, are fine
> in either place.
{: .callout .callout-important}
{% endraw %}
