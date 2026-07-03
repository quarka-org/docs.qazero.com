---
id: for-ai-index
slug: /developer-manual/for-ai
title: AI 向けインストラクション
sidebar_label: For AI (Instructions & Spec)
sidebar_position: 7
description: QA ZERO API に対して QAL クエリを組み立てる AI クライアント向けの最小ルール集と機械可読仕様
audience: ai
---

# AI 向けインストラクション — QA ZERO API / QAL

:::note 機械可読仕様
このページはバージョン非依存の AI 向けインストラクションです。正本の
機械可読仕様はこの隣で配布され、`/guide` が AI / MCP クライアントに
配信するものです:

- **[`materials.yaml`](./materials.yaml)** — `since:` タグつきの
  マテリアル / カラム全カタログ（バージョン非依存・リビング）。
- **`qal-validation.yaml`** — 機能フラグとバリデータ仕様で、
  **バージョン固定** です。対象とするバージョンの配下のコピーを
  使ってください。例:
  [`2026-05-11/qal-validation.yaml`](../api/2026-05-11/qal-validation.yaml)。
:::

あなたがこのファイルを読んでいるのは、あなたが AI アシスタント (LLM, MCP クライアント等) で、**QA ZERO API** 用のクエリを組み立てているからです。クエリを書く前にこのファイルを全部読んでください。並んでいる2本の YAML ファイル (`materials.yaml`, `qal-validation.yaml`) が **正本の仕様書** です。このREADMEと YAML が食い違う場合は常に YAML を信用してください。

このファイルは意図的に短く保たれています。**チュートリアルではありません。** 守るべきルールと形の集合です。

---

## 1. この API は何か

- 読み取り専用の分析 API です。**QAL クエリ** (構造化 JSON) を送信すると、表形式の結果が返ります。
- QAL は **SQL ではありません。** 意図的に小さい宣言型言語で、AI クライアントがリトライを必要とせず、かつ裏のストアを傷つけるようなクエリを決して組み立てられないように設計されています。
- 対象のデプロイ先は安価なシェアードホスティングです — この API は、クラウド DWH ではなく、安価なインフラ上で素早く結果を返すように設計されています。

## 2. 使うことになる2つのエンドポイント

- `GET  /wp-json/qa-platform/guide` — このファイル、2本の YAML 仕様書、使える tracking_id、機能フラグを返す。何が現在サポートされているかを知るために **最初に** 呼びます。
- `POST /wp-json/qa-platform/query` — JSON ボディで QAL クエリを受け取り、行を返す。

他のエンドポイントは AI 用途の対象外です。

## 3. Version と update

- **`version`** (`YYYY-MM-DD`) — 破壊的変更時だけ変わる。URL に pin する: `?version=2026-05-11`。
- **`update`** (`YYYY-MM-DD`) — 同一バージョン内の非破壊追加で bump。`/guide` レスポンスに `api_update` として返される。
- 各機能・各フィールドは `since: YYYY-MM-DD` タグを持てます。`since > client.known_update` なら、サーバーでその機能がまだ存在しない可能性があるので **フォールバック** すること。エラーにしない。

## 4. QAL の形 (最小有効クエリ)

有効な QAL クエリは常に以下のトップレベルキーを持ちます。

- `tracking_id` — `/guide` が返すサイト識別子。
- `materials` — このクエリが読むマテリアル一覧。
- `time` — `{ start, end, tz }`。`start`/`end` は ISO-8601、`tz` は IANA タイムゾーン (例: `Asia/Tokyo`)。
- `make` — 名前付きビューのマップ。各ビューは `from` (マテリアル) と `keep` (選ぶカラム) を持つ。オプション: `filter`, `join`, `add`/`calc`, `sort`。
- `result` — どのビューをどう返すか。`use`, `limit`, `count_only` をサポート。

他のトップレベルキーはミスです。バリデータが拒否します。

### 4.1 最小の動作例

まずこの形をコピーして、そこから調整してください。QAL クエリ全体は
`/query` に POST する際、トップレベルの `qal` キーでラップする必要があります。

```json
{
  "qal": {
    "tracking_id": "<guide が返す id>",
    "materials": [{"name": "allpv"}],
    "time": {
      "start": "2026-04-01T00:00:00",
      "end":   "2026-04-14T00:00:00",
      "tz":    "Asia/Tokyo"
    },
    "make": {
      "top": {
        "from":  ["allpv"],
        "keep":  ["allpv.url"],
        "calc":  {"views": "COUNT(allpv.pv_id)"},
        "sort":  {"by": "views", "order": "desc", "top": 5}
      }
    },
    "result": {"use": "top"}
  }
}
```

これは指定期間のページビュー数上位5件の URL を返します。他のクエリの形は
全てこの骨組みのバリエーションです — マテリアル、`keep` のカラム、`calc` の
集計関数を変えるだけ。

