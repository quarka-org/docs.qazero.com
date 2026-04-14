---
id: why-qal
title: Why QAL, not SQL?
sidebar_position: 2
---

# Why QAL, not SQL?

If you already speak SQL fluently, the first reaction to QAL is
usually *"why are you making me learn a new query language when SQL
exists and everyone knows it?"* That question is fair. This page
answers it.

The short version: **SQL is a brilliant language for humans working
against a cloud data warehouse. QAL is for AI assistants working
against a small, real server.** Those are two genuinely different
problems, and the right shape of the query layer is different in
each.

## The two problems QAL was built to solve

### 1. **AI assistants should almost never have to retry**

The baseline experience we wanted was: a user asks a question in
natural language, an AI composes a query, the query runs, and the
answer comes back. **First try. No retries.**

SQL makes that hard for several reasons:

- Column and table names drift as the schema evolves. Prompts and
  few-shot examples rot within weeks.
- The space of valid queries is enormous. Small typos silently
  produce wrong answers rather than structural errors.
- JOIN behavior is hard to predict at compose time. A missed join
  condition can quietly explode row counts or lock up the DB.
- SQL exposes dangerous shapes (cross joins, recursive CTEs, `DELETE`)
  that an AI should never be able to generate at all.

QAL is deliberately narrow. Every valid query has the same five
top-level keys (`tracking_id`, `materials`, `time`, `make`, `result`).
Material names, column names, and feature names are all enumerated in
a machine-readable spec the AI can read at runtime. Structural
mistakes become impossible by construction; semantic mistakes become
the only remaining class — and those you want the AI to actually get
wrong visibly, not silently.

### 2. **It should run on commodity hosting, not a cloud warehouse**

The other option we kept being pushed toward — *"just put everything
in BigQuery / Redshift / Snowflake and write SQL"* — directly
contradicts one of the core commitments of QA ZERO:

> **Give the power of data to everyone who has a website — not just
> people who can afford a cloud data warehouse contract.**

If you require a customer to provision BigQuery before they can ask
an AI assistant about their own site, you have excluded the vast
majority of the people we built this for. Shared hosting, small VPS,
a cheap Lightsail instance — these are the targets. The query layer
has to be fast on those, without exotic infrastructure.

QAL ships with a file-based columnar store (ColumnDB) and a Storage
layer that can be swapped for other backends. A query that would take
ten seconds against a vanilla MySQL table is expected to return in
under a second through QAL, without you paying anyone extra.

---

> These two points are the reason QAL exists. The items below are
> secondary benefits that fall out of the same design, but if
> you only remember two things, remember those two.

---

## Secondary benefits

### 3. The schema the AI sees is stable

In SQL, table and column names track the implementation. When the
implementation changes — a column gets renamed, a table gets split —
any prompt or few-shot example that hardcoded a name silently breaks.

QAL exposes **materials**, which are defined in semantic terms
("one row per page view", "one row per click event"). Internal
storage can change without the material's shape changing, so an AI
that learned QAL two years ago still works against today's server.

### 4. Raw schemas stay inside the server

Giving an AI direct SQL access means giving it the raw table
structure: every column, every index, every FK. That is a security
posture and a privacy posture rolled into one, and it ages badly.

QAL deliberately abstracts away the backing store. An AI client
knows materials and columns; it has no idea whether the data lives
in ColumnDB, MySQL, a flat file, or something we haven't shipped
yet. That is deliberate.

### 5. Query cost is predictable before execution

Every QAL query declares its `result.limit` and `keep` set. That
means an AI — or a server-side throttle — can estimate the cost of a
query *before* running it, and reject or trim anything that would
exceed a budget.

SQL cannot do this in general. A single misplaced join or `SELECT *`
on a big table can turn an assistant into a denial-of-service
vector. QAL is shaped so that class of problem does not exist.

### 6. Domain vocabulary is built into the language

SQL takes whatever vocabulary the schema designer chose. QAL has
domain words — `session`, `pv`, `goal`, `click_event`, `page_version`
— built directly into the language. An AI with zero prior knowledge
of this particular site can still make sensible choices because the
language itself carries the domain model.

### 7. The surface is small enough to be safe

This is the one people miss. QAL has a deliberately small feature
set compared to SQL. The temptation is to read that as "unfinished"
— but it is not.

**A small surface is the whole point.** Every feature QAL *lacks*
is a class of mistake an AI cannot make. Fewer features means fewer
ways to damage a query, fewer ways to damage a server, fewer ways to
silently return wrong answers. The missing features are a safety
asset, not a gap we are ashamed of.

Where a feature is genuinely needed, we add it — carefully, with a
`since` tag so clients can detect its availability. Where it is not
needed, leaving it out is an active choice.

---

## What QAL is not trying to do

To be explicit about the boundary:

- QAL is **not** a general-purpose analytics language. It is shaped
  for web behavior data on sites QA ZERO can see.
- QAL is **not** a replacement for BI tools. If you want a drag-and-drop
  dashboard builder, you want a BI tool — not this API.
- QAL is **not** trying to be expressive. It is trying to be
  *correct-by-construction when composed by an AI*. Those goals are
  sometimes in tension, and when they are, we pick correctness.

---

## Where to go next

- **[What is QAL?](./what-is-qal.md)** — the actual shape of the
  query language, in one page.
- **[Materials, Views, Result](./materials-views-result.md)** — the
  three moving parts.
- **[AI Instructions](../api/2025-10-20/ai/README.md)** — the rule set an AI client
  is expected to follow.
