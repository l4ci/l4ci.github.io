---
layout: rota/doc
title: "/rota-learn"
description: "Save the session's durable lessons to KNOWLEDGE.md."
permalink: /rota/docs/skills/rota-learn/
source: docs/skills/rota-learn.md
skill: rota-learn
---
{% raw %}
Writes durable knowledge from the current session into `.rota/KNOWLEDGE.md`, grouped by topic. It captures gotchas, project conventions, constraints, debugging insights and decisions with rationale, and skips anything obvious from reading the code. `--strict` adds a verifier pass over the new bullets (off by default). `--retro [<session-id|path>]` reads the newest session transcript (Claude Code or Codex), or the one you name, and cites it as evidence, then classifies the session's mistakes into guardrails (filed as items), standards, navigation pointers, tool-economy fixes and information-access gaps (filed as items), flags no-op bullets for removal without deleting them, audits steering files (`AGENTS.md`, `CLAUDE.md`, global instructions) for restating or dead lines without editing them, and reports a repo whose check command runs in no CI workflow or hook as a no-guardrail finding. In umbrella mode the write (and `--term` Glossary entries) routes to the scope that the cwd or `--repo` resolves to: repo-local or the umbrella-shared `.rota/KNOWLEDGE.md`. Three manual flags edit one existing bullet and skip the capture flow: `--promote <topic> "<title>"` sets its tier to `confirmed` without waiting for the hit threshold, `--deprecate <topic> "<title>"` sets it to `deprecated`, and `--amend <topic> "<title>"` appends text to its body (tier and hits stay). `--external-review` is the maintenance pass over the external knowledge base: it measures the topics, drafts a split plan (3 to 7 subtopics with hooks) for each oversized one, offers to fold stray files an older rota left behind, and always asks you before it runs `rota knowledge split`, whatever `autonomy.level` says. See [learning](/rota/docs/usage/learning/), [external knowledge](/rota/docs/usage/external-knowledge/) and [umbrella mode](/rota/docs/usage/umbrella-mode/) for the full flow.
{% endraw %}
