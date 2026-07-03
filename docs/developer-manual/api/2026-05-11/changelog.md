---
id: changelog-2026-05-11
title: Update History
sidebar_position: 6
last_updated: 2026-05-21
api_update: 2026-05-21
---

# Update History (2026-05-11)

This is the **Update History** for API version `2026-05-11`: one living document per version, new entries on top. Each entry is tagged with the `api_update` date that the plugin will report in its `/guide` response. Read this top-to-bottom to see how the API has grown since the initial release of this version, and match the most recent entry against your server's `api_update` to know which features are actually available to you.

The entries below the **Initial Release of `2026-05-11`** section are carried over from the predecessor version `2025-10-20` for context. The breaking-change entry at the top describes the contract delta you need to know when migrating.

### 2026-05-21 — `api_update: 2026-05-21` — summary integral materials (T102)

**Added:**
- ✅ **Three pre-aggregated summary materials** — `summary_landingpage`, `summary_allpage`, and `summary_days_access_detail` are now queryable as first-class QAL materials. Each returns the **period-cumulative** roll-up that the nightly batch already maintains (year-to-date integrals, served from a single file read), so questions like "landing-page sessions for any date range" or "page ranking by pageviews" no longer require scanning millions of `allpv` rows. All three are `supports_all: true` (the cross-site `tracking_id: "all"` aggregate exists). See [`summary_*` materials](../materials/summary.md) and the authoritative [`materials.yaml`](../../for-ai/materials.yaml). **Since:** 2026-05-21
- ✅ **Validator material patterns extended** — `summary_landingpage` / `summary_allpage` / `summary_days_access_detail` are now accepted in `materials[].name`, `make.*.from`, and `make.*.keep` (see [`qal-validation.yaml`](./qal-validation.yaml)).

**Important property (read before using):**
- 🔸 These materials have **no `date` dimension**. Each query returns one cumulative set for the requested period (cross-year ranges supported), not a daily breakdown. If you need a daily trend, use `allpv` (which has a `date` dimension) instead. Numeric-range filtering on the count columns (`pv_count`, `session_count`, …) is applied as a `post_filter` after the cumulative roll-up.

**Why this update is still non-breaking:**
- The three materials are purely additive. No existing material, column, query shape, or feature flag changed. Queries that do not name a `summary_*` material are completely unaffected.

### 2026-05-20 — `api_update: 2026-05-20` — `allpv` browser window-size columns (T101)

**Added:**
- ✅ **`allpv.window_inner_width` / `allpv.window_inner_height`** — two new columns (uint16) recording the browser's live `window.innerWidth` / `window.innerHeight` in CSS pixels at the moment of the page view: the **actual rendered content area**, not the device's screen resolution. Use them for responsive-breakpoint analysis and viewport-segment splits (e.g. `between: 768, 1199` for the tablet band, `gte: 1200` for desktop). A value of `0` means the source header was absent for that page view; filter `gte: 1` to keep only real measurements. See [`allpv`](../materials/allpv.md) and [`materials.yaml`](../../for-ai/materials.yaml). **Since:** 2026-05-20

**Why this update is still non-breaking:**
- Both columns are additive (`nullable: true, default: 0`). Existing queries that do not reference them are unaffected; date ranges predating the column return `0` rather than an error.

### 2026-05-11 — `api_update: 2026-05-11` — Version `2026-05-11` initial release — symmetric calc column declaration

**This is a breaking-change version bump. Read this entry before migrating from `2025-10-20`.**

**Added:**
- ✅ **Symmetric `calc` column declaration (T87c).** A `material.column` reference inside any `calc` expression is now the single declaration site for that column on **both** the `from` side and the `join.with` side. The executor fetches and preserves the column from whichever side the material lives on, then drops it from the output (only `keep` columns + `calc` keys are returned). This unifies a long-standing asymmetry where `from`-side columns were auto-fetched but `join`-side columns were not, causing aggregates like `COUNT(click_event.pv_id)` to silently return 0 when `click_event` was the join target. **Since:** 2026-05-11. Reported in `/guide` as `features_detail.calc_join_symmetric.enabled: true`.
- ✅ **`E_CALC_COLUMN_UNRESOLVED` (validator).** Pre-execution validation now rejects any `calc` expression whose `material.column` reference is not in scope (the material is not in `from` or `join.with`) or does not exist in the material's schema. This converts what used to be a silent zero-row result into a clear validation error, restoring the "AI repair loop" signal for AI-composed queries. See [Errors](./reference/errors.md).
- ✅ **JOIN `on.left` / `on.right` pinpoint scope pre-validation + structured error details (T87, originally shipped 2026-05-10 on `2025-10-20`).** `on.left` must equal the resolved physical material name of the `from` side (with view chains pre-resolved); `on.right` must equal the `join.with` string verbatim. Errors now carry `side` (`"left"` or `"right"`), `received_value`, `expected_prefix`, and a `hint` field inside `details`. Carried forward into `2026-05-11` unchanged.

