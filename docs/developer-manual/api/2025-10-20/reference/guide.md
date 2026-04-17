---
id: reference-guide-2025-10-20
title: GET /guide
sidebar_position: 3
---

# `GET /wp-json/qa-platform/guide`

The discovery endpoint. Call this **first**, on every new client
session. It returns everything a client needs to build a correct
QAL query against this particular server: version and update
metadata, feature flags (with `since` tags), the list of
tracking_ids the authenticated user can query, per-site goal
definitions, and the live machine-readable spec.

## Request

```
GET /wp-json/qa-platform/guide?version=2025-10-20
Authorization: Basic <base64 user:app_password>
```

### Query parameters

| Parameter | Type   | Required | Description                                               |
|-----------|--------|----------|-----------------------------------------------------------|
| `version` | string | no       | API version. Defaults to the latest installed on server. Use `latest` or a `YYYY-MM-DD` string. |

## Response shape

```json
{
  "version": "2025-10-20",
  "api_update": "2026-04-17",
  "timestamp": "2026-04-17T08:30:00Z",
  "plugin_version": "3.0.0.0",

  "features": {
    "filter":        true,
    "join":          true,
    "calc":          true,
    "view_chaining": true,
    "sort":          true,
    "allpv_prev_next_page": true,
    "sample":        false,
    "include_count": false,
    "return_file":   false,
    "return_csv":    false,
    "return_parquet": false
  },

  "features_detail": {
    "filter":        { "enabled": true,  "since": "2025-10-20" },
    "join":          { "enabled": true,  "since": "2025-10-20" },
    "calc":          { "enabled": true,  "since": "2025-10-20" },
    "view_chaining": { "enabled": true,  "since": "2025-10-20" },
    "sort":          { "enabled": true,  "since": "2025-10-20" },
    "sample":        { "enabled": false },
    "include_count": { "enabled": false },
    "return_file":   { "enabled": false },
    "return_csv":    { "enabled": false },
    "return_parquet":{ "enabled": false }
  },

  "sites": [
    {
      "tracking_id": "abc123",
      "domain": "example.com",
      "name": "Corporate site",
      "default": true,
      "data_available_from": "2024-01-01",
      "timezone": "Asia/Tokyo",
      "goals": [
        {
          "id": 1,
          "name": "Contact form submit",
          "type": "gtype_page",
          "condition": { "url": "/thanks/", "match": "exact" }
        }
      ]
    }
  ],

  "documentation": {
    "source": "https://github.com/quarka-org/docs.qazero.com/tree/main/docs/developer-manual/api/2025-10-20/ai",
    "format": "mixed",
    "sections": [
      {
        "category": "instructions",
        "format":   "markdown",
        "file":     "README.md",
        "title":    "AI Instructions (how to build a QAL query)",
        "content":  "..."
      },
      {
        "category": "spec",
        "format":   "yaml",
        "file":     "materials.yaml",
        "title":    "Materials Manifest (machine-readable)",
        "content":  "..."
      },
      {
        "category": "spec",
        "format":   "yaml",
        "file":     "qal-validation.yaml",
        "title":    "QAL Validation Manifest (machine-readable)",
        "content":  "..."
      }
    ]
  }
}
```

## Field reference

| Field                   | Meaning                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| `version`               | API version (URL-visible, breaking-change clock).                      |
| `api_update`            | Update date (non-breaking addition clock). Compare against `since`.    |
| `timestamp`             | Server time the response was generated.                               |
| `plugin_version`        | QA ZERO plugin version on the server.                                 |
| `features`              | Flat `{name: bool}` map. Backward-compat shape.                       |
| `features_detail`       | Rich `{name: {enabled, since?}}` map. Use this for `since` checks.    |
| `sites[]`               | One entry per tracking_id the authenticated user can access.           |
| `sites[].goals[]`       | Per-site goal definitions — the mapping from `goal_N` material to the goal it represents. |
| `documentation.sections`| Live spec served to AI clients. `README.md` is markdown; the two `.yaml` files are the authoritative schema. |

## Caching

The server caches the `ai/` subdirectory from GitHub locally the
first time `/guide` is called for a given version. Subsequent calls
read from the local cache. If you change the docs source and want
the cache invalidated, delete the cache directory on the server
(it lives under `wp-content/qa-zero-data/restapi/`).

## Typical client flow

1. On startup, call `/guide` with your pinned `version`.
2. Record `api_update` and `features_detail`.
3. Parse `documentation.sections` — pick out the two YAML blocks
   by `file` name, parse them, and cache them in memory.
4. Use the YAML specs to compose subsequent `/query` calls.
5. If a `/query` call fails with `E_UNKNOWN_*`, re-call `/guide`
   — the server may have been updated since your last cache.

## Where to go next

- **[`/query` reference](./query.md)** — the execution endpoint.
- **[AI Instructions](../ai/README.md)** — what goes into the
  README block inside `documentation.sections`.
- **[Errors](./errors.md)** — canonical error codes.
