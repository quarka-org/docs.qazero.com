---
id: material-allpv
title: allpv
sidebar_position: 2
last_updated: 2026-11-02
api_update: 2026-11-02
---

# `allpv` — one row per page view

`allpv` is the **starting point** for most questions about a website.
One row = one page view = one person landed on one URL at one moment.
Everything about that moment is recorded: the referrer, the device,
how long the person stayed, whether they rage-clicked, whether the
page was deep-read, whether it was the last page of the session.

If the user's question is about traffic, sessions, referrers, devices,
or "which pages are popular", this is the material you want.

## Sample rows

The table below is a hand-crafted sample — the shape you should
expect to see, not real data from any site. Only three ID columns
are shown (`page_id`, `session_id`, `pv_id`); the full schema in
[`ai/materials.yaml`](../../for-ai/materials.yaml) carries many more.

| pv_id | session_id | page_id | url                       | referrer              | device  | browse_sec | deep_read | stop_max_sec | irritation_click | is_last |
|------:|-----------:|--------:|---------------------------|-----------------------|---------|-----------:|----------:|-------------:|-----------------:|:-------:|
| 91023 | 48217      | 1042    | `/blog/coffee-grinders/`   | google / organic      | mobile  |        312 |         1 |          142 |                0 | —       |
| 91024 | 48217      | 1088    | `/products/hario-slim/`    | (same-site nav)       | mobile  |         28 |         0 |            8 |                2 | —       |
| 91025 | 48217      | 1042    | `/blog/coffee-grinders/`   | (same-site nav, back) | mobile  |         64 |         0 |           22 |                0 | ✓       |
| 91026 | 48218      | 1003    | `/`                       | (direct)              | desktop |         11 |         0 |            6 |                0 | ✓       |
| 91027 | 48219      | 1201    | `/recipes/v60/`            | pinterest.com         | mobile  |        498 |         1 |          221 |                0 | ✓       |
| 91028 | 48220      | 1088    | `/products/hario-slim/`    | google / ads          | desktop |         15 |         0 |           11 |                4 | ✓       |

Things the sample is trying to show you at a glance:

- **Session 48217** came from Google, deep-read the blog post
  (`stop_max_sec = 142`), bounced to the product page, got annoyed
  (`irritation_click = 2`), bounced back, then left. That is a
  classic *"the article was interesting, the product page was
  not"* pattern.
- **Session 48219** is the kind of row you are hoping for: one
  page view, 8+ minutes on page, deep-read, from Pinterest. That is
  a content discovery success.
- **Session 48220** is a Google Ads click that landed on the same
  product page 48217 bounced off of — and also got irritation
  clicks. Two independent signals pointing at the same page-level
  problem.

A real `allpv` row carries many more columns than shown here. The
YAML spec is the authoritative list.

## Columns the sample glosses over

For brevity, the sample table omits these families of columns. They
are documented in [`ai/materials.yaml`](../../for-ai/materials.yaml):

- **Source attribution**: `source_id`, `medium_id`, `campaign_id`,
  `content_id`, plus the raw `utm_*` fields.
- **Device details**: `device_type`, `os`, `browser`, `language`,
  `country_code`.
- **Browser viewport**: `window_inner_width`, `window_inner_height`
  (uint16) — the browser's live `window.innerWidth` / `window.innerHeight`
  in CSS pixels at the moment of the page view: the *actual rendered
  content area*, not the device's screen resolution. `0` means the
  source header was missing for that view; filter `gte: 1` to keep only
  real measurements. Useful for responsive-breakpoint and viewport-band
  analysis (`between: 768, 1199` ≈ tablet, `gte: 1200` ≈ desktop).
  **Since:** 2026-05-20
- **Engagement depth**: `dead_click_image_count`, `scroll_back_count`,
  `content_skip_count`, `exploration_count`, `depth_position`,
  `exit_pos`.
- **Page transition**: `prev_page_id`, `next_page_id` (physical IDs),
  plus `prev_url`, `prev_title`, `next_url`, `next_title` (virtual,
  resolved from `qa_pages`). **Since:** 2026-04-17
