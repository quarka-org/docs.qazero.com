---
id: material-allpv-2025-10-20
title: allpv
sidebar_position: 2
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
[`ai/materials.yaml`](../ai/materials.yaml) carries many more.

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
are documented in [`ai/materials.yaml`](../ai/materials.yaml):

- **Source attribution**: `source_id`, `medium_id`, `campaign_id`,
  `content_id`, plus the raw `utm_*` fields.
- **Device details**: `device_type`, `os`, `browser`, `language`,
  `country_code`.
- **Engagement depth**: `dead_click_image_count`, `scroll_back_count`,
  `content_skip_count`, `exploration_count`, `depth_position`,
  `exit_pos`.
- **Page type flags**: `is_article`, `is_product`, `is_list`,
  `is_form`, `is_top_page`, … — a whole family of boolean flags
  classifying what kind of page this is.
- **Goal flags**: `is_goal_1` through `is_goal_10` — whether this
  page view triggered a configured goal.
- **Other IDs**: `reader_id`, `device_id`, `version_id`, etc. The
  three ID columns shown in the sample (`pv_id`, `session_id`,
  `page_id`) are the ones you will typically JOIN on.

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

Any of these can be expressed as one or two QAL views on `allpv`.

## Where to go next

- **[`click_event`](./click_event.md)** — click-level detail for the
  same page views.
- **[`gsc`](./gsc.md)** — organic search data joinable on `page_id`.
- **[`/query` reference](../reference/query.md)** — how to actually
  send a QAL query over the wire.
