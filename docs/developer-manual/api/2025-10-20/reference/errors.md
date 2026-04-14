---
id: reference-errors-2025-10-20
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

### Execution

| HTTP | Code                  | When                                                |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_BAD_JOIN`          | JOIN attempted on a column that is not a declared join key. |
|  400 | `E_CARDINALITY_GUARD` | A JOIN would explode row count beyond the safety threshold (e.g. unfiltered `gsc` ↔ `allpv`). |
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
