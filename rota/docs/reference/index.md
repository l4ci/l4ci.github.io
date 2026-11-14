---
layout: rota/doc
title: "Reference"
description: "Find a specific guide or setting. For the shortest path to a running round, see Getting started."
permalink: /rota/docs/reference/
source: docs/reference/README.md
---
{% raw %}
Find a specific guide or setting. For the shortest path to a running round, see [Getting started](/rota/docs/getting-started/).

### Getting started

- [Install](/rota/docs/install/): the short installation guide
- [Installation reference](/rota/docs/reference/installation/): plugins, release binaries, verification, updates and removal
- [Getting started](/rota/docs/getting-started/): set up your project and run a parallel round
- [How it works](/rota/docs/how-it-works/): orchestrator, workers and merge checks
- [Where coding agents go wrong](/rota/docs/agent-mistakes/): seven common mistakes, enforced checks, written rules and remaining gaps

### Walkthroughs

- [All walkthroughs](/rota/docs/walkthroughs/): complete examples for new projects, existing projects and rounds.
- [Greenfield: what a project holds after a brief](/rota/docs/walkthroughs/greenfield-from-brief/). The files `/rota-vision`, `/rota-plan`, `/rota-capture` and `/rota-learn` leave behind in a new project, with the plan, milestones and knowledge entries shown in full.
- [Brownfield: what rota adds to an existing project](/rota/docs/walkthroughs/brownfield-existing-project/). The project map, config choices, backlog, decision and knowledge entry that appear when rota joins a codebase with history.

### Rounds

- [Worker setup](/rota/docs/first-round/): hosts, accounts, tracker access and checks
- [A round cycle](/rota/docs/walkthroughs/round-cycle/): shape the slate, run a round, wind down, release
- [Parallel rounds](/rota/docs/usage/parallel-rounds/): an orchestrator, standing workers in worktrees, the merge gate, solo mode
- [Unattended rounds](/rota/docs/usage/unattended-rounds/): hooks, statusline, keepalive, usage limits, the orchestrator switch
- [Doctor and reap](/rota/docs/usage/doctor-and-reap/): check the machine before a round, clear leftovers after
- [Codex workers](/rota/docs/usage/codex-workers/): run Codex as a worker in a round
- [OpenCode workers](/rota/docs/usage/opencode-workers/): run OpenCode, and any model it can reach, as a worker in a round
- [Orchestrator harnesses](/rota/docs/usage/orchestrator-harnesses/): run the orchestrator in Claude Code, Codex, Hermes or opencode
- [Skills in Codex](/rota/docs/usage/codex-skills/): install and call the skills from Codex

### Skills

- [All skills](/rota/docs/skills/): commands, examples and flags
- [Workflows](/rota/docs/skills/workflows/): longer sequences of skills

### Capture and backlog

- [Capturing work](/rota/docs/usage/capturing-work/): `/rota-capture`, mixed input, related links, detail files
- [Picking work](/rota/docs/usage/picking-work/): `/rota-work` (no argument), `/rota-work --preview`
- [Removing work](/rota/docs/usage/removing-work/): `/rota-capture --remove`, dry-run preview, batch removal, safety semantics

### Execution

- [Running work](/rota/docs/usage/running-work/): `/rota-work` parallel cycles, branch vs worktree isolation, capture then work
- [Debugging](/rota/docs/usage/debugging/): `/rota-debug` systematic cycle
- [Pausing and resuming](/rota/docs/usage/pausing-and-resuming/): `/rota-pause`, recovering after `/clear`
- [Parallel work](/rota/docs/usage/parallel-work/): worktree mode, concurrent `/rota-work` sessions
- [Support machine](/rota/docs/usage/support-machine/): a second machine in the same round, pinning, claim labels, hand-back

### Shipping

- [Review and ship](/rota/docs/usage/review-and-ship/): `/rota-review` single-pass review and `/rota-ship` gates (second-opinion, QA)
- [Product QA](/rota/docs/usage/qa/): `/rota-qa` per-target strategy files and the `ship.qa` gate
- [Rolling back a cycle](/rota/docs/usage/undo/): `/rota-ship --undo` guided rollback, dry-run preview, manual confirmation
- [Learning](/rota/docs/usage/learning/): `/rota-learn` and `KNOWLEDGE.md`, including `--term <name>` for the project Glossary
- [External knowledge](/rota/docs/usage/external-knowledge/): a shared git repo of platform and technology learnings, read and written by every project
- [Decisions](/rota/docs/usage/decisions/): `/rota-decide` and hard-boundary commitments in `DECISIONS.md`

### Vision and planning

