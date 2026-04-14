---
id: material-click-event-2025-10-20
title: click_event
sidebar_position: 3
---

# `click_event` — one row per click

`click_event` records every click a visitor makes, tied back to the
page view it happened on. One row = one click = one `(pv_id, moment,
target)` triple.

Use this material when the question is about **interaction**, not
just traffic: click-through rates, which buttons actually get pressed,
where people rage-click, what anchor text is working. If the question
can be answered without looking at individual clicks, use `allpv`
instead — click-event queries are more expensive.

## Sample rows

Hand-crafted sample. Only `pv_id`, `session_id`, `page_id` shown as
IDs; the full schema in [`ai/materials.yaml`](../ai/materials.yaml)
carries more (e.g. `event_sec`, `selector`, `element_text`,
`element_id`, `element_class`, `page_x_pct`, `page_y_pct`).

| pv_id | session_id | page_id | event_sec | element_text       | selector                  | to_url                     | is_external |
|------:|-----------:|--------:|----------:|--------------------|---------------------------|----------------------------|:-----------:|
| 91023 | 48217      | 1042    |        14 | "See our picks"    | `a.cta-main`              | `/products/hario-slim/`    |   —         |
| 91024 | 48217      | 1088    |         6 | "Add to cart"      | `button#add-to-cart`      | (no href)                  |   —         |
| 91024 | 48217      | 1088    |         7 | "Add to cart"      | `button#add-to-cart`      | (no href)                  |   —         |
| 91024 | 48217      | 1088    |         8 | "Add to cart"      | `button#add-to-cart`      | (no href)                  |   —         |
| 91024 | 48217      | 1088    |        11 | (image of product) | `img.product-hero`        | (no href)                  |   —         |
| 91027 | 48219      | 1201    |       142 | "Buy on Amazon"    | `a.affiliate-link`        | `https://amazon.co.jp/...` | ✓           |
| 91028 | 48220      | 1088    |         4 | "Add to cart"      | `button#add-to-cart`      | (no href)                  |   —         |

Things the sample is trying to show at a glance:

- **`pv_id 91024`** has four rapid clicks on the same button over
  5 seconds: three on `button#add-to-cart`, one dead-click on the
  product image. That is a **rage-click pattern** — the button did
  not respond and the visitor started stabbing at anything
  clickable. This is the kind of row that should surface in a
  "pages with frustrated visitors" query.
- **`pv_id 91027`** — one click, 142 seconds after page load, on
  an affiliate link. That is an **earned click**: the visitor
  actually read the content before converting. Completely
  different story from the rage-click session.
- **`pv_id 91028`** is another visitor hitting the same "Add to
  cart" button, also within 4 seconds. Paired with the
  `irritation_click_count = 4` on that same `pv_id` in the `allpv`
  sample, it confirms the button has a real problem.

## Columns the sample glosses over

- **Event timing**: `event_sec` is the seconds from page load to
  click — useful for "did they read before clicking" analysis.
- **Element position**: `page_x_pct`, `page_y_pct` are the
  click coordinates as a percentage of the page, normalized across
  viewports. Useful for heatmap-style queries.
- **Element metadata**: `element_id`, `element_class`,
  `element_data` carry the attributes of the clicked element for
  finer-grained rollups than `selector` alone.
- **Action classification**: `action_id` is the internal action
  type for the click (navigation, form submit, outbound, …).

See [`ai/materials.yaml`](../ai/materials.yaml) for the full list.

## Common JOIN keys

- `pv_id` → `allpv.pv_id` (pull in the page-level context for a
  click — device, referrer, browse_sec, etc.)
- `session_id` → `allpv.session_id` (session-scoped aggregations)
- `page_id` → `page_version.page_id` (what version of the page was
  live when the click happened)

## Good first questions for `click_event`

- "Which buttons on the product page have the highest click-through
  rate?"
- "Where on the page do people click most — above or below the
  fold?"
- "Which pages have the most rage clicks?"
- "What is the average time-to-first-click on the hero CTA?"
- "Which outbound links are actually driving traffic?"

## Where to go next

- **[`allpv`](./allpv.md)** — the per-page-view context you will
  usually want to JOIN with.
- **[`/query` reference](../reference/query.md)**.
