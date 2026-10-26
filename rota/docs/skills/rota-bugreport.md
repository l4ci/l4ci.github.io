---
layout: rota/doc
title: "/rota-bugreport"
description: "File rota's own mistakes upstream, after your explicit yes."
permalink: /rota/docs/skills/rota-bugreport/
source: docs/skills/rota-bugreport.md
skill: rota-bugreport
---
{% raw %}
Files rota's own mistakes upstream. rota records them in `.rota/bugreports.jsonl` while it runs: a verb that fails with an internal error or panic (exit 70) writes a record, and an agent adds one it noticed with `rota bugreport add`. `rota round wind-down` and the Stop hook of a solo session print one non-blocking line when records are open. The skill lists them, shows each report redacted (tokens and keys, email addresses, home-directory paths, hostnames, your repo name and remote URL are removed) with the rota version, OS and architecture, harness and model, searches `l4ci/rota` for a duplicate (offering a comment instead), and files only after your yes for that report. Bugs in your own project stay with `/rota-capture`. Nothing is sent in the background.
{% endraw %}
