---
layout: rota/doc
title: "/rota-release"
description: "Cut a release: checklist, version bump, notes, tag, publish."
permalink: /rota/docs/skills/rota-release/
source: docs/skills/rota-release.md
skill: rota-release
---
{% raw %}
Cuts a release end to end: walks the project's release checklist (`.rota/RELEASE.md` by default; override with `release.checklistPath`) as a preflight gate, bumps the project version (`major`/`minor`/`patch` or explicit semver), generates categorized release notes from commits since the last tag, prepends a section to `CHANGELOG.md` (creating it if absent), creates an annotated git tag, pushes commit and tag, and publishes a release on GitHub or GitLab when origin is set. It detects the version source (`plugin.json`, `package.json`, `pyproject.toml`, `Cargo.toml`, plain `VERSION`) and honors a `release.versionFile` override.

The checklist file is per-project and tracked by default; see [release checklist](/rota/docs/usage/review-and-ship/#release-checklist) for the format. When absent, the skill offers to scaffold a starter (under `autonomy.level: off`) or skips the gate silently (under `auto`). Items ending in `(manual)` always interject even in unattended modes.

Where the repo carries a video series (`videos/`), the preflight also runs `python3 scripts/videos.py --check` and reminds the maintainer to re-render any stale episode with `videos/render.sh <episode>`; it never blocks the release. The check covers scripts, captured output and shared renderer/voice inputs, naming any input that changed since the render. See the [video pipeline](https://github.com/l4ci/rota/blob/main/videos/README.md#is-anything-stale) for the manifest format and inputs.

After publishing, an always-manual gate offers to close any upstream GitHub/GitLab issues that landed in the release but are still open. It covers the direct-push path where work skipped `/rota-ship` (or chose "leave open") and the linked issues never closed. Candidates come from `rota issues imported --open-only`; the gate is silent when nothing is open. Skipped entirely in `--dry-run` mode.
{% endraw %}
