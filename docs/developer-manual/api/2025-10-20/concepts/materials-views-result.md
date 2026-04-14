---
id: materials-views-result-2025-10-20
title: Materials, Views, Result
sidebar_position: 3
---

# Materials, Views, Result

Every QAL query is built from three moving parts. If you understand
how they relate, the rest of the language follows.

## Material — the data surface

A **material** is a named data surface with a fixed grain.
`allpv` is one row per page view. `click_event` is one row per
click. `gsc` is one row per search query per day. The grain is a
property of the material, not something you choose at query time.

You pick a material based on the question the user is asking. If the
question is "how many sessions came from search?", you want `allpv`
(grain = one page view) joined with `gsc` (grain = one search query),
not `click_event`.

Materials are enumerated in **[`ai/materials.yaml`](../ai/materials.yaml)**.
If a name is not in that file, it does not exist.

## View — a named transformation

A **view** is a named transformation built on top of a material (or
on top of another view). A view says: *"take this source, keep these
columns, apply these filters, join this other thing, compute these
aggregates, sort by this column"*.

You can define multiple views in a single `make` block. Views can
chain: one view's output can be another view's `from`. That is how
you build multi-stage queries without giving QAL a CTE syntax.

Views are the unit of work. The executor runs views, not queries —
your query as a whole is "define these views, return this one".

## Result — what actually gets returned

The `result` block tells the executor **which view to return and how
to shape the output**. Only one view can be returned per query
(identified by `result.use`).

- `result.use` — the name of the view to return.
- `result.limit` — cap the number of rows (required unless
  `count_only`).
- `result.count_only: true` — return just the row count, ignoring
  `limit`.

The rest of `make` is not wasted — intermediate views that are not
returned can still be referenced as `from` sources by the returned
view. They are the equivalent of subqueries.

## A mental picture

```
   materials (data surfaces)
        │
        ▼
   make (named views — possibly chained)
        │
        ▼
   result (which view, how much)
```

Every well-formed QAL query moves left to right through this
picture. If your query is fighting the shape, it is usually because
you are trying to do work in `result` that belongs in `make`, or
because you have picked a material with the wrong grain.

## Where to go next

- **[Materials](../materials/)** — the actual data surfaces, with
  sample tables.
- **[AI Instructions](../ai/README.md)** — the rule set for AI
  clients.
