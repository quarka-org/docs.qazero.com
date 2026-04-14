---
id: changelog-2025-10-20
title: Update History
sidebar_position: 6
last_updated: 2026-04-14
api_update: 2026-04-14
---

# Update History (2025-10-20)

This is the **Update History** for API version `2025-10-20`: one living document per version, new entries on top. Each entry is tagged with the `api_update` date that the plugin will report in its `/guide` response. Read this top-to-bottom to see how the API has grown since the initial release, and match the most recent entry against your server's `api_update` to know which features are actually available to you.

### 2026-04-14 — `api_update: 2026-04-14` — Developer Manual restructure + `features_detail` + `since`

**Added:**
- ✅ **`/guide` now returns `features_detail`** — a richer map keyed by feature name, with per-entry `{ enabled, since }` shape. The existing flat `features` map is preserved as a projection so older clients keep working. New AI clients should prefer `features_detail` and compare each feature's `since` against the server's `api_update` to decide availability.
- ✅ **Per-feature `since` in `qal-validation.yaml`** — every entry under `features:` in the validation manifest now carries a `since: YYYY-MM-DD` tag when `enabled: true`. This is the authoritative source the `/guide` endpoint projects from.
- ✅ **Top-level `version` / `update` in `materials-manifest.yaml`** — and optional `since:` tags on individual materials and fields. Purely additive; existing consumers are unaffected.
- ✅ **New `ai/` subdirectory** under `developer-manual/api/2025-10-20/` containing the concise AI instruction set (`README.md`) and the two machine-readable YAML specs (`materials.yaml`, `qal-validation.yaml`). The `/guide` endpoint now serves this subdirectory instead of the legacy flat markdown files, so MCP / LLM clients receive exactly the content they need — no human-oriented prose.

**Changed:**
- 🔄 **Developer manual reorganized** into `concepts/`, `materials/`, `reference/`, and `ai/` subdirectories. The top-level entry point is now framed as **"Get Started with AI"** rather than a conventional curl-first Quick Start. The legacy flat files (`qal.md`, `qal-validation.md`, `materials.md`, `endpoints.md`) have been removed in favor of this structure.
- 🔄 Each material now has its own page with a hand-crafted **sample table** so the grain of the data is visible at a glance. Sample tables show only three ID columns (`page_id`, `session_id`, `pv_id`) — the full ID set and schema live in `ai/materials.yaml`.
- 🔄 **`/guide` documentation content is now AI-optimized.** The endpoint previously fetched four markdown files aimed at humans (`index.md`, `endpoints.md`, `materials.md`, `qal.md`); it now fetches one concise `README.md` plus the two YAML specs. Human-oriented pages remain on docs.qazero.com for people who want to read them.

**Why this update is still non-breaking:**
- The legacy flat `features` map is preserved unchanged in the `/guide` response.
- Existing client code that reads `version`, `api_update`, `features`, `sites`, or the presence of `documentation.sections` continues to work. The *content* of `documentation.sections` has changed, but clients that treat it as opaque pass-through (as AI clients do) are unaffected.
- No QAL query shape has changed. No existing material or column has been removed or renamed.

### 2026-04-13 — `api_update: 2026-04-13` — Documentation v1.2.0
**Added:**
- ✅ **QAL `make.sort`** — view-level row ordering and top-N. Place `sort: { by, order, top }` inside a view in `make` to sort the view's output after `filter` / `join` / `keep` / `calc`. `by` accepts both qualified (`allpv.url`) and unqualified (`pageviews`) names, `order` is `asc` / `desc`, `top` is an optional row cap. See the [What is QAL?](./concepts/what-is-qal.md) concept page and the authoritative [`qal-validation.yaml`](./ai/qal-validation.yaml).
- ✅ `/guide` `features.sort` now reports `true` on servers running this update — clients should use it to detect availability instead of hard-coding.

