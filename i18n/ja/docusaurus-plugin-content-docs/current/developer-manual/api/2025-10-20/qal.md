---
id: qal-2025-10-20
title: QAL ガイド
sidebar_position: 3
last_updated: 2026-04-13
api_update: 2026-04-13
---

# QAL ガイド (2025-10-20)

## 概要

**QAL** (Query Abstraction Language) は、QA ZERO のカラム指向分析データ向けに設計された、軽量で安全性を第一に考えたクエリ言語です。これは汎用的な SQL 方言では *ありません* — QAL はクエリを予測可能で安全なものにし、人間と AI の両方が書きやすくするために、意図的に表現力を制限しています。

**バージョン:** 2025-10-20

### 設計原則

1. **曖昧さを排除する** — 自由度を減らし、決定性を高める
2. **AI と人間の双方にとって予測可能である** — 各意図を表現する「明らかに正しい方法」を一つだけ用意する
3. **アクセスログ形式のデータに最適化する** — 実際に重要な問題を解くための最小限の構文

### サポート対象

正本のリストはサーバーの `/guide` レスポンスの `features` マップを確認してください — 実行中のプラグインが実際にどの機能を実装しているかを報告します。

| 機能 | ステータス | 備考 |
|---------|--------|-------|
| `materials` | ✅ | データソースを宣言します（エイリアス不可） |
| `time` | ✅ | IANA タイムゾーン付きの時間範囲 |
| `make.from` | ✅ | ソースマテリアルまたは既に構築されたビュー |
| `make.filter` | ✅ | フラット形式の行フィルター（カラムごとの条件の AND） |
| `make.join` | ✅ | ビューごとに 1 つの等結合（equi-join）、ID ベースのみ |
| `make.keep` | ✅ | カラムの射影 / グループキー |
| `make.calc` | ✅ | 集計（ホワイトリスト関数） |
| `make.add` | ✅ | オプションの明示的な calc キーリスト |
| `make.sort` | ✅ **Since:** 2026-04-13 | 行のソートとトップ N 抽出 |
| ビューチェイニング (`from: ["other_view"]`) | ✅ | インメモリの keep/calc/join でビューを合成 |
| `result.use` / `limit` / `count_only` | ✅ | |
| 仮想カラム (`position_weighted`, `is_goal_N`, …) | ✅ | マテリアル/Executor 層で計算 |

**未サポート（明示的なリスト）:**
- `result.sample` / `result.include_count` / `result.return` — 現在の `result` ホワイトリストに含まれません。代わりに `make.sort` と `limit` / `count_only` を使用してください
- フィルター条件をまたぐ `OR` ロジック（フラット形式フィルターは暗黙の `AND` です）
- 集計結果に対する HAVING 形式のフィルター
- エイリアス (`as`) — 意図的に禁止
- 1 つのビューでの複数ステップ結合（ビューごとに 1 つの結合のみ）

---

## ドキュメント構造

QAL クエリには 5 つの必須トップレベルキーがあります。

```json
{
  "tracking_id": "abc123",
  "materials": [ /* data sources */ ],
  "time":      { /* time range */ },
  "make":      { /* view definitions */ },
  "result":    { /* result specification */ }
}
```

**メモ:** QAL のバージョンは URL のクエリパラメーター (`?version=2025-10-20`) で指定し、ボディには含めません。`/qa-platform/query` に POST するときは、リクエストボディで QAL オブジェクトを `qal` キーでラップする必要があります。

```json
{ "qal": { "tracking_id": "...", "materials": [...], ... } }
```

---

## 1. tracking_id (必須)

クエリ対象のトラッキングサイトを指定します。`/guide` エンドポイントのレスポンスにある `sites[].tracking_id` の値を使用してください。

```json
{ "tracking_id": "abc123" }
```

**ルール:**
- このプラグインのインストールで認識される `tracking_id` と一致する必要があります
- どのサイトのデータと利用可能なマテリアルを使うかを決定します
- 未知の場合は `E_UNKNOWN_TRACKING_ID` が返されます

---

## 2. materials (必須)

ビューが利用するデータソースを宣言します。

```json
{
  "materials": [
    { "name": "allpv" },
    { "name": "gsc" }
  ]
}
```

