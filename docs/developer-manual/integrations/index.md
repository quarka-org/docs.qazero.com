---
id: integrations-index
slug: /developer-manual/integrations
title: Integrations
sidebar_label: Integrations
sidebar_position: 8
last_updated: 2026-07-01
---

# Integrations

This section is for people who want to **use** an official connector to
move QA ZERO data into another system — not to build one. (If you want to
build or distribute your own connector, see [Extending](../extending/index.md).)

:::note Preparing
Official connectors are on the roadmap and not yet generally available.
This page is a placeholder so the entry point is stable; per-connector
usage guides will be published here as each connector ships.
:::

## What will live here

Each official connector will get its own page describing **how to use it** —
credentials, configuration, the data it moves, and its limits. Planned
connectors include:

- **BigQuery connector** *(planned)* — export QAL query results and
  materials into Google BigQuery for warehousing and downstream BI.

The list above is a roadmap, not a set of shipped features. When a
connector becomes available, its usage guide will appear here and be
announced in the API [changelog](../api/2026-05-11/changelog.md).

## Until then

Everything a connector does, you can do directly against the REST API
today:

- **[API Reference](../api/index.md)** — the `/guide` and `/query` endpoints.
- **[Materials](../api/materials/index.md)** — the data surfaces you can pull.
- **[For AI — Instructions & Spec](../for-ai/index.md)** — the machine-readable
  spec, if you are wiring this into an AI or MCP client.
