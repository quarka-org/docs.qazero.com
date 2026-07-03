---
id: version-2025-10-20
title: Version 2025-10-20
sidebar_position: 1
last_updated: 2026-04-29
api_update: 2026-04-29
---

# Version 2025-10-20

:::info Version Information
**API Version:** 2025-10-20  
**API Update:** 2026-04-29  
**Plugin Version Required:** 3.0.0.0+  
**Status:** Previous (supported — 24-month archive)

`2025-10-20` is the URL-visible version — it only changes on breaking
revisions. `api_update` bumps on every non-breaking addition within
this version, so read it from `/guide.api_update` at runtime to decide
which features are available on the server you are talking to.

**Check compatibility:** [Version Compatibility Guide](../compatibility.md)
:::

This page lists what lives inside version `2025-10-20`. If you are
here for the *why* behind QAL, read the
[philosophy pages](../../concepts/) first — those are
version-independent and apply to every API version.

## What is in this version

Version-pinned pages (fixed to `2025-10-20`):

- **[API Reference](./reference/)** — exact shapes of `/guide`,
  `/query`, authentication, and errors, with worked examples.
- **[`qal-validation.yaml`](./qal-validation.yaml)** — the feature-flag
  and validator spec for this version (machine-readable, version-pinned).
- **[Update History](./changelog.md)** — the Update Ledger for this
  version. Every non-breaking addition is logged here against its
  `api_update` date.

Shared, version-independent pages (living — the same catalogue serves
every version):

- **[Materials](../materials/)** — the data surfaces you can query.
- **[For AI — Instructions & Spec](../../for-ai/)** — the concise
  instruction set plus `materials.yaml`, served to AI / MCP clients
  via `/guide`.

## Before you start

If you are new here:

1. Read **[Get Started with AI](../../get-started-with-ai.md)** for
   the shape of a first interaction.
2. Read **[Why QAL, not SQL?](../../concepts/why-qal.md)** for the
   design rationale.
3. Then come back here, pick the material you need from the list
   above, and compose a query.
