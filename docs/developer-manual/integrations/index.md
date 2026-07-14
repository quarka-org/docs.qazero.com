---
id: integrations-index
slug: /developer-manual/integrations
title: Integrations
sidebar_label: Integrations
sidebar_position: 8
last_updated: 2026-07-14
---

# Integrations

This section is for people who want to **use** an official connector to
move QA ZERO data into another system — not to build one. (If you want to
build or distribute your own connector, see [Extending](../extending/index.md).)

## Available connectors

- **[MCP Server](./mcp.md)** — connect Claude Desktop or another
  [Model Context Protocol](https://modelcontextprotocol.io) client so an
  AI can query your analytics through QAL. Read-only, over the same
  `/guide` and `/query` endpoints a human would use.

## On the roadmap

- **BigQuery connector** *(planned)* — export QAL query results and
  materials into Google BigQuery for warehousing and downstream BI.

Roadmap items are not shipped features. When a connector becomes
available, its usage guide will appear here and be announced in the API
[changelog](../api/2026-05-11/changelog.md).

## Prefer the raw API?

Everything a connector does, you can also do directly against the REST
API:

- **[API Reference](../api/index.md)** — the `/guide` and `/query` endpoints.
- **[Materials](../api/materials/index.md)** — the data surfaces you can pull.
- **[For AI — Instructions & Spec](../for-ai/index.md)** — the machine-readable
  spec, if you are wiring this into an AI or MCP client yourself.
