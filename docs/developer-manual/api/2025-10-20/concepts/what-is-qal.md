---
id: what-is-qal-2025-10-20
title: What is QAL?
sidebar_position: 1
---

# What is QAL?

**QAL** (Query Analytics Language) is the query language spoken by
the QA ZERO API. It is a declarative JSON format — not SQL, not a
DSL with parentheses and operators. You construct a query by
building a JSON object and sending it to `/query`.

## The shape, in one object

Every valid QAL query has exactly these top-level keys:

```
{
  "tracking_id": "...",      // which site to query
  "materials":   [...],      // data surfaces this query touches
  "time":        {...},      // start / end / timezone
  "make":        {...},      // named views (the actual work)
  "result":      {...}       // which view to return, and how
}
```

Any other top-level key is rejected. This is intentional: the shape
is small enough to fit in a single mental model, and the validator
can reject structural mistakes before they reach the executor.

## The five pieces, explained

### `tracking_id`
A string that identifies which site on this install to query. The
list of tracking_ids you can use is returned by `/guide`. Do not
hardcode these across servers.

### `materials`
An array of objects naming the data surfaces this query reads from.
Material names come from `materials.yaml` (e.g. `allpv`, `gsc`,
`click_event`). If a material name is not in the spec, the query
is rejected.

### `time`
The time window, as `{ start, end, tz }`. `start` and `end` are
ISO-8601 timestamps. `tz` is an IANA timezone such as `Asia/Tokyo`
or `UTC`. There is no default time range — "all time" queries are
intentionally unavailable.

### `make`
A map of named views. Each view has:

- `from` — the source material.
- `keep` — columns to carry forward.
- Optionally: `filter`, `join`, `add`/`calc`, `sort`.

Views are the actual working units of QAL. You can define multiple
views in one `make` block and chain them (one view can use another
as its `from`).

### `result`
Tells the executor which view to return:

- `use` — the name of the view in `make` to return.
- `limit` — maximum row count.
- `count_only` — if `true`, return only a row count and ignore
  `limit`.

## Worked example

A minimal query that returns the 10 most-viewed pages over the last
seven days:

```json
{
  "tracking_id": "abc123",
  "materials":   [{ "name": "allpv" }],
  "time": {
    "start": "2026-04-07T00:00:00",
    "end":   "2026-04-14T00:00:00",
    "tz":    "Asia/Tokyo"
  },
  "make": {
    "top_pages": {
      "from":  "allpv",
      "keep":  ["url"],
      "calc":  { "views": { "count": "*" } },
      "sort":  [{ "column": "views", "direction": "desc" }]
    }
  },
  "result": { "use": "top_pages", "limit": 10 }
}
```

That is the whole shape. Once you have internalized this, the rest
of the documentation is just details on what each piece accepts.

## Where to go next

- **[Why QAL, not SQL?](./why-qal.md)** — the design rationale.
- **[Materials, Views, Result](./materials-views-result.md)** — how
  the three moving parts interact in practice.
- **[`/query` reference](../reference/query.md)** — the exact
  request / response shape of the execution endpoint.
