---
layout: rota/doc
title: "/rota-qa"
description: "Run product-level QA against the built artifact and score it."
permalink: /rota/docs/skills/rota-qa/
source: docs/skills/rota-qa.md
skill: rota-qa
---
{% raw %}
Product-level QA: runs the per-target strategy declared in `.rota/qa/<target>.md` and emits a scored verdict. `/rota-qa` does NOT read commits or the diff (that's `/rota-review`'s job). It runs the built artifact: Playwright, smoke scripts, contract tests, Lighthouse, axe, ZAP, whatever the strategy declares, grouped into executable and audit pillars. Three modes: `first-run` (probe surfaces, propose strategy), `run` (execute, score, verdict), `restructure` (audit strategy files). Returns `PASS` / `CONCERNS` / `FAIL`, or `INFRA-FAIL` when required infra is missing. Invoked from `/rota-ship` when `ship.qa: true`; route on verdict gated by `qa.gate` (`"advisory"` reports only, `"blocking"` halts on `FAIL`). See [product QA](/rota/docs/usage/qa/) for the full flow.
{% endraw %}
