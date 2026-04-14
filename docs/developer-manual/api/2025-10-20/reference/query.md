---
id: reference-query-2025-10-20
title: POST /query
sidebar_position: 4
---

# `POST /wp-json/qa-platform/query`

The execution endpoint. Submit a QAL query in the JSON body and
receive rows back.

## Request

```
POST /wp-json/qa-platform/query?version=2025-10-20
Authorization: Basic <base64 user:app_password>
Content-Type: application/json
```

### Query parameters

| Parameter | Type   | Required | Description                             |
|-----------|--------|----------|-----------------------------------------|
| `version` | string | no       | API version. Defaults to server latest. |

### Request body

A valid QAL query. See [Concepts → What is QAL?](../../../concepts/what-is-qal.md)
for the shape, and [`ai/qal-validation.yaml`](../ai/qal-validation.yaml)
for the authoritative validation rules.

Minimal valid body:

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

## Response shape

### Success

```json
{
  "ok": true,
  "version": "2025-10-20",
  "query_time_ms": 412,
  "result": {
    "view": "top_pages",
    "columns": ["url", "views"],
    "rows": [
      ["/blog/coffee-grinders/", 4821],
      ["/recipes/v60/",          3904],
      ["/products/hario-slim/",  2870]
    ],
    "row_count": 3
  }
}
```

| Field                  | Meaning                                                    |
|------------------------|-----------------------------------------------------------|
| `ok`                   | `true` on success, `false` on error.                      |
| `version`              | Version the query was executed against.                    |
| `query_time_ms`        | Server-side execution time.                                |
| `result.view`          | The view returned (matches `result.use` in the request). |
| `result.columns`       | Column names in row-order.                                 |
| `result.rows`          | Array of arrays. One inner array per row, values in the order declared by `columns`. |
| `result.row_count`     | Number of rows returned (may be less than `limit`).       |

### `count_only` variant

If the request had `result.count_only: true`, the response is:

```json
{
  "ok": true,
  "version": "2025-10-20",
  "query_time_ms": 88,
  "result": {
    "view": "top_pages",
    "count": 12483
  }
}
```

No `columns` / `rows`, just a scalar `count`.

### Error

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

See [Errors](./errors.md) for the list of canonical error codes.

## Rules enforced by the validator

These come straight from `ai/qal-validation.yaml`:

- `tracking_id`, `materials`, `time`, `make`, `result` are all
  required.
- `materials` must reference names that exist in the manifest.
- `time.tz` must be a valid IANA timezone.
- Every view in `make` must have `from` and `keep`.
- `result.use` must name a view defined in `make`.
- `result.limit` is required unless `result.count_only` is `true`.
- Feature use must match `features_detail` — if a feature is
  `enabled: false` on the server, requests that use it are
  rejected with `E_FEATURE_DISABLED`.

## Where to go next

- **[AI Instructions](../ai/README.md)** — if you are building a
  client that composes QAL queries.
- **[Examples](./examples.md)** — worked end-to-end curl
  sequences.
- **[Errors](./errors.md)** — when things go wrong.