**Changed (breaking from 2025-10-20):**
- 🔄 **`calc` semantics: `material.column` is the column declaration.** In `2025-10-20`, the only declaration site that consistently triggered fetch + preserve was the `from` side. From `2026-05-11`, the rule is symmetric and the spec is unified: **the appearance of `material.column` inside a `calc` expression is itself the declaration that the executor fetches that column, regardless of which side of the join it lives on.** The output still contains only `keep` columns plus `calc` keys — `calc`-input columns are preserved through merge but stripped from the final result, preserving `GROUP BY = keep` semantics.

**Migration from 2025-10-20:**
- Queries that worked are still correct: `from`-side calc references behave identically. No client change needed.
- Queries that previously *silently returned 0 rows* because they referenced a join-side column inside `calc` will now return correct aggregates without modification. Re-run them.
- Queries that pre-emptively added a join-side column to `keep` solely to make `calc` "see" it should remove that column from `keep`. Keeping it in `keep` is still legal but changes the GROUP BY grain and is no longer required.
- Invalid `calc` references (typo in column name, material absent from `from` / `join.with`) that used to silently produce 0 rows now fail at validation with `E_CALC_COLUMN_UNRESOLVED`. Fix the reference or remove it.
- The `features.calc_join_symmetric` flag in `/guide` tells you whether the server is running the new symmetric rule. Treat its absence as "old behavior — re-check column placement before relying on join-side calc."

**Known limitation (carried forward, intentionally out of scope for this bump):**
- 🚧 **View chain × calc symmetry is not in scope.** When `from[0]` references a previously defined view (view chaining), the validator skips `E_CALC_COLUMN_UNRESOLVED` for that view, and the executor falls back to the legacy Material-runtime path for calc preservation. Real material-name prefixes still resolve through the Material runtime; bare view-name prefixes in calc (`<from_view>.column`) are not yet preserved. This is tracked as a future task and is intentionally not blocking this version bump.

**Why this is a version bump and not an update:**
- The fix changes observable execution semantics for queries that *had been considered valid by the validator*. Even though the new semantics are arguably "what every client always meant," anything depending on the old behavior (e.g., an integration that worked around the silent-zero bug by adding columns to `keep`) is now strictly speaking running on a different contract. Per the versioning policy, that is a version bump, not an update.

### 2026-05-11 — `api_update: 2026-05-11` — `/guide` local source + observed dataLayer events (T86)

*Shipped with the initial `2026-05-11` release; documented here retroactively. Both items below are additive `/guide` changes and carry `since: 2026-05-11`.*

**Added:**
- ✅ **`features.datalayer_observed_events`** (and `features_detail.datalayer_observed_events`, `since: 2026-05-11`). When enabled, each entry in `/guide`'s `sites[]` — including the cross-site `all` aggregate — gains an `observed_events` map describing the **tenant-specific dataLayer schema** actually observed for that site: `{ event_name: { material: "events.{name}", columns: { … } } }`. This lets an AI client discover which custom `events.{name}` materials exist and what parameter keys/types each carries, so it can compose a correct `events.{name}` query without guessing. The map is schema only — values are aggregated via QAL `calc`, not returned here. Only event names that are QAL-safe (`[A-Za-z0-9_]+`) are surfaced; a missing or corrupt per-event manifest skips that one event rather than blanking the whole site.
- ✅ **`features.guide_local_source`** (`since: 2026-05-11`). The `/guide` endpoint now reads its `documentation.sections` (`README.md`, `materials.yaml`, `qal-validation.yaml`) directly from the plugin-bundled `src/core/yaml/` files instead of fetching them from GitHub at runtime. The plugin version and the served spec are therefore guaranteed to match, and no GitHub round-trip or cache-invalidation step is involved. `documentation.source` now points at the human-readable docs.qazero.com mirror of those files for reference. This is observationally a no-op for clients except that the spec can no longer lag the installed plugin.

**Why this update is still non-breaking:**
- `observed_events` is an additive optional key inside each `sites[]` entry; clients that ignore it are unaffected, and servers on older versions simply omit it (gated on the feature flag). The local-source switch changes only where the server reads its own bundled files from — the response shape clients consume is unchanged.

---

## Pre-`2026-05-11` history (carried over from `2025-10-20` for context)