**ルール:**
- 各エントリには `name` が必要です
- 名前は完全一致・大文字小文字を区別します
- **エイリアス (`as`) は禁止** — `E_ALIAS_FORBIDDEN`
- 1 つしか使用しない場合でも複数のマテリアルを宣言できます

**利用可能なマテリアル名 (2025-10-20):**

`allpv`, `gsc`, `goal_1`..`goal_N`, `ga4_age_gender`, `ga4_country`, `ga4_region`, `page_version`, `click_event`, `datalayer_event`, `events.{name}`

全カラム一覧は [Materials Reference](./materials.md) を参照してください。

---

## 3. time (必須)

```json
{
  "time": {
    "start": "2026-03-01T00:00:00",
    "end":   "2026-04-01T00:00:00",
    "tz":    "Asia/Tokyo"
  }
}
```

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `start` | string | Yes | ISO 8601 ローカル時刻（start を含む） |
| `end` | string | Yes | ISO 8601 ローカル時刻（end を含まない） |
| `tz` | string | Yes | IANA タイムゾーン識別子 |

時間範囲は `[start, end)` として解釈されます。各マテリアルはこの範囲を自身の物理的な時間カラムにマッピングします。

---

## 4. make (必須)

`make` はキーがビュー名となるオブジェクトです。各ビューは実行の単位 — ソースを選択し、オプションでフィルターや結合を行い、カラムを射影し、オプションで集計するまでを含む 1 つのブロックです。

```json
{
  "make": {
    "<view_name>": {
      "from":   ["<material_or_view>"],
      "filter": { /* §4.1 */ },
      "join":   { /* §4.2 */ },
      "keep":   ["material.column", "..."],
      "calc":   { /* §4.3 */ },
      "add":    ["metric_a", "metric_b"],
      "sort":   { /* §4.7 */ },
      "x-label": "optional annotation"
    }
  }
}
```

### from (必須)

```json
{ "from": ["allpv"] }
```

- 要素数がちょうど 1 つの配列
- `materials` で宣言されたマテリアル名、または同じ `make` ブロック内で先に定義されたビュー名（**ビューチェイニング**）のいずれか
- 不一致の場合は `E_UNKNOWN_MATERIAL` / `E_UNKNOWN_VIEW`

### keep (必須)

```json
{ "keep": ["allpv.url", "allpv.access_time"] }
```

- **完全修飾名が必須** (`<material_or_view>.<column>`)
- 少なくとも 1 つのエントリが必要 — **ただし** `calc` が存在する場合は例外で、空の `keep` は「すべてを 1 行に集計する」（グローバル集計）を意味します
- `calc` がある場合、`keep` は **group-by キー** としても機能します
- 未知のカラムは `E_UNKNOWN_COLUMN` を発生させます

---

### 4.1 filter (オプション)

`filter` は、結合と集計の **前に** `from` ソースに対して行フィルターを適用します。

```json
{
  "filter": {
    "device_type":  ["SP", "PC"],
    "country_code": ["JP"],
    "url":          { "prefix": "/blog" },
    "browse_sec":   { "gte": 30 }
  }
}
```

- **キーは `from` マテリアルに属する修飾なしのカラム名です。** `allpv.device_type` ではなく `device_type` と書きます。
- **値** は以下のいずれかです:
  - **配列** — 暗黙の `IN`（リストに含まれる値のいずれかに一致）
  - **演算子オブジェクト** — `{ "<op>": <value> }`
- **複数のキーは暗黙の AND で結合されます。** 異なるカラム間の `OR` はまだサポートされていません。

**サポートされる演算子**（Storage 層ベース）:

| 演算子 | 意味 | 値の例 |
|----------|---------|---------------|
| `eq` | 等しい | `"PC"` |
| `neq` | 等しくない | `"bot"` |
| `gt` / `gte` | より大きい / 以上 | `100` |
| `lt` / `lte` | より小さい / 以下 | `1000` |
| `in` | いずれか | `["a", "b"]` |
| `contains` | 部分一致 | `"blog"` |
| `prefix` | 前方一致 | `"/blog"` |
| `between` | 両端を含む範囲 | `[100, 500]` |

