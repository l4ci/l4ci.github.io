---
layout: rota/doc
title: "/rota-init"
description: "Suggest config values from the repo and write the ones you confirm."
permalink: /rota/docs/skills/rota-init/
source: docs/skills/rota-init.md
skill: rota-init
---
{% raw %}
Reads the project first, then proposes config values that fit it: the test commands from the manifests, Makefile and CI config (`test.fast`, `test.full`), the base branch and forge from the `origin` remote (`git.baseBranch`, `forge.provider`, `issues.source`), the harness CLIs on `PATH` (`round.harnesses`) and the terminal host (`round.dispatch`, `work.isolation`). Every proposal names the file or command it came from; a key with no signal keeps the schema default and is reported as such. Each choice is one question with the recommended value first (`AskUserQuestion` in Claude Code, a lettered list elsewhere). Answers are written only after you confirm, through `rota setup --set` on a project without `.rota/` and `rota config set` otherwise. On an initialized project it lists only the keys whose current value differs from the suggestion. It does not change `rota init` or `rota setup` defaults and installs no harness or host. Manual only.
{% endraw %}
