---
id: reference-guide-2025-10-20
title: GET /guide
sidebar_position: 3
---

# `GET /wp-json/qa-platform/guide`

ディスカバリエンドポイント。新しいクライアントセッションのたびに **最初に** 呼んでください。このサーバーに対して QAL クエリを組み立てるのに必要なものをすべて返します: バージョンと update メタデータ、(`since` タグ付き) 機能フラグ、認証ユーザーがクエリ可能な tracking_id 一覧、サイトごとのゴール定義、現在有効な機械可読仕様書。

## リクエスト

```
GET /wp-json/qa-platform/guide?version=2025-10-20
Authorization: Basic <base64 user:app_password>
```

### クエリパラメータ

| パラメータ | 型     | 必須 | 説明                                                      |
|-----------|--------|------|-----------------------------------------------------------|
| `version` | string | いいえ | API バージョン。サーバー上の最新をデフォルトに。`latest` または `YYYY-MM-DD`。 |

## レスポンスの形

```json
{
  "version": "2025-10-20",
  "api_update": "2026-04-14",
  "timestamp": "2026-04-14T08:30:00Z",
  "plugin_version": "3.0.0.0",

  "features": {
    "filter":        true,
    "join":          true,
    "calc":          true,
    "view_chaining": true,
    "sort":          true,
    "sample":        false,
    "include_count": false,
    "return_file":   false,
    "return_csv":    false,
    "return_parquet": false
  },

  "features_detail": {
    "filter":        { "enabled": true,  "since": "2025-10-20" },
    "join":          { "enabled": true,  "since": "2025-10-20" },
    "calc":          { "enabled": true,  "since": "2025-10-20" },
    "view_chaining": { "enabled": true,  "since": "2025-10-20" },
    "sort":          { "enabled": true,  "since": "2025-10-20" },
    "sample":        { "enabled": false },
    "include_count": { "enabled": false },
    "return_file":   { "enabled": false },
    "return_csv":    { "enabled": false },
    "return_parquet":{ "enabled": false }
  },

  "sites": [
    {
      "tracking_id": "abc123",
      "domain": "example.com",
      "name": "コーポレートサイト",
      "default": true,
      "data_available_from": "2024-01-01",
      "timezone": "Asia/Tokyo",
      "goals": [
        {
          "id": 1,
          "name": "お問い合わせ送信",
          "type": "gtype_page",
          "condition": { "url": "/thanks/", "match": "exact" }
        }
      ]
    }
  ],

  "documentation": {
    "source": "https://github.com/quarka-org/docs.qazero.com/tree/main/docs/developer-manual/api/2025-10-20/ai",
    "format": "mixed",
    "sections": [
      {
        "category": "instructions",
        "format":   "markdown",
        "file":     "README.md",
        "title":    "AI Instructions (how to build a QAL query)",
        "content":  "..."
      },
      {
        "category": "spec",
        "format":   "yaml",
        "file":     "materials.yaml",
        "title":    "Materials Manifest (machine-readable)",
        "content":  "..."
      },
      {
        "category": "spec",
        "format":   "yaml",
        "file":     "qal-validation.yaml",
        "title":    "QAL Validation Manifest (machine-readable)",
        "content":  "..."
      }
    ]
  }
}
```

## フィールド一覧

| フィールド                | 意味                                                                 |
|-------------------------|----------------------------------------------------------------------|
| `version`               | API バージョン (URL に現れる、破壊的変更時計)                            |
| `api_update`            | Update 日付 (非破壊追加時計)。`since` と比較する                        |
| `timestamp`             | レスポンスが生成されたサーバー時刻                                      |
| `plugin_version`        | サーバーの QA ZERO プラグインバージョン                                 |
| `features`              | フラット `{name: bool}` マップ。後方互換形式                           |
| `features_detail`       | リッチ `{name: {enabled, since?}}` マップ。`since` チェックにはこちらを使う |
| `sites[]`               | 認証ユーザーがアクセスできる tracking_id ごとのエントリ                 |
| `sites[].goals[]`       | サイトごとのゴール定義 — `goal_N` マテリアルがどのゴールを意味するかのマッピング |
| `documentation.sections`| AI クライアントに配信される現行仕様。`README.md` は markdown、2本の `.yaml` は正式なスキーマ |

## キャッシュ

サーバーはあるバージョンについて `/guide` が最初に呼ばれたときに、GitHub から `ai/` サブディレクトリをローカルキャッシュします。以降の呼び出しはローカルキャッシュから読まれます。ドキュメントソースを変更してキャッシュを無効化したい場合は、サーバー上のキャッシュディレクトリを削除してください (`wp-content/qa-zero-data/restapi/` 以下にあります)。

## 典型的なクライアントフロー

1. 起動時、pin した `version` で `/guide` を呼ぶ。
2. `api_update` と `features_detail` を記録。
3. `documentation.sections` をパース — `file` 名で2本の YAML ブロックを拾って、パースしてメモリにキャッシュ。
4. YAML 仕様書を使って以降の `/query` 呼び出しを組み立てる。
5. `/query` が `E_UNKNOWN_*` で失敗したら、`/guide` をもう一度呼ぶ — 最後にキャッシュした時から仕様が動いている可能性があるため。

## 次に読むページ

- **[`/query` リファレンス](./query.md)** — 実行エンドポイント。
- **[AI Instructions](../ai/README.md)** — `documentation.sections` の README ブロックに何が入っているか。
- **[エラー](./errors.md)** — 正式なエラーコード一覧。
