---
id: qal-validation-2025-10-20
title: QAL バリデーションマニフェスト
sidebar_position: 5
version: "2025-10-20"
update: "2026-04-11"
api_update: "2026-04-11"
last_updated: "2026-04-11"
type: validation_manifest
description: >
  Defines strict validation rules for QAL JSON execution requests.
  This frontmatter is parsed by QAL_Executor (PHP) for runtime validation
  and mirrored in the body for AI models and other HTTP consumers.
structure:
  required: ["tracking_id", "materials", "time", "make", "result"]
rules:
  tracking_id:
    type: string
    description: "Unique identifier for the tracking site to query. Must match a tracking_id from the /guide endpoint response."
    pattern: "^[a-zA-Z0-9_-]+$"
    errors:
      - code: E_UNKNOWN_TRACKING_ID
        message: "Invalid tracking_id provided."

  materials:
    type: array
    description: "List of data sources (materials) to use in the query. Each material must have a 'name' property."
    items:
      type: object
      required: ["name"]
      properties:
        name:
          type: string
          description: "Material name. Allowed values: 'allpv', 'gsc', 'ga4_age_gender', 'ga4_country', 'ga4_region', 'goal_N' (N>=1), 'click_event', 'datalayer_event', 'page_version', or 'events.{name}'."
          pattern: "^(allpv|gsc|ga4_age_gender|ga4_country|ga4_region|goal_[1-9]\\d*|click_event|datalayer_event|page_version|events\\.[a-zA-Z0-9_]+)$"
      additionalProperties: false
    minItems: 1
    errors:
      - code: E_UNKNOWN_MATERIAL
        message: "Material name not found in manifest."

  time:
    type: object
    required: ["start", "end", "tz"]
    properties:
      start: { type: string, format: date-time }
      end: { type: string, format: date-time }
      tz:
        type: string
        description: "IANA timezone identifier. Any valid IANA zone is accepted."
        examples: ["Asia/Tokyo", "UTC", "Europe/London", "America/New_York", "America/Los_Angeles", "Europe/Paris"]
    errors:
      - code: E_TIME_REQUIRED
        message: "Missing time.start, time.end, or time.tz."

  make:
    type: object
    description: "Defines views (data transformations) to create from materials. Each key is a view name."
    patternProperties:
      "^[a-zA-Z0-9_]+$":
        type: object
        description: >
          View definition. Must specify 'from' (source material or previously defined view)
          and 'keep' (columns to select). Optionally specify 'filter' for row filtering,
          'join' for combining materials, and 'add'/'calc' for aggregation.
        required: ["from", "keep"]
        properties:
          from:
            type: array
            description: "Exactly one element: a material name or a view name previously defined in this make block."
            items:
              type: string
              pattern: "^(allpv|gsc|ga4_age_gender|ga4_country|ga4_region|goal_[1-9]\\d*|click_event|datalayer_event|page_version|events\\.[a-zA-Z0-9_]+|[a-zA-Z0-9_]+)$"
            minItems: 1
            maxItems: 1
          keep:
            type: array
            description: >
              List of columns to include. Must use fully qualified names in the format
              'material.column' or 'view.column'. Empty array is allowed when 'calc' is
              present (global aggregation pattern).
            items:
              type: string
              pattern: "^[a-zA-Z0-9_\\.]+\\.[a-zA-Z0-9_]+$"
            minItems: 0
          filter:
            type: object
            description: >
              Filter conditions to apply to rows from the 'from' source. Keys are plain
              (unqualified) column names. Values are either an array (implicit IN) or an
              object keyed by an operator. Multiple keys combine with implicit AND.
              Filtering a view that uses another view as 'from' is not allowed
              (E_FILTER_ON_VIEW_CHAIN).
            additionalProperties:
              oneOf:
                - type: array
                  items: { type: ["string", "number", "boolean"] }
                - type: object
                  propertyNames:
                    enum: [eq, neq, gt, gte, lt, lte, in, contains, prefix, between]
          join:
            type: object
            description: >
              One equi-join per view (arrays of joins are forbidden). 'with' is the right-side
              material or view, 'on' is an array of {left, right} fully qualified column pairs.
              Only integer id columns may be joined. M:N target materials (e.g. gsc) require
              a filter on the target side (E_JOIN_FILTER_REQUIRED).
            required: ["with", "on"]
            properties:
              with: { type: string }
              on:
                type: array
                minItems: 1
                items:
                  type: object
                  required: ["left", "right"]
                  properties:
                    left: { type: string, description: "Fully qualified column from the left (from) source." }
                    right: { type: string, description: "Fully qualified column from the 'with' material/view." }
              "if not match":
                type: string
                enum: ["keep-left", "drop"]
                description: "Unmatched-row behavior. Default: keep-left (LEFT OUTER)."
              fill:
                description: "Default value for unmatched right-side columns when 'if not match' is 'keep-left'. Default: null."
          add:
            type: array
            description: "Optional list of calc result column names. Must exactly match calc keys when specified; auto-derived from calc when omitted."
            items: { type: string }
          calc:
            type: object
            description: >
              Aggregation expressions. Keys are result column names; values must match
              ^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\\([A-Za-z_][\\w]*\\.[A-Za-z_][\\w]*\\)$.
              The column referenced need not appear in 'keep'.
            additionalProperties:
              type: string
              pattern: "^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\\([A-Za-z_][\\w]*\\.[A-Za-z_][\\w]*\\)$"
        additionalProperties: false
    errors:
      - code: E_UNKNOWN_COLUMN
        message: "Invalid column name in keep list."

  result:
    type: object
    description: "Specifies which view to return and how to format the result."
    required: ["use"]
    properties:
      use:
        type: string
        description: "Name of the view (defined in 'make') to return."
      limit:
        type: integer
        description: "Max rows returned. Default: 1000, hard cap: 50000."
        minimum: 1
        maximum: 50000
        default: 1000
      count_only:
        type: boolean
        description: "If true, return only { count: N } instead of rows."
        default: false
      include_count:
        type: boolean
        description: "Planned: meta.filtered_rows will carry the pre-sample hit count. Currently accepted by the validator but the executor does not process it yet."
        default: false
      sample:
        type: object
        description: "Planned: sampling when the view exceeds max_rows. Currently accepted by the validator but the executor does not process it yet."
        required: ["max_rows", "method"]
        properties:
          max_rows: { type: integer, minimum: 1 }
          method:   { type: string, enum: ["head", "random", "hashmod"] }
      return:
        type: object
        description: "Planned: output shape. Only INLINE+JSON works today; other combinations are no-ops."
        properties:
          mode:   { type: string, enum: ["INLINE", "FILE"] }
          format: { type: string, enum: ["JSON", "CSV", "PARQUET"] }
    additionalProperties: false
    errors:
      - code: E_UNKNOWN_VIEW
        message: "Result.use does not match any defined view in make."
      - code: E_RESULT_FORBIDDEN_KEY
        message: "Result contains a non-whitelisted key (e.g. 'sort' is not yet implemented)."

