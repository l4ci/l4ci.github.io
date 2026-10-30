---
layout: rota/doc
title: "/rota-go"
description: "Implement an issue and land it with only gofmt, vet and build; no slow tests, no review."
permalink: /rota/docs/skills/rota-go/
source: docs/skills/rota-go.md
skill: rota-go
---
{% raw %}
Fast track for solo work: claims an existing issue, implements it with no brainstorm, plan or TDD, runs only `gofmt`, `go vet` and `go build`, then merges or opens a PR per [`work.mergeStrategy`](/rota/docs/usage/configuration/#workmergestrategy-direct-or-pr). The smoke suite, `go test` and the AI review are skipped on purpose, and the merge commit or PR body says so. Cheap-check failures are fixed before anything lands.

It refuses inside a round: workers keep the [worker contract](https://github.com/l4ci/rota/blob/main/docs/contributing/rounds.md) because the orchestrator relies on the gate. Use [`/rota-work`](/rota/docs/skills/rota-work/) when you want tests and review.
{% endraw %}