**Clarified:**
- 🔧 Sorting is intentionally **view-level, not result-level**. There is no `result.sort`. A single QAL query may ask for multiple chained views, and each view owns its own ordering.
- 🔧 `result` whitelist today is exactly `use` / `limit` / `count_only`. `result.sample` / `result.include_count` / `result.return` are **not** currently accepted (previously documented as "validator-accepted no-ops"; that description is now obsolete).

### 2026-04-11 — `api_update: 2026-04-11` — Documentation v1.1.2
**Runtime:**
- ✅ `/guide` now returns an `api_update` field and a `features` map keyed by `filter`, `join`, `calc`, `view_chaining`, `sort`, `sample`, `include_count`, `return_file`, `return_csv`, `return_parquet`. This is the authoritative runtime state — clients (including AI agents) should consult `features` rather than hard-coding feature availability.
- ✅ Plugin constants `QAHM_API_VERSION` and `QAHM_API_UPDATE` are introduced and used to populate the guide response.

**Corrected (documentation only, carried forward from v1.1.1):**
- 🔧 `result.sort` is rejected as `E_RESULT_FORBIDDEN_KEY`, and `result.sample` / `result.include_count` pass validation but are no-ops. Examples, feature table, and validation manifest were updated accordingly in the previous revision and remain authoritative.

### 2026-04-10 — `api_update: 2026-04-10` — Documentation v1.1.0
**Added:**
- ✅ QAL `filter` (flat form, `eq`/`neq`/`gt`/`gte`/`lt`/`lte`/`in`/`contains`/`prefix`/`between`)
- ✅ QAL `join` (single equi-join per view, id-column only)
- ✅ QAL `calc` aggregation with whitelisted functions (`COUNT`, `COUNTUNIQUE`, `SUM`, `AVERAGE`, `MIN`, `MAX`)
- ✅ View chaining — `from` may reference previously defined views in the same `make` block
- ✅ M:N join filter requirement (`E_JOIN_FILTER_REQUIRED`) documented
- ✅ New materials: `goal_1`..`goal_N`, `ga4_age_gender`, `ga4_country`, `ga4_region`, `page_version`, `click_event`, `datalayer_event`, `events.{name}`
- ✅ `allpv` behavioral columns (`depth_position`, `deep_read`, `stop_max_sec`, `stop_max_pos`, `exit_pos`, `is_submit`, `dead_click_image_count`, `irritation_click_count`, `scroll_back_count`, `content_skip_count`, `exploration_count`)
- ✅ `allpv` page-type booleans (`is_article`, `is_product`, `is_form`, ...) and virtual goal columns (`is_goal_1`..`is_goal_10`)
- ✅ `gsc` column-DB schema (`clicks`, `impressions`, `position_x100`) with virtual `ctr`, `position`, `position_weighted`

**Changed:**
- 🔄 QAL Validation Manifest aligned with current runtime rules (filter/join/calc features enabled)
- 🔄 Materials Reference restructured to catalogue all materials from `/guide`

These features reflect work merged into qa-labo through April 2026. See the [Developer Blog](/blog) for context on what was built and why.

### 2025-10-06 - Documentation v1.0.0
**Added:**
- ✅ `tracking_id` required field in all QAL queries
- ✅ `/guide` endpoint now returns comprehensive server information
- ✅ `plugin_version` field in `/guide` response
- ✅ Site-specific materials and goals in `/guide` response
- ✅ System limits information
- ✅ Compatibility matrix documentation

**Removed:**
- ❌ `/materials` endpoint (replaced by `/guide`)
- ❌ Goal-related fields from `allpv` material
- ❌ Several deprecated fields: `session_id`, `tracking_domain`, `path_prefix`, `utm_content`, `utm_term`, `version_id`

**Changed:**
- 🔄 `country` → `country_code` (ISO 3166-1 alpha-2)
- 🔄 QAL version specification moved from query body to URL parameter

**Plugin Version:**
- 🔌 Requires QA Platform Plugin 3.0.0.0+

### 2025-10-20 - Initial Release
**Released:**
- Basic QAL with `from` and `keep` operations
- Two materials: `allpv` and `gsc`
- Simple result options: `limit` and `count_only`
