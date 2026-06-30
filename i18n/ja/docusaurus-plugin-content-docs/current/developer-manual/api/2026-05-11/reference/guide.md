---
id: reference-guide-2026-05-11
title: GET /guide
sidebar_position: 3
---

# `GET /wp-json/qa-platform/guide`

ディスカバリエンドポイント。新しいクライアントセッションのたびに **最初に** 呼んでください。このサーバーに対して QAL クエリを組み立てるのに必要なものをすべて返します: バージョンと update メタデータ、(`since` タグ付き) 機能フラグ、認証ユーザーがクエリ可能な tracking_id 一覧、サイトごとのゴール定義、現在有効な機械可読仕様書。

## リクエスト

```
GET /wp-json/qa-platform/guide?version=2026-05-11
Authorization: Basic <base64 user:app_password>
```

### クエリパラメータ

| パラメータ | 型     | 必須 | 説明                                                      |
|-----------|--------|------|-----------------------------------------------------------|
| `version` | string | いいえ | API バージョン。サーバー上の最新をデフォルトに。`latest` または `YYYY-MM-DD`。 |

## レスポンスの形

```json
{
  "version": "2026-05-11",
  "api_update": "2026-05-11",
  "timestamp": "2026-05-11T08:30:00Z",
  "plugin_version": "3.0.0.0",

  "features": {
    "filter":                true,
    "join":                  true,
    "calc":                  true,
    "view_chaining":         true,
    "sort":                  true,
    "allpv_prev_next_page":  true,
    "materials_supports_all": true,
    "calc_join_symmetric":   true,
    "guide_local_source":    true,
    "datalayer_observed_events": true,
    "sample":                false,
    "include_count":         false,
    "return_file":           false,
    "return_csv":            false,
    "return_parquet":        false
  },

  "features_detail": {
    "filter":                { "enabled": true,  "since": "2025-10-20" },
    "join":                  { "enabled": true,  "since": "2025-10-20" },
    "calc":                  { "enabled": true,  "since": "2025-10-20" },
    "view_chaining":         { "enabled": true,  "since": "2025-10-20" },
    "sort":                  { "enabled": true,  "since": "2025-10-20" },
    "allpv_prev_next_page":  { "enabled": true,  "since": "2026-04-17" },
    "materials_supports_all":{ "enabled": true,  "since": "2026-04-29" },
    "calc_join_symmetric":   { "enabled": true,  "since": "2026-05-11" },
    "guide_local_source":    { "enabled": true,  "since": "2026-05-11" },
    "datalayer_observed_events": { "enabled": true, "since": "2026-05-11" },
    "sample":                { "enabled": false },
    "include_count":         { "enabled": false },
    "return_file":           { "enabled": false },
    "return_csv":            { "enabled": false },
    "return_parquet":        { "enabled": false }
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
      ],
      "observed_events": {
        "purchase": {
          "material": "events.purchase",
          "columns": { "value": "number", "currency": "string", "items": "number" }
        },
        "newsletter_signup": {
          "material": "events.newsletter_signup",
          "columns": { "plan": "string" }
        }
      }
    }
  ],

  "documentation": {
    "source": "https://docs.qazero.com/docs/developer-manual/api/2026-05-11/ai",
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
| `sites[].observed_events` | **Since 2026-05-11。** このサイトで観測されたテナント固有の dataLayer スキーマ。`datalayer_observed_events` が有効なときのみ存在。下記の [`observed_events`](#observed-events) を参照 |
| `documentation.source`  | 配信される仕様の docs.qazero.com 上の人間向けミラーの URL。仕様そのものは `documentation.sections` にある |
| `documentation.sections`| AI クライアントに配信される現行仕様。`README.md` は markdown、2本の `.yaml` は正式なスキーマ |

### 各マテリアルの `supports_all` フラグ

[`materials.yaml`](../ai/materials.yaml) 内の各マテリアルには、そのマテリアルが `tracking_id: "all"`（全サイト集約）でクエリできるかどうかを宣言する `supports_all: true | false` フラグが付いています。ユーザーに「全サイト」スコープを選ばせる場面で、どのマテリアルを提示するか判断するときは、`documentation.sections` 内の `materials.yaml` ブロックからこのフラグを読み取ってください。**Since:** 2026-04-29

```yaml
materials:
  allpv:
    dataset_id: 1
    supports_all: true     # 全サイト集約は夜間バッチで生成される
    decoders: ...
  click_event:
    dataset_id: 2
    supports_all: true
    decoders: ...
  gsc:
    dataset_id: 4
    supports_all: false    # サイト別専用 — 実在の tracking_id が必須
    decoders: ...
```

`features.materials_supports_all = true` を返すサーバー（つまり `api_update >= 2026-04-29`）は、すべてのマテリアルに `supports_all` を設定することが保証されます。旧バージョンのサーバーはフラグを完全に省略する可能性があります。フラグ非存在時は「不明 — クエリを投げてエラーで判定する」扱いにしてください。

### `observed_events` — サイトごとの dataLayer スキーマ {#observed-events}

**Since:** 2026-05-11（`features.datalayer_observed_events` で gate）

サーバーが `datalayer_observed_events` を広告している場合、`sites[]` の各エントリー — 全サイト集約 `all` を含む — に、そのサイトで **実際に観測された dataLayer イベント** をイベント名でキーにして記述する `observed_events` マップが付きます:

```jsonc
"observed_events": {
  "purchase": {
    "material": "events.purchase",          // クエリする QAL マテリアル
    "columns": { "value": "number", "currency": "string", "items": "number" }
  }
}
```

これを使うと、実行時かつテナントごとに、どの `events.{name}` マテリアルが存在し、各イベントがどのパラメータキー／型を持つかを発見できます。だから AI クライアントは、`value` カラムが観測されているか推測せずに、`events.purchase` を `value` カラムで集計するクエリを組み立てて「1万円以上購入したセッション数」に答えられます。

注意点:

- マップは **スキーマのみ** です。形を教えるだけで、実際の値は `events.{name}` マテリアルに対する QAL の `calc` で集計します（ここでは返しません）。
- `/query` バリデータが `events.{name}` をその文字セットに制限しているため、QAL 安全なイベント名（`[A-Za-z0-9_]+`）のみが載ります。`:`、`/`、`-` 等を含む生の dataLayer 名はスキップされます。
- イベント単位でデグレードします: あるイベントのマニフェストが欠落・破損していても、そのイベントだけをスキップし、サイト全体は失われません。
- 旧バージョンのサーバー（フィーチャフラグなし）はキーを完全に省略します — 非存在時は「不明」扱いにしてフォールバックしてください。

## `/guide` が仕様を組み立てる仕組み

**Since:** 2026-05-11（`features.guide_local_source`）

`documentation.sections` の内容（`README.md`、`materials.yaml`、`qal-validation.yaml`）は、リクエスト時に QA ZERO プラグイン同梱ファイル（`src/core/yaml/`）から直接読まれます。**GitHub 取得も、無効化すべきサーバー側キャッシュもありません** — サーバーが配信する仕様は、そのサーバーにインストールされたプラグインバージョンと構造的に必ず一致します。`documentation.source` は、同じファイル群の docs.qazero.com 上の人間向けミラーを指す便宜的な URL で、エンドポイントが取得するものではありません。

クライアント側で仕様を長期キャッシュする場合は、サーバーの `api_update`（と `version`）をキーにしてください: `api_update` が進んだら同梱仕様が増えている可能性があるので、`/guide` を再取得してリフレッシュします。

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
