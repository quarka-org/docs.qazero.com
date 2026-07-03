---
id: extending-index
slug: /developer-manual/extending
title: Extending
sidebar_label: Extending
sidebar_position: 9
last_updated: 2026-07-01
---

# Extending

This section is for people who want to **build** on top of QA ZERO —
your own plugin, connector, or integration — and, eventually, distribute
it. (If you just want to use an official connector, see
[Integrations](../integrations/index.md).)

:::note Preparing
The authoring and distribution guides are still being written. This page
is a placeholder so the entry point is stable; the how-to material will
be filled in here.
:::

## The foundation you build on

Anything you build talks to QA ZERO through the same public REST API that
everything else uses — there is no private back door:

- **[API Reference](../api/index.md)** — `/guide` for discovery, `/query` for
  execution. Start here.
- **[Materials](../api/materials/index.md)** — the version-independent catalogue
  of data surfaces your extension can read.
- **[For AI — Instructions & Spec](../for-ai/index.md)** — the machine-readable
  spec (`materials.yaml`) and the version-pinned `qal-validation.yaml`,
  if your extension composes QAL programmatically or via an LLM.

The API is the marquee surface, not a dependency nested under this
section — build against it directly and link back to it.

## What will live here

- How to structure a custom plugin or connector against the API.
- Authentication and versioning expectations for third-party code.
- How to package and distribute what you build.

These guides will be published as the extension surface stabilises.
