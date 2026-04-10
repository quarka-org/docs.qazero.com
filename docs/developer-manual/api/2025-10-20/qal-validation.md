---
id: qal-validation-2025-10-20
title: QAL Validation Manifest
sidebar_position: 5
version: "2025-10-20"
update: "2026-04-10"
type: validation_manifest
description: >
  Defines strict validation rules for QAL JSON execution requests.
  This frontmatter is parsed by QAL_Executor (PHP) for runtime validation
  and mirrored in the body for AI models and other HTTP consumers.
structure:
  required: ["tracking_id", "materials", "time", "make", "result"]
rules:
  tracking_id:
    type: string
    description: "Unique identifier for the tracking site to query. Must match a tracking_id from the /guide endpoint response."
    pattern: "^[a-zA-Z0-9_-]+$"
    errors:
      - code: E_UNKNOWN_TRACKING_ID
        message: "Invalid tracking_id provided."

  materials:
    type: array
    description: "List of data sources (materials) to use in the query. Each material must have a 'name' property."
    items:
      type: object
      required: ["name"]
      properties:
        name:
          type: string
          description: "Material name. Allowed values: 'allpv', 'gsc', 'ga4_age_gender', 'ga4_country', 'ga4_region', 'goal_N' (N>=1), 'click_event', 'datalayer_event', 'page_version', or 'events.{name}'."
          pattern: "^(allpv|gsc|ga4_age_gender|ga4_country|ga4_region|goal_[1-9]\\d*|click_event|datalayer_event|page_version|events\\.[a-zA-Z0-9_]+)$"
      additionalProperties: false
    minItems: 1
    errors:
      - code: E_UNKNOWN_MATERIAL
        message: "Material name not found in manifest."

  time:
    type: object
    required: ["start", "end", "tz"]
    properties:
      start: { type: string, format: date-time }
      end: { type: string, format: date-time }
      tz:
        type: string
        description: "IANA timezone identifier. Any valid IANA zone is accepted."
        examples: ["Asia/Tokyo", "UTC", "Europe/London", "America/New_York", "America/Los_Angeles", "Europe/Paris"]
    errors:
      - code: E_TIME_REQUIRED
        message: "Missing time.start, time.end, or time.tz."

  make:
    type: object
    description: "Defines views (data transformations) to create from materials. Each key is a view name."
    patternProperties:
      "^[a-zA-Z0-9_]+$":
        type: object
        description: >
          View definition. Must specify 'from' (source material or previously defined view)
          and 'keep' (columns to select). Optionally specify 'filter' for row filtering,
          'join' for combining materials, and 'add'/'calc' for aggregation.
        required: ["from", "keep"]
        properties:
          from:
            type: array
            description: "Exactly one element: a material name or a view name previously defined in this make block."
            items:
              type: string
              pattern: "^(allpv|gsc|ga4_age_gender|ga4_country|ga4_region|goal_[1-9]\\d*|click_event|datalayer_event|page_version|events\\.[a-zA-Z0-9_]+|[a-zA-Z0-9_]+)$"
            minItems: 1
            maxItems: 1
          keep:
            type: array
            description: >
              List of columns to include. Must use fully qualified names in the format
              'material.column' or 'view.column'. Empty array is allowed when 'calc' is
              present (global aggregation pattern).
            items:
              type: string
              pattern: "^[a-zA-Z0-9_\\.]+\\.[a-zA-Z0-9_]+$"
            minItems: 0
          filter:
            type: object
            description: >
              Filter conditions to apply to rows from the 'from' source. Keys are plain
              (unqualified) column names. Values are either an array (implicit IN) or an
              object keyed by an operator. Multiple keys combine with implicit AND.
              Filtering a view that uses another view as 'from' is not allowed
              (E_FILTER_ON_VIEW_CHAIN).
            additionalProperties:
              oneOf:
                - type: array
                  items: { type: ["string", "number", "boolean"] }
                - type: object
                  propertyNames:
                    enum: [eq, neq, gt, gte, lt, lte, in, contains, prefix, between]
          join:
            type: object
            description: >
              One equi-join per view (arrays of joins are forbidden). 'with' is the right-side
              material or view, 'on' is an array of {left, right} fully qualified column pairs.
              Only integer id columns may be joined. M:N target materials (e.g. gsc) require
              a filter on the target side (E_JOIN_FILTER_REQUIRED).
            required: ["with", "on"]
            properties:
              with: { type: string }
              on:
                type: array
                minItems: 1
                items:
                  type: object
                  required: ["left", "right"]
                  properties:
                    left: { type: string, description: "Fully qualified column from the left (from) source." }
                    right: { type: string, description: "Fully qualified column from the 'with' material/view." }
              "if not match":
                type: string
                enum: ["keep-left", "drop"]
                description: "Unmatched-row behavior. Default: keep-left (LEFT OUTER)."
              fill:
                description: "Default value for unmatched right-side columns when 'if not match' is 'keep-left'. Default: null."
          add:
            type: array
            description: "Optional list of calc result column names. Must exactly match calc keys when specified; auto-derived from calc when omitted."
            items: { type: string }
          calc:
            type: object
            description: >
              Aggregation expressions. Keys are result column names; values must match
              ^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\\([A-Za-z_][\\w]*\\.[A-Za-z_][\\w]*\\)$.
              The column referenced need not appear in 'keep'.
            additionalProperties:
              type: string
              pattern: "^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\\([A-Za-z_][\\w]*\\.[A-Za-z_][\\w]*\\)$"
        additionalProperties: false
    errors:
      - code: E_UNKNOWN_COLUMN
        message: "Invalid column name in keep list."

  result:
    type: object
    description: "Specifies which view to return and how to format the result."
    required: ["use"]
    properties:
      use:
        type: string
        description: "Name of the view (defined in 'make') to return."
      limit:
        type: integer
        description: "Max rows returned. Default: 1000, hard cap: 50000."
        minimum: 1
        maximum: 50000
        default: 1000
      count_only:
        type: boolean
        description: "If true, return only { count: N } instead of rows."
        default: false
      include_count:
        type: boolean
        description: "If true, meta.filtered_rows carries the pre-sample hit count."
        default: false
      sort:
        type: array
        description: "Sort specifications applied at the result stage."
        items:
          type: object
          required: ["by", "dir"]
          properties:
            by:  { type: string }
            dir: { type: string, enum: ["asc", "desc"] }
      sample:
        type: object
        description: "Sampling when the view exceeds max_rows."
        required: ["max_rows", "method"]
        properties:
          max_rows: { type: integer, minimum: 1 }
          method:   { type: string, enum: ["head", "random", "hashmod"] }
      return:
        type: object
        description: "Output shape. Only INLINE+JSON is fully supported in this version."
        properties:
          mode:   { type: string, enum: ["INLINE", "FILE"] }
          format: { type: string, enum: ["JSON", "CSV", "PARQUET"] }
    additionalProperties: false
    errors:
      - code: E_UNKNOWN_VIEW
        message: "Result.use does not match any defined view in make."
      - code: E_RESULT_FORBIDDEN_KEY
        message: "Result contains a non-whitelisted key."

