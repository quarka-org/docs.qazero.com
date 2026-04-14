---
id: get-started-with-ai
title: Get Started with AI
sidebar_position: 2
---

# Get Started with AI — QA ZERO API

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
   spec, feature flags with `since` dates, and the list of
   `tracking_id`s you can query. **Call this first.**
2. **`POST /wp-json/qa-platform/query`** — accepts a QAL query in the
   JSON body and returns rows.
3. **The `ai/` subdirectory of the current API version.** It contains
   a concise `README.md` plus two YAML specs (`materials.yaml`,
   `qal-validation.yaml`). This is the same content the `/guide`
   endpoint serves, so you can preview it without authenticating.
   See [AI Instructions](./api/2025-10-20/ai/).

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

If you *want* to write a query yourself, the current version's
reference pages walk through `/guide`, `/query`, authentication, and
errors with working examples.

## Version vs. update

QA ZERO uses **two-tier versioning**. The short version:

- **`version`** (`YYYY-MM-DD`) — pinned in the URL
  (`?version=2025-10-20`). Only changes on breaking revisions.
- **`update`** (`YYYY-MM-DD`) — bumps on any non-breaking addition
  within a version. Read this from `/guide.api_update` at runtime
  to decide which features are live on the server you are talking to.

See [Versioning philosophy](./concepts/versioning.md) for the full
rationale.

## Where to go next

- **[Concepts](./concepts/)** — start here if you want to understand
  *why* QAL exists and how it is shaped. In particular, read
  [**Why QAL**](./concepts/why-qal.md) before you try to compare it
  to SQL.
- **[Version 2025-10-20](./api/2025-10-20/)** — the current API
  version. Materials, reference, and the AI spec live here.
- **[AI Instructions](./api/2025-10-20/ai/)** — the minimal rule set
  served to AI / MCP clients. Useful to read even as a human, because
  it reveals exactly what constraints the API enforces.

---

> **データは人を縛るためではなく、人の時間と創造性を支えるために使いたい。**
>
> **作業のための分析から、創造のための観測基盤へ。**
