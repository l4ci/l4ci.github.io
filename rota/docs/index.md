---
layout: rota/doc
title: "rota documentation"
description: "Public user guide for rota, a dev workflow for Claude Code and Codex, with OpenCode as a round worker: skills plus a single-binary CLI. Start with one agent…"
permalink: /rota/docs/
source: docs/README.md
---
{% raw %}
Public user guide for rota, a dev workflow for Claude Code and Codex, with OpenCode as a round worker: skills plus a single-binary CLI. Start with one agent: capture an item, build it, ship it. When you have several issues ready, an orchestrator agent hands them to worker agents and a gate checks every merge.

## Contents

### 🚀 Getting started

- [Install](/rota/docs/install/): Homebrew, the install script, release binaries, the Claude Code plugin, upgrading, uninstalling
- [Getting started](/rota/docs/getting-started/): install and run your first cycle
- [How it works](/rota/docs/how-it-works/): the two ways to use rota (orchestrator, workers, gate), plus how each skill connects to the artifacts it touches
- [Where coding agents go wrong](/rota/docs/agent-mistakes/): seven common mistakes, enforced checks, written rules and remaining gaps

### Walkthroughs

- [Greenfield: what a project holds after a brief](/rota/docs/walkthroughs/greenfield-from-brief/). The files `/rota-vision`, `/rota-plan`, `/rota-capture` and `/rota-learn` leave behind in a new project, with the plan, milestones and knowledge entries shown in full.
- [Brownfield: what rota adds to an existing project](/rota/docs/walkthroughs/brownfield-existing-project/). The project map, config choices, backlog, decision and knowledge entry that appear when rota joins a codebase with history.

### 🔄 Rounds

- [Your first round](/rota/docs/first-round/): herdr or tmux, launching the orchestrator, a first round and wind-down, step by step
- [A round cycle](/rota/docs/walkthroughs/round-cycle/): shape the slate, run a round, wind down, release
- [Parallel rounds](/rota/docs/usage/parallel-rounds/): an orchestrator, standing workers in worktrees, the merge gate, solo mode
- [Unattended rounds](/rota/docs/usage/unattended-rounds/): hooks, statusline, keepalive, usage limits, the orchestrator switch
- [Doctor and reap](/rota/docs/usage/doctor-and-reap/): check the machine before a round, clear leftovers after
- [Codex workers](/rota/docs/usage/codex-workers/): run Codex as a worker in a round
- [OpenCode workers](/rota/docs/usage/opencode-workers/): run OpenCode, and any model it can reach, as a worker in a round
- [Orchestrator harnesses](/rota/docs/usage/orchestrator-harnesses/): run the orchestrator in Claude Code, Codex, Hermes or opencode
- [Skills in Codex](/rota/docs/usage/codex-skills/): install and call the skills from Codex

### 🧰 Skills

