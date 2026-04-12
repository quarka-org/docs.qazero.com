---
id: qal-2025-10-20
title: QAL Guide
sidebar_position: 3
last_updated: 2026-04-13
api_update: 2026-04-13
---

# QAL Guide (2025-10-20)

## Overview

**QAL** (Query Abstraction Language) is a lightweight, safety-first query language designed for QA ZERO's column-oriented analytics data. It is *not* a generic SQL dialect — QAL deliberately restricts expression power to make queries predictable, safe, and easy for both humans and AI to author.

**Version:** 2025-10-20

### Design principles

1. **Eliminate ambiguity** — fewer degrees of freedom, more determinism
2. **Predictable for AI and humans** — one obvious way to express each intent
3. **Optimized for access-log–style data** — minimal syntax for the problems that actually matter

### What's supported

Check the server's `/guide` response `features` map for the authoritative list — it reports exactly which features the running plugin implements.

| Feature | Status | Notes |
|---------|--------|-------|
| `materials` | ✅ | Declare data sources (no aliasing) |
| `time` | ✅ | Time range with IANA timezone |
| `make.from` | ✅ | Source material or previously-built view |
| `make.filter` | ✅ | Flat-form row filter (AND of per-column conditions) |
| `make.join` | ✅ | One equi-join per view, id-based only |
| `make.keep` | ✅ | Column projection / group keys |
| `make.calc` | ✅ | Aggregation (whitelisted functions) |
| `make.add` | ✅ | Optional explicit calc key list |
| `make.sort` | ✅ **Since:** 2026-04-13 | Sort rows and optionally keep only the top N |
| View chaining (`from: ["other_view"]`) | ✅ | Compose views with in-memory keep/calc/join |
| `result.use` / `limit` / `count_only` | ✅ | |
| Virtual columns (`position_weighted`, `is_goal_N`, …) | ✅ | Computed at material/executor layer |

**Not yet supported (explicit list):**
- `result.sample` / `result.include_count` / `result.return` — not accepted by the current `result` whitelist. Use `make.sort` + `limit` / `count_only` instead
- `OR` logic across filter conditions (flat filters are implicit `AND`)
- HAVING-style filters on aggregated results
- Aliasing (`as`) — intentionally forbidden
- Multi-step joins in a single view (one join per view)

---

## Document Structure

Every QAL query has five required top-level keys:

```json
{
  "tracking_id": "abc123",
  "materials": [ /* data sources */ ],
  "time":      { /* time range */ },
  "make":      { /* view definitions */ },
  "result":    { /* result specification */ }
}
```

**Note:** The QAL version is specified in the URL query parameter (`?version=2025-10-20`), not in the body. The request body must wrap the QAL object in a `qal` key when POSTing to `/qa-platform/query`:

```json
{ "qal": { "tracking_id": "...", "materials": [...], ... } }
```

---

## 1. tracking_id (required)

Specifies which tracking site to query. Use a value from `sites[].tracking_id` in the `/guide` endpoint response.

```json
{ "tracking_id": "abc123" }
```

**Rules:**
- Must match a `tracking_id` known to this plugin installation
- Determines which site's data and available materials apply
- `E_UNKNOWN_TRACKING_ID` is returned when unknown

---

## 2. materials (required)

Declare the data sources the view will consume.

```json
{
  "materials": [
    { "name": "allpv" },
    { "name": "gsc" }
  ]
}
```

**Rules:**
- Each entry must have a `name`
- Names are exact and case-sensitive
- **Aliasing (`as`) is forbidden** — `E_ALIAS_FORBIDDEN`
- Multiple materials may be declared even if only one is used

**Available material names (2025-10-20):**

`allpv`, `gsc`, `goal_1`..`goal_N`, `ga4_age_gender`, `ga4_country`, `ga4_region`, `page_version`, `click_event`, `datalayer_event`, `events.{name}`

See [Materials Reference](./materials.md) for full column listings.

---

## 3. time (required)

