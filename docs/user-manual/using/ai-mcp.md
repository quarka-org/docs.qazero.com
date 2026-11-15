---
sidebar_position: 110
title: AI Integration (MCP)
---

# AI Integration (MCP)

QA ZERO supports MCP (Model Context Protocol), a standard for connecting AI to tools and data. With MCP, you can ask AI to query and analyze your site's data in QA ZERO.

This page explains what you can do, how to connect, and what to know before using it.

## What you can do with MCP

- Check metrics by asking AI, without opening report screens.
- Explore pageviews, traffic sources, scroll depth, and reading behavior through conversation.
- Use AI-generated summaries as starting points for reports and improvement plans.

MCP access is **read-only**. AI cannot change QA ZERO settings or data.

See [Materials Explorer (data catalog)](pathname:///tools/materials-explorer/index.html) for available data fields.

## How to connect

MCP integration is available with **Claude Desktop** and **Claude Code**.

Visit the [AI integration (MCP)](https://qazero.com/ai-mcp/) page (in Japanese) on the QA ZERO website for connection instructions. Copy the provided prompt into Claude Desktop or Claude Code. Claude will read the instructions and guide you through the connection.

When using Claude Code, replace “Claude Desktop” with “Claude Code” in the prompt.

Connection instructions for other AI tools, including ChatGPT, are not currently provided.

You will need:

- Claude Desktop or Claude Code
- The URL of the site running QA ZERO
- An application password

Application passwords are currently issued by the QA ZERO team. Contact support to request one.

## How to ask AI

AI translates your questions into queries using QA ZERO's data fields. Ambiguous wording may produce results that differ from your intentions.

See [Prompt Examples for AI Integration (MCP)](./ai-mcp-prompts.md) for available data, terminology, and tips for asking clear questions.

## Data is available through the previous day

QA ZERO processes data in a nightly batch. MCP and API access therefore provide data **through the previous day**. Today's data becomes available the following morning, after processing finishes.

To check today's activity, use [Realtime](./realtime.md) in the admin screen.

:::note
Nightly processing starts around 2–3 a.m. Japan time. Large datasets may take until early morning to process. Plan to access the previous day's data after about 6 a.m. Japan time.
:::

## Using the API directly

MCP integration lets AI access QA ZERO through its API. You can also call the API directly.

To build custom integrations, dashboards, tools, or agents, see the [Developer Guide](../../developer-manual/introduction.md). It covers the API, QA ZERO's query language (QAL), and [technical MCP setup](../../developer-manual/integrations/mcp.md).

|   | MCP integration | Direct API access |
| --- | --- | --- |
| Best for | Asking AI to explore and analyze site data | Building integrations, dashboards, tools, or agents |
| How it works | Ask questions; AI builds the queries | Write QAL queries and send them to the API |
| Required knowledge | No programming knowledge required | Programming and API knowledge |
| Instructions | [AI integration (MCP)](https://qazero.com/ai-mcp/) (in Japanese) | [Developer Guide](../../developer-manual/introduction.md) |
