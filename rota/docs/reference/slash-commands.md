---
layout: rota/doc
title: "Slash commands"
description: "Quick-reference table of every /rota-* command."
permalink: /rota/docs/reference/slash-commands/
source: docs/reference/slash-commands.md
---
{% raw %}
Quick-reference table of every `/rota-*` command.

Setup, config, update and migration are `rota` verbs, not skills: `rota init` (and `rota init umbrella`), `rota config show` / `rota config set`, `rota update`, `rota migrate hv` / `rota migrate issues`. See [config options](/rota/docs/reference/config-options/).

<!-- generated:skills:table begin -->
<!-- edit docs/skills/*.md and run python3 scripts/skills-docs.py -->

| Skill | Lane | What it does |
|-------|------|--------------|
| [`/rota-capture`](/rota/docs/skills/rota-capture/) | Capture | Record bugs, features and tasks in the backlog without starting work. |
| [`/rota-brainstorm`](/rota/docs/skills/rota-brainstorm/) | Plan | Negotiate the design of one Major item before planning it. |
| [`/rota-spike`](/rota/docs/skills/rota-spike/) | Plan | Try one risky idea on a throwaway branch and keep only the finding. |
| [`/rota-plan`](/rota/docs/skills/rota-plan/) | Plan | Write a signed-off implementation plan with verifiable tasks. |
| [`/rota-work`](/rota/docs/skills/rota-work/) | Execute | Build the next item in small commits, one verified task at a time. |
| [`/rota-debug`](/rota/docs/skills/rota-debug/) | Execute | Find the root cause of one bug, fix it atomically and prove it. |
| [`/rota-review`](/rota/docs/skills/rota-review/) | Ship | Review a branch against its spec and conventions before it leaves. |
| [`/rota-ship`](/rota/docs/skills/rota-ship/) | Ship | Review, then open the PR or merge, linking items by ID. |
| [`/rota-docs`](/rota/docs/skills/rota-docs/) | Ship | Scaffold, update or reorganize the public docs. |
| [`/rota-orchestrate`](/rota/docs/skills/rota-orchestrate/) | Rounds | Run a parallel round: pick the slate, watch workers, merge their PRs. |
| [`/rota-answer`](/rota/docs/skills/rota-answer/) | Rounds | Answer every decision a round is waiting on, one question at a time. (manual only) |
| [`/rota-learn`](/rota/docs/skills/rota-learn/) | Persist | Save the session's durable lessons to KNOWLEDGE.md. |
| [`/rota-decide`](/rota/docs/skills/rota-decide/) | Persist | Record a hard-boundary decision with explicit forbids and permits. (manual only) |
| [`/rota-init`](/rota/docs/skills/rota-init/) | Maintenance | Suggest config values from the repo and write the ones you confirm. (manual only) |
| [`/rota-bugreport`](/rota/docs/skills/rota-bugreport/) | Maintenance | File rota's own mistakes upstream, after your explicit yes. |
| [`/rota-pause`](/rota/docs/skills/rota-pause/) | Persist | Stop cleanly and leave a handoff note for the next session. |
| [`/rota-vision`](/rota/docs/skills/rota-vision/) | Plan | Turn an idea into milestones with dependencies and ready/blocked status. |
| [`/rota-refactor`](/rota/docs/skills/rota-refactor/) | Execute | Review the architecture and file refactor issues; --map drafts the map. |
| [`/rota-qa`](/rota/docs/skills/rota-qa/) | Ship | Run product-level QA against the built artifact and score it. |
| [`/rota-release`](/rota/docs/skills/rota-release/) | Maintenance | Cut a release: checklist, version bump, notes, tag, publish. (manual only) |
<!-- generated:skills:table end -->

Each skill has its own page with examples, flags and the detail that used to live here: [skills](/rota/docs/skills/).
{% endraw %}
