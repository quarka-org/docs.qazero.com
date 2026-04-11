---
id: changelog-2025-10-20
title: Update History
sidebar_position: 6
last_updated: 2026-04-11
api_update: 2026-04-11
---

# Update History (2025-10-20)

This is the **Update History** for API version `2025-10-20`: one living document per version, new entries on top. Each entry is tagged with the `api_update` date that the plugin will report in its `/guide` response. Read this top-to-bottom to see how the API has grown since the initial release, and match the most recent entry against your server's `api_update` to know which features are actually available to you.

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