レスポンスの形は以下:

```json
{
  "data": [ /* 行の配列 */ ],
  "meta": { "total_count": 0, "returned_count": 0, "limit": 1000 }
}
```

各句の正式な形は `qal-validation.yaml` を参照してください — この例は
親しみやすい入り口であって、仕様書そのものではありません。

### 4.2 よくある間違い

以下の5つで初回失敗のほぼ全てを説明できます。クエリが弾かれたら、まずここを
確認してください。

1. **POST ボディはクエリを `{"qal": ...}` でラップする必要がある。**
   `/query` エンドポイントはトップレベルの `qal` フィールドからクエリを読む。
   ラップせずに QAL 本体を直接ルートに置くとバリデーションが失敗する。
2. **`from` は配列で、文字列ではない。** `"from": ["allpv"]` と書く。
   `"from": "allpv"` ではない。ソースが1つでも `[...]` でラップする。
3. **`keep` のエントリは `<material>.<column>` の形で修飾する。**
   `"keep": ["allpv.url"]` と書く。`"keep": ["url"]` ではない。
   カラム名を裸で書くと `E_UNKNOWN_COLUMN` で拒否される。
4. **`calc` の値は `FUNC(material.column)` 形式の文字列式。**
   `"calc": {"views": "COUNT(allpv.pv_id)"}` と書く。
   `"calc": {"views": "COUNT(*)"}` も
   `"calc": {"views": {"count": "*"}}` も無効。`*` はここでは有効な
   カラム参照ではなく、実在のカラム名を指定する必要がある。許可された関数は
   `qal-validation.yaml` に列挙されている (現在は `COUNT`, `COUNTUNIQUE`,
   `SUM`, `AVERAGE`, `MIN`, `MAX`)。
5. **`sort` はオブジェクトで、配列ではない。**
   `"sort": {"by": "views", "order": "desc", "top": 5}` と書く。
   `"sort": [{"column": "views", "direction": "desc"}]` ではない。
   キーは `by` (必須、文字列)、`order` (`"asc"` か `"desc"`、必須)、
   `top` (オプション、正の整数 — top-N クエリで行数を制限するには
   `result.limit` の代わりにこれを使う)。

## 5. 守るべきルール

1. **最初のクエリの前に必ず `/guide` を呼ぶこと。** tracking_id、マテリアル、機能のサポート状況を推測しない。
2. **カラムを発明しないこと。** 対象マテリアルの `materials.yaml` に存在するカラムだけを使う。ユーザーが存在しないカラムを要求したら、作り上げずに「無い」と言う。
3. **`time` は常に設定すること。** デフォルトの時間範囲はない。`time` 無しのクエリは拒否される。
4. **`result.use` は常に設定すること。** `make` で定義したビューを参照する必要がある。未定義のビュー参照は `E_UNKNOWN_VIEW` を返す。
5. **`count_only: true` でない限り `result.limit` を必ず設定すること。** 実行コストを予測可能に保つ方法。
6. **同じ名前のビューを2つ置かないこと。** `make` 内でビュー名はユニーク。
7. **`enabled` が `false` の機能を要求しないこと。** `/guide` の `features_detail` マップをチェックする。無効な機能を要求するのはクライアント側のバグで、サーバー側のバグではない。
8. **何かが失敗したら `/guide` を読み直すこと。** キャッシュされた知識と実際のデプロイ状態の間でルールが動いている可能性がある。

## 6. マテリアルの選び方

正本は `materials.yaml`。素早い手引き:

- `allpv` — 1行 = 1ページビュー。トラフィック、セッション、リファラー、デバイス、ページ人気度の質問はここから。
- `click_event` — 1行 = 1クリック。クリックスルー率、レイジクリック、要素レベルの関心度に。
- `gsc` — Google Search Console データ。検索クエリ、インプレッション、オーガニック CTR に。
- `goal_N` — サイトごとに設定された conversion / goal イベント。コンバージョン率の質問に。
- `page_version` — ページバージョンメタデータ。コンテンツ変更や A/B テストのスライシングに。
- `datalayer_event` — カスタム dataLayer イベント。ユーザーが明示的に dataLayer イベント名を言及したときだけ使う。

全リストと各マテリアルのカラムは `materials.yaml` にあります。クエリを出す前にそこを参照してください。

## 7. JOIN ルール

- `materials.yaml` の `join` セクションに列挙されているキーだけが JOIN キーに使える。
- 1つのビューは `from` ソースの上に最大1つのマテリアルを JOIN できる。1ビュー内で複数 JOIN を連鎖しない — 別のビューを `make` に作って `view_chaining` で連鎖する。
- `pv_id` は `allpv` と `click_event` 間の正規の JOIN キー。
- `session_id` は複数マテリアルにまたがるセッション単位メトリクスの正規 JOIN キー。
- `page_id` は `page_version` と相関するときの正規 JOIN キー。

