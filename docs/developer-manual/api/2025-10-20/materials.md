---
id: materials-2025-10-20
title: Materials Reference
sidebar_position: 4
last_updated: 2026-04-11
api_update: 2026-04-11
---

# Materials Reference (2025-10-20)

Complete column catalogue for all materials exposed by the QA ZERO API (version `2025-10-20`).

:::caution Plugin Version Required
**Minimum Plugin Version:** 3.0.0.0+

Check your version from WP Admin → Plugins, or by calling `/guide` and reading `plugin_version`.
Not compatible? See the [Compatibility Guide](../compatibility.md).
:::

---

## Overview

| Material | Type | Source | Purpose |
|----------|------|--------|---------|
| `allpv` | Log (column-DB) | view_pv | Page views with identity, device, traffic source, behavior |
| `gsc` | Log (column-DB) | GSC import | Search Console clicks / impressions / position per (page, keyword) |
| `goal_1`..`goal_N` | Log (derived) | goal file functions | PV-level goal conversion log, one material per configured goal |
| `ga4_age_gender` | Attribute (column-DB) | GA4 import (T48) | Age × gender session breakdown |
| `ga4_country` | Attribute (column-DB) | GA4 import (T48) | Country session breakdown |
| `ga4_region` | Attribute (column-DB) | GA4 import (T48) | Region (prefecture etc.) session breakdown |
| `page_version` | Master (column-DB) | page version tracker (T53) | Per-page content version log |
| `click_event` | Log (column-DB) | click event pipeline | Click events on page elements |
| `datalayer_event` | Log (column-DB, dataLayer sites only) | raw_g | Unified index of dataLayer events |
| `events.{name}` | Log (column-DB, dynamic) | raw_g | Per-event typed material (discovered via `/guide`) |

All logs are time-indexed by day; use `time.start` / `time.end` to scope queries.

**Discovering available materials for a site:**
```bash
curl -u "user:pass" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```
The response lists each tracking site's available materials, goals, datalayer events, and their row counts / date ranges.

---

## allpv — Page views

`allpv` is QA ZERO's primary material. Every page view is stored with identity, page, referral, device, timing, and behavioral columns. It is the join anchor for most other materials (via `pv_id`, `session_id`, `reader_id`, `page_id`, `version_id`).

### Identity & session

| Column | Type | Description | Filter hint |
|--------|------|-------------|-------------|
| `pv_id` | u32 | Unique page view id | Join key — don't filter on this |
| `session_id` | u32 | Session id (sequential within tracking_id × day) | Fast column scan |
| `reader_id` | u32 | Visitor id (persistent) | Fast; combine with URL filters for human use |
| `page_id` | u32 | Page id (join key) | Usually filter on `url` instead |
| `device_id` | u8 | Internal device id (1=PC, 2=SP, 3=tablet) | Prefer `device_type` |
| `source_id` / `medium_id` / `campaign_id` / `content_id` | u16/u8 | Traffic source ids | Prefer `utm_*` columns |
| `version_id` | u16 | Page version id (A/B / deploy) | Join key to `page_version` |
| `access_time` | u32 | UNIX timestamp (also the time column) | Usually handled by `time` |

### Page info (master-resolved via `page_id`)

| Column | Type | Description | Filter hint |
|--------|------|-------------|-------------|
| `url` | string | Full URL | `eq`/`in` fast (hash index); `prefix`/`contains` fall back to scan |
| `title` | string | Page title | Filter by URL, then `keep` the title |
| `page_type` | u64 bitfield | Page type bitflags | Prefer the `is_*` booleans below |
| `page_fetch_status` | i8 | NULL / 1=success / -1=failure | |

**Page type booleans** (generated columns; all `0/1`):
`is_article`, `is_product`, `is_list`, `is_form`, `is_trust_info`, `is_faq`, `is_landing`, `is_search`, `is_account`, `is_cart`, `is_checkout`, `is_confirm`, `is_thanks`, `is_top_page`, `is_event`, `is_recipe`, `is_job`, `is_video`, `is_howto`, `is_qa_forum`

### Referral & UTM (master-resolved)

