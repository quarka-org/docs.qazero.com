---
id: reference-examples-2025-10-20
title: Examples
sidebar_position: 6
---

# Examples

Every example here is a working `curl` sequence you can run
against a live QA ZERO install. Replace `example.com`, `admin`,
and the application password with your own.

## 1. Discover the server

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  "https://example.com/wp-json/qa-platform/guide?version=2025-10-20" \
  | jq .
```

From the response, you will use:

- `sites[0].tracking_id` — which site to query below.
- `features_detail.*` — to check before using a feature.
- `documentation.sections[].content` — the live spec.

## 2. Top pages last 7 days (the canonical hello-world)

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_id": "abc123",
    "materials":   [{ "name": "allpv" }],
    "time": {
      "start": "2026-04-07T00:00:00",
      "end":   "2026-04-14T00:00:00",
      "tz":    "Asia/Tokyo"
    },
    "make": {
      "top_pages": {
        "from": "allpv",
        "keep": ["url"],
        "calc": { "views": { "count": "*" } },
        "sort": [{ "column": "views", "direction": "desc" }]
      }
    },
    "result": { "use": "top_pages", "limit": 10 }
  }' \
  "https://example.com/wp-json/qa-platform/query?version=2025-10-20"
```

## 3. Traffic by source for a single page

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_id": "abc123",
    "materials":   [{ "name": "allpv" }],
    "time": {
      "start": "2026-04-01T00:00:00",
      "end":   "2026-04-14T00:00:00",
      "tz":    "Asia/Tokyo"
    },
    "make": {
      "one_page": {
        "from":  "allpv",
        "keep":  ["source_id"],
        "filter":{ "url": "/products/hario-slim/" },
        "calc":  { "views": { "count": "*" } },
        "sort":  [{ "column": "views", "direction": "desc" }]
      }
    },
    "result": { "use": "one_page", "limit": 20 }
  }' \
  "https://example.com/wp-json/qa-platform/query?version=2025-10-20"
```

## 4. Pages with the most rage clicks

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_id": "abc123",
    "materials":   [{ "name": "allpv" }],
    "time": {
      "start": "2026-04-01T00:00:00",
      "end":   "2026-04-14T00:00:00",
      "tz":    "Asia/Tokyo"
    },
    "make": {
      "rage": {
        "from":  "allpv",
        "keep":  ["url"],
        "calc":  {
          "total_views": { "count": "*" },
          "rage_sum":    { "sum": "irritation_click_count" }
        },
        "filter":{ "irritation_click_count": { "gt": 0 } },
        "sort":  [{ "column": "rage_sum", "direction": "desc" }]
      }
    },
    "result": { "use": "rage", "limit": 20 }
  }' \
  "https://example.com/wp-json/qa-platform/query?version=2025-10-20"
```

## 5. GSC queries driving clicks to a specific page

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_id": "abc123",
    "materials":   [{ "name": "gsc" }],
    "time": {
      "start": "2026-03-01T00:00:00",
      "end":   "2026-04-01T00:00:00",
      "tz":    "Asia/Tokyo"
    },
    "make": {
      "top_queries": {
        "from":  "gsc",
        "keep":  ["keyword", "clicks", "impressions", "ctr", "position"],
        "filter":{ "url": "/blog/coffee-grinders/" },
        "sort":  [{ "column": "clicks", "direction": "desc" }]
      }
    },
    "result": { "use": "top_queries", "limit": 25 }
  }' \
  "https://example.com/wp-json/qa-platform/query?version=2025-10-20"
```

## 6. Count conversions this week

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_id": "abc123",
    "materials":   [{ "name": "goal_1" }],
    "time": {
      "start": "2026-04-07T00:00:00",
      "end":   "2026-04-14T00:00:00",
      "tz":    "Asia/Tokyo"
    },
    "make": {
      "conversions": { "from": "goal_1", "keep": ["pv_id"] }
    },
    "result": { "use": "conversions", "count_only": true }
  }' \
  "https://example.com/wp-json/qa-platform/query?version=2025-10-20"
```

The response will be a scalar count, not a row set.

## Where to go next

- **[`/guide`](./guide.md)** — what to parse from the discovery
  response.
- **[`/query`](./query.md)** — request/response shape in detail.
- **[Materials](../materials/)** — what data exists to query.
