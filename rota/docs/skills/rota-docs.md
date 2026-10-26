---
layout: rota/doc
title: "/rota-docs"
description: "Scaffold, update or reorganize the public docs."
permalink: /rota/docs/skills/rota-docs/
source: docs/skills/rota-docs.md
skill: rota-docs
---
{% raw %}
Maintains the public docs. After-work mode may run in any agent, including a round worker's PR; scaffold and restructure follow `autonomy.level` and escalate to the maintainer in a round. Scaffolds `<docs.path>/` on first run (discovery, a tailored tree, interactive approval), proposes doc updates in after-work mode, or audits and reorganizes in restructure mode (`/rota-docs restructure`). Runs inline at ship time when `docs.afterWork: true` and the post-cycle trigger condition matches.

`/rota-ship --docs` is a deprecated alias for one more release: it prints a one-line pointer to `/rota-docs` and runs it.
{% endraw %}
