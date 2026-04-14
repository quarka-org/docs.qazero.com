---
id: reference-index-2025-10-20
title: API Reference
sidebar_position: 1
---

# API Reference

This section is the execution layer: the exact shapes of `/guide`,
`/query`, authentication, and error responses. If you are writing
client code directly (no AI in the middle), this is where you want
to be.

If you are here looking for concepts or a mental model, go back to
**[Concepts](../concepts/)**. If you are building through an AI
client, the AI only needs **[AI Instructions](../ai/README.md)** and
the YAML specs — not these pages.

## In this section

- **[Authentication](./authentication.md)** — how to obtain and send
  credentials.
- **[`/guide`](./guide.md)** — the discovery endpoint. Returns live
  spec, feature flags, and `tracking_id` list.
- **[`/query`](./query.md)** — the execution endpoint. Accepts a QAL
  query, returns rows.
- **[Errors](./errors.md)** — canonical error codes and what they
  mean.
- **[Examples](./examples.md)** — worked end-to-end examples you can
  `curl` against a live install.
