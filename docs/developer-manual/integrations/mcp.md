---
id: integrations-mcp
slug: /developer-manual/integrations/mcp
title: MCP Server
sidebar_label: MCP Server
sidebar_position: 1
last_updated: 2026-07-14
description: Connect Claude Desktop and other MCP clients to QA ZERO so an AI can query your analytics through QAL.
---

# MCP Server — Claude Desktop & other AI clients

The **QA ZERO MCP server** is a small, official connector that lets an
AI client — Claude Desktop, or any host that speaks the
[Model Context Protocol](https://modelcontextprotocol.io) — read your
analytics through the QA ZERO REST API. You point it at your site, the
AI asks questions in plain language, and the connector translates them
into safe [QAL](../concepts/what-is-qal.md) queries.

It does **not** hand the AI your database. It exposes exactly two
read-only tools over the same `/guide` and `/query` endpoints a human
would use, and nothing else.

:::note Who this is for
People who want to **use** the connector as-is to let an AI read their
QA ZERO data. If you want to build your own MCP wrapper or a different
kind of connector, see [Extending](../extending/index.md) instead.
:::

## What it gives the AI

The server registers two tools. The AI decides when to call them; you
just talk to it.

| Tool | What it does |
|------|--------------|
| `qa_get_guide` | Fetches the live spec: available materials, feature flags with `since` dates, and the list of `tracking_id`s you can query. The AI calls this **first** to learn what the server supports. |
| `qa_execute_query` | Runs one QAL query and returns rows plus a `meta` count. The AI builds the query from what `qa_get_guide` told it. |

Because `qa_get_guide` reports the server's live `features` map, the
connector automatically reflects whatever your server version supports
— you never edit a capability list by hand.

## Before you start

- **Node.js 18 or newer** on the machine that runs the AI client.
- **A QA ZERO site** with the plugin active and the REST API reachable.
- **A WordPress Application Password** for the account the connector will
  authenticate as. Create one under **Users → Profile → Application
  Passwords** in wp-admin (name it e.g. `Claude MCP`), and copy the
  generated value — spaces and all.

:::tip Least privilege
Use a dedicated WordPress user with only the access it needs, rather
than your main admin account.
:::

## Install

The connector is published as open source at
**[quarka-org/qa-platform-mcp](https://github.com/quarka-org/qa-platform-mcp)**
(Apache-2.0). Clone and build it:

```bash
git clone https://github.com/quarka-org/qa-platform-mcp.git
cd qa-platform-mcp
npm install
npm run build
```

That produces `dist/index.js`, which is what your AI client runs. Note
the absolute path to it — you will need it in the next step.

:::note npm package
A one-line `npx` install is planned but not yet published to the npm
registry. Until it lands, use the clone-and-build steps above. When the
package ships, this page will be updated with the `npx` form.
:::

## Configure Claude Desktop

Open Claude Desktop's config file and add a `qa-platform` server entry.

| OS | Config file |
|----|-------------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "qa-platform": {
      "command": "node",
      "args": ["/absolute/path/to/qa-platform-mcp/dist/index.js"],
      "env": {
        "QA_PLATFORM_ENDPOINT": "https://your-site.com/wp-json",
        "QA_PLATFORM_USERNAME": "your-username",
        "QA_PLATFORM_PASSWORD": "xxxx xxxx xxxx xxxx xxxx xxxx"
      }
    }
  }
}
```

Restart Claude Desktop after saving. The `qa-platform` tools should
appear in the client.

### Setting the endpoint correctly

`QA_PLATFORM_ENDPOINT` is the base URL **up to but not including** the
REST route. The connector appends `/qa-platform/guide/` and
`/qa-platform/query/` itself, so the base has to match how your
WordPress serves the REST API. Which form you use depends on your
site's permalink setting:

- **Permalinks enabled (typical production)** — use the `wp-json` form:

  ```
  https://your-site.com/wp-json
  ```

- **Permalinks disabled (e.g. some local setups)** — use the
  `?rest_route=` form:

  ```
  https://your-site.com/index.php?rest_route=
  ```

Passing a bare domain like `https://your-site.com/` does **not** work —
WordPress serves it as a normal HTML page and the connector cannot parse
JSON out of it.

HTTPS is required.

### Optional settings

| Variable | Purpose | Default |
|----------|---------|---------|
| `QA_PLATFORM_API_VERSION` | Pin a specific API version. Leave unset to always request `latest`. | `latest` |
| `QA_PLATFORM_CACHE_TTL` | How long the guide response is cached, in ms. | `300000` (5 min) |
| `LOG_LEVEL` | `error`, `warn`, `info`, or `debug`. | `info` |

## Verify it works

In Claude Desktop, ask something that needs the guide first:

> What can QA ZERO tell me about my site?

The AI should call `qa_get_guide` and come back with your site's
`tracking_id`, the available data range, and what it can query. Then try
a real query:

> Show me the 10 most recent pageviews.

A healthy round-trip looks like: `qa_get_guide` → the AI builds a QAL
query → `qa_execute_query` → the AI formats the rows for you. You never
write a query yourself.

## Troubleshooting

**The tools don't appear.** Check the config JSON is valid
(`cat <file> | jq .`), confirm `node --version` is 18+, verify the path
to `dist/index.js` is correct and absolute, and restart Claude Desktop.

**`Authentication failed`.** Re-check the Application Password (it must
be copied with its spaces and still be active) and the username. Confirm
the endpoint is HTTPS.

**`404` / `rest_no_route`.** The endpoint base is wrong. Open
`<endpoint>/qa-platform/guide/` directly in a browser — if you get HTML
instead of JSON, switch between the `wp-json` and `?rest_route=` forms
above. Also confirm the QA ZERO plugin is active.

**Queries time out.** Narrow the time range or lower the `limit`. Very
broad queries over long periods are the usual cause.

**Need more detail.** Set `"LOG_LEVEL": "debug"` in the `env` block and
watch the client's MCP logs (on macOS: `~/Library/Logs/Claude/mcp*.log`).

## Security notes

- Treat `claude_desktop_config.json` as a secret — it holds your
  Application Password. Don't commit it. Restrict its permissions
  (`chmod 600` on macOS/Linux).
- Rotate the Application Password periodically, and revoke it from
  wp-admin if a machine is lost.
- Always use an HTTPS endpoint.

## Related

- **[For AI — Instructions & Spec](../for-ai/index.md)** — the
  machine-readable spec the connector serves through `qa_get_guide`.
  Useful to read even as a human.
- **[API Reference](../api/index.md)** — the `/guide` and `/query`
  endpoints the connector wraps, if you want to call them directly.
- **[What is QAL](../concepts/what-is-qal.md)** — the query language the
  AI composes on your behalf.
