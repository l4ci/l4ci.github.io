---
layout: rota/doc
title: "/rota-brainstorm"
description: "Negotiate the design of one Major item before planning it."
permalink: /rota/docs/skills/rota-brainstorm/
source: docs/skills/rota-brainstorm.md
skill: rota-brainstorm
---
{% raw %}
Per-item design exploration before `/rota-plan`: Socratic discovery, 2-3 approaches with tradeoffs, then a sectioned design approved section by section. It stores the design as `.rota/designs/<ID>.md` (file backend) or a note on the issue (issue backend), which `/rota-plan` reads as soft input. Major features and P0 bugs get one grilling pass first, settling every open decision before drafting; `--grill` forces that pass on any item. The skill is skipped when the issue body already has `## Acceptance`.

See [brainstorming a design](/rota/docs/usage/brainstorm/) for the full flow.
{% endraw %}