<!-- generated:skills:nav begin -->
<!-- edit docs/skills/*.md and run python3 scripts/skills-docs.py -->

- [All skills](/rota/docs/skills/): when to use each skill, and how they chain
- [`/rota-capture`](/rota/docs/skills/rota-capture/): Record bugs, features and tasks in the backlog without starting work
- [`/rota-brainstorm`](/rota/docs/skills/rota-brainstorm/): Negotiate the design of one Major item before planning it
- [`/rota-spike`](/rota/docs/skills/rota-spike/): Try one risky idea on a throwaway branch and keep only the finding
- [`/rota-plan`](/rota/docs/skills/rota-plan/): Write a signed-off implementation plan with verifiable tasks
- [`/rota-work`](/rota/docs/skills/rota-work/): Build the next item in small commits, one verified task at a time
- [`/rota-debug`](/rota/docs/skills/rota-debug/): Find the root cause of one bug, fix it atomically and prove it
- [`/rota-review`](/rota/docs/skills/rota-review/): Review a branch against its spec and conventions before it leaves
- [`/rota-ship`](/rota/docs/skills/rota-ship/): Review, then open the PR or merge, linking items by ID
- [`/rota-docs`](/rota/docs/skills/rota-docs/): Scaffold, update or reorganize the public docs
- [`/rota-orchestrate`](/rota/docs/skills/rota-orchestrate/): Run a parallel round: pick the slate, watch workers, merge their PRs
- [`/rota-answer`](/rota/docs/skills/rota-answer/): Answer every decision a round is waiting on, one question at a time
- [`/rota-learn`](/rota/docs/skills/rota-learn/): Save the session's durable lessons to KNOWLEDGE.md
- [`/rota-decide`](/rota/docs/skills/rota-decide/): Record a hard-boundary decision with explicit forbids and permits
- [`/rota-init`](/rota/docs/skills/rota-init/): Suggest config values from the repo and write the ones you confirm
- [`/rota-bugreport`](/rota/docs/skills/rota-bugreport/): File rota's own mistakes upstream, after your explicit yes
- [`/rota-pause`](/rota/docs/skills/rota-pause/): Stop cleanly and leave a handoff note for the next session
- [`/rota-vision`](/rota/docs/skills/rota-vision/): Turn an idea into milestones with dependencies and ready/blocked status
- [`/rota-refactor`](/rota/docs/skills/rota-refactor/): Review the architecture and file refactor issues; --map drafts the map
- [`/rota-qa`](/rota/docs/skills/rota-qa/): Run product-level QA against the built artifact and score it
- [`/rota-release`](/rota/docs/skills/rota-release/): Cut a release: checklist, version bump, notes, tag, publish
<!-- generated:skills:nav end -->

### 📥 Capture and backlog

- [Capturing work](/rota/docs/usage/capturing-work/): `/rota-capture`, mixed input, related links, detail files
- [Picking work](/rota/docs/usage/picking-work/): `/rota-work` (no argument), `/rota-work --preview`
- [Removing work](/rota/docs/usage/removing-work/): `/rota-capture --remove`, dry-run preview, batch removal, safety semantics

### 🔨 Execution

- [Running work](/rota/docs/usage/running-work/): `/rota-work` parallel cycles, branch vs worktree isolation, capture then work
- [Debugging](/rota/docs/usage/debugging/): `/rota-debug` systematic cycle
- [Pausing and resuming](/rota/docs/usage/pausing-and-resuming/): `/rota-pause`, recovering after `/clear`
- [Parallel work](/rota/docs/usage/parallel-work/): worktree mode, concurrent `/rota-work` sessions

### 📦 Shipping

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

### ⚙ Configuration

- [Configuration](/rota/docs/usage/configuration/): every key in `.rota/config.json` and what it does
- [Autonomy levels](/rota/docs/usage/autonomy/): how `off`, `roundtrip` and `auto` change skill chaining
- [Issue backend](/rota/docs/usage/issue-backend/): backlog on GitHub/GitLab issues, setup, labels, milestones, `rota migrate issues`
- [Umbrella mode](/rota/docs/usage/umbrella-mode/): coordinator at umbrella, work in sub-repos (M02 V1)

### 📖 Reference

- [Architecture](/rota/docs/reference/architecture/): how the CLI, the skills and `.rota/` fit together
- [The `.rota/` folder](/rota/docs/reference/rota-folder/): files and directories created by `rota init`
- [`rota` verb reference](/rota/docs/reference/cli-helpers/): every `rota` verb, with conventions and exit codes
- [Configuration options](/rota/docs/reference/config-options/): every config key and option label, set via `rota config set`
- [Tracker labels](/rota/docs/reference/labels/): label definitions, project declarations and dry-run sync
- [Upstream issues reference](/rota/docs/reference/rota-issues/): GitHub/GitLab issue backend and round-trip closing
- [Project check](/rota/docs/reference/preflight/): what `rota init check` verifies, plus exit-code meanings

### 🤝 Contributing

- [Rounds on rota itself](https://github.com/l4ci/rota/blob/main/docs/contributing/rounds.md): the gate, repo rules and roster for contributors
- [Skill-rule audit, October 2026](https://github.com/l4ci/rota/blob/main/docs/contributing/skill-rule-audit-2026-10.md): the complete never/must inventory, enforcement gaps and observed breakage
- [Release signing](https://github.com/l4ci/rota/blob/main/docs/contributing/release-signing.md): generating or rotating the minisign key, the Actions secret, verifying by hand
- [Market review, October 2026](https://github.com/l4ci/rota/blob/main/docs/contributing/market-review-2026-10.md): what comparable orchestrators' users ask for, where rota stands, and the ranked gaps behind issues #574 to #587
- [Plain orchestrator comparison, October 2026](https://github.com/l4ci/rota/blob/main/docs/contributing/plain-orchestrator-comparison-2026-10.md): what a bare Claude Code session would do to run a team against what rounds do, and the six gaps behind issues #897 to #902. The [re-judged user version](/rota/docs/usage/rota-vs-plain-session/) is the current one

### ⚖ Compare

- [How rota compares](/rota/docs/compare/): one page per tool, with the version checked
- [rota vs GSD](/rota/docs/compare/gsd/): spec-driven phases from discuss to ship
- [rota vs Superpowers](/rota/docs/compare/superpowers/): a skills methodology for many harnesses
- [rota vs OpenSpec](/rota/docs/compare/openspec/): living specs and delta change folders
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
