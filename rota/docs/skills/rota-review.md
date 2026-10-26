---
layout: rota/doc
title: "/rota-review"
description: "Review a branch against its spec and conventions before it leaves."
permalink: /rota/docs/skills/rota-review/
source: docs/skills/rota-review.md
skill: rota-review
---
{% raw %}
Staff-engineer review of a feature branch before it leaves your machine: scopes the diff, pulls relevant `KNOWLEDGE.md` topics and returns PASS / CONCERNS / FAIL with file-and-line evidence. Read-only: no mutations, no commits. On the issue backend, `--queue` instead works through every `needs-review` item's open PR or MR and merges the ones that pass. See [review and ship](/rota/docs/usage/review-and-ship/) for the full flow.
{% endraw %}
