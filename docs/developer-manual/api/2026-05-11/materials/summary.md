---
id: material-summary-2026-05-11
title: summary_*
sidebar_position: 7
---

# `summary_*` — pre-aggregated, period-cumulative roll-ups

**Since:** 2026-05-21

Three summary materials expose the **year-to-date integrals** that the
nightly batch already maintains. Where `allpv` is one row per page view,
a summary material is one row per *combination of its grouping
dimensions*, with the counts accumulated over the requested date range.

Reach for these when the question is a **roll-up over a date range** —
"landing-page sessions last quarter", "top pages by pageviews this
year", "access detail by source / medium / campaign" — and you do **not**
need a day-by-day breakdown. Because each material reads one cumulative
file (a few files for cross-year ranges) instead of scanning millions of
`allpv` rows, the typical roll-up is two to three orders of magnitude
faster.

| Material | Grain (grouping dimensions) | Use it for |
|---|---|---|
| `summary_landingpage` | landing page × device × utm trio × is_newuser × second_page × is_QA | Entry-page (landing) performance |
| `summary_allpage` | page × device × utm trio × is_newuser × is_QA | Page ranking across the whole site |
| `summary_days_access_detail` | device × source × medium × campaign × is_newuser × is_QA | Acquisition / traffic-source detail |

All three are `supports_all: true` — they can be queried with
`tracking_id: "all"` (the cross-site aggregate built nightly) as well as
a real per-site `tracking_id`.

:::caution No `date` dimension
A summary material returns **one cumulative set for the requested
period**, not a daily series. The counts are period integrals
(`(end) − (start − 1)`), so cross-year ranges work, but there is no
per-day row. If you need a daily trend, query `allpv` (which has a
`date` dimension) instead.

Numeric-range filters on the count columns (`pv_count`,
`session_count`, …) are applied as a `post_filter` **after** the
cumulative roll-up, not as a storage-level scan.
:::

## Sample rows — `summary_allpage`

A hand-crafted sample showing the shape, not real data. Only the grain
and a few measures are shown; the full column set is in
[`ai/materials.yaml`](../ai/materials.yaml).

| page_id | device_type | utm_source | is_newuser | pv_count | user_count | bounce_count | time_on_page |
|--------:|-------------|------------|-----------:|---------:|-----------:|-------------:|-------------:|
| 1042    | PC          | google     | 1          |    12894 |       9311 |         4120 |       903112 |
| 1042    | SP          | google     | 1          |    20557 |      17402 |         9881 |       742330 |
| 1088    | SP          | (direct)   | 0          |     3301 |       2210 |         1004 |        61120 |
| 1201    | PC          | pinterest  | 1          |      812 |        790 |          120 |       240551 |

Read it as: page `1042` pulls far more mobile (`SP`) new-user traffic
from Google than desktop, but the mobile bounce rate is visibly worse
(`9881 / 20557` vs `4120 / 12894`). That is the kind of comparison
`summary_allpage` answers in a single file read.

## Column families

The exact columns differ slightly per material (see the YAML spec for
the authoritative list). Across the three they fall into:

- **Grouping dimensions** (filter / `keep` on these): `page_id`,
  `device_id` (with a virtual `device_type` label via value mapping —
  `1 = PC`, `2 = SP`, `3 = tablet`), `utm_source`, `utm_medium`,
  `utm_campaign`, `source_domain`, `is_newuser`, `is_QA`, plus
  `second_page` (`summary_landingpage` only).
- **Cumulative measures**: `pv_count`, `session_count`, `user_count`,
  `bounce_count`, and a time total (`session_time` for
  `summary_landingpage`, `time_on_page` for the other two). Per-material
  extras: `exit_count` and `lp_count` (`summary_allpage`),
  `is_newuser_count` (`summary_days_access_detail`).
- **Resolved page attributes** (page-grained materials only): `title`,
  `url`, `wp_qa_id` — restored from `page_id` on the loader side.

Note that `utm_source` / `utm_medium` / `utm_campaign` come back as
**label strings** (already ID-resolved by the loader), so you do not
join them to a master table the way you would for raw `allpv` IDs.

## Good first questions

- "Top 20 landing pages by sessions for new users, last 90 days."
  → `summary_landingpage`, filter `is_newuser: 1`, sort by
  `session_count desc`, `top: 20`.
- "Pageview ranking across the whole site this year."
  → `summary_allpage`, sort by `pv_count desc`.
- "Pageviews and bounces by source / medium for the campaign window."
  → `summary_days_access_detail`, group by the utm trio.

## Where to go next

- **[`allpv`](./allpv.md)** — use this instead when you need a daily
  trend or per-page-view detail the summaries roll away.
- **[`/query` reference](../reference/query.md)** — how to send the
  query over the wire.
