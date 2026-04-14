---
sidebar_position: 1
title: Introduction
---

# QA ZERO Developer Manual

> **AI で仕事の形は変わる。だからこそ、人がもっと面白いことに時間を使える土台を作りたい。**

This is the developer manual for **QA ZERO**: a small, self-contained
analytics platform designed for the AI era. It exists so that humans and
AI assistants can get at honest, high-fidelity behavioral data about a
website, **without** renting a cloud data warehouse and **without**
handing raw schemas to an LLM.

## What this manual is about

Most analytics APIs read like they were written for SQL-fluent humans
with a warehouse budget. QA ZERO is different by design:

- It runs on commodity shared hosting. No BigQuery, no Redshift, no
  cluster. Your hosting plan is the compute budget.
- Its query layer, **QAL**, is a deliberately small declarative language
  — not SQL. It is shaped so that an AI assistant can compose a correct
  query on the first try, and so that a malformed query cannot damage
  the backing store.
- Its machine-readable spec ships alongside the human-readable docs.
  LLMs, MCP servers, and custom agents can consume the spec directly
  and stay in sync as the API evolves.

In one sentence: **this is an observation platform built so that AI can
operate it responsibly, on any server, for anyone who has a website.**

## Who this manual is for

It is for people building on top of QA ZERO — directly or through AI
assistants. That includes:

- Developers wiring QA ZERO into dashboards, bots, agents, or MCP servers.
- Engineers evaluating whether QAL is a better fit than SQL for
  AI-driven analytics workflows.
- Researchers and operators trying to understand *why* the API is shaped
  the way it is.

If you are configuring QA ZERO as an end user (installing the plugin,
setting up tracking, reading reports), you want the **user manual**, not
this one.

## On replacement and change

> AI によって、今ある仕事の多くは形を変えると思う。なくなる役割もあるだろう。
> それでも人間は、効率だけでは測れない営みの中で、新しい意味や価値を作り続ける存在だ。
> だから私は、作業のために時間を溶かすのではなく、人がもっと考えたり、試したり、遊んだりできる側へ時間を戻したい。

QA ZERO is not neutral about AI. It is built on the expectation that
the shape of analytics work is going to change substantially, and that
people will need tools that hand the tedious parts over to AI while
keeping judgment, curiosity, and taste in human hands.

The design choices in the rest of this manual — a minimal query
language, first-class machine-readable specs, predictable cost, no
cloud-warehouse dependency — all point in the same direction.

> **データは人を縛るためではなく、人の時間と創造性を支えるために使いたい。**

## Where to go next

- [Get Started with AI](./get-started-with-ai.md) — the entry point for
  building your first query.
- [Concepts](./concepts/) — what QAL is, why it exists, and how the
  pieces fit together.
- [Version 2025-10-20](./api/2025-10-20/) — the current API version.
  Materials, reference, and the AI spec live here.
- [AI Instructions](./api/2025-10-20/ai/) — the minimal rule set served
  to AI / MCP clients.

> **作業のための分析から、創造のための観測基盤へ。**
