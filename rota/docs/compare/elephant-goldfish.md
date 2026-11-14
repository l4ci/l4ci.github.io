---
layout: rota/doc
title: "rota vs the Elephant-Goldfish Model"
description: "The Elephant-Goldfish Model (EGM) is a plugin of skills and reviewer prompts for spec-driven design. The \"elephant\" is the main agent, which holds the project…"
permalink: /rota/docs/compare/elephant-goldfish/
source: docs/compare/elephant-goldfish.md
---
{% raw %}
The [Elephant-Goldfish Model](https://github.com/google/elephant-goldfish-model) (EGM) is a plugin of skills and reviewer prompts for spec-driven design. The "elephant" is the main agent, which holds the project context and drafts the design; the "goldfish" are reviewers that run as fresh subagents and see only the document and the source it cites. It comes from Google engineers and is Apache-2.0, but its README says it "is not an officially supported Google product." It has no tagged releases. Checked 2026-11-13 against commit `964a4f1` (2026-11-13) and rota 0.34.2.

## The short version

- Pick EGM when the risk is a design nobody challenged: you want an idea stress-tested, a design written section by section, and reviews from agents that never saw how it was argued.
- Pick rota when the design is settled enough to file as issues and you want them built, verified and merged, possibly in parallel.
- They barely overlap. EGM ends at an approved design doc and tells you to "ask your coding agent to implement it"; rota starts there.

## Side by side

| | EGM | rota |
|---|---|---|
| What it is | A plugin of skills (`egm-*`), reviewer personas and review rubrics | A Go binary plus `/rota-*` skills |
| Unit of work | A design doc in `docs/designs/<feature>.md` | A backlog item or tracker issue |
| Core loop | `egm-brainstorm`, `egm-draft`, `egm-review`, `egm-resolve`; also `egm-review-loop`, `egm-bootstrap`, `egm-drift-report` | `/rota-capture`, `/rota-work`, `/rota-ship`; rounds for parallel work |
| Review | Up to five stages (zoom out, comprehension, critic, zoom out again, implementation readiness), each by fresh-context reviewers; a synthesizer merges their findings. Refuses to run without subagent support | `/rota-review` runs Spec and Standards reviewers in fresh context on the diff; a plan critic reviews plans |
| Implementation | Not covered. The approved design lists every file to change, and you hand it to your agent | `/rota-work` or a round worker, with red and green proof |
| Parallel agents | Parallel reviewers only | An orchestrator plus two to five standing workers |
| Isolation, merging | Not documented | One worktree per worker; the gate merges after `test.full` passes on a scratch merge |
| Backlog / tracker | None | `.rota/BACKLOG.md`, GitHub, GitLab, Jira, Linear or It's a Plan |
| Memory across sessions | Design docs, an optional `SITEMAP.md` index, generated READMEs | `KNOWLEDGE.md`, `DECISIONS.md` and handoff notes in `.rota/` |
| Agents | Verified on Claude Code, Codex and the Antigravity CLI; others listed as working or experimental | Claude Code, Codex, OpenCode |
| Install | `claude plugin marketplace add google/elephant-goldfish-model`, then `claude plugin install egm@egm`; similar for Codex and `agy` | `brew install l4ci/tap/rota` or `install.sh`, then `rota skills install` and `rota setup` |
| License | Apache-2.0 | MIT |

## Where EGM is stronger

- **Design review depth.** Ten reviewer slots across five stages, each with its own rubric, then a structured pass where every finding is fixed or contested. rota reviews a plan with one critic and reviews code, not designs, with two reviewers.
- **Brainstorming against an idea.** `egm-brainstorm` runs several critical lenses at once before anything is drafted. `/rota-brainstorm` explores approaches with you in one thread.
- **Documentation upkeep.** `egm-bootstrap` writes READMEs for an existing codebase bottom-up, and `egm-drift-report` compares design docs with the code. rota's drift checks cover its own contract docs, not your design docs.
- **No setup beyond a plugin.** No binary, tracker or terminal host.

## Where rota is stronger

- **Everything after the design.** Issues, implementation with recorded proof, review of the diff, and a test-gated merge. See [how it works](/rota/docs/how-it-works/).
- **Parallelism across issues.** A [rota round](/rota/docs/usage/parallel-rounds/) runs several issues at once in separate worktrees.
- **Trackers.** Items live in GitHub, GitLab, Jira or Linear ([issue backend](/rota/docs/usage/issue-backend/)).
- **Project knowledge beyond designs.** `/rota-learn` and `/rota-decide` keep lessons and hard boundaries. See [learning](/rota/docs/usage/learning/) and [decisions](/rota/docs/usage/decisions/).
- **Releases.** rota ships versioned releases; EGM is tracked by commit only.

## Using both

They fit end to end, though running the two together is untested. Draft and review a design with EGM, commit it to `docs/designs/`, then capture its implementation section as rota issues and build them in a round. Both use fresh subagents and both write files rather than long chat replies, so the habits carry over. Name the design doc in each issue so workers read it.

## Sources

- [EGM README](https://github.com/google/elephant-goldfish-model): description, skills, install, license, star count (18.6k on 2026-11-13).
- [Getting started](https://github.com/google/elephant-goldfish-model/blob/main/docs/getting_started.md) and [harnesses](https://github.com/google/elephant-goldfish-model/blob/main/docs/harnesses.md): workflow, verified and experimental harnesses.
- [`egm-review`](https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-review/SKILL.md) and [`egm-draft`](https://github.com/google/elephant-goldfish-model/blob/main/skills/egm-draft/SKILL.md): review stages, synthesizer, refusal without subagents, design requirements.
- [Commits on `main`](https://github.com/google/elephant-goldfish-model/commits/main): `964a4f1`, 2026-11-13; no tagged releases.
- rota: [README](https://github.com/l4ci/rota/blob/main/README.md), [how it works](/rota/docs/how-it-works/), [plan critic](https://github.com/l4ci/rota/blob/main/skills/references/plan-critic.md).

More comparisons: [how rota compares](/rota/docs/compare/).
{% endraw %}
