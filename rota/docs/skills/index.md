---
layout: rota/doc
title: "Skills"
description: "One page per /rota-* skill: when to use it, when another skill fits better, what usually comes before and after, and a short example. This index, the README…"
permalink: /rota/docs/skills/
source: docs/skills/README.md
---
{% raw %}
One page per `/rota-*` skill: when to use it, when another skill fits better, what usually comes before and after, and a short example. This index, the README skills table and the chains in [how it works](/rota/docs/how-it-works/) are generated from these pages by `scripts/skills-docs.py`, so edit the pages, not those lists.

<!-- generated:skills:index begin -->
<!-- edit docs/skills/*.md and run python3 scripts/skills-docs.py -->

## Capture

- [`/rota-capture`](/rota/docs/skills/rota-capture/): Record bugs, features and tasks in the backlog without starting work. Flags: `--remove <ID>`, `--triage <N>`.

## Plan

- [`/rota-brainstorm`](/rota/docs/skills/rota-brainstorm/): Negotiate the design of one Major item before planning it. Flags: `--grill`.
- [`/rota-spike`](/rota/docs/skills/rota-spike/): Try one risky idea on a throwaway branch and keep only the finding. Flags: `done <name>`.
- [`/rota-plan`](/rota/docs/skills/rota-plan/): Write a signed-off implementation plan with verifiable tasks.
- [`/rota-vision`](/rota/docs/skills/rota-vision/): Turn an idea into milestones with dependencies and ready/blocked status.

## Execute

- [`/rota-work`](/rota/docs/skills/rota-work/): Build the next item in small commits, one verified task at a time. Flags: `--preview <ID>`.
- [`/rota-debug`](/rota/docs/skills/rota-debug/): Find the root cause of one bug, fix it atomically and prove it.
- [`/rota-refactor`](/rota/docs/skills/rota-refactor/): Review the architecture and file refactor issues; --map drafts the map. Flags: `--fix`, `--designs`, `--interactive`, `--map`.

## Ship

- [`/rota-review`](/rota/docs/skills/rota-review/): Review a branch against its spec and conventions before it leaves. Flags: `--since <sha>`, `--queue`.
- [`/rota-ship`](/rota/docs/skills/rota-ship/): Review, then open the PR or merge, linking items by ID. Flags: `--undo`, `--docs`.
- [`/rota-docs`](/rota/docs/skills/rota-docs/): Scaffold, update or reorganize the public docs. Flags: `restructure`.
- [`/rota-qa`](/rota/docs/skills/rota-qa/): Run product-level QA against the built artifact and score it. Flags: `first-run`, `run [<target>]`, `restructure`, `uat <ID>`.

## Persist

- [`/rota-learn`](/rota/docs/skills/rota-learn/): Save the session's durable lessons to KNOWLEDGE.md. Flags: `--strict`, `--retro [<session-id|path>]`, `--term <name>`, `--promote | --deprecate | --amend <topic> "<title>"`.
- [`/rota-decide`](/rota/docs/skills/rota-decide/): Record a hard-boundary decision with explicit forbids and permits. Manual only. Flags: `--from-learning <topic>`, `--from-spike <name>`, `--supersede <topic> "<title>"`, `--retire <topic> "<title>"`.
- [`/rota-pause`](/rota/docs/skills/rota-pause/): Stop cleanly and leave a handoff note for the next session. Flags: `--report`.

## Rounds

- [`/rota-orchestrate`](/rota/docs/skills/rota-orchestrate/): Run a parallel round: pick the slate, watch workers, merge their PRs.
- [`/rota-answer`](/rota/docs/skills/rota-answer/): Answer every decision a round is waiting on, one question at a time. Manual only.

## Maintenance

- [`/rota-init`](/rota/docs/skills/rota-init/): Suggest config values from the repo and write the ones you confirm. Manual only.
- [`/rota-bugreport`](/rota/docs/skills/rota-bugreport/): File rota's own mistakes upstream, after your explicit yes.
- [`/rota-release`](/rota/docs/skills/rota-release/): Cut a release: checklist, version bump, notes, tag, publish. Manual only. Flags: `major | minor | patch | <semver>`, `--dry-run`.
<!-- generated:skills:index end -->
{% endraw %}
