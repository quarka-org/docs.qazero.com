---
id: material-gsc-2025-10-20
title: gsc
sidebar_position: 4
---

# `gsc` — Google Search Console data

`gsc` exposes Google Search Console data at the grain of
`(page, query, day, search_type)`. One row = one search query that
showed one page of your site to someone on one day, on one search
surface (web / image / video).

Use this material when the question is about **organic search**:
which queries bring traffic, which pages rank for what, where CTR
is surprisingly low, where position is climbing or falling. If the
question is not about search, do not use `gsc` — its grain is wide
and it joins expensively.

## Sample rows

Hand-crafted sample. Only `page_id` is shown as an ID (GSC has no
per-impression or per-session identifiers). The full schema is in
[`ai/materials.yaml`](../ai/materials.yaml).

| page_id | query                          | search_type | clicks | impressions | ctr    | position |
|--------:|--------------------------------|:-----------:|-------:|------------:|-------:|---------:|
| 1042    | `best manual coffee grinder`    | web         |    142 |       3,210 | 4.42%  |     4.8  |
| 1042    | `hario slim review`             | web         |     98 |         410 | 23.90% |     2.1  |
| 1042    | `coffee grinder under 50`       | web         |      6 |       1,880 | 0.32%  |     9.4  |
| 1088    | `hario slim`                    | web         |    312 |         720 | 43.33% |     1.3  |
| 1088    | `hario slim vs porlex`          | web         |     18 |         150 | 12.00% |     3.7  |
| 1201    | `v60 brewing ratio`             | web         |    480 |       2,100 | 22.86% |     2.4  |
| 1201    | `how to use v60`                | web         |    210 |       9,800 | 2.14%  |     6.9  |

Things the sample is trying to show at a glance:

- **`page_id 1042`** ranks well for a narrow query (`hario slim
  review`, CTR 23.9%, position 2.1) but poorly for a broad one
  (`coffee grinder under 50`, CTR 0.32%, position 9.4). Classic
  long-tail story: the niche terms convert, the broad terms leak.
- **`page_id 1088`** is the product page. The branded query
  (`hario slim`) has CTR 43% at position 1.3 — expected. But the
  comparison query (`hario slim vs porlex`) is only position 3.7
  with CTR 12%. Comparison intent is not being captured well; that
  is a content gap worth flagging.
- **`page_id 1201`** ranks well for `v60 brewing ratio` (position
  2.4, CTR 22.9%) but poorly for `how to use v60` (position 6.9,
  CTR 2.1%). Two queries, same page, very different performance —
  a strong hint that the page title/H1 does not match the broader
  query's intent.

## Columns the sample glosses over

- **`query_id`** — an integer foreign key into the keyword table.
  Prefer `keyword` for reading; `query_id` is the key you would
  use for efficient filtering.
- **`position_x100`** — the raw stored position (×100). The
  `position` column shown in the sample is the decoded float.
- **`position_weighted`** — virtual column for impression-weighted
  position calculations.
- **`url`**, **`title`**, **`page_type`**, **`page_fetch_status`**
  — master-resolved columns (via `page_id`) so you do not need to
  JOIN `allpv` just to get the URL of a page.

See [`ai/materials.yaml`](../ai/materials.yaml) for the full list.

## ⚠️ JOIN caution

`gsc` has an **N:M** relationship with `allpv` on `page_id`:

> One page can have dozens or hundreds of GSC rows (many queries,
> many days) for each page view. Joining `gsc` to `allpv` without
> a filter can explode row counts (e.g. 100 page views × 150
> keyword-days = 15,000 rows).

**Always filter `gsc` before joining.** Typical filters are on
`keyword`, on `search_type`, or on a specific date range tighter
than the overall query's time window.

## Good first questions for `gsc`

- "Which search queries are driving the most clicks to my blog?"
- "Which pages have high impressions but low CTR? (i.e. title /
  snippet needs work)"
- "Which queries are we ranking for that we did not target?"
- "What is our average position for branded vs. non-branded
  queries?"
- "Where is position dropping month over month?"

## Where to go next

- **[`allpv`](./allpv.md)** — page-view-level data to JOIN with.
- **[`/query` reference](../reference/query.md)**.