features:
  filter: true
  join: true
  calc: true
  sort: true
  sample: true
  view_chaining: true
  return_file_csv: false
  return_file_parquet: false
---

# QAL Validation Manifest — AI Accessible Version

This document defines **the exact schema that every QAL JSON must follow**.
The YAML frontmatter section is used by the PHP executor for validation. The body below duplicates this information for AI models and other tools reading via HTTP.

---

## Overview

**Purpose:** Single source of truth for QAL validation rules
**Version:** 2025-10-20
**Type:** validation_manifest
**Audience:** QAL Executor (PHP), AI Models (ChatGPT, Claude, MCP), Human Documentation

The authoritative copy lives in the repository at `src/core/yaml/qal-validation-2025-10-20.yaml` and is mirrored here whenever the plugin ships a documentation update.

---

## For AI Models (ChatGPT, Claude, MCP)

**You are a QAL Generator.**

Your job is to produce valid QAL JSON that conforms to the schema above. Follow these rules:

1. **Always include all required top-level keys:** `tracking_id`, `materials`, `time`, `make`, `result`.
2. **Materials:** Use only names allowed by the `materials[].name` pattern (`allpv`, `gsc`, `ga4_age_gender`, `ga4_country`, `ga4_region`, `goal_N`, `click_event`, `datalayer_event`, `page_version`, `events.{name}`).
3. **Time:** `start` / `end` / `tz` are all required. `tz` must be a full IANA identifier such as `Asia/Tokyo` — never abbreviations like `JST`.
4. **make views:**
   - `from` is an array of **exactly one** element. That element may be a material name or another view defined earlier in the same `make` block (view chaining).
   - `keep` uses fully qualified names (`material.column` or `view.column`). When `calc` is present, `keep` may be empty (global aggregation).
   - `filter` keys are **plain column names** (unqualified). Values are either an array (IN) or `{ <op>: <value> }`. Multiple keys combine with AND; there is no OR form yet. **Do not use filter when `from` references another view** — filter in the upstream view.
   - `join` is a single object (arrays forbidden). `on[]` uses fully qualified names on both sides. Only integer id columns may be joined. If the join target is an M:N material (e.g. `gsc`), the view must carry a filter on a target column.
   - `calc` values must match the strict regex `^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\(<qualified>\)$`. `COUNT(*)` is forbidden.
