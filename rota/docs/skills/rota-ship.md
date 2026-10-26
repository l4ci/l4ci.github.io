---
layout: rota/doc
title: "/rota-ship"
description: "Review, then open the PR or merge, linking items by ID."
permalink: /rota/docs/skills/rota-ship/
source: docs/skills/rota-ship.md
skill: rota-ship
---
{% raw %}
Finishes a feature branch: runs `/rota-review` (by default), builds a PR body from commit subjects and resolved item IDs, then either opens a PR (GitHub) or MR (GitLab) or merges directly based on `work.mergeStrategy`. Clears the `status.json` entry and closes referenced items on completion. On the issue backend it always opens a PR or MR with `Closes #N` lines and never merges; the merge closes the issues ([issue backend](/rota/docs/usage/issue-backend/)). See [review and ship](/rota/docs/usage/review-and-ship/).

`--undo` is the one flag mode:

- `/rota-ship --undo`: guided rollback of the last `/rota-work` cycle on the base branch. Resets the merge commit and restores the cycle's TODO entries to their type sections in `BACKLOG.md`. Direct-merge cycles only (MVP); PR-mode cycles refused with a manual-recovery pointer. Refuses on cycles that have post-merge commits unless `--allow-post-merge` is passed. It defaults to a dry-run preview and always asks for explicit confirmation before applying. See [rolling back a cycle](/rota/docs/usage/undo/) for the full flow.
{% endraw %}
