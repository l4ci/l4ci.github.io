---
layout: rota/doc
title: "/rota-debug"
description: "Find the root cause of one bug, fix it atomically and prove it."
permalink: /rota/docs/skills/rota-debug/
source: docs/skills/rota-debug.md
skill: rota-debug
---
{% raw %}
Systematic root-cause cycle for a single bug (`[B##]` on the file backend, `#N` on the issue backend): reproduce, state a testable hypothesis and verify it before touching code, fix with one atomic commit, confirm the reproducer passes, record proof and open a PR (on the file backend it marks the item complete instead). After two refuted hypotheses it re-reads the symptom and the reproducer from scratch. One circuit breaker: after 3 failed committed fixes (counted per item in `.rota/verdicts.json`, so a new session or branch does not reset it) the Iron Law fires a hard stop with no further attempts, surfacing to the user. Uses the same isolation mode as `/rota-work`, and nudges you toward [`/rota-learn`](/rota/docs/usage/learning/) when the root cause was non-obvious. See [debugging](/rota/docs/usage/debugging/) for the full flow.
{% endraw %}