5. **result:** Only the whitelisted keys (`use`, `limit`, `count_only`, `include_count`, `sort`, `sample`, `return`) are allowed. Unknown keys raise `E_RESULT_FORBIDDEN_KEY`.
6. **No aliasing.** Never add `as` fields to `materials[]` or `make.<view>` — it raises `E_ALIAS_FORBIDDEN`.

### Features enabled in this version

- ✅ `filter` (flat form, AND-only)
- ✅ `join` (single equi-join, id-column only)
- ✅ `calc` (whitelisted single-column aggregates)
- ✅ view chaining (`from: ["<previous_view>"]`)
- ✅ `result.sort`, `result.sample`, `result.include_count`
- ⚠️ `return.mode = "FILE"` and non-JSON formats are declared in the schema but not fully supported yet — use `INLINE` / `JSON`.

---

## Error Codes Reference

| Code | Field | Cause |
|------|-------|-------|
| `E_UNKNOWN_TRACKING_ID` | `tracking_id` | Not a known site |
| `E_UNKNOWN_MATERIAL` | `materials[]` / `from[]` | Name not in manifest |
| `E_UNKNOWN_VIEW` | `from[]` / `result.use` | View not defined |
| `E_UNKNOWN_COLUMN` | `keep` / `filter` / `calc` / `join.on` | Column not in material schema |
| `E_ALIAS_FORBIDDEN` | `materials` / `make` | `as` used |
| `E_TIME_REQUIRED` | `time` | Missing `start`/`end`/`tz` |
| `E_FILTER_INVALID` | `filter` | Malformed or over-nested |
| `E_FILTER_ON_VIEW_CHAIN` | `filter` | `filter` used when `from` is a view |
| `E_INVALID_JOIN` | `join` | Missing `with`/`on`, non-qualified, non-equi |
| `E_JOIN_MULTIPLE_FORBIDDEN` | `join` | Array or multiple joins |
| `E_JOIN_FILTER_REQUIRED` | `join` | M:N target has no filter |
| `E_RESULT_UNKNOWN_VIEW` | `result.use` | View not in `make` |
| `E_RESULT_FORBIDDEN_KEY` | `result` | Non-whitelisted key |
| `E_KEEP_EXPR_FORBIDDEN` | `keep` | Non-column expression |
| `E_ADD_NOT_SUBSET_OF_CALC` | `add` | Explicit `add` lists an unknown metric |
| `E_CALC_NOT_SUBSET_OF_ADD` | `calc` | Explicit `add` is missing calc keys |

---

## Complete Valid Example

```json
{
  "tracking_id": "abc123",
  "materials": [
    { "name": "allpv" },
    { "name": "gsc" }
  ],
  "time": {
    "start": "2026-03-01T00:00:00",
    "end":   "2026-04-01T00:00:00",
    "tz":    "Asia/Tokyo"
  },
  "make": {
    "blog_pvs": {
      "from":   ["allpv"],
      "filter": { "url": { "prefix": "/blog" }, "device_type": ["SP"] },
      "keep":   ["allpv.url", "allpv.reader_id", "allpv.pv_id", "allpv.browse_sec"]
    },
    "blog_by_url": {
      "from": ["blog_pvs"],
      "keep": ["blog_pvs.url"],
      "calc": {
        "pv":        "COUNT(blog_pvs.pv_id)",
        "uniq_user": "COUNTUNIQUE(blog_pvs.reader_id)",
        "avg_dwell": "AVERAGE(blog_pvs.browse_sec)"
      }
    }
  },
  "result": {
    "use": "blog_by_url",
    "sort": [{ "by": "pv", "dir": "desc" }],
    "limit": 100,
    "include_count": true
  }
}
```

---

## Related Documentation

- **[QAL Guide](./qal.md)** — Syntax walkthrough with examples
- **[Materials Reference](./materials.md)** — Column catalogue
- **[Endpoints](./endpoints.md)** — HTTP surface
- **[Getting Started](./index.md)** — Overview

---

**Last Updated:** 2026-04-10
**API Version:** 2025-10-20
**Manifest ID:** qal-validation-2025-10-20
