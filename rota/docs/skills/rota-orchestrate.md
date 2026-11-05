---
layout: rota/doc
title: "/rota-orchestrate"
description: "Run a parallel round: pick the slate, watch workers, merge their PRs."
permalink: /rota/docs/skills/rota-orchestrate/
source: docs/skills/rota-orchestrate.md
skill: rota-orchestrate
---
{% raw %}
Runs a parallel round: you are the orchestrator, and standing workers (`round.slots`, at most as many as `round.roster` names) each take one issue in their own worktree and terminal tab. Start it in your existing coding-agent session with `/rota-orchestrate` (`$rota-orchestrate` in Codex). The CLI launcher is an optional alternative. The skill decides what the `rota round` verbs cannot: which issues make a good slate, how to read a stuck worker, what to escalate to you and when to merge. Sequencing and the rules are the verbs' job (`rota doctor`, `rota round start`, `assign`, `wait`, `rota worker gate`, `rota round wind-down`), and a refusal from a verb is the rule, not an obstacle. Workers build and open PRs; they never merge. "You are the orchestrator" or "run a round" triggers it. For one item, use `/rota-work`. See [parallel rounds](/rota/docs/usage/parallel-rounds/) and the [`rota round` verbs](/rota/docs/reference/cli-helpers/#rota-round).

If test setup was left open at init, the agent revisits it before assigning workers. For a new project it recommends establishing tests alongside the first implementation, so work can start while the foundation is built. Before the first merge it configures the agreed local or CI verification and requires the merge checks to pass. An explicitly agreed build or lint check is reported with that coverage, without claiming behavior tests ran. Deferral never authorizes `--no-verify`. Once verification is configured, later rounds do not repeat the question without a new reason. See [starting without tests](/rota/docs/first-round/#starting-without-tests).
{% endraw %}
