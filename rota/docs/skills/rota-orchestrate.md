---
layout: rota/doc
title: "/rota-orchestrate"
description: "Run a parallel round: pick the slate, watch workers, merge their PRs."
permalink: /rota/docs/skills/rota-orchestrate/
source: docs/skills/rota-orchestrate.md
skill: rota-orchestrate
---
{% raw %}
Runs a parallel round: you are the orchestrator, and standing workers (`round.slots`, at most as many as `round.roster` names) each take one issue in their own worktree and terminal tab. Start it with `rota orchestrate` or bare `rota` (`orchestrator.harness` picks the agent), or tell an existing session "you are the orchestrator". The skill decides what the `rota round` verbs cannot: which issues make a good slate, how to read a stuck worker, what to escalate to you and when to merge. Sequencing and the rules are the verbs' job (`rota doctor`, `rota round start`, `assign`, `wait`, `rota worker gate`, `rota round wind-down`), and a refusal from a verb is the rule, not an obstacle. Workers build and open PRs; they never merge. Triggered by "you are the orchestrator" or "run a round". For one item, use `/rota-work`. See [parallel rounds](/rota/docs/usage/parallel-rounds/) and the [`rota round` verbs](/rota/docs/reference/cli-helpers/#rota-round).
{% endraw %}