| Column | Description |
|--------|-------------|
| `source_domain` | Referrer domain |
| `referrer` | Full referrer URL |
| `utm_source` | UTM source |
| `utm_medium` | UTM medium |
| `utm_campaign` | UTM campaign |
| `utm_content` | UTM content |
| `utm_term` | UTM term |

### Device & reader attributes

| Column | Description |
|--------|-------------|
| `ua` | User-Agent fragment |
| `device_type` | `"PC"`, `"SP"`, `"tablet"` (case-sensitive, exactly these three values) |
| `os` | Operating system label |
| `browser` | Browser label |
| `language` | Reader language |
| `country_code` | ISO 3166-1 alpha-2 |
| `original_id` | Reader original id |

### Timing & basic behavior

| Column | Type | Description |
|--------|------|-------------|
| `pv` | u16 | PV index within session (1 = landing) |
| `speed_msec` | u16 | Page load time (ms) |
| `browse_sec` | u16 | Browse time (s) |
| `is_last` | bool | Last PV of session (exit page) |
| `is_newuser` | bool | New user flag |

### Behavioral metrics (T41)

Computed from scroll/click/exploration raw events.

**Scroll / reading depth (raw_p):**

| Column | Type | Description |
|--------|------|-------------|
| `depth_position` | u8 (0-100%) | Max scroll depth |
| `deep_read` | 0/1 | Deep-read flag: ≥5 stops of ≥3s |
| `stop_max_sec` | u16 | Longest dwell (s) at any point |
| `stop_max_pos` | u8 (0-100%) | Position (%) of the longest dwell |
| `exit_pos` | u8 (0-100%) | Position at exit |

**Click quality (raw_c):**

| Column | Type | Description |
|--------|------|-------------|
| `is_submit` | 0/1 | Submission (form CV) occurred |
| `dead_click_image_count` | u8 | Clicks on images with no link |
| `irritation_click_count` | u8 | Rapid repeated clicks (rage click bursts) |

**Mouse / navigation (raw_e):**

| Column | Type | Description |
|--------|------|-------------|
| `scroll_back_count` | u8 | Large upward scroll-backs |
| `content_skip_count` | u8 | Large downward skips |
| `exploration_count` | u8 | Horizontal mouse exploration events |

### Virtual goal columns

`is_goal_1` .. `is_goal_10` — per-PV flag indicating whether this PV achieved goal N. Filterable as `eq:1` (only the "achieved" case is supported). Keep multiple `is_goal_N` columns and post-process in the client for OR semantics.

---

## gsc — Google Search Console

Column-DB material of per-page × per-keyword × per-day search metrics. **N:M cardinality** — joins from `allpv` to `gsc` **require a filter on the gsc side** or the query is rejected (`E_JOIN_FILTER_REQUIRED`).

### Columns

| Column | Type | Description | Filter hint |
|--------|------|-------------|-------------|
| `page_id` | u32 | Join key (resolves `url`, `title`) | Usually filter via `url` |
| `query_id` | u32 | Keyword id | Prefer `keyword` |
| `search_type` | u8 | 1=web, 2=image, 3=video | Fast |
| `clicks` | u32 | Daily clicks | Aggregate with `SUM` |
| `impressions` | u32 | Daily impressions | Aggregate with `SUM` |
| `position_x100` | u16 | Position × 100 (raw storage) | Prefer virtual `position` |
| `keyword` | string | Search query (resolved via `query_id`) | DB lookup → column scan |
| `url` | string | Page URL (resolved via `page_id`) | |
| `title` | string | Page title (resolved via `page_id`) | |
| `page_type` | u64 | Page type bitfield (resolved via `page_id`) | |
| `page_fetch_status` | i8 | Resolved via `page_id` | |

### Virtual columns (computed)

| Column | Formula | Usage |
|--------|---------|-------|
| `ctr` | `clicks / impressions` | `keep` or post-aggregation |
| `position` | `position_x100 / 100` | float position |
| `position_weighted` | `position × impressions` | aggregate with `SUM` to compute weighted-average position |

### M:N join rule

