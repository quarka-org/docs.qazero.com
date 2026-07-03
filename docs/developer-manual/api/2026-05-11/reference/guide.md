---
id: reference-guide-2026-05-11
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
GET /wp-json/qa-platform/guide?version=2026-05-11
Authorization: Basic <base64 user:app_password>
```

### Query parameters

| Parameter | Type   | Required | Description                                               |
|-----------|--------|----------|-----------------------------------------------------------|
| `version` | string | no       | API version. Defaults to the latest installed on server. Use `latest` or a `YYYY-MM-DD` string. |

## Response shape

```json
{
  "version": "2026-05-11",
  "api_update": "2026-05-11",
  "timestamp": "2026-05-11T08:30:00Z",
  "plugin_version": "3.0.0.0",

  "features": {
    "filter":                true,
    "join":                  true,
    "calc":                  true,
    "view_chaining":         true,
    "sort":                  true,
    "allpv_prev_next_page":  true,
    "materials_supports_all": true,
    "calc_join_symmetric":   true,
    "guide_local_source":    true,
    "datalayer_observed_events": true,
    "sample":                false,
    "include_count":         false,
    "return_file":           false,
    "return_csv":            false,
    "return_parquet":        false
  },

  "features_detail": {
    "filter":                { "enabled": true,  "since": "2025-10-20" },
    "join":                  { "enabled": true,  "since": "2025-10-20" },
    "calc":                  { "enabled": true,  "since": "2025-10-20" },
    "view_chaining":         { "enabled": true,  "since": "2025-10-20" },
    "sort":                  { "enabled": true,  "since": "2025-10-20" },
    "allpv_prev_next_page":  { "enabled": true,  "since": "2026-04-17" },
    "materials_supports_all":{ "enabled": true,  "since": "2026-04-29" },
    "calc_join_symmetric":   { "enabled": true,  "since": "2026-05-11" },
    "guide_local_source":    { "enabled": true,  "since": "2026-05-11" },
    "datalayer_observed_events": { "enabled": true, "since": "2026-05-11" },
    "sample":                { "enabled": false },
    "include_count":         { "enabled": false },
    "return_file":           { "enabled": false },
    "return_csv":            { "enabled": false },
    "return_parquet":        { "enabled": false }
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
      ],
      "observed_events": {
        "purchase": {
          "material": "events.purchase",
          "columns": { "value": "number", "currency": "string", "items": "number" }
        },
        "newsletter_signup": {
          "material": "events.newsletter_signup",
          "columns": { "plan": "string" }
        }
      }
    }
  ],

  "documentation": {
    "source": "https://docs.qazero.com/docs/developer-manual/for-ai",
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
| `sites[].observed_events` | **Since 2026-05-11.** Tenant-specific dataLayer schema observed for this site. Present only when `datalayer_observed_events` is enabled. See [`observed_events`](#observed-events) below. |
| `documentation.source`  | URL of the human-readable mirror of the served spec on docs.qazero.com. The spec itself is in `documentation.sections`. |
| `documentation.sections`| Live spec served to AI clients. `README.md` is markdown; the two `.yaml` files are the authoritative schema. |

### `supports_all` flag on each material

Each material in [`materials.yaml`](../../../for-ai/materials.yaml) carries a
`supports_all: true | false` flag declaring whether the material is
queryable with `tracking_id: "all"` (the cross-site aggregate). Read
this from the `materials.yaml` block inside `documentation.sections`
when deciding which materials to surface to a user picking the
all-sites scope. **Since:** 2026-04-29

```yaml
materials:
  allpv:
    dataset_id: 1
    supports_all: true     # cross-site aggregate is built nightly
    decoders: ...
  click_event:
    dataset_id: 2
    supports_all: true
    decoders: ...
  gsc:
    dataset_id: 4
    supports_all: false    # per-site only — needs a real tracking_id
    decoders: ...
```

Servers reporting `features.materials_supports_all = true` (i.e.
`api_update >= 2026-04-29`) are guaranteed to populate `supports_all`
on every material. Older servers may omit the flag entirely; in that
case treat its absence as "unknown — try the query and handle the
error."

### `observed_events` — per-site dataLayer schema {#observed-events}

**Since:** 2026-05-11 (gated on `features.datalayer_observed_events`)

When the server advertises `datalayer_observed_events`, every entry in
`sites[]` — including the cross-site `all` aggregate — carries an
`observed_events` map describing the **dataLayer events actually
observed for that site**, keyed by event name:

```jsonc
"observed_events": {
  "purchase": {
    "material": "events.purchase",          // the QAL material to query
    "columns": { "value": "number", "currency": "string", "items": "number" }
  }
}
```

Use it to discover, at runtime and per tenant, which `events.{name}`
materials exist and what parameter keys/types each one carries — so an
AI client can answer "how many sessions purchased more than ¥10,000"
by composing an `events.purchase` query on the `value` column instead
of guessing whether that column is observed.

Notes:

- The map is **schema only**. It tells you the shape; the actual values
  are aggregated through QAL `calc` on the `events.{name}` material, not
  returned here.
- Only QAL-safe event names (`[A-Za-z0-9_]+`) appear, because the
  `/query` validator restricts `events.{name}` to that character set.
  Raw dataLayer names containing `:`, `/`, `-`, etc. are skipped.
- It degrades per-event: a missing or corrupt manifest for one event
  skips that event only, never the whole site.
- Older servers (without the feature flag) omit the key entirely —
  treat its absence as "unknown" and fall back gracefully.

## How `/guide` builds its spec

**Since:** 2026-05-11 (`features.guide_local_source`)

The `documentation.sections` content (`README.md`, `materials.yaml`,
`qal-validation.yaml`) is read directly from the files bundled inside
the QA ZERO plugin (`src/core/yaml/`) at request time. There is **no
GitHub fetch and no server-side cache to invalidate** — the spec a
server serves always matches the plugin version installed on it, by
construction. `documentation.source` is a convenience URL pointing at
the human-readable mirror of those same files on docs.qazero.com; it is
not fetched by the endpoint.

If you maintain a long-lived client cache of the spec, key it on the
server's `api_update` (and `version`): when `api_update` advances, the
bundled spec may have grown, so re-call `/guide` and refresh.

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
- **[AI Instructions](../../../for-ai/index.md)** — what goes into the
  README block inside `documentation.sections`.
- **[Errors](./errors.md)** — canonical error codes.
