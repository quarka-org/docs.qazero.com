---
id: version-2026-05-11
title: Version 2026-05-11
sidebar_position: 1
last_updated: 2026-05-21
api_update: 2026-05-21
---

# Version 2026-05-11

:::info Version Information
**API Version:** 2026-05-11
**API Update:** 2026-05-21
**Plugin Version Required:** 3.0.0.0+
**Status:** Current Release

`2026-05-11` is the URL-visible version — it only changes on breaking
revisions. `api_update` bumps on every non-breaking addition within
this version, so read it from `/guide.api_update` at runtime to decide
which features are available on the server you are talking to.

**Check compatibility:** [Version Compatibility Guide](../compatibility.md)
:::

:::caution Breaking change from 2025-10-20
`2026-05-11` introduces the **symmetric calc column declaration** rule
(T87c). Under the previous version, only the `from`-side material had
its `calc`-referenced columns auto-fetched; `join`-side references
silently returned 0. From `2026-05-11`, both sides behave identically:
any `material.column` reference inside a `calc` expression triggers
fetch + preserve regardless of whether the material is reached via
`from` or `join.with`. Existing queries that worked are unaffected;
queries that were silently returning 0 because they relied on
`join`-side calc will now return correct counts. Bad references are
caught at validation time with `E_CALC_COLUMN_UNRESOLVED`. See the
[Update History](./changelog.md) for the full rationale.
:::

This page lists what lives inside version `2026-05-11`. If you are
here for the *why* behind QAL, read the
[philosophy pages](../../concepts/) first — those are
version-independent and apply to every API version.

## What is in this version

Version-pinned pages (fixed to `2026-05-11`):

- **[API Reference](./reference/)** — exact shapes of `/guide`,
  `/query`, authentication, and errors, with worked examples.
- **[`qal-validation.yaml`](./qal-validation.yaml)** — the feature-flag
  and validator spec for this version (machine-readable, version-pinned).
- **[Update History](./changelog.md)** — the Update Ledger for this
  version. Every non-breaking addition is logged here against its
  `api_update` date.

Shared, version-independent pages (living — apply to every version, each
field carrying its own `since:` tag):

- **[Materials](../materials/)** — the data surfaces you can query.
  One page per material, each with a hand-crafted sample table so
  the grain of the data is visible at a glance.
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