`gsc.join.cardinality = "N:M"` — the manifest marks this material as exploding on join. The executor will reject any `join` that targets `gsc` unless the view building `gsc` (or the view that joins it) has a `filter` on a `gsc` column. Typical filters: `keyword`, `search_type`, `page_id` range via `url`.

---

## goal_1 .. goal_N — Goal conversion log

`goal_x` is a template; each configured goal on the site produces its own material (e.g. `goal_1`, `goal_2`, ...). The `/guide` response lists available goals for each site.

Rows are PV-level conversion records — every time a goal was achieved on this site.

**Core columns:**
`pv_id`, `session_id`, `reader_id`, `page_id`, `url`, `title`, `access_time`, `device_id`, `version_id`, `is_reject`, `is_newuser`, `is_last`, `pv`, `speed_msec`, `browse_sec`

**Traffic source columns:**
`source_id`, `utm_source`, `source_domain`, `medium_id`, `utm_medium`, `campaign_id`, `utm_campaign`

**Session context:**
`session_index`, `pv_index`, `session_no`, `version_no`, `is_raw_p`, `is_raw_c`, `is_raw_e`, `UAos`, `UAbrowser`, `language`

**Filterable columns (validation manifest):** `utm_source`, `utm_medium`, `utm_campaign`, `device_id`, `is_reject`

Use `goal_N` when you want conversion-only rows instead of filtering `allpv.is_goal_N=1`. `allpv` is cheaper for "did this PV convert?" questions; `goal_N` is cheaper when you need goal-specific context not stored on `allpv`.

---

## ga4_age_gender, ga4_country, ga4_region — GA4 attribute data (T48)

Daily attribute aggregates imported from Google Analytics 4. They complement `allpv` with demographic and geographic breakdowns that QA ZERO's own tracker does not capture.

### ga4_age_gender

| Column | Type | Description |
|--------|------|-------------|
| `age` | u8 | Age bracket id (0=unknown, 1=18-24, 2=25-34, 3=35-44, 4=45-54, 5=55-64, 6=65+) |
| `gender` | u8 | 0=unknown, 1=male, 2=female |
| `sessions` | u32 | Sessions |
| `active_users` | u32 | Active users |
| `age_label` | string | Resolved bracket label |
| `gender_label` | string | Resolved gender label |

**Filterable:** `age`, `gender`, `sessions`, `active_users`.

### ga4_country

| Column | Type | Description |
|--------|------|-------------|
| `country` | u16 | Country id (ASCII-packed 2-char code) |
| `sessions` | u32 | |
| `active_users` | u32 | |
| `country_code` | string | 2-char ISO code (resolved) |

**Filterable:** `country`, `sessions`, `active_users`.

### ga4_region

| Column | Type | Description |
|--------|------|-------------|
| `region` | u16 | Region id (1-47 = JP prefectures, 0 = other/overseas) |
| `sessions` | u32 | |
| `active_users` | u32 | |
| `region_name` | string | Prefecture name (English, resolved) |

**Filterable:** `region`, `sessions`, `active_users`.

All three materials are aggregated — they have no `pv_id` and should not be joined into `allpv`. Use them directly with `calc` for breakdowns.

---

## page_version — Page content versions (T53)

Tracks content versions per `(page_id, device_id)`. Useful for A/B snapshots and change-effect analysis. `cardinality: "1:1"` relative to `allpv.version_id`, so joining from `allpv` is safe without a filter.

| Column | Description |
|--------|-------------|
| `version_id` | PK / join key (matches `allpv.version_id`) |
| `page_id` | Page id |
| `device_id` | 1=PC, 2=SP, 3=tablet |
| `version_no` | Monotonic version number within `(page_id, device_id)` |
| `update_date` | When this version was created |
| `url` | URL (resolved via `page_id`) |
| `title` | Title (resolved via `page_id`) |
| `device_type` | `"PC"` / `"SP"` / `"tablet"` (resolved via `device_id`) |

**Filterable:** `page_id`, `device_id`, `version_no`, `update_date`.

**Usage:** filter `allpv` to your URL(s), then `join` `page_version` on `version_id` to attach the matching version meta to each PV.

---

## click_event — Click events

Every click captured by the client tracker, stored in the column DB. Join to `allpv` via `pv_id`.

