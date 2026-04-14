---
id: material-goal-n-2025-10-20
title: goal_N
sidebar_position: 5
---

# `goal_N` — conversion / goal events

`goal_N` is a **family** of materials, not a single one. Each site
can define up to ten goals, and each goal gets its own material
named `goal_1`, `goal_2`, …, `goal_10`. A row in `goal_3`, for
example, is "someone triggered goal #3 on this site".

Use `goal_N` whenever the question is about **conversion**: how
many goals fired, which pages drove them, which referrers, what
the path to conversion looked like. If the user says "conversion",
"signup", "purchase", "lead", "contact form submission", think
`goal_N`.

## Which goal is which?

The `/guide` endpoint returns a `sites` array, and every site has a
`goals` list containing `id`, `name`, and a human-readable
condition. That is where you look up which goal number means what.
**Never guess** that `goal_1` is "signup" — it depends on how the
site owner configured their site.

A typical `sites[0].goals` response:

```json
[
  { "id": 1, "name": "Contact form submit", "type": "gtype_page",
    "condition": { "url": "/contact/thanks", "match": "exact" } },
  { "id": 2, "name": "Newsletter signup",   "type": "gtype_click",
    "condition": { "page": "/", "selector": "#newsletter-submit" } },
  { "id": 3, "name": "Free trial started",  "type": "gtype_page",
    "condition": { "url": "/trial/start",   "match": "exact" } }
]
```

If the user asks "how many signups did we get this week?", you
look at that list, pick the goal whose `name` is "Newsletter
signup" (or whichever matches intent), and query the corresponding
`goal_N` material.

## Sample rows

Hand-crafted sample for `goal_3` ("Free trial started"). Only
`page_id`, `session_id`, `pv_id` shown as IDs.

| pv_id | session_id | page_id | access_time         | url                  | referrer         | device  | browse_sec |
|------:|-----------:|--------:|---------------------|----------------------|------------------|---------|-----------:|
| 91030 | 48221      | 1305    | 2026-04-14 09:14:22 | `/trial/start`       | google / organic | desktop |         38 |
| 91033 | 48224      | 1305    | 2026-04-14 10:02:11 | `/trial/start`       | (direct)         | mobile  |         72 |
| 91041 | 48228      | 1305    | 2026-04-14 11:48:55 | `/trial/start`       | twitter.com      | mobile  |         24 |
| 91048 | 48230      | 1305    | 2026-04-14 13:22:07 | `/trial/start`       | google / ads     | desktop |         19 |

Things to notice at a glance:

- Every row has the same `page_id` (1305) and URL (`/trial/start`).
  That is expected: `goal_3` is a page-type goal, so every goal
  firing is a page view of the thanks/start page.
- The rows differ in who got there and how: a mix of organic,
  direct, social, and paid. That is exactly what makes this
  material useful — you can break down conversions by any of the
  `allpv`-style columns.

Every `goal_N` material shares the same shape as `allpv` but is
already filtered to the page views that triggered that goal. That
means **you do not need to JOIN** to get source, device, referrer,
or engagement columns — they are already there on each row.

## Common JOIN keys

- `pv_id` → `click_event.pv_id` (what did the user click on the
  conversion page view?)
- `session_id` → `allpv.session_id` (what other pages did they
  see in the session before converting?)
- `page_id` → `gsc.page_id` (did they come from organic search?)

## Good first questions for `goal_N`

- "How many conversions did we get this week, by source?"
- "Which referrers drive the highest-quality conversions
  (longest browse_sec pre-conversion)?"
- "What is our conversion rate by device type?"
- "Which landing pages lead to the most conversions two steps
  later?"

## Where to go next

- **[`/guide` reference](../reference/guide.md)** — to see the
  structure of `sites[].goals` in a live response.
- **[`allpv`](./allpv.md)** — the base material `goal_N` is
  derived from.