**カラム名 — 列挙値 — 型** のすべてが整合している必要があります。たとえば `device_type` は `"PC"`, `"SP"`, `"tablet"` のみを受け付けます（大文字小文字を区別）。各カラムについては [Materials Reference](./materials.md) の `search_hint` の注記を参照してください。

**ビューチェイニング + filter:** `from` がマテリアルではなく別のビューを参照している場合、`filter` は **使用できません** (`E_FILTER_ON_VIEW_CHAIN`)。代わりに上流のビューでフィルターをかけてください。

---

### 4.2 join (オプション)

```json
{
  "join": {
    "with": "gsc",
    "on":   [ { "left": "allpv.page_id", "right": "gsc.page_id" } ],
    "if not match": "keep-left",
    "fill": null
  }
}
```

- **ビューごとに 1 つの結合** — 結合の配列は禁止されています (`E_JOIN_MULTIPLE_FORBIDDEN`)
- `on` エントリは両側とも **完全修飾** のカラム名を使用する必要があります
- **等結合（equi-join）のみ**。範囲結合や関数結合はサポートしません
- **ID カラムのみ**（`page_id`, `pv_id`, `reader_id`, `version_id` などの整数キー）。文字列カラムでの結合は本バージョンではサポートしません
- `if not match`:
  - `"keep-left"` (デフォルト) → LEFT OUTER JOIN。不足する右側の値は `fill`（デフォルト `null`）で埋めます
  - `"drop"` → INNER JOIN

**M:N 結合のフィルター要件 (T45):** 対象マテリアルのマニフェストが `cardinality: "N:M"` を宣言している場合（たとえば `gsc`）、ビューは **必ず** M:N 側に `filter` を含める必要があります — さもないと行数が爆発的に増加します。違反は `E_JOIN_FILTER_REQUIRED` を発生させます。

例 — `gsc` に対する M:N 結合で `keyword` でフィルター:

```json
{
  "materials": [{"name":"allpv"}, {"name":"gsc"}],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "pv_with_kw": {
      "from":   ["allpv"],
      "filter": { "url": { "prefix": "/blog" } },
      "join":   {
        "with": "gsc",
        "on":   [{"left":"allpv.page_id","right":"gsc.page_id"}]
      },
      "keep":   ["allpv.url", "gsc.keyword", "gsc.clicks", "gsc.impressions"]
    }
  },
  "result": { "use": "pv_with_kw", "limit": 1000 }
}
```

メモ: この例は `gsc` にフィルターがないため拒否されます。`gsc` 上のビューにまず `"filter": { "keyword": { "contains": "..." } }` を追加してから結合してください。

---

### 4.3 calc (オプションの集計)

`calc` が存在する場合、ビューは `keep`（これがグループキーになります）で集計し、**`keep` + `calc`** のカラムのみを返します。

```json
{
  "keep": ["allpv.url"],
  "calc": {
    "sessions":  "COUNTUNIQUE(allpv.reader_id)",
    "pageviews": "COUNT(allpv.pv_id)",
    "avg_dwell": "AVERAGE(allpv.browse_sec)"
  }
}
```

**ホワイトリスト関数（単一カラム構文に厳格）:**

- `COUNT(<col>)`
- `COUNTUNIQUE(<col>)`
- `SUM(<col>)`
- `AVERAGE(<col>)`
- `MIN(<col>)`
- `MAX(<col>)`

**ルール:**
- 引数は単一の完全修飾カラム参照でなければなりません — 式、ネスト、算術、条件はすべて不可
- **`COUNT(*)` は使えません** — 実際のカラム名を指定してください
- `calc` が参照するカラムは `keep` に含める必要はありません。フィルター段階で自動的に読み込まれます
- 空の `keep` + `calc` = グローバル集計（1 行）
- 値は正規表現 `^(COUNT|COUNTUNIQUE|SUM|AVERAGE|MIN|MAX)\([A-Za-z_][\w]*\.[A-Za-z_][\w]*\)$` にマッチする必要があります

### 4.4 add (オプション)

```json
{ "add": ["sessions", "pageviews", "avg_dwell"] }
```