- [Vision and plans](/rota/docs/usage/vision-and-plans/): `/rota-vision`, `/rota-plan`, milestones
- [Brainstorming a design](/rota/docs/usage/brainstorm/): per-item design exploration with `/rota-brainstorm`, before `/rota-plan`
- [Spikes](/rota/docs/usage/spikes/): throwaway feasibility experiments via `/rota-spike`

### Configuration

- [Configuration](/rota/docs/usage/configuration/): every key in `.rota/config.json` and what it does
- [Autonomy levels](/rota/docs/usage/autonomy/): how `off`, `roundtrip` and `auto` change skill chaining
- [Issue backend](/rota/docs/usage/issue-backend/): backlog on GitHub/GitLab issues, setup, labels, milestones, `rota migrate issues`
- [Umbrella mode](/rota/docs/usage/umbrella-mode/): coordinator at umbrella, work in sub-repos (M02 V1)

### Reference

- [Safeguards and their limits](/rota/docs/reference/agent-safeguards/): the complete enforcement details and remaining gaps
- [Architecture](/rota/docs/reference/architecture/): how the CLI, the skills and `.rota/` fit together
- [The `.rota/` folder](/rota/docs/reference/rota-folder/): files and directories created by `rota init`
- [`rota` verb reference](/rota/docs/reference/cli-helpers/): every `rota` verb, with conventions and exit codes
- [Configuration options](/rota/docs/reference/config-options/): every config key and option label, set via `rota config set`
- [Tracker labels](/rota/docs/reference/labels/): label definitions, project declarations and dry-run sync
- [Upstream issues reference](/rota/docs/reference/rota-issues/): GitHub/GitLab issue backend and round-trip closing
- [Project check](/rota/docs/reference/preflight/): what `rota init check` verifies, plus exit-code meanings

### Contributing

- [Rounds on rota itself](https://github.com/l4ci/rota/blob/main/docs/contributing/rounds.md): the gate, repo rules and roster for contributors
- [Skill-rule audit, October 2026](https://github.com/l4ci/rota/blob/main/docs/contributing/skill-rule-audit-2026-10.md): the complete never/must inventory, enforcement gaps and observed breakage
- [Release signing](https://github.com/l4ci/rota/blob/main/docs/contributing/release-signing.md): generating or rotating the minisign key, the Actions secret, verifying by hand
- [Market review, October 2026](https://github.com/l4ci/rota/blob/main/docs/contributing/market-review-2026-10.md): what comparable orchestrators' users ask for, where rota stands, and the ranked gaps behind issues #574 to #587; refreshed 2026-10-27 with gstack (#2170 to #2174) and new entrants
- [Plain orchestrator comparison, October 2026](https://github.com/l4ci/rota/blob/main/docs/contributing/plain-orchestrator-comparison-2026-10.md): what a bare Claude Code session would do to run a team against what rounds do, and the six gaps behind issues #897 to #902. The [re-judged user version](/rota/docs/usage/rota-vs-plain-session/) is the current one

### Compare

- [How rota compares](/rota/docs/compare/): one page per tool, with the version checked
- [rota vs GSD](/rota/docs/compare/gsd/): spec-driven phases from discuss to ship
- [rota vs Superpowers](/rota/docs/compare/superpowers/): a skills methodology for many harnesses
- [rota vs Spec Kit](/rota/docs/compare/spec-kit/): GitHub's spec, plan and tasks toolkit for 40+ agents
- [rota vs OpenSpec](/rota/docs/compare/openspec/): living specs and delta change folders
- [rota vs the Elephant-Goldfish Model](/rota/docs/compare/elephant-goldfish/): design docs reviewed by fresh-context agents
- [rota vs ralph](/rota/docs/compare/ralph/): a fresh-context loop over a `prd.json`
- [rota vs Conductor](/rota/docs/compare/conductor/): a Mac app for agents in workspaces
- [rota vs Orca](/rota/docs/compare/orca/): a desktop app for fleets of agents
- [rota vs Vibe Kanban](/rota/docs/compare/vibe-kanban/): a kanban board that runs agents
- [rota vs Claude Squad](/rota/docs/compare/claude-squad/): a TUI for agents in tmux sessions
- [rota vs Gas Town](/rota/docs/compare/gastown/): a Mayor, polecats and a merge queue
- [rota vs Octo](/rota/docs/compare/octo/): several AI providers on one question
- [rota or a bare session](/rota/docs/usage/rota-vs-plain-session/): a row-by-row comparison with a plain Claude Code session that runs its own subagents

### Other

- [FAQ](/rota/docs/faq/): common questions
{% endraw %}