```json
{
  "time": {
    "start": "2026-03-01T00:00:00",
    "end":   "2026-04-01T00:00:00",
    "tz":    "Asia/Tokyo"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `start` | string | Yes | ISO 8601 local time (inclusive) |
| `end` | string | Yes | ISO 8601 local time (exclusive) |
| `tz` | string | Yes | IANA timezone identifier |

Time range is interpreted as `[start, end)`. Each material maps this range to its own physical time column.

---

## 4. make (required)

`make` is an object whose keys are view names. Each view is the unit of execution — a single block that selects a source, optionally filters and joins, projects columns, and optionally aggregates.

```json
{
  "make": {
    "<view_name>": {
      "from":   ["<material_or_view>"],
      "filter": { /* §4.1 */ },
      "join":   { /* §4.2 */ },
      "keep":   ["material.column", "..."],
      "calc":   { /* §4.3 */ },
      "add":    ["metric_a", "metric_b"],
      "sort":   { /* §4.7 */ },
      "x-label": "optional annotation"
    }
  }
}
```

### from (required)

```json
{ "from": ["allpv"] }
```

- Array of exactly one element
- Either a material name declared in `materials`, or a previously-defined view name in the same `make` block (**view chaining**)
- `E_UNKNOWN_MATERIAL` / `E_UNKNOWN_VIEW` on mismatch

### keep (required)

```json
{ "keep": ["allpv.url", "allpv.access_time"] }
```

- **Fully qualified names required** (`<material_or_view>.<column>`)
- At least one entry — **unless** `calc` is present, in which case an empty `keep` means "aggregate everything into a single row" (global aggregation)
- With `calc`, `keep` is also the **group-by key**
- Unknown columns raise `E_UNKNOWN_COLUMN`

---

### 4.1 filter (optional)

`filter` applies a row filter to the `from` source **before** join and aggregation.

```json
{
  "filter": {
    "device_type":  ["SP", "PC"],
    "country_code": ["JP"],
    "url":          { "prefix": "/blog" },
    "browse_sec":   { "gte": 30 }
  }
}
```

- **Keys are plain (unqualified) column names** belonging to the `from` material. Write `device_type`, not `allpv.device_type`.
- **Values** may be:
  - An **array** — implicit `IN` (any of the listed values matches)
  - An **operator object** — `{ "<op>": <value> }`
- **Multiple keys are combined with implicit AND.** `OR` across different columns is not yet supported.

**Supported operators** (per Storage layer):

| Operator | Meaning | Example value |
|----------|---------|---------------|
| `eq` | Equal | `"PC"` |
| `neq` | Not equal | `"bot"` |
| `gt` / `gte` | Greater than / or equal | `100` |
| `lt` / `lte` | Less than / or equal | `1000` |
| `in` | One of | `["a", "b"]` |
| `contains` | Substring | `"blog"` |
| `prefix` | Prefix match | `"/blog"` |
| `between` | Inclusive range | `[100, 500]` |

**Column name — enum values — type compatibility** must all agree. For example, `device_type` only accepts `"PC"`, `"SP"`, `"tablet"` (case-sensitive); see the [Materials Reference](./materials.md) `search_hint` notes for each column.

**view chaining + filter:** When `from` references another view (not a material), `filter` is **not allowed** (`E_FILTER_ON_VIEW_CHAIN`). Put the filter in the upstream view instead.

---

### 4.2 join (optional)

```json
{
  "join": {
    "with": "gsc",
    "on":   [ { "left": "allpv.page_id", "right": "gsc.page_id" } ],
    "if not match": "keep-left",
    "fill": null
  }
}
```

- **One join per view** — arrays of joins are forbidden (`E_JOIN_MULTIPLE_FORBIDDEN`)
- `on` entries must use **fully qualified** column names on both sides
- **Equi-join only**; no range or function joins
- **Id-column only** (integer keys like `page_id`, `pv_id`, `reader_id`, `version_id`, …). String-column joins are not supported in this version
- `if not match`:
  - `"keep-left"` (default) → LEFT OUTER JOIN, fill missing right-side values with `fill` (default `null`)
  - `"drop"` → INNER JOIN

**M:N join filter requirement (T45):** If the target material's manifest declares `cardinality: "N:M"` (for example, `gsc`), the view **must** include a `filter` on the M:N side — otherwise row counts explode. Violations raise `E_JOIN_FILTER_REQUIRED`.

Example — M:N join against `gsc`, filtered on `keyword`:

```json
{
  "materials": [{"name":"allpv"}, {"name":"gsc"}],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "pv_with_kw": {
      "from":   ["allpv"],
      "filter": { "url": { "prefix": "/blog" } },
      "join":   {
        "with": "gsc",
        "on":   [{"left":"allpv.page_id","right":"gsc.page_id"}]
      },
      "keep":   ["allpv.url", "gsc.keyword", "gsc.clicks", "gsc.impressions"]
    }
  },
  "result": { "use": "pv_with_kw", "limit": 1000 }
}
```

Note: this example will be rejected because `gsc` has no filter. Add `"filter": { "keyword": { "contains": "..." } }` on a view over `gsc` first, then join.

---

### 4.3 calc (optional aggregation)

When `calc` is present, the view aggregates by `keep` (which becomes the group key) and returns **`keep` + `calc`** columns only.

```json
{
  "keep": ["allpv.url"],
  "calc": {
    "sessions":  "COUNTUNIQUE(allpv.reader_id)",
    "pageviews": "COUNT(allpv.pv_id)",
    "avg_dwell": "AVERAGE(allpv.browse_sec)"
  }
}
```

**Whitelisted functions (strict single-column syntax):**

- `COUNT(<col>)`
- `COUNTUNIQUE(<col>)`
- `SUM(<col>)`
- `AVERAGE(<col>)`
- `MIN(<col>)`
- `MAX(<col>)`

**Rules:**
- Arguments must be a single fully-qualified column reference — no expressions, nesting, arithmetic, or conditions
- **`COUNT(*)` is not allowed** — name an actual column
- The column referenced by `calc` does not need to appear in `keep`; it will be loaded automatically during the filter step
- Empty `keep` + `calc` = global aggregation (1 row)
- Values must match the regex `^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\([A-Za-z_][\w]*\.[A-Za-z_][\w]*\)$`

### 4.4 add (optional)

```json
{ "add": ["sessions", "pageviews", "avg_dwell"] }
```

- May be **omitted**; when omitted, it is auto-derived from the keys of `calc`
- When explicit, the set must exactly match `calc`'s keys, otherwise:
  - `E_ADD_NOT_SUBSET_OF_CALC` — `add` lists an unknown metric
  - `E_CALC_NOT_SUBSET_OF_ADD` — `calc` has keys not listed in `add`

### 4.5 Virtual columns

Some columns are not stored physically — the material layer computes them on the fly:

- `allpv.is_goal_1` .. `allpv.is_goal_10` — per-PV goal achievement flag (filter `eq:1` supported)
- `gsc.ctr` — `clicks / impressions`
- `gsc.position` — weighted-average position (float)
- `gsc.position_weighted` — `position × impressions` (used as an intermediate for weighted averages in `calc`)

Virtual columns are used just like physical ones in `keep`, `filter`, and `calc`. See [Materials Reference](./materials.md) for the full catalogue.

### 4.6 View chaining

`from` may reference another view in the same `make` block:

```json
{
  "make": {
    "pv_mobile": {
      "from": ["allpv"],
      "filter": { "device_type": ["SP"] },
      "keep": ["allpv.url", "allpv.browse_sec"]
    },
    "pv_mobile_slow": {
      "from": ["pv_mobile"],
      "keep": ["pv_mobile.url"],
      "calc": { "slow_count": "COUNT(pv_mobile.url)" }
    }
  },
  "result": { "use": "pv_mobile_slow" }
}
```

In chained views, `keep`, `calc`, and `join` operate on the in-memory rows produced by the upstream view. `filter` is **not** allowed on a chained `from` — filter upstream instead.

### 4.7 sort (optional)

**Since:** 2026-04-13

Sort the view's rows and, optionally, keep only the top N. `sort` is applied **after** `filter` / `join` / `keep` / `calc`, so the sort key must be a column that actually exists in the view's output (one of `keep` or a `calc`/`add` metric).

```json
{
  "sort": {
    "by":    "pageviews",
    "order": "desc",
    "top":   10
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `by` | string | Yes | Column to sort by. Either qualified (`allpv.url`, `click_event.click_count`) or unqualified (`pageviews`). Must exist in `keep` or a `calc`/`add` metric of this view. |
| `order` | string | Yes | `"asc"` or `"desc"` |
| `top` | int | No | Return only the first N rows after sorting. Omit to return every row. |

**Rules and notes:**

- Sort is per-view — each view in `make` can have its own `sort`. The final `result.limit` still applies after `top`, so use `top` when you want a semantic "top N" and `limit` only as a row-count safety cap.
- `by` resolution tries qualified names first, then unqualified. Ambiguous unqualified names raise a validation error — prefer qualified names when you have joins.
- `null` values sort last in `desc` and first in `asc` (stable across runs).
- Sorting a view that is referenced by another view via chaining is allowed — the downstream view sees the sorted rows in order, but if it aggregates (`calc`) the sort order of its *own* output is independent and needs its own `sort`.
- There is no "sort by multiple columns" form in this version. If you need a secondary key, produce the secondary key as a `calc`/`add` column and sort by a composite score (client-side or via an upstream view).

**Example — top 10 URLs by pageviews:**

```json
{
  "make": {
    "by_url": {
      "from": ["allpv"],
      "keep": ["allpv.url"],
      "calc": {
        "pageviews": "COUNT(allpv.pv_id)",
        "sessions":  "COUNTUNIQUE(allpv.reader_id)"
      },
      "sort": { "by": "pageviews", "order": "desc", "top": 10 }
    }
  },
  "result": { "use": "by_url" }
}
```

---

## 5. result (required)

Selects the final view and controls output shape.

```json
{
  "result": {
    "use":        "pv_stats",
    "limit":      1000,
    "count_only": false
  }
}
```

### Currently implemented keys

| Key | Type | Description |
|-----|------|-------------|
| `use` | string | Name of the view (in `make`) to return. Exactly one. |
| `limit` | int | Max rows returned. Default `1000`, hard cap `50000`. |
| `count_only` | bool | When `true`, returns `{ "count": N }` only — no data. |

Only the whitelisted keys above are allowed — any other key triggers `E_RESULT_FORBIDDEN_KEY`.

### Sorting — use `make.sort`, not `result.sort`

Sorting is a **view-level** concern in this API. To get ordered results, put a `sort` block inside the view that `result.use` points to (see §4.7). There is intentionally no `result.sort` key — a single QAL query may ask for several views via chaining, and each view owns its own ordering.

### Planned keys (not yet implemented)

The following keys appear in the design spec but are **not accepted by the current `result` whitelist**. They will light up in a future `api_update`; check the `/guide` `features` map before using any of them.

| Key | Status | Planned shape |
|-----|--------|---------------|
| `sample` | 🚧 Not yet accepted | `{ "max_rows": N, "method": "head\|random\|hashmod" }` |
| `include_count` | 🚧 Not yet accepted | `bool` → will populate `meta.filtered_rows` |
| `return` | 🚧 Not yet accepted — responses are always `INLINE` / `JSON` today | `{ "mode": "INLINE\|FILE", "format": "JSON\|CSV\|PARQUET" }` |

---

## 6. Error reference

| Code | Cause |
|------|-------|
| `E_UNKNOWN_TRACKING_ID` | `tracking_id` doesn't match a known site |
| `E_UNKNOWN_MATERIAL` | `materials[].name` or `from[0]` is not a declared material/view |
| `E_UNKNOWN_VIEW` | `from` or `result.use` references a non-existent view |
| `E_UNKNOWN_COLUMN` | Column not found in the material's schema |
| `E_ALIAS_FORBIDDEN` | `as` appears in `materials` or `make` |
| `E_TIME_REQUIRED` | `time.start` / `end` / `tz` missing or invalid |
| `E_FILTER_INVALID` | `filter` syntax is malformed or over-nested |
| `E_FILTER_ON_VIEW_CHAIN` | `filter` on a view that uses another view as `from` |
| `E_INVALID_JOIN` | `join` missing `with`/`on`, non-qualified names, non-equi conditions |
| `E_JOIN_MULTIPLE_FORBIDDEN` | More than one join per view |
| `E_JOIN_FILTER_REQUIRED` | M:N join target has no filter (see §4.2) |
| `E_RESULT_UNKNOWN_VIEW` | `result.use` doesn't match any view |
| `E_RESULT_FORBIDDEN_KEY` | `result` contains a non-whitelisted key |
| `E_KEEP_EXPR_FORBIDDEN` | `keep` contains something other than a column reference |
| `E_ADD_NOT_SUBSET_OF_CALC` | Explicit `add` lists metrics not in `calc` |
| `E_CALC_NOT_SUBSET_OF_ADD` | Explicit `add` is missing keys present in `calc` |

---

## 7. Complete examples

### 7.1 Simple extraction

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "blog_pvs": {
      "from": ["allpv"],
      "filter": { "url": { "contains": "/blog/" } },
      "keep":   ["allpv.pv_id", "allpv.url", "allpv.access_time"],
      "x-label": "Blog pageviews"
    }
  },
  "result": { "use": "blog_pvs", "limit": 100 }
}
```

### 7.2 Aggregation by URL

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "by_url": {
      "from": ["allpv"],
      "keep": ["allpv.url"],
      "calc": {
        "sessions":  "COUNTUNIQUE(allpv.reader_id)",
        "pageviews": "COUNT(allpv.pv_id)",
        "avg_dwell": "AVERAGE(allpv.browse_sec)"
      }
    }
  },
  "result": {
    "use": "by_url",
    "limit": 100
  }
}
```