features:
  # Implemented and fully processed
  filter:        true
  join:          true
  calc:          true
  view_chaining: true
  # Not yet implemented. 'sort' is rejected outright as E_RESULT_FORBIDDEN_KEY.
  # 'sample' / 'include_count' pass validation but the executor does not
  # process them yet; treat them as no-ops until flipped to true.
  sort:          false
  sample:        false
  include_count: false
  return_file:   false
  return_csv:    false
  return_parquet: false
---

# QAL バリデーションマニフェスト — AI 向けアクセス可能バージョン

このドキュメントは **すべての QAL JSON が従うべき厳密なスキーマ** を定義します。
YAML frontmatter セクションは PHP 実行エンジンがバリデーションに使用します。以下の本文は、HTTP 経由で読み取る AI モデルやその他のツールのために同じ情報を複製したものです。

---

## 概要

**目的:** QAL バリデーションルールの唯一の正
**バージョン:** 2025-10-20
**種別:** validation_manifest
**対象読者:** QAL Executor (PHP)、AI モデル (ChatGPT、Claude、MCP)、人間向けドキュメント

正本はリポジトリ内の `src/core/yaml/qal-validation-2025-10-20.yaml` にあり、プラグインがドキュメントのアップデートを出荷するたびにここにミラーされます。