### 2026-04-29 — `api_update: 2026-04-29` — `materials.supports_all` flag

**Added:**
- ✅ **`materials.{name}.supports_all: true | false`** in [`materials.yaml`](../../for-ai/materials.yaml) — every material now declares whether it can be queried with `tracking_id: "all"` (the cross-site aggregate built nightly). Currently `true` for `allpv`, `click_event`, `datalayer_event`, `events_template`; `false` for `gsc`, `goal_x`, `page_version`, `ga4_*`. AI clients and admin UIs should read this flag before offering "all sites" as a tracking_id choice for a given material.
- ✅ **`features.materials_supports_all`** reported in `/guide` — clients can detect availability of the new flag by checking this feature flag. Older servers may omit `supports_all` from individual materials; treat its absence as "unknown — try and handle errors." **Since:** 2026-04-29
- ✅ **Synced `ai/materials.yaml` and `ai/qal-validation.yaml`** with the qa-labo source for both this update and the prior 2026-04-17 update — the AI-served YAML now reflects the `prev_page_id` / `next_page_id` / `prev_url` / `prev_title` / `next_url` / `next_title` columns and the `allpv_prev_next_page` feature flag that were added on 2026-04-17. The human-readable `materials/allpv.md` and the `/guide` reference example were already correct; only the AI-facing YAML lagged behind.

**Why this update is still non-breaking:**
- The `supports_all` flag is purely additive metadata. Existing queries — including ones that pass `tracking_id: "all"` to materials that turn out to be `supports_all: false` — behave exactly as before (still return their pre-existing error / empty result).
- The qa-labo runtime continues to enforce `tracking_id` semantics; the flag only documents the existing behavior so AI clients can decide before sending the query.

### 2026-04-17 — `api_update: 2026-04-17` — `allpv` page transition columns

**Added:**
- ✅ **`allpv.prev_page_id` / `allpv.next_page_id`** — two new physical columns (uint32) recording the page viewed immediately before and after each page view within the same session. Landing PVs have `prev_page_id = 0`; exit PVs have `next_page_id = 0`. Filter on these values to extract landing or exit page views in a single QAL query.
- ✅ **`allpv.prev_url` / `allpv.prev_title` / `allpv.next_url` / `allpv.next_title`** — four virtual columns resolved from `prev_page_id` / `next_page_id` via the `qa_pages` master table. Use `keep` to include human-readable URLs and titles for the previous/next pages.
- ✅ **`features.allpv_prev_next_page`** reported in `/guide` — clients can detect availability of the new columns by checking this feature flag. **Since:** 2026-04-17

**Why this update is still non-breaking:**
- All new columns are additive. Existing queries that do not reference `prev_page_id` / `next_page_id` are completely unaffected.
- The new physical columns use `nullable: true, default: 0`, so date ranges predating this update return `0` (no transition data) rather than errors.

### 2026-04-14 — `api_update: 2026-04-14` — Developer Manual restructure + `features_detail` + `since`

**Added:**
- ✅ **`/guide` now returns `features_detail`** — a richer map keyed by feature name, with per-entry `{ enabled, since }` shape. The existing flat `features` map is preserved as a projection so older clients keep working. New AI clients should prefer `features_detail` and compare each feature's `since` against the server's `api_update` to decide availability.
- ✅ **Per-feature `since` in `qal-validation.yaml`** — every entry under `features:` in the validation manifest now carries a `since: YYYY-MM-DD` tag when `enabled: true`. This is the authoritative source the `/guide` endpoint projects from.
- ✅ **Top-level `version` / `update` in `materials-manifest.yaml`** — and optional `since:` tags on individual materials and fields. Purely additive; existing consumers are unaffected.
- ✅ **New `ai/` subdirectory** under `developer-manual/api/2026-05-11/` containing the concise AI instruction set (`README.md`) and the two machine-readable YAML specs (`materials.yaml`, `qal-validation.yaml`). The `/guide` endpoint now serves this subdirectory instead of the legacy flat markdown files, so MCP / LLM clients receive exactly the content they need — no human-oriented prose.

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
- ✅ **QAL `make.sort`** — view-level row ordering and top-N. Place `sort: { by, order, top }` inside a view in `make` to sort the view's output after `filter` / `join` / `keep` / `calc`. `by` accepts both qualified (`allpv.url`) and unqualified (`pageviews`) names, `order` is `asc` / `desc`, `top` is an optional row cap. See the [What is QAL?](../../concepts/what-is-qal.md) concept page and the authoritative [`qal-validation.yaml`](./qal-validation.yaml).
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