- **Page type flags**: `is_article`, `is_product`, `is_list`,
  `is_form`, `is_top_page`, … — a whole family of boolean flags
  classifying what kind of page this is.
- **Goal flags**: `is_goal_1` through `is_goal_10` — whether this
  page view triggered a configured goal.
- **Other IDs**: `reader_id`, `device_id`, `version_id`, etc. The
  three ID columns shown in the sample (`pv_id`, `session_id`,
  `page_id`) are the ones you will typically JOIN on.

## Time buckets: `month`, `hour`, `weekday` {#time-buckets}

QAL has no function that rounds a timestamp to a month, hour, or day of
week (`calc` is a fixed whitelist). Instead, `allpv` exposes three
virtual columns computed from `access_time` at query time. Put one in
`keep` and the rows are grouped by it.

| Column | Type | Values | Since |
|---|---|---|---|
| `month` | string | `"YYYY-MM"` | 2026-08-05 |
| `hour` | int | `0`–`23` | 2026-11-02 |
| `weekday` | int | `0`–`6`, `0` = Sunday (same as PHP `w`) | 2026-11-02 |

- **Site clock.** All three are computed on the site's own clock (the
  WordPress timezone). `time.tz` does not change them; it only decides
  which day files are read.
- **Daylight saving time.** Hours are counted on the wall clock. On the
  autumn fall-back day, `hour = 1` holds two hours of traffic; on the
  spring-forward day, `hour = 2` has no rows. GA4 counts the same way.
- **Narrow with `time` first.** These columns are meant for `keep`.
  Filtering on them runs as a post-filter after every row has been
  decoded, which is slow. Narrow the period with `time`, and use
  physical columns (`source_id`, `medium_id`, `is_newuser`, …) in
  `filter` before adding a bucket to `keep`. A 12-month query with no
  narrowing is heavy whether or not you use these columns.
- **Integers only.** `hour` and `weekday` are integers, so `prefix` and
  `contains` do not apply.
- **No zero-fill, no implicit order.** An hour or weekday with no page
  views returns no row. Rows come out in first-seen order, so add a
  `sort` on the bucket column to get clock or calendar order.
- **Labels are yours.** `weekday` returns numbers; map them to "Sun",
  "Mon", … on the client side.

Example — page views by hour of day, in clock order:

```json
"make": {
  "by_hour": {
    "from": "allpv",
    "keep": ["hour"],
    "calc": { "views": { "count": "*" } },
    "sort": [{ "column": "hour", "direction": "asc" }]
  }
}
```

`gsc` has `month` too, but not `hour` or `weekday` (its rows are per
day). See [`gsc`](./gsc.md#month).

**Since:** `month` 2026-08-05 · `hour` / `weekday` 2026-11-02. Check
`features.material_month_bucket` and `features.material_hour_weekday_bucket`
in `/guide` before relying on them.

## Common JOIN keys

- `pv_id` → `click_event.pv_id` (which clicks happened on this
  page view)
- `session_id` → `click_event.session_id` (session-scoped analysis)
- `page_id` → `gsc.page_id` (organic search data for the same URL)
- `page_id` → `page_version.page_id` (content version at the time
  of the view)

## Good first questions for `allpv`

- "Which pages lost the most traffic in the last 30 days?"
- "Which referrers drive the longest sessions?"
- "What is the mobile vs. desktop split on the checkout page?"
- "Which pages have high deep-read but low conversion?"
- "Which pages show unusually high `irritation_click_count`?"
- "At what hours and on which weekdays does direct traffic arrive?"
  (`keep: ["hour", "weekday"]`)

Any of these can be expressed as one or two QAL views on `allpv`.

## Where to go next

- **[`click_event`](./click_event.md)** — click-level detail for the
  same page views.
- **[`gsc`](./gsc.md)** — organic search data joinable on `page_id`.
- **[`/query` reference](../2026-05-11/reference/query.md)** — how to actually
  send a QAL query over the wire.