- **省略可能**。省略すると `calc` のキーから自動的に導出されます
- 明示する場合は、そのセットが `calc` のキーと完全に一致する必要があります。そうでない場合:
  - `E_ADD_NOT_SUBSET_OF_CALC` — `add` に未知のメトリクスが列挙されている
  - `E_CALC_NOT_SUBSET_OF_ADD` — `calc` に `add` に含まれないキーがある

### 4.5 仮想カラム

一部のカラムは物理的に保存されていません — マテリアル層がオンザフライで計算します。

- `allpv.is_goal_1` .. `allpv.is_goal_10` — PV ごとのゴール達成フラグ（フィルター `eq:1` をサポート）
- `gsc.ctr` — `clicks / impressions`
- `gsc.position` — 加重平均順位（float）
- `gsc.position_weighted` — `position × impressions`（`calc` で加重平均を計算する際の中間値として使用）

仮想カラムは `keep`, `filter`, `calc` で物理カラムと同じように使用できます。完全なカタログは [Materials Reference](./materials.md) を参照してください。

### 4.6 ビューチェイニング

`from` は同じ `make` ブロック内の別のビューを参照できます。

```json
{
  "make": {
    "pv_mobile": {
      "from": ["allpv"],
      "filter": { "device_type": ["SP"] },
      "keep": ["allpv.url", "allpv.browse_sec"]
    },
    "pv_mobile_slow": {
      "from": ["pv_mobile"],
      "keep": ["pv_mobile.url"],
      "calc": { "slow_count": "COUNT(pv_mobile.url)" }
    }
  },
  "result": { "use": "pv_mobile_slow" }
}
```

チェインされたビューでは、`keep`, `calc`, `join` は上流のビューが生成したインメモリの行に対して動作します。チェインされた `from` に対する `filter` は **使用できません** — 代わりに上流でフィルターをかけてください。

### 4.7 sort (オプション)

**Since:** 2026-04-13

ビューの出力行をソートし、オプションでトップ N 行だけを残します。`sort` は `filter` / `join` / `keep` / `calc` の **後** に適用されるため、ソートキーはビューの出力に実在するカラム（`keep` のいずれか、または `calc` / `add` のメトリクス）でなければなりません。

```json
{
  "sort": {
    "by":    "pageviews",
    "order": "desc",
    "top":   10
  }
}
```

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `by` | string | Yes | ソート対象のカラム名。修飾あり（`allpv.url`、`click_event.click_count`）でも修飾なし（`pageviews`）でも指定できます。このビューの `keep` または `calc` / `add` のいずれかに実在する必要があります。 |
| `order` | string | Yes | `"asc"`（昇順）または `"desc"`（降順） |
| `top` | int | No | ソート後の先頭 N 行のみを返します。省略するとすべての行を返します。 |

**ルールと注意点:**

- `sort` はビュー単位です — `make` 内の各ビューはそれぞれ独自の `sort` を持てます。最終的な `result.limit` は `top` の後にも適用されるため、「意味的にトップ N が欲しい」場合は `top` を使い、`limit` は行数のセーフティキャップとしてだけ使ってください。
- `by` の解決は修飾名を先に試し、次に修飾なし名を試します。修飾なしで曖昧な場合はバリデーションエラーになります — 結合のあるビューでは修飾名を優先してください。
- `null` 値は `desc` では最後に、`asc` では最初にソートされます（実行ごとに安定）。
- ビューチェイニングで参照されるビューをソートすることは可能ですが、下流のビューが集計（`calc`）する場合、下流の出力順序は独立であり、下流側にも独自の `sort` が必要です。
- 本バージョンでは「複数カラムによるソート」の形式はありません。副次キーが必要な場合は、副次キーを `calc` / `add` の複合スコアとして生成し、それでソートしてください（クライアント側または上流ビューで）。

**例 — pageviews の多い URL トップ 10:**

```json
{
  "make": {
    "by_url": {
      "from": ["allpv"],
      "keep": ["allpv.url"],
      "calc": {
        "pageviews": "COUNT(allpv.pv_id)",
        "sessions":  "COUNTUNIQUE(allpv.reader_id)"
      },
      "sort": { "by": "pageviews", "order": "desc", "top": 10 }
    }
  },
  "result": { "use": "by_url" }
}
```

---

## 5. result (必須)

