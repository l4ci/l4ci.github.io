---
layout: rota/doc
title: "/rota-answer"
description: "Answer every decision a round is waiting on, one question at a time."
permalink: /rota/docs/skills/rota-answer/
source: docs/skills/rota-answer.md
skill: rota-answer
---
{% raw %}
During a round, asks you each pending decision in turn: open escalations, slots blocked on a question, PRs whose review or bounce cap needs a call, candidates the orchestrator is holding, and items with an open `question` comment. Each question gives the facts and 2 to 4 options, recommended one first. In Claude Code it uses the `AskUserQuestion` picker; in any other harness it sends one message per question with a lettered list `A)` to `E)` (`A)` the recommendation, the last entry "Write your own answer"). Each answer is recorded as a `decision` comment citing "maintainer, answering the orchestrator in its session", then applied (relay, re-recorded verdict, issue edit, follow-up) before the next question. With nothing pending it prints `no decisions pending`. Manual only: the orchestrator never starts it, and a round otherwise uses no blocking picker. See [parallel rounds](/rota/docs/usage/parallel-rounds/#asking-the-maintainer).
{% endraw %}
