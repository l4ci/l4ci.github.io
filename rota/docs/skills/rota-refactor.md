---
layout: rota/doc
title: "/rota-refactor"
description: "Review the architecture and file refactor issues; --map drafts the map."
permalink: /rota/docs/skills/rota-refactor/
source: docs/skills/rota-refactor.md
skill: rota-refactor
---
{% raw %}
Architecture review. Explores the codebase (or one area, `/rota-refactor internal/cli`) for friction using one vocabulary (module, interface, depth, seam, adapter, leverage, locality) and a few heuristics (the deletion test, the interface as the test surface, one adapter is a hypothetical seam). It reads the glossary, knowledge and decisions first, ranks candidates Strong / Worth exploring / Speculative, and files each as a `refactor`-labelled issue with a `## Acceptance` section, deduped against open and closed issues. It changes no code by default.

Flags: `--fix` implements the candidates you pick (parallel workers, verification, one commit; `refactor.confirmBeforeExecute` gates it), `--designs` drafts competing interfaces for structural candidates, `--interactive` lets you choose which to file. Several workers can each review one area in a round.
{% endraw %}