> To return, say, the top 10 URLs by `sessions`, add `"sort": { "by": "sessions", "order": "desc", "top": 10 }` to the `by_url` view (see §4.7).

### 7.3 Global aggregate (one row)

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "totals": {
      "from": ["allpv"],
      "keep": [],
      "calc": {
        "sessions":  "COUNTUNIQUE(allpv.reader_id)",
        "pageviews": "COUNT(allpv.pv_id)"
      }
    }
  },
  "result": { "use": "totals" }
}
```

### 7.4 Goal conversions (virtual column)

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "goal1_cvrs": {
      "from":   ["allpv"],
      "filter": { "is_goal_1": { "eq": 1 } },
      "keep":   ["allpv.url"],
      "calc":   { "conversions": "COUNT(allpv.pv_id)" }
    }
  },
  "result": {
    "use": "goal1_cvrs",
    "limit": 50
  }
}
```

### 7.5 GSC keyword performance (filter + weighted position)

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "gsc" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "kw_perf": {
      "from":   ["gsc"],
      "filter": { "keyword": { "contains": "qa" } },
      "keep":   ["gsc.keyword"],
      "calc": {
        "clicks":           "SUM(gsc.clicks)",
        "impressions":      "SUM(gsc.impressions)",
        "position_weighted":"SUM(gsc.position_weighted)"
      }
    }
  },
  "result": {
    "use": "kw_perf",
    "limit": 100
  }
}
```

Compute a weighted average position client-side as `position_weighted / impressions`. To return the top 100 keywords by clicks, add `"sort": { "by": "clicks", "order": "desc", "top": 100 }` to the `kw_perf` view.

### 7.6 View chaining

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "mobile_pvs": {
      "from":   ["allpv"],
      "filter": { "device_type": ["SP"] },
      "keep":   ["allpv.url", "allpv.browse_sec", "allpv.reader_id", "allpv.pv_id"]
    },
    "mobile_by_url": {
      "from": ["mobile_pvs"],
      "keep": ["mobile_pvs.url"],
      "calc": {
        "pv":        "COUNT(mobile_pvs.pv_id)",
        "uniq_user": "COUNTUNIQUE(mobile_pvs.reader_id)",
        "avg_dwell": "AVERAGE(mobile_pvs.browse_sec)"
      }
    }
  },
  "result": {
    "use": "mobile_by_url",
    "limit": 50
  }
}
```

---

## 8. Tips

1. **Filter early.** Apply `filter` in the first view over a material so view chaining downstream is cheap.
2. **Use `count_only` to gauge size.** Before pulling 50k rows, check the count.
3. **Prefer id columns for joins.** String keys are not supported; join on `page_id`, `pv_id`, `reader_id`, etc.
4. **Name views descriptively.** `mobile_slow_pvs` is better than `v1`.
5. **Always filter M:N targets.** `gsc` and similar N:M materials *must* carry a filter on the target side of any join.
6. **Ask `/guide` first.** It reports the site's `tracking_id`, available materials, goal definitions, and system limits.

---

## Next Steps

- **[Materials Reference](./materials.md)** — Every column, every material
- **[QAL Validation Manifest](./qal-validation.md)** — Machine-readable schema
- **[Endpoints](./endpoints.md)** — HTTP surface
- **[Getting Started](./index.md)** — Overview and auth
