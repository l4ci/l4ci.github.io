---
layout: rota/doc
title: "Getting started"
description: "Install rota, set up a project and run your first capture, work, ship cycle in about five minutes."
permalink: /rota/docs/getting-started/
source: docs/getting-started.md
---
{% raw %}
Install rota, set up a project and run your first capture, work, ship cycle in about five minutes.

## 📦 Install

```bash
brew install l4ci/tap/rota   # or: curl -fsSL https://raw.githubusercontent.com/l4ci/rota/main/install.sh | sh
rota skills install
```

The second command writes the skills into the Claude Code and Codex skill directories. Options, scopes, upgrading and removal are on the [install page](/rota/docs/install/).

## ⚙ Set up the project

Run `rota setup` once at the project root. It scaffolds `.rota/` and asks the main config questions: where the backlog lives, isolation, merge strategy, review depth, test commands and a few more. Press Enter to keep the suggested value. Where the repo gives a signal (your `go.mod` or `package.json`, CI files, the `origin` host, the harnesses on your `PATH`), setup suggests that value and says where it read it.

- `rota setup --list` prints the questions with each suggestion and its evidence.
- `rota setup --yes` takes the suggested values and asks nothing. `--set key=value` answers one question. Both suit scripts and CI.
- `rota config set <key> <value>` changes a setting later. Don't hand-edit the JSON files.

Every question and its choices are described in [config options](/rota/docs/reference/config-options/); [configuration](/rota/docs/usage/configuration/) explains the keys by concept. A second machine that builds issues beside main uses the `support` role: see [Support role](https://github.com/l4ci/rota/blob/main/docs/contributing/rounds.md#support-role).

Commit `.rota/` and the files setup wrote (`AGENTS.md`, `CLAUDE.md`, `.claude/agents/`, `.gitignore`): `/rota-work` starts from a clean tree.

## 🔁 Your first cycle

One item, with you driving each step.

1. **Capture it.** Describe the work in plain words:

   ```
   /rota-capture the list command shows every row when I ask for zero
   ```

   Capture writes the item to the backlog (`.rota/BACKLOG.md` by default) and stops. It never starts work. See [capturing work](/rota/docs/usage/capturing-work/).

2. **Build it.**

   ```
   /rota-work B03
   ```

   Use the ID capture printed. `/rota-work` checks the tree is clean, cuts a branch and builds the item in small commits, one per task. For a behavior change the proof gate wants a failing test run first, then a passing one. See [running work](/rota/docs/usage/running-work/).

3. **Ship it.**

   ```
   /rota-ship
   ```

   Ship runs `/rota-review` first. On a pass it merges into the base branch (`work.mergeStrategy: direct`, the default) or pushes and prints the PR URL (`pr`). With the issue backend it always opens a PR that closes the issue. See [review and ship](/rota/docs/usage/review-and-ship/).

For an item too big to one-shot, run `/rota-plan` between capture and work. [Skills](/rota/docs/skills/) lists every `/rota-*` skill; [how skills chain](/rota/docs/how-it-works/#how-skills-chain) shows which follow which.

## ➡ Next

- [Your first round](/rota/docs/first-round/): several issues in parallel, an orchestrator, workers and the merge gate.
- [Examples](https://volkerotto.net/rota/examples/): the skill chains with sample transcripts, from one small bug to a whole project. The [walkthroughs](/rota/docs/walkthroughs/) show what a greenfield or brownfield project holds on disk.
- [How it works](/rota/docs/how-it-works/): the roles and how the skills connect.
{% endraw %}
