---
layout: rota/doc
title: "Workflows"
description: "Optional workflows for planning, solo work and larger projects. Start a parallel round with Getting started."
permalink: /rota/docs/skills/workflows/
source: docs/skills/workflows.md
---
{% raw %}
Optional workflows for planning, solo work and larger projects. Start a parallel round with [Getting started](/rota/docs/getting-started/).

<!-- generated:skills:chains begin -->
<!-- edit docs/skills/*.md and run python3 scripts/skills-docs.py -->

### Fix a small bug or add a small feature

One clear item, small enough to build in one sitting.

1. [`/rota-capture`](/rota/docs/skills/rota-capture/): Write the item down. Capture records it and stops.
2. [`/rota-work`](/rota/docs/skills/rota-work/): Build it in small commits. The proof gate needs a red run, then a green one.
3. [`/rota-ship`](/rota/docs/skills/rota-ship/): Review the branch, then open the PR or merge.

Walkthrough: [Implementing](/rota/docs/usage/running-work/)

### Build a bigger feature

A Major item where the design or the approach needs sign-off before code lands.

1. [`/rota-capture`](/rota/docs/skills/rota-capture/): Record the feature as an item.
2. [`/rota-brainstorm`](/rota/docs/skills/rota-brainstorm/): Settle the design with you, section by section.
3. [`/rota-plan`](/rota/docs/skills/rota-plan/): Turn the design into tasks with a way to verify each.
4. [`/rota-work`](/rota/docs/skills/rota-work/): Build the plan, one verified task at a time.
5. [`/rota-ship`](/rota/docs/skills/rota-ship/): Review against what the item promised, then merge.

Walkthrough: [A round cycle: shape the slate, run the round, cut the release](/rota/docs/walkthroughs/round-cycle/#a-major-item-brainstorm-then-plan)

### Chase a bug you don't understand

Something is broken and the cause is not known yet.

1. [`/rota-debug`](/rota/docs/skills/rota-debug/): Reproduce it, test one hypothesis at a time, fix it in one commit.
2. [`/rota-ship`](/rota/docs/skills/rota-ship/): Review and merge the fix.
3. [`/rota-learn`](/rota/docs/skills/rota-learn/): Keep what the bug taught you for the next session.

Walkthrough: [Greenfield: what a project holds after a brief](/rota/docs/walkthroughs/greenfield-from-brief/#step-7-a-real-bug-run-rota-debug)

### Try a risky idea first

You don't know yet whether an approach or a library works.

1. [`/rota-spike`](/rota/docs/skills/rota-spike/): Try it on a throwaway branch. Only the findings come back.
2. [`/rota-plan`](/rota/docs/skills/rota-plan/): Plan the real work with what the spike found.
3. [`/rota-work`](/rota/docs/skills/rota-work/): Build it.

Walkthrough: [Greenfield: what a project holds after a brief](/rota/docs/walkthroughs/greenfield-from-brief/#step-3-rota-spike-optional)

### Start a project from a brief

An empty repo and an idea of where it should go.

1. [`/rota-init`](/rota/docs/skills/rota-init/): Suggest config values from the repo, confirmed one by one.
2. [`/rota-vision`](/rota/docs/skills/rota-vision/): Turn the brief into milestones.
3. [`/rota-plan`](/rota/docs/skills/rota-plan/): Plan the first milestone slice.
4. [`/rota-capture`](/rota/docs/skills/rota-capture/): Turn the plan into backlog items.
5. [`/rota-work`](/rota/docs/skills/rota-work/): Build the first item.

Walkthrough: [Greenfield: what a project holds after a brief](/rota/docs/walkthroughs/greenfield-from-brief/)

### Bring rota into an existing project

A repo with history and a backlog that lives in your head, with no rota yet.

1. [`/rota-init`](/rota/docs/skills/rota-init/): Suggest config values from the repo, confirmed one by one.
2. [`/rota-refactor`](/rota/docs/skills/rota-refactor/): With --map, draft the project map so later cycles skip re-exploring the code.
3. [`/rota-capture`](/rota/docs/skills/rota-capture/): Brain-dump the bugs and ideas you have been carrying around.
4. [`/rota-work`](/rota/docs/skills/rota-work/): Take the P0 first. The map and knowledge tell the worker where to look.
5. [`/rota-debug`](/rota/docs/skills/rota-debug/): When a fix will not stay fixed, find the cause before changing code.
6. [`/rota-learn`](/rota/docs/skills/rota-learn/): Keep the gotcha so the next cycle in that area starts with it.

Walkthrough: [Brownfield: what rota adds to an existing project](/rota/docs/walkthroughs/brownfield-existing-project/)

### Run several issues in parallel

A few independent issues are ready and you can stay around for questions.

1. [`/rota-plan`](/rota/docs/skills/rota-plan/): Shape the slate so every issue has clear acceptance.
2. [`/rota-orchestrate`](/rota/docs/skills/rota-orchestrate/): Hand issues to workers, review their PRs, merge through the gate.
3. [`/rota-answer`](/rota/docs/skills/rota-answer/): Answer the decisions the round put to you, one at a time.
4. [`/rota-learn`](/rota/docs/skills/rota-learn/): At wind-down, keep what the round learned.
5. [`/rota-release`](/rota/docs/skills/rota-release/): Cut a release when the work adds up to one.

Walkthrough: [A round cycle: shape the slate, run the round, cut the release](/rota/docs/walkthroughs/round-cycle/)

### Stop for today

The context is filling up or you have to leave mid-item.

1. [`/rota-learn`](/rota/docs/skills/rota-learn/): Save the lessons worth keeping.
2. [`/rota-pause`](/rota/docs/skills/rota-pause/): Write a handoff so a fresh session continues.
3. [`/rota-work`](/rota/docs/skills/rota-work/): Next session, with no argument, it reads the handoff and picks up.
<!-- generated:skills:chains end -->
{% endraw %}
