---
slug: qa-labo-spring-2026-update
title: "qa-labo spring 2026: filter, join, calc, and a lot of new materials"
authors: [kojimaruyama]
tags: [qa-labo, qal, api]
---

Most of the heavy lifting in QA ZERO happens in a sibling repository called **qa-labo** — the experimental fork where new features incubate before they roll up into the production plugin. This post is the first in what I hope becomes a regular stream of notes from that work.

Since the last time this blog updated, qa-labo has filled in almost everything the original QAL `2025-10-20` guide listed as "not yet available". The API version is **unchanged** — these are additive, so you can keep using `?version=2025-10-20` and just start using the new features.

<!-- truncate -->

## What's new in QAL

The original release shipped `from` + `keep` and little else. You can now write full queries:

- **`filter`** — flat, AND-combined row filter with ten operators (`eq`, `neq`, `gt`/`gte`, `lt`/`lte`, `in`, `contains`, `prefix`, `between`). Keys are plain column names belonging to the source material, so `{ "device_type": ["SP"], "url": { "prefix": "/blog" } }` "just works".
- **`join`** — single equi-join per view, id-columns only. N:M materials like `gsc` now require a filter on the joined side (enforced by the executor as `E_JOIN_FILTER_REQUIRED`) — we hit this in production when a stray join blew up a 100-PV page into 15,000 rows. The rule is strict by design.
- **`calc`** — whitelisted aggregation (`COUNT`, `COUNTUNIQUE`, `SUM`, `AVERAGE`, `MIN`, `MAX`) with a strict single-column argument. `COUNT(*)` is still banned — always name the column, which keeps the optimizer honest.
- **View chaining** — `from: ["<earlier_view>"]` inside the same `make` block. This is where QAL starts feeling like a real query language: filter once in a base view, then aggregate it two different ways in child views without re-scanning the column DB.
- **`result.sort`, `result.sample`, `result.include_count`** — these keys are reserved in the spec but **not yet implemented**. `sort` is currently rejected as `E_RESULT_FORBIDDEN_KEY`, and `sample`/`include_count` pass validation but are no-ops. Sort and size-check client-side until the `features` map in `/guide` flips them on.

The [QAL Guide](/docs/developer-manual/api/2025-10-20/qal-2025-10-20) has been completely rewritten to cover all of this, and the [Validation Manifest](/docs/developer-manual/api/2025-10-20/qal-validation-2025-10-20) now reflects the executor's real rules instead of the initial "everything is disabled" stub.

## New materials

`allpv` and `gsc` are no longer alone. `/guide` now surfaces:

- **`goal_1`..`goal_N`** — per-PV conversion logs, one material per configured goal. For "did this PV achieve goal 3?" there are also **virtual** columns `is_goal_1`..`is_goal_10` on `allpv` so you can filter without switching materials.
- **`ga4_age_gender`, `ga4_country`, `ga4_region`** — GA4 attribute data landed via T48. These are aggregate materials (no `pv_id`), meant to complement `allpv` with demographics that first-party tracking doesn't see.
- **`page_version`** — per-page content version tracker (T53). Joins to `allpv` on `version_id`, 1:1, so you can attach version metadata to PVs without worrying about row explosion.
- **`click_event`** — click events with selector, element text, destination URL, and page-relative coordinates. Joinable via `pv_id`.
- **`datalayer_event`** (+ dynamic **`events.{name}`**) — sites that ship dataLayer events now get both a uniform index of every event and a typed per-event material whose columns reflect that event's parameters. The `/guide` response lists every `events.*` material the site exposes.

And `allpv` itself grew a lot of new columns: behavioral metrics (`depth_position`, `deep_read`, `stop_max_sec`, `stop_max_pos`, `exit_pos`, `is_submit`, `dead_click_image_count`, `irritation_click_count`, `scroll_back_count`, `content_skip_count`, `exploration_count`) and generated page-type booleans (`is_article`, `is_product`, `is_form`, `is_faq`, and so on). The [Materials Reference](/docs/developer-manual/api/2025-10-20/materials-2025-10-20) has the full list.

## Why "docs as a knowledge base for AI"?

This blog sits in a **public** repository on purpose. The API documentation for QA ZERO is optimized not just for human developers but for **AI assistants that are about to write a QAL query**. If an LLM is going to generate a valid query for you, it needs:

- Exact, machine-readable validation rules (hence the YAML frontmatter on the validation manifest being identical to the body).
- A clear list of allowed column names per material (hence every material page linking out of `/guide`).
- Explicit error codes with the cause, so the assistant can self-correct rather than hallucinate.

The blog itself is a lower-ceremony channel: design notes, "why we did it this way" stories, and dev diaries. Expect it to update irregularly — when something interesting ships in qa-labo, not on a fixed cadence.

## What's next

The shortlist on my desk right now:

- `OR` across filter conditions (the top complaint since `filter` went live).
- HAVING-style filtering over aggregated results.
- `return.mode = "FILE"` with CSV and Parquet output for the "I need 5 million rows" case.
- More attribute materials as additional sources land.

If you're building against the QA ZERO API and something in the new surface is unclear, file an issue against [quarka-org/docs.qazero.com](https://github.com/quarka-org/docs.qazero.com) — the repo is public precisely so problems in the docs are as easy to report as problems in the code.

— Koji
