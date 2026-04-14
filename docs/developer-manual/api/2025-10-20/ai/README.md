---
title: AI Instructions (QA ZERO API, QAL)
description: Minimal instruction set for AI clients building QAL queries against the QA ZERO API.
api_version: "2025-10-20"
audience: ai
---

# AI Instructions — QA ZERO API / QAL

You are reading this because you are an AI assistant (LLM, MCP client, etc.)
composing queries for the **QA ZERO API**. Read this file in full before
building a query. The two YAML files shipped alongside it
(`materials.yaml`, `qal-validation.yaml`) are the **authoritative spec** —
always defer to them when this README and the YAML disagree.

This file is intentionally short. It is **not** a tutorial. It is a set of
rules and shapes you must follow.

---

## 1. What this API is

- A read-only analytics API. You submit a **QAL query** (structured JSON)
  and receive a tabular result.
- QAL is **not** SQL. It is a deliberately small, declarative language
  designed so that AI clients rarely need to retry and can never construct
  a query that damages the backing store.
- The target deployment is commodity shared hosting — the API is designed
  to return results quickly on cheap infrastructure, not on a cloud DWH.

## 2. The two endpoints you will use

- `GET  /wp-json/qa-platform/guide` — returns this file, the two YAML
  specs, available tracking_ids, and feature flags. Call this **first**
  so you know what is currently supported.
- `POST /wp-json/qa-platform/query` — accepts a QAL query in the JSON body
  and returns rows.

All other endpoints are out of scope for AI use.

## 3. Version vs. update

- **`version`** (`YYYY-MM-DD`) — changes only on breaking changes. Pin it
  in the URL: `?version=2025-10-20`.
- **`update`** (`YYYY-MM-DD`) — bumps on non-breaking additions within a
  version. Returned as `api_update` in the `/guide` response.
- Each feature or field may carry a `since: YYYY-MM-DD` tag. If
  `since > client.known_update`, assume the feature may not exist on the
  server you are talking to; **fall back**, do not error.

## 4. QAL shape (minimum viable query)

A valid QAL query always contains these top-level keys:

- `tracking_id` — a site identifier returned by `/guide`.
- `materials` — list of materials you intend to read from.
- `time` — `{ start, end, tz }`. `start`/`end` are ISO-8601; `tz` is an
  IANA timezone (e.g. `Asia/Tokyo`).
- `make` — map of named views. Each view has `from` (a material) and
  `keep` (columns to select). Optional: `filter`, `join`, `add`/`calc`,
  `sort`.
- `result` — which view to return and how. Supports `use`, `limit`, and
  `count_only`.

Any other top-level key is a mistake. The validator will reject it.

## 5. Rules you must follow

1. **Always call `/guide` before your first `/query`.** Do not guess the
   tracking_id, materials, or feature support.
2. **Never invent columns.** Only use columns that appear under the
   target material in `materials.yaml`. If the user asks for a column
   that does not exist, say so rather than fabricating one.
3. **Always set `time`.** There is no default time range. Queries without
   `time` are rejected.
4. **Always set `result.use`.** It must reference a view you defined in
   `make`. Undefined view references return `E_UNKNOWN_VIEW`.
5. **Always set `result.limit` unless `count_only: true`.** This is how
   you keep execution cost predictable.
6. **Never set two views with the same name.** View names must be unique
   within `make`.
7. **Never request features whose `enabled` is `false`.** Check the
   `features_detail` map in `/guide`. Asking for a disabled feature is a
   client bug, not a server bug.
8. **If something fails, re-read `/guide`.** The rules may have shifted
   between your cached knowledge and the live deployment.

## 6. Picking a material

Use `materials.yaml` as the source of truth. For quick orientation:

- `allpv` — one row per page view. Start here when the user asks about
  traffic, sessions, referrers, devices, or page popularity.
- `click_event` — one row per recorded click. Use for click-through
  rates, rage clicks, or element-level interest.
- `gsc` — Google Search Console data. Use for search queries,
  impressions, and CTR from organic search.
- `goal_N` — conversion/goal events configured per site. Use when the
  user asks about conversion rates or funnels.
- `page_version` — page version metadata. Use when slicing by content
  changes or A/B.
- `datalayer_event` — custom dataLayer events. Use only when the user
  explicitly mentions a dataLayer event name.

The full list and the columns each material exposes live in
`materials.yaml`. Consult it before emitting a query.

## 7. JOIN rules

- Only the keys listed in `materials.yaml` under a material's `join`
  section can be used as JOIN keys.
- A single view may JOIN at most one additional material on top of its
  `from` source. Do not chain multiple joins in one view — build a
  separate view in `make` and chain views via `view_chaining` instead.
- `pv_id` is the canonical JOIN key between `allpv` and `click_event`.
- `session_id` is the canonical JOIN key when aggregating per-session
  metrics across materials.
- `page_id` is the canonical JOIN key when correlating with
  `page_version`.

Any other ID-looking field exists for future use or for internal
bookkeeping. **If you are tempted to JOIN on a column not listed in
`materials.yaml` `join:`, stop.**

## 8. Filter, calc, sort — the safe surface

- `filter` accepts a flat object of `{column: value}` or
  `{column: {op: value}}`. No free-form SQL. No raw expressions.
- `calc` supports a whitelisted set of functions. Check
  `qal-validation.yaml` for the current list. Do not invent function
  names.
- `sort` takes a list of `{column, direction}` entries. Direction is
  `asc` or `desc`, nothing else.
- `result.limit` caps row count. `result.count_only: true` returns only
  a scalar count and ignores `limit`.

## 9. What **not** to do

- Do not try to write SQL. There is no SQL layer exposed.
- Do not fetch data through any URL not listed in §2.
- Do not hardcode a column list from memory. The authoritative column
  list is `materials.yaml`, and it can change between updates.
- Do not try to bypass `time`. "All-time" queries are intentionally
  unavailable because they are usually a mistake.
- Do not assume a feature exists because it was enabled in a previous
  version. Re-check `features_detail` each session.
- Do not translate user intent directly to a query without first
  verifying the target material exists.

## 10. If you are unsure

Prefer to **ask the user** over guessing. One well-formed question to
the user is cheaper than three rejected queries. This API is designed
so that correct-by-construction queries are easy to write — if you find
yourself fighting the shape, you have probably picked the wrong
material.
