---
id: what-is-qa
title: What is QA
sidebar_position: 2
last_updated: 2026-07-01
---

# What is QA

QA ZERO is one edition of something larger. Understanding that larger
thing — **QA**, the trunk the editions grow from — is the fastest way
to understand why the API is shaped the way it is.

## QA is a Behavioral Intelligence Architecture

Traditional web analytics reports metrics: page views, sessions,
bounce rate, conversions. QA has a different objective.

> QA exists to help AI understand how humans interact with information.

Rather than producing reports for humans to read, QA builds
**structured behavioral knowledge that AI can reason with**. That is
why QA is not, at its core, an analytics platform. It is a Behavioral
Intelligence Architecture.

Raw behavioral events carry no meaning on their own. QA converts
observable behavior into structured knowledge, and the goal is not
collecting data — it is enabling AI to understand human intent.

```
Human → Behavior → Structured Events → Semantic Labels
     → Knowledge → Reasoning → Recommendation → Better Human Experience
```

Visualization is only one possible output. Understanding is the real
objective.

## Three principles for every behavioral event

- **Observable** — objectively measurable (scroll, click, hover,
  reading time, revisit, navigation).
- **Contextual** — the same behavior means different things on
  different sites. A three-minute read means *engaged learning* on
  documentation, *hesitation* on an e-commerce page, and *normal* on
  news. Context is therefore part of the data, not metadata around it.
- **Semantic** — meaning should not rely on statistical inference
  alone. QA supports explicit semantic labels (*reading carefully*,
  *comparing products*, *hesitating*, *task completed*), which become
  high-quality signal for AI.

## Why the labels are accurate: collective intelligence

Labels are only valuable if they are accurate, and accuracy is the
hard part — because the same behavioral value means different things
depending on the type of website. So labels must be **segmented by
context (site type)**, not applied globally.

QA's answer is collective intelligence: across a distributed network
of WordPress sites, humans and AI collaborate to raise the inference
accuracy specific to each site segment. This mechanism is the subject
of patent **JP 7011367**. Because the data stays on each site's own
server — Cookie-less, anonymized, no central cloud — QA is a
distributed, first-party counter to centralized analytics: each site
runs autonomously, yet all of them improve the shared understanding.

## How this shapes QA ZERO's API

Everything in this developer manual follows from the ideas above:

- **QAL, not SQL.** [QAL](./concepts/what-is-qal.md) is a small
  declarative language shaped so that an AI assistant composes a
  correct query on the first try, and so that a malformed query cannot
  damage the backing store.
- **Materials carry meaning, not just rows.** The
  [materials](./api/materials/) you query already encode behavioral
  context (deep-read, irritation clicks, engagement depth), not just
  raw hits.
- **The spec is machine-readable and first-class.** The
  [AI-facing spec](./for-ai/) ships next to the human docs so that
  LLMs, MCP servers, and agents consume it directly.

## QA does not replace GA4

QA is meant to be used **alongside** GA4. GA4 measures *what
happened*; QA adds *what it meant* and *what to do next*, so that
people can act on their own data instead of decoding numbers. The real
purpose is a creativity loop: when people can finally use the power of
their data, they spend less energy interpreting metrics and more
energy expressing their own creativity — and that creativity, observed
as behavior, feeds back to make the intelligence better.

## Where to go next

- [Get Started with AI](./get-started-with-ai.md) — compose your first
  query.
- [Concepts](./concepts/) — QAL, materials, views, results.
- [API Reference](./api/) — the REST API surface.
