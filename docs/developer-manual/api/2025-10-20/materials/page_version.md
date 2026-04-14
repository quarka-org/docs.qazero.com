---
id: material-page-version-2025-10-20
title: page_version
sidebar_position: 6
---

# `page_version` — page version history

`page_version` records the **history of a page as its content
changed**. One row = "this page (identified by `page_id`) was in
this state (identified by `version_id`) from this time until this
time". It is how QA ZERO answers questions like *"did performance
change after we updated the article?"* without conflating old and
new behavior.

Use this material when the question involves **time-sliced content
changes** — A/B testing, before/after comparisons, tracking the
effect of a revision.

## Sample rows

Hand-crafted sample. Only `page_id` is shown as an ID (version_id
appears as a version label in the real material).

| page_id | version_id | title                              | word_count | first_seen          | last_seen           |
|--------:|-----------:|------------------------------------|-----------:|---------------------|---------------------|
| 1042    | 1          | "Best Coffee Grinders (2025)"       |        820 | 2025-11-02 00:00:00 | 2026-01-15 09:23:00 |
| 1042    | 2          | "Best Manual Coffee Grinders"       |       1240 | 2026-01-15 09:23:00 | 2026-02-28 14:07:00 |
| 1042    | 3          | "Best Manual Coffee Grinders (2026)"|       1510 | 2026-02-28 14:07:00 | (current)           |
| 1088    | 1          | "Hario Slim II"                     |        340 | 2025-09-10 00:00:00 | (current)           |
| 1201    | 1          | "V60 Brewing Guide"                 |        680 | 2025-10-01 00:00:00 | 2026-03-12 08:14:00 |
| 1201    | 2          | "How to Brew with V60"              |        950 | 2026-03-12 08:14:00 | (current)           |

Things to notice at a glance:

- `page_id 1042` has three versions. The title got more specific
  over time (`"Best Coffee Grinders (2025)"` → `"Best Manual
  Coffee Grinders (2026)"`), word count roughly doubled. A
  typical content refresh story.
- `page_id 1088` is a product page — one version since launch.
  Product pages usually do not rev.
- `page_id 1201` had a title change from declarative to
  instructional (`"V60 Brewing Guide"` → `"How to Brew with
  V60"`). If GSC position for that page changed around
  `2026-03-12`, you now have a story to tell.

## Columns the sample glosses over

- **`content_hash`** — a stable hash of the page body used for
  detecting actual content changes (vs. noise like a changed
  date stamp).
- **Version metadata** — change type, who changed it (if tracked),
  the reason.

See [`ai/materials.yaml`](../ai/materials.yaml) for the full list.

## Common JOIN keys

- `page_id` → `allpv.page_id` + `version_id` matching on
  `allpv.version_id` (to slice page views by the version that
  was live at the time)
- `page_id` → `gsc.page_id` (to slice search performance by
  version)

The typical analysis pattern is:

1. Query `page_version` for the versions of a page you care
   about.
2. Use the `first_seen` / `last_seen` windows to split `allpv`
   or `gsc` traffic by version.
3. Compare the segments.

## Good first questions for `page_version`

- "Did engagement time increase after we rewrote page 1042?"
- "How did the GSC position for page 1201 change across its
  versions?"
- "Which pages changed most recently?"
- "Which content updates correlate with traffic changes?"

## Where to go next

- **[`allpv`](./allpv.md)** — the base material you will slice
  by version.
- **[`/query` reference](../reference/query.md)**.