---

## AI モデル向け（ChatGPT、Claude、MCP）

**あなたは QAL Generator です。**

あなたの仕事は、上記のスキーマに準拠した有効な QAL JSON を生成することです。以下のルールに従ってください:

1. **必須のトップレベルキーを常にすべて含めること:** `tracking_id`、`materials`、`time`、`make`、`result`。
2. **Materials:** `materials[].name` パターンで許可された名前のみを使用すること（`allpv`、`gsc`、`ga4_age_gender`、`ga4_country`、`ga4_region`、`goal_N`、`click_event`、`datalayer_event`、`page_version`、`events.{name}`）。
3. **Time:** `start` / `end` / `tz` はすべて必須です。`tz` は `Asia/Tokyo` のような完全な IANA 識別子でなければなりません — `JST` のような略記は使用しないでください。
4. **make ビュー:**
   - `from` は **ちょうど 1 つ** の要素を持つ配列です。その要素はマテリアル名、または同じ `make` ブロック内で先に定義されたビュー（ビューチェイニング）のいずれかです。
   - `keep` は完全修飾名（`material.column` または `view.column`）を使用します。`calc` がある場合、`keep` は空配列でも構いません（グローバル集計）。
   - `filter` のキーは **プレーンなカラム名**（非修飾）です。値は配列（IN）または `{ <op>: <value> }` のいずれかです。複数のキーは AND で結合され、OR 形式はまだありません。**`from` が別のビューを参照している場合は filter を使用しないでください** — 上流のビューでフィルターしてください。
   - `join` は単一のオブジェクトです（配列は禁止）。`on[]` は両側で完全修飾名を使用します。結合できるのは整数 id カラムのみです。結合ターゲットが M:N マテリアル（例: `gsc`）の場合、ビューはターゲットのカラムにフィルターを持たなければなりません。
   - `calc` の値は厳密な正規表現 `^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\(<qualified>\)$` にマッチする必要があります。`COUNT(*)` は禁止です。
5. **result:** 実行エンジンのランタイムホワイトリストは `use`、`limit`、`count_only`、`include_count`、`sample`、`return`（および `x-*` アノテーション）です。**`sort` はホワイトリストに含まれていません** ので `E_RESULT_FORBIDDEN_KEY` を発生させます。受け付けられるキーのうち、`include_count` / `sample` / `return` は現在 no-op です — 下記の §機能 を参照してください。
6. **エイリアス禁止。** `materials[]` や `make.<view>` に `as` フィールドを決して追加しないでください — `E_ALIAS_FORBIDDEN` を発生させます。

### このバージョンで有効な機能

実行時の正は常にライブサーバーの `/guide` レスポンスの `features` マップを参照してください。現在のベースライン:

**実装済みかつ処理される:**
- ✅ `filter`（フラット形式、AND のみ）
- ✅ `join`（単一の等結合（equi-join）、id カラムのみ、M:N ターゲットはフィルターが必須）
- ✅ `calc`（ホワイトリストされた単一カラム集計）
- ✅ ビューチェイニング（`from: ["<previous_view>"]`）

**未実装（まだ依存しないでください）:**
- 🚧 `result.sort` — `E_RESULT_FORBIDDEN_KEY` として積極的に拒否されます。クライアント側でソートしてください。
- 🚧 `result.sample` — バリデーターは受け付けますが実行時効果はありません
- 🚧 `result.include_count` — バリデーターは受け付けますが実行時効果はありません
- 🚧 `return.mode = "FILE"` および JSON 以外のフォーマット — 現時点では `INLINE` / `JSON` を使用してください
- 🚧 フィルター条件をまたぐ `OR` 論理

