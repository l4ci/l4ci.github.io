---
layout: rota/doc
title: "Install rota"
description: "Open your project in Claude Code, Codex or OpenCode and paste:"
permalink: /rota/docs/install/
source: docs/install.md
---
{% raw %}
Open your project in Claude Code, Codex or OpenCode and paste:

```text
Install rota and set it up in this project. Follow https://raw.githubusercontent.com/l4ci/rota/main/install.md
```

The agent installs rota and its skills, then helps configure the project.

Alternative: [Homebrew](/rota/docs/reference/installation/#homebrew) · [curl](/rota/docs/reference/installation/#install-script) · [Claude Plugin](/rota/docs/reference/installation/#-plugin-marketplace) · [Codex Plugin](/rota/docs/reference/installation/#codex) · [More](/rota/docs/reference/installation/).

## With Homebrew

```sh
brew install l4ci/tap/rota
rota skills install
```

## Without Homebrew

On Linux or macOS:

```sh
curl -fsSL https://raw.githubusercontent.com/l4ci/rota/main/install.sh | sh
rota skills install
```

The script installs to `~/.local/bin`. It checks the download checksum and, when `minisign` is available, the release signature. [Verification details](/rota/docs/reference/installation/#verifying-a-release).

On Windows, use [WSL2](/rota/docs/reference/installation/#windows-wsl2).

## In your project

For a manual install, open your project in Claude Code or Codex. Reopen the agent session if the new skills are not visible, then invoke `/rota-init` (`$rota-init` in Codex).

[Start your first parallel round](/rota/docs/getting-started/).

## Other options

The [installation reference](/rota/docs/reference/installation/) covers plugins, release binaries, updates and removal.
{% endraw %}