| Column | Type | Description |
|--------|------|-------------|
| `pv_id` | u32 | Join key to `allpv.pv_id` |
| `session_id` | u32 | Session id |
| `page_id` | u32 | Page id |
| `event_sec` | u16 | Offset (s) from PV start |
| `selector` | u32 | Element selector id |
| `element_text` | u16 | Element text id |
| `element_id` | u16 | HTML `id` attribute id |
| `element_class` | u16 | HTML class id |
| `element_data` | u16 | `data-*` id |
| `to_url` | u16 | Destination URL id |
| `is_external` | 0/1 | External link flag |
| `action_id` | u8 | Action type |
| `page_x_pct` / `page_y_pct` | u16 | Click position in page (% × 100) |

---

## datalayer_event — dataLayer unified index

Available only on sites that ship dataLayer events (`raw_g`). Every event lands here with a uniform schema:

| Column | Type | Description |
|--------|------|-------------|
| `pv_id` | u32 | Join key |
| `session_id` | u32 | Session id |
| `page_id` | u32 | Page id |
| `event_name` | string | Event name (resolved) |
| `params_json` | string | Full params payload (resolved JSON string) |

Use `datalayer_event` for cross-event search ("which sessions fired any `add_to_cart`?"). For typed parameter columns, switch to `events.{name}` materials.

### events.{name} — Per-event typed materials

For each distinct event name a site emits, a dynamic material is exposed whose columns are the typed parameters declared in the event's manifest. Fixed columns across all events: `pv_id`, `session_id`. Discover the list via the `/guide` response field `sites[].datalayer_events[]`, which reports each event's `material`, `event_count`, and typed column schema.

Example — `events.purchase`:

| Column | Type | Description |
|--------|------|-------------|
| `pv_id` | u32 | |
| `session_id` | u32 | |
| `transaction_id` | string | |
| `value` | f64 | |
| `currency` | string | |
| `items` | string (JSON) | |

Discovery query (aggregate event names from `datalayer_event`):

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "datalayer_event" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "events": {
      "from": ["datalayer_event"],
      "keep": ["datalayer_event.event_name"],
      "calc": { "n": "COUNT(datalayer_event.pv_id)" }
    }
  },
  "result": { "use": "events", "sort": [{"by":"n","dir":"desc"}] }
}
```

---

## Data type cheatsheet

| Type | Range | Typical use |
|------|-------|-------------|
| `uint8` / `u8` | 0-255 | Small ids, booleans, percentages 0-100 |
| `uint16` / `u16` | 0-65535 | Medium ids, short counters |
| `uint32` / `u32` | 0-4.29B | Large ids, timestamps, counts |
| `uint64` / `u64` | huge | bitfields (`page_type`) |
| `int8` | -128..127 | Status flags (e.g. `page_fetch_status`) |
| `float` | IEEE754 | Derived metrics (`ctr`, `position`) |
| `string` | UTF-8 | URLs, titles, keywords |

---

## Tips

1. **Start from `/guide`.** It tells you which materials exist for each tracking site, their data ranges, and which goals / datalayer events are configured.
2. **Filter on indexed columns first.** Check each column's `search_hint` note; stick to `eq` / `in` on indexed columns when possible.
3. **URL filters: prefer `eq` / `in` over `contains`.** URL hash indices make exact matches fast; `contains` falls back to full scan.
4. **Join via ids, not strings.** Only integer join keys are allowed in this version.
5. **Behavioral metrics need real tracker data.** `depth_position`, `deep_read`, `stop_max_*`, etc. require the full JS tracker (not tag-only). Filter by `is_raw_p`/`is_raw_c`/`is_raw_e` via `goal_x` if you need to ensure the data is present.
6. **`device_type` values are case-sensitive:** exactly `"PC"`, `"SP"`, `"tablet"`. `desktop`, `mobile`, `smartphone` will not match.

---

## Next Steps

- **[QAL Guide](./qal.md)** — How to query these materials
- **[Endpoints](./endpoints.md)** — HTTP surface
- **[QAL Validation Manifest](./qal-validation.md)** — Machine-readable schema
- **[Getting Started](./index.md)** — Return to overview
