---
id: what-is-qal
title: QAL とは何か?
sidebar_position: 1
---

# QAL とは何か?

**QAL** (Query Analytics Language) は、QA ZERO API が話すクエリ言語です。宣言型の JSON フォーマットで — SQL でも、括弧と演算子で書く DSL でもありません。JSON オブジェクトを組み立てて `/query` に送ると、クエリを投げたことになります。

## 形を1つのオブジェクトで

有効な QAL クエリは必ずこのトップレベルキーを持ちます。

```
{
  "tracking_id": "...",      // どのサイトを対象にするか
  "materials":   [...],      // このクエリが触るデータ面
  "time":        {...},      // start / end / tz
  "make":        {...},      // 名前付きビュー(実際の作業)
  "result":      {...}       // どのビューをどう返すか
}
```

他のトップレベルキーは拒否されます。これは意図的です。形が1つの頭のモデルに収まる小ささで、バリデータが構造的な間違いを実行前に弾けるからです。

## 5つのパーツの説明

### `tracking_id`
このインストール内でどのサイトを対象にするかを示す文字列。使える値の一覧は `/guide` が返します。複数サーバーにまたがってハードコードしないこと。

### `materials`
このクエリが読むデータ面を列挙するオブジェクトの配列。マテリアル名は `materials.yaml` から来ます (`allpv`, `gsc`, `click_event` など)。仕様書に無い名前は拒否されます。

### `time`
時間窓を `{ start, end, tz }` で。`start`/`end` は ISO-8601 タイムスタンプ。`tz` は `Asia/Tokyo` や `UTC` のような IANA タイムゾーン。デフォルトの時間範囲はありません — 「全期間」クエリは意図的に使えません。

### `make`
名前付きビューのマップ。各ビューは:

- `from` — ソースマテリアル
- `keep` — 残すカラム
- オプション: `filter`, `join`, `add`/`calc`, `sort`

ビューが QAL の実際の作業単位です。1つの `make` ブロックに複数のビューを定義できますし、ビューを連鎖させることもできます (あるビューを別のビューの `from` に指定できる)。

### `result`
どのビューを返すかを実行器に伝えます。

- `use` — 返すビューの `make` 内での名前
- `limit` — 最大行数
- `count_only` — `true` なら行数だけ返し `limit` を無視

## 動作例

直近7日間でビュー数が多い上位10ページを返す最小クエリ:

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

これが全部です。この形が頭に入れば、ドキュメントの残りは各パーツが受け付ける詳細を詰めるだけの作業になります。

## 次に読むページ

- **[なぜ QAL なのか?](./why-qal.md)** — 設計の根拠。
- **[Materials, Views, Result](./materials-views-result.md)** — 3つの動く部品が実際どう組み合わさるか。
- **[`/query` リファレンス](../api/2025-10-20/reference/query.md)** — 実行エンドポイントのリクエスト/レスポンス仕様。
