---
id: materials-index-2025-10-20
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

The authoritative column list for every material lives in
**[`ai/materials.yaml`](../ai/materials.yaml)**. The pages here are
friendly previews; the YAML is the source of truth.

## About the sample tables

Every material page includes a small, hand-crafted sample table with
realistic rows. The tables intentionally show **only three ID
columns** — `page_id`, `session_id`, `pv_id` — because those are the
keys you most often want to JOIN on. Real materials carry additional
IDs (event_id, page_version_id, …); those are documented in the YAML
spec but omitted from the sample tables to keep the shape of the data
visible at a glance.
