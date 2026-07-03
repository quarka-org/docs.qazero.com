---
id: materials-index
title: Materials
sidebar_position: 1
---

# Materials

A **material** is a data surface you can query — one row per
observation, with a defined set of columns. QAL is built around a
fixed set of materials, chosen so that the grain of each one maps to a
natural human question about a website.

> The fastest way to understand a material is to look at the sample
> table on its page. Humans read sample rows faster than column lists.

:::tip Interactive — Materials Explorer
**[Open the Materials Explorer →](pathname:///tools/materials-explorer/index.html)** — a
searchable, browsable view of every material and field (keys vs. signals,
semantic families, `since` dates). Generated from the same machine-readable
spec. *(Prototype — Japanese UI for now.)*
:::

## In this section

- **[`allpv`](./allpv.md)** — one row per page view. Start here when
  the question is about traffic, sessions, referrers, or page
  popularity.
- **[`click_event`](./click_event.md)** — one row per recorded click.
  Use for click-through rates, rage clicks, element-level interest.
- **[`gsc`](./gsc.md)** — Google Search Console data. Use for search
  queries, impressions, and organic CTR.
- **[`goal_N`](./goal_n.md)** — conversion / goal events configured
  per site. Use when the question is about conversion rates.
- **[`page_version`](./page_version.md)** — page version metadata.
  Use when slicing by content changes or A/B.
- **[`summary_landingpage` / `summary_allpage` /
  `summary_days_access_detail`](./summary.md)** — pre-aggregated,
  period-cumulative summaries served from a single file read. Use when
  the question is a roll-up over a date range (landing-page sessions,
  page ranking, access detail by source) and you do *not* need a daily
  breakdown. **Since:** 2026-05-21

The authoritative column list for every material lives in
**[`ai/materials.yaml`](../../for-ai/materials.yaml)**. The pages here are
friendly previews; the YAML is the source of truth.

Each material in the YAML also carries a `supports_all: true | false`
flag declaring whether it accepts `tracking_id: "all"` (the cross-site
aggregate). Roughly: traffic-shaped materials (`allpv`, `click_event`,
`datalayer_event`, `events.{name}`) are `true`; per-site analytical
materials (`gsc`, `goal_N`, `page_version`, `ga4_*`) are `false`. See
the [`/guide` reference](../2026-05-11/reference/guide.md) for how to read the
flag at runtime. **Since:** 2026-04-29

## About the sample tables

Every material page includes a small, hand-crafted sample table with
realistic rows. The tables intentionally show **only three ID
columns** — `page_id`, `session_id`, `pv_id` — because those are the
keys you most often want to JOIN on. Real materials carry additional
IDs (event_id, page_version_id, …); those are documented in the YAML
spec but omitted from the sample tables to keep the shape of the data
visible at a glance.