他の ID っぽいフィールドは将来用または内部簿記用です。**`materials.yaml` の `join:` にないカラムで JOIN したくなったら、やめること。**

## 8. Filter, calc, sort — 安全な表面

- `filter` はフラットな `{column: value}` または `{column: {op: value}}` を受ける。自由形式 SQL は無い。生の式は無い。
- `calc` はホワイトリスト化された関数集合をサポートする。現在のリストは `qal-validation.yaml` を参照。関数名を発明しない。
- `sort` は `{column, direction}` のリスト。方向は `asc` か `desc` だけ、他は無し。
- `result.limit` が行数の上限。`result.count_only: true` ならスカラーのカウントだけ返って `limit` は無視。

### 8.1 `calc` と列宣言（2026-05-11 から）

`calc` 式の中の `material.column` 参照は、その列の宣言そのものです。Executor はそのマテリアルがあるどちら側（`from` または `join.with`）からでも列を fetch し、集計から見えるように merge を通り抜けさせます。その列は **出力には乗りません** — レスポンスの列はちょうど `keep` ∪ `calc` キーで、`GROUP BY` はちょうど `keep` です。

`calc` から見えるようにするためだけに join 側列を `keep` に入れる必要は **ありません**。むしろ、入れると `GROUP BY` の粒度が変わってほぼ常に間違いです:

```jsonc
// ✅ 正解: COUNT は calc 参照経由で click_event.pv_id を見る。
//          GROUP BY = (selector)。selector ごとに1行。
{
  "from":   ["allpv"],
  "join":   { "with": "click_event",
              "on":   [{ "left": "allpv.pv_id", "right": "click_event.pv_id" }] },
  "keep":   ["click_event.selector"],
  "calc":   { "clicks": "COUNT(click_event.pv_id)" }
}

// ❌ 間違い: keep に pv_id が入って GROUP BY = (selector, pv_id) になる。
//          全行がユニークなグループになり、どこでも clicks = 1 になる。
{
  "from":   ["allpv"],
  "join":   { "with": "click_event",
              "on":   [{ "left": "allpv.pv_id", "right": "click_event.pv_id" }] },
  "keep":   ["click_event.selector", "click_event.pv_id"],
  "calc":   { "clicks": "COUNT(click_event.pv_id)" }
}
```

`calc` 式が、`from` か `join.with` に登場しない `material.column` を参照する場合、または存在しない列を参照する場合、バリデータは実行前に `E_CALC_COLUMN_UNRESOLVED` を返します。参照を修正してください。変更せずにリトライしないでください。

**互換性メモ。** `2025-10-20` は `from` 側列のみを自動 fetch していました。古いバージョンに対して、join 側参照を `calc` の中に入れたクエリはサイレントに 0 行を返します。クライアントが両バージョンをサポートする場合、`/guide` の `features_detail.calc_join_symmetric` を確認してください: `false` か非存在なら「旧挙動 — 列を `from` 側に置くか、`2026-05-11` サーバーに移行」してください。

### 8.2 `join.on.left` / `join.on.right` ルール（2026-05-11 から）

`on.left` と `on.right` はピンポイント・スコープでバリデーションされます:

- `on.left` は `from` 側の **解決済み物理マテリアル名** と完全一致しなければなりません。`from[0]` がビューチェイニングのときは、バリデータが比較前にビューを元のマテリアル名まで解決します。素のビュー名プレフィックス（例: `top_pages.pv_id`）は left 側では拒否されます。
- `on.right` は **`join.with` 文字列と完全一致** しなければなりません。

失敗時には `E_INVALID_JOIN` が `details` に `side`、`received_value`、`expected_prefix`、`hint` を構造化して返します。レスポンスの厳密な形と動作サンプルは [エラー](../api/2026-05-11/reference/errors.md) を参照してください。

## 9. やって **いけない** こと

- SQL を書こうとしない。SQL 層は露出していない。
- §2 に挙がっていない URL 経由でデータを取ろうとしない。
- 記憶からカラムリストをハードコードしない。正本は `materials.yaml` で、update 間で変わりうる。
- `time` をバイパスしようとしない。「全期間」クエリは意図的に使えない — 通常それはミスだから。
- 過去のバージョンで有効だった機能が現在も存在すると仮定しない。セッションごとに `features_detail` を再確認する。
- 対象マテリアルの存在を検証せずにユーザーの意図をクエリに直訳しない。

## 10. 迷ったら

推測するより **ユーザーに質問する** ことを優先してください。うまく形成された質問を1回するほうが、拒否されたクエリを3回投げるより安い。この API は正しく組み立てられたクエリを書きやすくするために設計されています — もしあなたが形と戦っているなら、マテリアル選びを間違えている可能性が高いです。
