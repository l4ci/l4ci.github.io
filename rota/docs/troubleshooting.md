---
layout: rota/doc
title: "Troubleshooting"
description: "Ask the orchestrator about a blocked task in the same conversation. It can inspect the round and explain the next step."
permalink: /rota/docs/troubleshooting/
source: docs/troubleshooting.md
---
{% raw %}
Ask the orchestrator about a blocked task in the same conversation. It can inspect the round and explain the next step.

## Setup does not pass

The orchestrator runs `rota doctor` before starting. Each failing check names the missing tool, login or configuration and gives a fix. Resolve those failures, then retry `/rota-orchestrate`.

[Worker setup](/rota/docs/first-round/) · [Doctor reference](/rota/docs/usage/doctor-and-reap/)

## No tests yet

You can leave test commands unset during `/rota-init`. Today, initialization and round startup warn about missing verification; there is no automatic follow-up conversation. The merge gate refuses to merge when local verification has neither `test.full` nor `test.e2e`, unless explicitly overridden. Configured CI verification is another option.

Before your first merge, ask the agent to establish an appropriate check. In a new project, this can mean adding the first tests with the implementation. A build or lint command can check something useful, but it is not evidence that behavior was tested.

Set the agreed command through the agent or with `rota config set test.full '<your command>'`. A command inferred from a manifest is only a suggestion: check that it actually runs useful tests.

## A check fails

A failed merge check keeps the PR from landing. The orchestrator sends the findings back for repair and checks the updated result. Repeated failures can park the issue for your help.

Ask for the failed command and its output. [Merge checks](/rota/docs/usage/parallel-rounds/#merge-approval) describes the verdicts.

## An account reaches its limit

Separate workers can use different configured accounts. Moving work to another account or waiting for a reset depends on the harness, account pool and running limit watcher. Starting the skill alone does not set up supervision.

[Accounts and limits](/rota/docs/usage/unattended-rounds/)

## A session stops

For a supervised first round, return to the project and invoke `/rota-orchestrate`. It checks round state and available handoff notes before continuing. Do not delete active worktrees or force-clear another orchestrator's lease.

[Recovery and cleanup](/rota/docs/usage/doctor-and-reap/) · [Long-running rounds](/rota/docs/usage/unattended-rounds/)
{% endraw %}
