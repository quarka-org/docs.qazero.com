---
id: versioning
title: Versioning philosophy
sidebar_position: 4
---

# Versioning philosophy

QA ZERO API uses a **two-tier** versioning scheme. Understanding the
distinction is the difference between "my client is stable for years"
and "my client breaks every quarter".

## The two tiers

| Tier           | Format       | Changes when                          | Where you see it                   |
|----------------|--------------|---------------------------------------|------------------------------------|
| **`version`**  | `YYYY-MM-DD` | A breaking change to the API shape.   | The URL (`?version=2025-10-20`).   |
| **`update`**   | `YYYY-MM-DD` | Any non-breaking addition within a version. | `api_update` in `/guide` response, `QAHM_API_UPDATE` in the plugin. |

- `version` is the **stable contract**. It is the thing you pin in
  your client. Breaking changes are rare, advertised far in advance,
  and supported in parallel for 24 months.
- `update` is the **feature clock**. Non-breaking additions (new
  materials, new columns, new features) bump `update` without
  touching `version`, so clients that do not need the new capability
  keep working.

## How a client should read this

A typical AI client on startup:

1. Call `/guide?version=2025-10-20`.
2. Record `api_update` from the response.
3. Record the `features_detail` map (features with per-entry
   `since` tags).
4. Before using any feature, compare the feature's `since` against
   your known `api_update`. If `since > api_update`, the server may
   not actually support it yet — fall back gracefully, do not crash.

This is the Stripe / AWS model adapted for AI clients. It lets us
ship improvements frequently without breaking anyone, and lets
clients detect new capabilities at runtime.

## The `since` tag

Every feature entry in `qal-validation.yaml` and (optionally) every
material and field in `materials.yaml` can carry a
`since: YYYY-MM-DD` tag. The rule is:

- **Absent `since`**: this thing has existed since the version was
  introduced. Always usable.
- **Present `since`**: this thing was added on that update date. Only
  usable when the server's `api_update >= since`.

The tag is intentionally per-feature, not per-query, because it is
the only way an AI client can decide at compose time *"am I allowed
to use this?"*. Anything coarser-grained forces a retry on failure,
and retries are exactly what we are trying to eliminate.

## What counts as a breaking change?

Things that bump **`version`**:

- Removing or renaming a material, a column, or a top-level key.
- Changing the type of a column in a way that would break existing
  deserializers.
- Changing the required-fields set of a query.
- Changing the shape of the error response.

Things that bump only **`update`**:

- Adding a new material.
- Adding a new column to an existing material.
- Adding a new feature (with its own `since` tag).
- Adding new optional request fields.
- Expanding the whitelist of functions available in `calc`.
- Changing implementation details that leave the public contract
  unchanged.

If you are in doubt about whether a change is breaking, assume it
is, and bump `version`. Breaking things silently is the one mistake
this scheme is designed to make impossible.

## Where to go next

- **[Changelog](../api/2025-10-20/changelog.md)** — the Update Ledger for version
  `2025-10-20`, with every `update` date and what was added.
- **[Compatibility Guide](../api/compatibility.md)** — version
  support windows and migration policy.
