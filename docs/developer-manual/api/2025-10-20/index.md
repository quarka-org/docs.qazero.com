---
id: getting-started-2025-10-20
title: Get Started with AI
sidebar_position: 1
last_updated: 2026-04-14
api_update: 2026-04-14
---

# Get Started with AI — QA ZERO API (2025-10-20)

:::info Version Information
**API Version:** 2025-10-20  
**API Update:** 2026-04-14  
**Plugin Version Required:** 3.0.0.0+  
**Status:** Current Release

`2025-10-20` is the URL-visible version — it only changes on breaking
revisions. `api_update` bumps on every non-breaking addition within
this version, so read it from `/guide` at runtime to decide which
features are available on the server you are talking to.

**Check compatibility:** [Version Compatibility Guide](../compatibility.md)
:::

---

> **AI で仕事の形は変わる。だからこそ、人がもっと面白いことに時間を使える土台を作りたい。**

## What this API is for

QA ZERO API is designed for the **AI era**. Humans can read and test
it directly, but the primary goal is to let AI assistants — Claude,
MCP clients, custom agents — retrieve structured analytics data
**safely and consistently**, through a small query language called
**QAL**.

If you have been thinking *"I want to let an AI analyze my site
without handing it database credentials and hoping for the best"*,
this API is for you.

## How it is different from a normal analytics API

Most analytics APIs assume a SQL-literate human and a cloud data
warehouse. QA ZERO drops both assumptions:

- **No cloud warehouse.** QAL runs on commodity shared hosting. Your
  hosting plan is the compute budget.
- **No SQL.** QAL is a deliberately small declarative language. An AI
  can compose a correct query on the first try, and a malformed query
  cannot damage the backing store.
- **Machine-readable spec, first-class.** The `/guide` endpoint ships
  the live spec as YAML, alongside a short instruction README written
  for AI consumers. You do not have to scrape our docs site.

In one sentence: **it is an observation platform built so that AI can
operate it responsibly, on any server, for anyone who has a website.**

## The three things you will touch

1. **`GET /wp-json/qa-platform/guide`** — returns everything an AI needs
   to build a query against this server: the live machine-readable
   spec, feature flags with `since` dates, and the list of tracking_ids
   you can query. **Call this first.**
2. **`POST /wp-json/qa-platform/query`** — accepts a QAL query in the
   JSON body and returns rows.
3. **The `ai/` subdirectory of this documentation.** It contains a
   concise `README.md` plus two YAML specs (`materials.yaml`,
   `qal-validation.yaml`). This is the same content the `/guide`
   endpoint serves, so you can preview it without authenticating.
   See [AI Instructions](./ai/README.md).

Everything else in this manual is there to help humans understand
*why* those three pieces are shaped the way they are.

## First query — through an AI

The expected shape of a first interaction is **not** `curl`. It is a
conversation like:

> "Which pages on my site lost the most traffic from organic search
> over the last 30 days?"

You hand that to an AI client that speaks QAL. The client calls
`/guide`, picks the right materials (`allpv`, `gsc`), builds a QAL
query, calls `/query`, and comes back with an answer. You never write
a query yourself.

If you *want* to write a query yourself, the
[API Reference](./reference/) pages walk through `/guide`, `/query`,
authentication, and errors with working examples.

## Where to go next

- **[Concepts](./concepts/)** — start here if you want to understand
  *why* QAL exists and how it is shaped. In particular, read
  [**Why QAL**](./concepts/why-qal.md) before you try to compare it
  to SQL.
- **[Materials](./materials/)** — what data is actually available.
  Each material page shows a small, realistic sample table so you can
  get a feel for the grain of the data before writing anything.
- **[API Reference](./reference/)** — exact shapes of `/guide`,
  `/query`, authentication, errors, and worked examples.
- **[AI Instructions](./ai/README.md)** — the minimal rule set served
  to AI / MCP clients. Useful to read even as a human, because it
  reveals exactly what constraints the API enforces.
- **[Changelog](./changelog.md)** — the Update Ledger. Every
  non-breaking addition inside version `2025-10-20` is logged here
  against its `api_update` date.

---

> **データは人を縛るためではなく、人の時間と創造性を支えるために使いたい。**
>
> **作業のための分析から、創造のための観測基盤へ。**
