---
layout: rota/doc
title: "/rota-decide"
description: "Record a hard-boundary decision with explicit forbids and permits."
permalink: /rota/docs/skills/rota-decide/
source: docs/skills/rota-decide.md
skill: rota-decide
---
{% raw %}
Captures a hard-boundary decision into `.rota/DECISIONS.md`. Manually confirmed, never auto-invoked. Decisions differ from learnings in `KNOWLEDGE.md` by being commitments with explicit forbids/permits; `/rota-work`, `/rota-debug`, `/rota-refactor`, `/rota-plan`, `/rota-brainstorm`, `/rota-vision` and [`/rota-review`](/rota/docs/usage/review-and-ship/) consult them as constraints. Accepts `--from-learning <topic>` to promote a hardened `KNOWLEDGE.md` bullet into a decision (rule/why are pre-filled; you supply the forbids/permits), and `--from-spike <name>` to promote a `.rota/spikes/<name>.md` finding the same way (`inconclusive` spikes are refused). See [decisions](/rota/docs/usage/decisions/) for the full flow.
{% endraw %}
