---
layout: rota/doc
title: "rota vs Gas Town"
description: "Gas Town (gt, by Steve Yegge) is an open-source workspace manager for coordinating many coding agents. You talk to a coordinator called the Mayor. It hands…"
permalink: /rota/docs/compare/gastown/
source: docs/compare/gastown.md
---
{% raw %}
[Gas Town](https://github.com/steveyegge/gastown) (`gt`, by Steve Yegge) is an open-source workspace manager for coordinating many coding agents. You talk to a coordinator called the Mayor. It hands work to worker agents called polecats, which run in git worktrees and report through a per-rig Witness and a merge queue called the Refinery. Work items are "beads" from Yegge's [beads](https://github.com/steveyegge/beads) tracker, stored in Dolt.

Checked 2026-10-26 against Gas Town commit `de2ce8e` on `main` (latest tagged release v1.2.1, 2026-06-06; the repo has moved on since).

## The short version

- Pick Gas Town when you want a standing, supervised swarm with a conversational coordinator, many agent runtimes, dashboards and an always-on merge queue, and you accept running Dolt and a larger moving part count.
- Pick rota when you want a single Go binary and skills that work for one agent on one item, and that scale up to a round of parallel workers whose PRs a test gate verifies before merge.
- Both keep workers off `main`: Gas Town polecats never push directly, and rota workers never merge.

## Side by side

| | Gas Town | rota |
|---|---|---|
| What it is | Multi-agent workspace manager (`gt`, `bd`) | Go binary plus `/rota-*` skills |
| Unit of work | Bead, bundled into a convoy | Backlog item or tracker issue |
| Parallel agents | Mayor, polecats, crew, Witness, Deacon, Dogs | Orchestrator plus 2 to 5 standing workers |
| Isolation | Git worktrees ("hooks"); Docker option | One git worktree per worker, reused across issues |
| Verification before merge | Refinery batches merge requests and runs verification gates on the merged stack; bisects on failure | `rota worker gate` merges onto a scratch tree and runs `test.full`, then `test.e2e`; a train does this once for several PRs |
| Who merges | Refinery, automatically | The orchestrator, through the gate |
| Backlog / tracker | Beads (Dolt-backed); GitHub or other trackers not documented in the README | `.rota/BACKLOG.md`, GitHub, GitLab, Jira, Linear, It's a Plan |
| Memory across sessions | Beads, hooks, and Seance (queries earlier sessions from event logs) | `.rota/KNOWLEDGE.md`, `DECISIONS.md`, handoff notes |
| Agents and models | Claude Code default; presets for Codex, Gemini, Copilot, Cursor, Kiro, Amp, OpenCode and others | Claude Code, Codex, OpenCode |
| Interface | `gt` CLI, tmux sessions, `gt feed` TUI, web dashboard | Terminal only; herdr or tmux tabs |
| Platforms | macOS, Linux; Windows needs WSL for tmux workflows | Linux and macOS; Windows through WSL2 |
| Install | `brew install gastown`, or `go install` plus Dolt | `brew install l4ci/tap/rota` or `install.sh` |
| License | MIT | MIT |

## Where Gas Town is stronger

- **Supervision.** A Witness per rig detects stuck polecats and nudges or hands off; a Deacon patrols across rigs. rota has stall detection, `rota reap` and `round watch`, but no layered supervisor agents.
- **Runtime breadth.** The README lists eleven built-in presets. rota supports three harnesses.
- **Observability.** `gt feed` and a web dashboard show agent activity and the merge queue, and it exports OpenTelemetry. rota has `round status` and `round summary` (cost per issue, slot and account), but no dashboard or metrics export.
- **Merge queue shape.** The Refinery is a standing Bors-style queue that batches merge requests as they arrive and bisects a failing batch. rota's [merge train](/rota/docs/usage/parallel-rounds/#merge-train) also bisects a red train and names the culprit, but the orchestrator starts each train; nothing queues on its own.
- **Scale and reach.** Cross-repo rigs, escalation routing by severity, convoys, a Docker sandbox and a federation network (Wasteland) are documented. rota's umbrella mode covers several repos but nothing like federation.
- **Conversational start.** You describe the goal to the Mayor. rota expects issues with acceptance criteria first.

## Where rota is stronger

- **Smaller footprint.** No Dolt, no daemon hierarchy. Install is one binary, and the solo loop works with git and one agent ([getting started](/rota/docs/getting-started/)).
- **A single-agent path.** `/rota-capture`, `/rota-work`, `/rota-ship` give a reviewed, merged item without any round ([how it works](/rota/docs/how-it-works/)).
- **Account-aware limits.** `round.accounts` and `rota limit watch` place work on the account with headroom and move a limited worker's issue to another ([parallel rounds](/rota/docs/usage/parallel-rounds/)). Gas Town's scheduler caps concurrency; its issue [#232](https://github.com/steveyegge/gastown/issues/232) asking for rate-limit-aware instance swapping was still open on 2026-10-26.
- **Trackers you already use.** GitHub, GitLab (self-hosted too), Jira and Linear are backends ([issue backend](/rota/docs/usage/issue-backend/)).
- **Signed provenance and bounce accounting.** The gate checks who approved and fails on mismatch ([review and ship](/rota/docs/usage/review-and-ship/)).
- **Curated knowledge.** `/rota-learn` and `/rota-decide` write human-reviewed files that travel in the repo ([learning](/rota/docs/usage/learning/), [decisions](/rota/docs/usage/decisions/)).

## Using both

Not a natural fit. Both want to own assignment and merging in a repo. beads, the tracker under Gas Town, is separate from Gas Town itself, but rota has no beads backend.

## Sources

- [Gas Town README](https://github.com/steveyegge/gastown/blob/main/README.md): roles, install, runtimes, merge queue, scheduler, license.
- [Repository API](https://github.com/steveyegge/gastown): stars (18.6k on 2026-10-26), MIT, release tags, head commit.
- [Gas Town issue 232](https://github.com/steveyegge/gastown/issues/232): open rate-limit request.
- [beads](https://github.com/steveyegge/beads): the tracker.

More comparisons: [how rota compares](/rota/docs/compare/).
{% endraw %}
