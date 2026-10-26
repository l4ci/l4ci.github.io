---
layout: rota/doc
title: "/rota-capture"
description: "Record bugs, features and tasks in the backlog without starting work."
permalink: /rota/docs/skills/rota-capture/
source: docs/skills/rota-capture.md
skill: rota-capture
---
{% raw %}
Captures bugs, features, and tasks into the backlog with `rota item create`. Where the item lands depends on `issues.source`. On the file backend (default) it goes into [`BACKLOG.md`](/rota/docs/reference/rota-folder/) under the correct section with a zero-padded auto-incrementing ID (`[B01]`, `[F01]`, `[T01]`). On the issue backend it becomes a GitHub or GitLab issue with type, priority and size labels, and the ID is the issue number (`#42`); see [issue backend](/rota/docs/usage/issue-backend/). Either way it auto-classifies each item and assigns priority (P0/P1/P2) for bugs and size (Major/Minor/Cosmetic) for features. See [capturing work](/rota/docs/usage/capturing-work/) for the full flow.

## --triage

Vets tracker issues filed by someone else: redundancy search, prior-decision check and, for bugs, a bounded reproduce. Creates no item. Each issue ends in one outcome you confirm: closed with the reason, `needs-info` with a question comment, or ready. See [capturing work](/rota/docs/usage/capturing-work/#triaging-an-issue-someone-else-filed).

## --remove

Removes a captured backlog item and cleans up its dependencies in one operation, through `rota item rm`. File backend only; on the issue backend close the issue with `rota item complete <ID> --reason dropped` instead. Strips the item's entry from `BACKLOG.md`, removes `Related:` cross-references that point to it from other items, and deletes any matching detail file (`.rota/bugs/`, `.rota/features/`, `.rota/tasks/`) and plan file (`.rota/plans/`). An item active in `status.json` is refused on apply until its stream is dropped with `rota status rm <branch>`.

Dry-run-by-default: the first pass shows what would change, then an explicit `AskUserQuestion` confirmation gate must be cleared before any writes happen. `ARCHIVE.md` is preserved by default as the historical record; pass `--scrub-archive` to also remove an archived entry and its cross-references there. Accepts one or more comma-separated IDs (e.g. `B07,F03`). If any ID is unknown, the verb exits 3 before any write. See [removing work](/rota/docs/usage/removing-work/) for the full flow.
{% endraw %}