---

## エラーコードリファレンス

| コード | フィールド | 原因 |
|------|-------|-------|
| `E_UNKNOWN_TRACKING_ID` | `tracking_id` | 既知のサイトではない |
| `E_UNKNOWN_MATERIAL` | `materials[]` / `from[]` | マニフェストにない名前 |
| `E_UNKNOWN_VIEW` | `from[]` / `result.use` | ビューが定義されていない |
| `E_UNKNOWN_COLUMN` | `keep` / `filter` / `calc` / `join.on` | マテリアルスキーマにないカラム |
| `E_ALIAS_FORBIDDEN` | `materials` / `make` | `as` が使用された |
| `E_TIME_REQUIRED` | `time` | `start`/`end`/`tz` が欠落 |
| `E_FILTER_INVALID` | `filter` | 不正または過剰にネスト |
| `E_FILTER_ON_VIEW_CHAIN` | `filter` | `from` がビューのときに `filter` を使用 |
| `E_INVALID_JOIN` | `join` | `with`/`on` が欠落、非修飾、非等結合 |
| `E_JOIN_MULTIPLE_FORBIDDEN` | `join` | 配列または複数 join |
| `E_JOIN_FILTER_REQUIRED` | `join` | M:N ターゲットにフィルターがない |
| `E_RESULT_UNKNOWN_VIEW` | `result.use` | ビューが `make` にない |
| `E_RESULT_FORBIDDEN_KEY` | `result` | ホワイトリスト外のキー |
| `E_KEEP_EXPR_FORBIDDEN` | `keep` | カラム以外の式 |
| `E_ADD_NOT_SUBSET_OF_CALC` | `add` | 明示的な `add` に未知のメトリクスが含まれる |
| `E_CALC_NOT_SUBSET_OF_ADD` | `calc` | 明示的な `add` に calc キーが欠けている |

---

## 完全な有効例

```json
{
  "tracking_id": "abc123",
  "materials": [
    { "name": "allpv" },
    { "name": "gsc" }
  ],
  "time": {
    "start": "2026-03-01T00:00:00",
    "end":   "2026-04-01T00:00:00",
    "tz":    "Asia/Tokyo"
  },
  "make": {
    "blog_pvs": {
      "from":   ["allpv"],
      "filter": { "url": { "prefix": "/blog" }, "device_type": ["SP"] },
      "keep":   ["allpv.url", "allpv.reader_id", "allpv.pv_id", "allpv.browse_sec"]
    },
    "blog_by_url": {
      "from": ["blog_pvs"],
      "keep": ["blog_pvs.url"],
      "calc": {
        "pv":        "COUNT(blog_pvs.pv_id)",
        "uniq_user": "COUNTUNIQUE(blog_pvs.reader_id)",
        "avg_dwell": "AVERAGE(blog_pvs.browse_sec)"
      }
    }
  },
  "result": {
    "use": "blog_by_url",
    "limit": 100
  }
}
```

> ソート（`result.sort`）はまだ実装されていません — 返却された行はクライアント側で `pv` の降順にソートしてください。ここでは `include_count` が便利ですが、現在は no-op です。`/guide` の `features.include_count` が `true` に変わるまでは省略してください。

---

## 関連ドキュメント

- **[QAL ガイド](./qal.md)** — 例付きの構文ウォークスルー
- **[マテリアルリファレンス](./materials.md)** — カラムカタログ
- **[エンドポイント](./endpoints.md)** — HTTP サーフェス
- **[はじめに](./index.md)** — 概要

---

**最終更新日:** 2026-04-10
**API バージョン:** 2025-10-20
**マニフェスト ID:** qal-validation-2025-10-20