最終的なビューを選択し、出力の形を制御します。

```json
{
  "result": {
    "use":        "pv_stats",
    "limit":      1000,
    "count_only": false
  }
}
```

### 現在実装されているキー

| キー | 型 | 説明 |
|-----|------|-------------|
| `use` | string | 返却する（`make` 内の）ビュー名。ちょうど 1 つ。 |
| `limit` | int | 返却する最大行数。デフォルト `1000`、上限 `50000`。 |
| `count_only` | bool | `true` の場合、`{ "count": N }` のみを返します — データは返しません。 |

実運用で許可されているのは上記のホワイトリストに含まれるキーのみです — その他のキーは `E_RESULT_FORBIDDEN_KEY` を発生させます。

### ソート — `result.sort` ではなく `make.sort` を使用

本 API ではソートは **ビュー単位** の関心事です。順序付けられた結果が必要な場合は、`result.use` が指す先のビュー内に `sort` ブロックを置いてください（§4.7 参照）。`result.sort` キーは意図的に存在しません — 1 つの QAL クエリはビューチェイニングで複数のビューを要求できる場合があり、それぞれのビューが自分の順序を所有します。

### 計画中のキー（未実装）

以下のキーは設計仕様書に記載されていますが、**現在の `result` ホワイトリストでは受理されません**。将来の `api_update` で有効化される予定です。使用する前に必ず `/guide` の `features` マップを確認してください。

| キー | ステータス | 予定されている形式 |
|-----|--------|---------------|
| `sample` | 🚧 まだ受理されません | `{ "max_rows": N, "method": "head\|random\|hashmod" }` |
| `include_count` | 🚧 まだ受理されません | `bool` → `meta.filtered_rows` を埋める予定 |
| `return` | 🚧 まだ受理されません — 本日時点のレスポンスは常に `INLINE` / `JSON` です | `{ "mode": "INLINE\|FILE", "format": "JSON\|CSV\|PARQUET" }` |

---

## 6. エラーリファレンス

| コード | 原因 |
|------|-------|
| `E_UNKNOWN_TRACKING_ID` | `tracking_id` が既知のサイトと一致しない |
| `E_UNKNOWN_MATERIAL` | `materials[].name` または `from[0]` が宣言されたマテリアル/ビューではない |
| `E_UNKNOWN_VIEW` | `from` または `result.use` が存在しないビューを参照している |
| `E_UNKNOWN_COLUMN` | マテリアルのスキーマにカラムが見つからない |
| `E_ALIAS_FORBIDDEN` | `as` が `materials` または `make` に現れた |
| `E_TIME_REQUIRED` | `time.start` / `end` / `tz` が欠落または無効 |
| `E_FILTER_INVALID` | `filter` の構文が不正、または過剰にネストされている |
| `E_FILTER_ON_VIEW_CHAIN` | 別のビューを `from` とするビューに `filter` が付いている |
| `E_INVALID_JOIN` | `join` に `with`/`on` がない、修飾されていない名前、非等結合条件 |
| `E_JOIN_MULTIPLE_FORBIDDEN` | ビューごとに 2 つ以上の結合 |
| `E_JOIN_FILTER_REQUIRED` | M:N 結合のターゲットにフィルターがない（§4.2 参照） |
| `E_RESULT_UNKNOWN_VIEW` | `result.use` がどのビューとも一致しない |
| `E_RESULT_FORBIDDEN_KEY` | `result` にホワイトリスト外のキーが含まれている |
| `E_KEEP_EXPR_FORBIDDEN` | `keep` にカラム参照以外のものが含まれている |
| `E_ADD_NOT_SUBSET_OF_CALC` | 明示的な `add` に `calc` にないメトリクスが列挙されている |
| `E_CALC_NOT_SUBSET_OF_ADD` | 明示的な `add` に `calc` のキーが欠落している |

---

## 7. 完全な例

