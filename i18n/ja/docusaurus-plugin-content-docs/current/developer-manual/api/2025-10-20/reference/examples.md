---
id: reference-examples-2025-10-20
title: サンプル
sidebar_position: 6
---

# サンプル

以下のサンプルはすべて、QA ZERO のライブインストールに対して動く `curl` シーケンスです。`example.com`、`admin`、アプリケーションパスワードを自分のものに置き換えてください。

## 1. サーバーを発見する

```bash
curl -s -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  "https://example.com/wp-json/qa-platform/guide?version=2025-10-20" \
  | jq .
```

レスポンスから以下を使います:

- `sites[0].tracking_id` — 以下でクエリするサイト。
- `features_detail.*` — 機能を使う前にチェック。
- `documentation.sections[].content` — ライブ仕様書。

## 2. 直近7日間の上位ページ (canonical hello-world)

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

## 3. 1ページのソース別トラフィック

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

## 4. 一番レイジクリックが多いページ

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

## 5. 特定ページに来る GSC クエリ

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

## 6. 今週のコンバージョン件数

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

レスポンスは行セットではなく、スカラーのカウントになります。

## 次に読むページ

- **[`/guide`](./guide.md)** — ディスカバリレスポンスから何を取り出すか。
- **[`/query`](./query.md)** — リクエスト/レスポンスの詳細。
- **[Materials](../materials/)** — クエリできるデータ。
