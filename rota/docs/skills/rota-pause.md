---
layout: rota/doc
title: "/rota-pause"
description: "Stop cleanly and leave a handoff note for the next session."
permalink: /rota/docs/skills/rota-pause/
source: docs/skills/rota-pause.md
skill: rota-pause
---
{% raw %}
Stops mid-session (or an orchestrator mid-round, without winding the round down) by writing a handoff note to `.rota/handoff/<branch>.md` that records the current hypothesis, next planned step, files mid-edit and gotchas found. Use it when the context window is filling or you need to step away mid-`/rota-work`. With `--report` it also writes `.rota/handoff/<branch>.report.md` (commits, files changed, tasks, proof) for you to read; `/rota-work` ignores it. See [pausing and resuming](/rota/docs/usage/pausing-and-resuming/) for the full flow.
{% endraw %}