### 7.1 シンプルな抽出

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "blog_pvs": {
      "from": ["allpv"],
      "filter": { "url": { "contains": "/blog/" } },
      "keep":   ["allpv.pv_id", "allpv.url", "allpv.access_time"],
      "x-label": "Blog pageviews"
    }
  },
  "result": { "use": "blog_pvs", "limit": 100 }
}
```

### 7.2 URL ごとの集計

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "by_url": {
      "from": ["allpv"],
      "keep": ["allpv.url"],
      "calc": {
        "sessions":  "COUNTUNIQUE(allpv.reader_id)",
        "pageviews": "COUNT(allpv.pv_id)",
        "avg_dwell": "AVERAGE(allpv.browse_sec)"
      }
    }
  },
  "result": {
    "use": "by_url",
    "limit": 100
  }
}
```

> `sessions` の降順でトップ 10 URL を取得したい場合は、`by_url` ビューに `"sort": { "by": "sessions", "order": "desc", "top": 10 }` を追加してください（§4.7 参照）。

### 7.3 グローバル集計（1 行）

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "totals": {
      "from": ["allpv"],
      "keep": [],
      "calc": {
        "sessions":  "COUNTUNIQUE(allpv.reader_id)",
        "pageviews": "COUNT(allpv.pv_id)"
      }
    }
  },
  "result": { "use": "totals" }
}
```

### 7.4 ゴールコンバージョン（仮想カラム）

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "goal1_cvrs": {
      "from":   ["allpv"],
      "filter": { "is_goal_1": { "eq": 1 } },
      "keep":   ["allpv.url"],
      "calc":   { "conversions": "COUNT(allpv.pv_id)" }
    }
  },
  "result": {
    "use": "goal1_cvrs",
    "limit": 50
  }
}
```

### 7.5 GSC キーワードパフォーマンス（filter + 加重順位）

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "gsc" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "kw_perf": {
      "from":   ["gsc"],
      "filter": { "keyword": { "contains": "qa" } },
      "keep":   ["gsc.keyword"],
      "calc": {
        "clicks":           "SUM(gsc.clicks)",
        "impressions":      "SUM(gsc.impressions)",
        "position_weighted":"SUM(gsc.position_weighted)"
      }
    }
  },
  "result": {
    "use": "kw_perf",
    "limit": 100
  }
}
```

クライアント側で加重平均順位を `position_weighted / impressions` として計算してください。`clicks` の降順でトップ 100 キーワードを取得したい場合は、`kw_perf` ビューに `"sort": { "by": "clicks", "order": "desc", "top": 100 }` を追加してください。

### 7.6 ビューチェイニング

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "allpv" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "mobile_pvs": {
      "from":   ["allpv"],
      "filter": { "device_type": ["SP"] },
      "keep":   ["allpv.url", "allpv.browse_sec", "allpv.reader_id", "allpv.pv_id"]
    },
    "mobile_by_url": {
      "from": ["mobile_pvs"],
      "keep": ["mobile_pvs.url"],
      "calc": {
        "pv":        "COUNT(mobile_pvs.pv_id)",
        "uniq_user": "COUNTUNIQUE(mobile_pvs.reader_id)",
        "avg_dwell": "AVERAGE(mobile_pvs.browse_sec)"
      }
    }
  },
  "result": {
    "use": "mobile_by_url",
    "limit": 50
  }
}
```

---

## 8. ヒント

1. **早めにフィルターする。** マテリアル上の最初のビューで `filter` を適用すると、下流のビューチェイニングが軽くなります。
2. **`count_only` でサイズを見積もる。** 50k 行を取得する前に件数を確認しましょう。
3. **結合には ID カラムを優先する。** 文字列キーはサポートされていません。`page_id`, `pv_id`, `reader_id` などで結合してください。
4. **ビューにはわかりやすい名前を付ける。** `v1` よりも `mobile_slow_pvs` の方が適切です。
5. **M:N ターゲットには常にフィルターを付ける。** `gsc` のような N:M マテリアルは、結合のターゲット側に *必ず* フィルターが必要です。
6. **まず `/guide` に問い合わせる。** サイトの `tracking_id`、利用可能なマテリアル、ゴール定義、システム上限を報告してくれます。

---

## 次のステップ

- **[Materials Reference](./materials.md)** — すべてのマテリアル、すべてのカラム
- **[QAL Validation Manifest](./qal-validation.md)** — 機械可読なスキーマ
- **[Endpoints](./endpoints.md)** — HTTP サーフェス
- **[Getting Started](./index.md)** — 概要と認証
