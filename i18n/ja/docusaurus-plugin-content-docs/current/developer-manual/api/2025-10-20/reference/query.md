---
id: reference-query-2025-10-20
title: POST /query
sidebar_position: 4
---

# `POST /wp-json/qa-platform/query`

実行エンドポイント。QAL クエリを JSON ボディで送ると、行データが返ります。

## リクエスト

```
POST /wp-json/qa-platform/query?version=2025-10-20
Authorization: Basic <base64 user:app_password>
Content-Type: application/json
```

### クエリパラメータ

| パラメータ | 型     | 必須 | 説明                                    |
|-----------|--------|------|-----------------------------------------|
| `version` | string | いいえ | API バージョン。サーバー上の最新をデフォルトに。 |

### リクエストボディ

有効な QAL クエリ。形は [Concepts → QAL とは何か?](../concepts/what-is-qal.md) を、正式な検証ルールは [`ai/qal-validation.yaml`](../ai/qal-validation.yaml) を参照。

最小の有効ボディ:

```json
{
  "tracking_id": "abc123",
  "materials":   [{ "name": "allpv" }],
  "time": {
    "start": "2026-04-07T00:00:00",
    "end":   "2026-04-14T00:00:00",
    "tz":    "Asia/Tokyo"
  },
  "make": {
    "top_pages": {
      "from":  "allpv",
      "keep":  ["url"],
      "calc":  { "views": { "count": "*" } },
      "sort":  [{ "column": "views", "direction": "desc" }]
    }
  },
  "result": { "use": "top_pages", "limit": 10 }
}
```

## レスポンスの形

### 成功

```json
{
  "ok": true,
  "version": "2025-10-20",
  "query_time_ms": 412,
  "result": {
    "view": "top_pages",
    "columns": ["url", "views"],
    "rows": [
      ["/blog/coffee-grinders/", 4821],
      ["/recipes/v60/",          3904],
      ["/products/hario-slim/",  2870]
    ],
    "row_count": 3
  }
}
```

| フィールド             | 意味                                                      |
|----------------------|-----------------------------------------------------------|
| `ok`                 | 成功時 `true`、エラー時 `false`                            |
| `version`            | クエリが実行されたバージョン                                 |
| `query_time_ms`      | サーバー側実行時間                                          |
| `result.view`        | 返されたビュー (リクエストの `result.use` と一致)           |
| `result.columns`     | 行の順序に対応するカラム名                                  |
| `result.rows`        | 配列の配列。内側の1配列 = 1行で、値は `columns` の順        |
| `result.row_count`   | 返された行数 (`limit` より少ない場合あり)                   |

### `count_only` バリアント

リクエストに `result.count_only: true` がある場合のレスポンス:

```json
{
  "ok": true,
  "version": "2025-10-20",
  "query_time_ms": 88,
  "result": {
    "view": "top_pages",
    "count": 12483
  }
}
```

`columns` / `rows` なし、スカラーの `count` のみ。

### エラー

```json
{
  "ok": false,
  "error": {
    "code": "E_UNKNOWN_MATERIAL",
    "message": "Material 'allpvs' not found in manifest.",
    "at": "materials[0].name"
  }
}
```

正式なエラーコード一覧は [エラー](./errors.md) を参照。

## バリデータが強制するルール

これらはすべて `ai/qal-validation.yaml` 由来:

- `tracking_id`, `materials`, `time`, `make`, `result` はすべて必須。
- `materials` は仕様書にある名前を参照すること。
- `time.tz` は有効な IANA タイムゾーンであること。
- `make` 内のすべてのビューは `from` と `keep` を持つこと。
- `result.use` は `make` で定義されたビューを指すこと。
- `result.count_only` が `true` でない限り `result.limit` は必須。
- 機能の使用は `features_detail` と一致すること — サーバーで `enabled: false` の機能を使ったリクエストは `E_FEATURE_DISABLED` で拒否されます。

## 次に読むページ

- **[AI Instructions](../ai/README.md)** — QAL クエリを組み立てるクライアントを作る場合。
- **[サンプル](./examples.md)** — end-to-end の curl サンプル。
- **[エラー](./errors.md)** — 何かが失敗したとき。
