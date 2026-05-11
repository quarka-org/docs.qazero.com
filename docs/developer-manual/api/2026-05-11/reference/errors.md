---
id: reference-errors-2026-05-11
title: Errors
sidebar_position: 5
---

# Errors

Every error response has the same shape:

```json
{
  "ok": false,
  "error": {
    "code": "E_UNKNOWN_MATERIAL",
    "message": "Material 'allpvs' not found in manifest.",
    "at": "materials[0].name"
  }
}
```

- **`code`** — a stable, machine-readable error code. Clients
  should branch on this, not on `message`.
- **`message`** — a human-readable explanation. The wording can
  change between releases.
- **`at`** — a JSON-pointer-ish path into the request body showing
  where the offending value lives. Optional; present when the
  error is tied to a specific field.

## Canonical error codes

### Authentication / authorization

| HTTP | Code                | When                                                  |
|-----:|---------------------|-------------------------------------------------------|
|  401 | `E_UNAUTHORIZED`    | Missing or invalid `Authorization` header.            |
|  403 | `E_FORBIDDEN`       | Auth succeeded but the user cannot access this tracking_id. |

### Request structure

| HTTP | Code                  | When                                                |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_INVALID_JSON`      | Body did not parse as JSON.                         |
|  400 | `E_MISSING_FIELD`     | A required top-level field is absent.               |
|  400 | `E_UNKNOWN_FIELD`     | An unrecognized top-level key appeared.             |
|  400 | `E_TIME_REQUIRED`     | `time.start`, `time.end`, or `time.tz` is missing.  |
|  400 | `E_INVALID_TZ`        | `time.tz` is not a valid IANA timezone.             |
|  400 | `E_INVALID_TIME_RANGE`| `time.end <= time.start`, or the range is implausible. |

### Materials, views, result

| HTTP | Code                  | When                                                |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_UNKNOWN_MATERIAL`  | A material name is not in the manifest.             |
|  400 | `E_UNKNOWN_VIEW`      | `result.use` does not reference a view defined in `make`. |
|  400 | `E_UNKNOWN_COLUMN`    | A `keep`, `filter`, or `sort` entry references a column not in the target material. |
|  400 | `E_DUPLICATE_VIEW`    | Two views in `make` share a name.                   |
|  400 | `E_LIMIT_REQUIRED`    | `result.limit` is missing and `count_only` is not set. |

### Features

| HTTP | Code                   | When                                               |
|-----:|------------------------|----------------------------------------------------|
|  400 | `E_FEATURE_DISABLED`   | The request uses a feature whose `enabled` is `false` on this server. |
|  400 | `E_FEATURE_NOT_AVAILABLE` | The feature exists but the server's `api_update` is older than the feature's `since`. |

### Calc validation (2026-05-11+)

| HTTP | Code                       | When                                                |
|-----:|----------------------------|-----------------------------------------------------|
|  400 | `E_CALC_COLUMN_UNRESOLVED` | A `material.column` reference inside `calc` cannot be resolved against the view's scope: either the material is not in `from` or `join.with`, or the column does not exist in that material's schema. **Since:** 2026-05-11. View-chain views (where `from[0]` is a previously defined view) are intentionally excluded from this check and fall back to the Material-runtime path. |

`E_CALC_COLUMN_UNRESOLVED` replaces what used to be a silent zero-row
result under the predecessor `2025-10-20` version. It is intentionally
loud so AI clients receive a clean repair signal instead of accepting
a wrong-but-successful response.

Example:

```json
{
  "ok": false,
  "error": {
    "code": "E_CALC_COLUMN_UNRESOLVED",
    "message": "calc references 'click_event.pv_id', but 'click_event' is not in this view's from or join.with scope.",
    "at": "make.top_clicks.calc.clicks"
  }
}
```

### JOIN validation

| HTTP | Code                  | When                                                |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_INVALID_JOIN`      | `join` structure is malformed, not fully qualified, non-equi, or `on.left` / `on.right` does not resolve to the correct side of the join. **Since 2026-05-11 (originally 2026-05-10 on 2025-10-20)** error responses include structured `details` to identify which side failed. |
|  400 | `E_BAD_JOIN`          | JOIN attempted on a column that is not a declared join key. |
|  400 | `E_CARDINALITY_GUARD` | A JOIN would explode row count beyond the safety threshold (e.g. unfiltered `gsc` ↔ `allpv`). |

`E_INVALID_JOIN` `details` fields (since 2026-05-11):

| Field             | Type   | Meaning                                                                                                                                       |
|-------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `side`            | string | `"left"` if the offending value is in `on.left`, `"right"` if in `on.right`.                                                                  |
| `received_value`  | string | The literal value the request passed (e.g. `"click_event.pv_id"` or `"top_pages.pv_id"`).                                                     |
| `expected_prefix` | string | The prefix the validator expected on this side. For `on.left` this is the resolved physical material name of the `from` side (with view chains pre-resolved). For `on.right` it is the `join.with` string verbatim. |
| `hint`            | string | A human-readable repair suggestion (e.g. *"use 'allpv.pv_id' — view-name prefixes are not accepted on on.left"*).                             |

`on.left` must equal the resolved physical material name of the `from`
side, **even when `from[0]` is a view chain** — the validator resolves
the view back to its source material name before comparison. Bare
view-name prefixes on `on.left` are rejected. `on.right` must equal
the `join.with` string verbatim.

Example:

```json
{
  "ok": false,
  "error": {
    "code": "E_INVALID_JOIN",
    "message": "join.on.left must reference the from material, not a view name",
    "at": "make.top_clicks.join.on[0].left",
    "details": {
      "side": "left",
      "received_value": "top_pages.pv_id",
      "expected_prefix": "allpv",
      "hint": "Replace 'top_pages.pv_id' with 'allpv.pv_id'. on.left always uses the physical material name; the view chain is resolved by the validator before comparison."
    }
  }
}
```

### Execution

| HTTP | Code                  | When                                                |
|-----:|-----------------------|-----------------------------------------------------|
|  500 | `E_EXECUTOR_FAILED`   | Internal execution error. Retry with backoff.       |
|  504 | `E_TIMEOUT`           | Query exceeded the server's time budget. Narrow `time`, add filters, or drop expensive JOINs. |

## Retry strategy

- **401/403** — do not retry. Fix credentials.
- **400 (structural)** — do not retry blindly. The client has a
  bug. If an AI client gets a 400, it should re-read `/guide` in
  case the schema moved, then rethink the query.
- **500** — retry once, with jitter.
- **504** — do not retry the same query. Narrow the request.

## Where to go next

- **[`/query` reference](./query.md)** — the request shape error
  codes refer to.
- **[Examples](./examples.md)** — working requests you can use as
  a baseline when debugging.
