---
layout: rota/doc
title: "/rota-work"
description: "Build the next item in small commits, one verified task at a time."
permalink: /rota/docs/skills/rota-work/
source: docs/skills/rota-work.md
skill: rota-work
---
{% raw %}
Parallel implementation: the orchestrator plans tasks and dispatches worker subagents to implement them, each on a feature branch or isolated worktree. With no item argument it first reconciles the backlog against git state (`rota status show`, `rota backlog drift`, `rota backlog list`, `rota milestone active`), reads any `/rota-pause` handoff note, and suggests the next item. It consults `KNOWLEDGE.md` and any matching `.rota/plans/<key>.md` at the start, then registers progress in `status.json`.

**The proof gate sits here.** Each task writes proof rows. For a behaviour change the test runs first and must fail on an assertion, then pass. `rota item complete` closes an item only when it has proof, and exits 4 otherwise.

See [running work](/rota/docs/usage/running-work/) for the full flow and [picking work](/rota/docs/usage/picking-work/) for the no-argument mode.
{% endraw %}
