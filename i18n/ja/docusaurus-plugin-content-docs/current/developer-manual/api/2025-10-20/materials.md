---
id: materials-2025-10-20
title: マテリアルリファレンス
sidebar_position: 4
last_updated: 2026-04-13
api_update: 2026-04-13
---

# マテリアルリファレンス (2025-10-20)

QA ZERO API（バージョン `2025-10-20`）が公開するすべてのマテリアルの完全なカラムカタログです。

:::caution 必要なプラグインバージョン
**最小プラグインバージョン:** 3.0.0.0+

バージョンは WP 管理画面 → プラグインから、または `/guide` を呼び出して `plugin_version` を読むことで確認できます。
互換性がない場合は [互換性ガイド](../compatibility.md) を参照してください。
:::

---

## 概要

| マテリアル | 種別 | ソース | 用途 |
|----------|------|--------|---------|
| `allpv` | ログ（カラム DB） | view_pv | 識別情報、デバイス、トラフィックソース、行動を含むページビュー |
| `gsc` | ログ（カラム DB） | GSC インポート | ページ × キーワード単位の Search Console クリック数 / インプレッション数 / 掲載順位 |
| `goal_1`..`goal_N` | ログ（派生） | ゴールファイル関数 | PV レベルのゴールコンバージョンログ。設定済みゴールごとに 1 マテリアル |
| `ga4_age_gender` | 属性（カラム DB） | GA4 インポート (T48) | 年齢 × 性別のセッション内訳 |
| `ga4_country` | 属性（カラム DB） | GA4 インポート (T48) | 国別のセッション内訳 |
| `ga4_region` | 属性（カラム DB） | GA4 インポート (T48) | 地域（都道府県等）のセッション内訳 |
| `page_version` | マスター（カラム DB） | ページバージョントラッカー (T53) | ページごとのコンテンツバージョンログ |
| `click_event` | ログ（カラム DB） | クリックイベントパイプライン | ページ要素上のクリックイベント |
| `datalayer_event` | ログ（カラム DB、dataLayer サイトのみ） | raw_g | dataLayer イベントの統合インデックス |
| `events.{name}` | ログ（カラム DB、動的） | raw_g | イベントごとの型付きマテリアル（`/guide` から発見） |

すべてのログは日単位で時間インデックスされています。`time.start` / `time.end` でクエリ範囲を指定してください。

**サイトで利用可能なマテリアルの発見方法:**
```bash
curl -u "user:pass" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```
レスポンスは各トラッキングサイトで利用可能なマテリアル、ゴール、datalayer イベント、およびそれらの行数 / 日付範囲を列挙します。

---

## allpv — ページビュー

`allpv` は QA ZERO の主要マテリアルです。すべてのページビューが識別情報、ページ、参照元、デバイス、タイミング、行動カラムとともに保存されます。他の多くのマテリアルに対する結合のアンカーです（`pv_id`、`session_id`、`reader_id`、`page_id`、`version_id` 経由）。

### 識別 & セッション

| カラム | 型 | 説明 | フィルターのヒント |
|--------|------|-------------|-------------|
| `pv_id` | u32 | 一意のページビュー id | 結合キー — これでフィルターしないこと |
| `session_id` | u32 | セッション id（tracking_id × 日内でシーケンシャル） | 高速なカラムスキャン |
| `reader_id` | u32 | 訪問者 id（永続） | 高速。人間利用では URL フィルターと組み合わせると良い |
| `page_id` | u32 | ページ id（結合キー） | 通常は代わりに `url` でフィルター |
| `device_id` | u8 | 内部デバイス id（1=PC、2=SP、3=tablet） | `device_type` を推奨 |
| `source_id` / `medium_id` / `campaign_id` / `content_id` | u16/u8 | トラフィックソース ids | `utm_*` カラムを推奨 |
| `version_id` | u16 | ページバージョン id（A/B / デプロイ） | `page_version` への結合キー |
| `access_time` | u32 | UNIX タイムスタンプ（time カラムでもある） | 通常は `time` で扱う |

### ページ情報（`page_id` 経由でマスター解決）

| カラム | 型 | 説明 | フィルターのヒント |
|--------|------|-------------|-------------|
| `url` | string | フル URL | `eq`/`in` は高速（ハッシュインデックス）。`prefix`/`contains` はスキャンにフォールバック |
| `title` | string | ページタイトル | URL でフィルターしてから `keep` でタイトルを取得 |
| `page_type` | u64 bitfield | ページタイプのビットフラグ | 下記の `is_*` ブール値を推奨 |
| `page_fetch_status` | i8 | NULL / 1=成功 / -1=失敗 | |

**ページタイプ判定フラグ**（生成カラム、すべて `0/1`）:
`is_article`、`is_product`、`is_list`、`is_form`、`is_trust_info`、`is_faq`、`is_landing`、`is_search`、`is_account`、`is_cart`、`is_checkout`、`is_confirm`、`is_thanks`、`is_top_page`、`is_event`、`is_recipe`、`is_job`、`is_video`、`is_howto`、`is_qa_forum`

### 参照元 & UTM（マスター解決）

| カラム | 説明 |
|--------|-------------|
| `source_domain` | リファラードメイン |
| `referrer` | 完全なリファラー URL |
| `utm_source` | UTM source |
| `utm_medium` | UTM medium |
| `utm_campaign` | UTM campaign |
| `utm_content` | UTM content |
| `utm_term` | UTM term |

### デバイス & 読者属性

| カラム | 説明 |
|--------|-------------|
| `ua` | User-Agent の一部 |
| `device_type` | `"PC"`、`"SP"`、`"tablet"`（大文字小文字を区別、この 3 つの値のみ） |
| `os` | OS ラベル |
| `browser` | ブラウザラベル |
| `language` | 読者の言語 |
| `country_code` | ISO 3166-1 alpha-2 |
| `original_id` | 読者の original id |

### タイミング & 基本行動

| カラム | 型 | 説明 |
|--------|------|-------------|
| `pv` | u16 | セッション内の PV インデックス（1 = ランディング） |
| `speed_msec` | u16 | ページ読み込み時間（ms） |
| `browse_sec` | u16 | 閲覧時間（秒） |
| `is_last` | bool | セッションの最後の PV（離脱ページ） |
| `is_newuser` | bool | 新規ユーザーフラグ |

### 行動メトリクス (T41)

スクロール / クリック / 探索の raw イベントから計算されます。

**スクロール / 読了深度 (raw_p):**

| カラム | 型 | 説明 |
|--------|------|-------------|
| `depth_position` | u8 (0-100%) | 最大スクロール深度 |
| `deep_read` | 0/1 | 深読みフラグ: 3 秒以上の停止が 5 回以上 |
| `stop_max_sec` | u16 | 任意の地点での最長滞在時間（秒） |
| `stop_max_pos` | u8 (0-100%) | 最長滞在の位置（%） |
| `exit_pos` | u8 (0-100%) | 離脱時の位置 |

**クリック品質 (raw_c):**

| カラム | 型 | 説明 |
|--------|------|-------------|
| `is_submit` | 0/1 | サブミット（フォーム CV）が発生 |
| `dead_click_image_count` | u8 | リンクのない画像に対するクリック数 |
| `irritation_click_count` | u8 | 高速に連打されたクリック（レイジクリック） |

**マウス / ナビゲーション (raw_e):**

| カラム | 型 | 説明 |
|--------|------|-------------|
| `scroll_back_count` | u8 | 大きな上方向スクロールバック |
| `content_skip_count` | u8 | 大きな下方向スキップ |
| `exploration_count` | u8 | 水平方向のマウス探索イベント |

### 仮想ゴールカラム

`is_goal_1` .. `is_goal_10` — その PV がゴール N を達成したかどうかを示す PV 単位のフラグ。`eq:1` でフィルター可能です（「達成」ケースのみサポート）。OR 的な意味が必要な場合は、複数の `is_goal_N` カラムを `keep` してクライアント側で後処理してください。

---

## gsc — Google Search Console

ページ × キーワード × 日単位の検索メトリクスのカラム DB マテリアルです。**N:M カーディナリティ** — `allpv` から `gsc` への結合は **gsc 側にフィルターが必須** で、そうでなければクエリは拒否されます（`E_JOIN_FILTER_REQUIRED`）。

### カラム

| カラム | 型 | 説明 | フィルターのヒント |
|--------|------|-------------|-------------|
| `page_id` | u32 | 結合キー（`url`、`title` を解決） | 通常は `url` 経由でフィルター |
| `query_id` | u32 | キーワード id | `keyword` を推奨 |
| `search_type` | u8 | 1=web、2=image、3=video | 高速 |
| `clicks` | u32 | 日次クリック数 | `SUM` で集計 |
| `impressions` | u32 | 日次インプレッション数 | `SUM` で集計 |
| `position_x100` | u16 | 掲載順位 × 100（生の格納値） | 仮想カラムの `position` を推奨 |
| `keyword` | string | 検索クエリ（`query_id` 経由で解決） | DB ルックアップ → カラムスキャン |
| `url` | string | ページ URL（`page_id` 経由で解決） | |
| `title` | string | ページタイトル（`page_id` 経由で解決） | |
| `page_type` | u64 | ページタイプのビットフィールド（`page_id` 経由で解決） | |
| `page_fetch_status` | i8 | `page_id` 経由で解決 | |

### 仮想カラム（計算）

| カラム | 計算式 | 使い方 |
|--------|---------|-------|
| `ctr` | `clicks / impressions` | `keep` または集計後に使用 |
| `position` | `position_x100 / 100` | float の掲載順位 |
| `position_weighted` | `position × impressions` | `SUM` で集計して加重平均順位を計算 |

### M:N 結合ルール

`gsc.join.cardinality = "N:M"` — マニフェストはこのマテリアルを結合時に展開すると示しています。実行エンジンは、`gsc` をビルドするビュー（またはそれを結合するビュー）に `gsc` カラム上の `filter` がない限り、`gsc` をターゲットとする `join` を拒否します。典型的なフィルター: `keyword`、`search_type`、`url` 経由の `page_id` 範囲。

---

## goal_1 .. goal_N — ゴールコンバージョンログ

`goal_x` はテンプレートです。サイトに設定された各ゴールがそれぞれ固有のマテリアル（例: `goal_1`、`goal_2`、...）を生成します。`/guide` レスポンスで各サイトの利用可能なゴールが列挙されます。

行は PV レベルのコンバージョンレコードです — このサイトでゴールが達成されるたびに記録されます。

**コアカラム:**
`pv_id`、`session_id`、`reader_id`、`page_id`、`url`、`title`、`access_time`、`device_id`、`version_id`、`is_reject`、`is_newuser`、`is_last`、`pv`、`speed_msec`、`browse_sec`

**トラフィックソースカラム:**
`source_id`、`utm_source`、`source_domain`、`medium_id`、`utm_medium`、`campaign_id`、`utm_campaign`

**セッションコンテキスト:**
`session_index`、`pv_index`、`session_no`、`version_no`、`is_raw_p`、`is_raw_c`、`is_raw_e`、`UAos`、`UAbrowser`、`language`

**フィルター可能カラム（バリデーションマニフェスト）:** `utm_source`、`utm_medium`、`utm_campaign`、`device_id`、`is_reject`

`allpv.is_goal_N=1` でフィルターするのではなく、コンバージョンのみの行が欲しい場合に `goal_N` を使用してください。「この PV はコンバージョンしたか?」という問いには `allpv` の方が低コストです。`allpv` に保存されていないゴール固有のコンテキストが必要な場合は `goal_N` の方が低コストです。

---

## ga4_age_gender、ga4_country、ga4_region — GA4 属性データ (T48)

Google Analytics 4 からインポートされる日次属性集計です。QA ZERO の独自トラッカーが捕捉しない人口統計と地理情報のブレークダウンで `allpv` を補完します。

### ga4_age_gender

| カラム | 型 | 説明 |
|--------|------|-------------|
| `age` | u8 | 年齢区分 id（0=不明、1=18-24、2=25-34、3=35-44、4=45-54、5=55-64、6=65+） |
| `gender` | u8 | 0=不明、1=男性、2=女性 |
| `sessions` | u32 | セッション数 |
| `active_users` | u32 | アクティブユーザー数 |
| `age_label` | string | 解決済みの区分ラベル |
| `gender_label` | string | 解決済みの性別ラベル |

**フィルター可能:** `age`、`gender`、`sessions`、`active_users`。

### ga4_country

| カラム | 型 | 説明 |
|--------|------|-------------|
| `country` | u16 | 国 id（ASCII パックの 2 文字コード） |
| `sessions` | u32 | |
| `active_users` | u32 | |
| `country_code` | string | 2 文字の ISO コード（解決済み） |

**フィルター可能:** `country`、`sessions`、`active_users`。

### ga4_region

| カラム | 型 | 説明 |
|--------|------|-------------|
| `region` | u16 | 地域 id（1-47 = 日本の都道府県、0 = その他 / 海外） |
| `sessions` | u32 | |
| `active_users` | u32 | |
| `region_name` | string | 都道府県名（英語、解決済み） |

**フィルター可能:** `region`、`sessions`、`active_users`。

これら 3 つのマテリアルはすべて集計済みで、`pv_id` を持たず、`allpv` へ結合するべきではありません。ブレークダウンのために `calc` と直接組み合わせて使ってください。

---

## page_version — ページコンテンツバージョン (T53)

`(page_id, device_id)` ごとのコンテンツバージョンを追跡します。A/B スナップショットや変更影響分析に便利です。`allpv.version_id` に対して `cardinality: "1:1"` なので、`allpv` からフィルターなしで結合しても安全です。

| カラム | 説明 |
|--------|-------------|
| `version_id` | PK / 結合キー（`allpv.version_id` と一致） |
| `page_id` | ページ id |
| `device_id` | 1=PC、2=SP、3=tablet |
| `version_no` | `(page_id, device_id)` 内の単調増加するバージョン番号 |
| `update_date` | このバージョンが作成された日時 |
| `url` | URL（`page_id` 経由で解決） |
| `title` | タイトル（`page_id` 経由で解決） |
| `device_type` | `"PC"` / `"SP"` / `"tablet"`（`device_id` 経由で解決） |

**フィルター可能:** `page_id`、`device_id`、`version_no`、`update_date`。

**使い方:** `allpv` を対象 URL でフィルターしてから `version_id` で `page_version` を `join` し、各 PV に一致するバージョンメタを付与します。

---

## click_event — クリックイベント

クライアントトラッカーが捕捉したすべてのクリックをカラム DB に格納したものです。`pv_id` 経由で `allpv` に結合します。

| カラム | 型 | 説明 |
|--------|------|-------------|
| `pv_id` | u32 | `allpv.pv_id` への結合キー |
| `session_id` | u32 | セッション id |
| `page_id` | u32 | ページ id |
| `event_sec` | u16 | PV 開始からのオフセット（秒） |
| `selector` | u32 | 要素セレクタ id |
| `element_text` | u16 | 要素テキスト id |
| `element_id` | u16 | HTML `id` 属性の id |
| `element_class` | u16 | HTML class id |
| `element_data` | u16 | `data-*` id |
| `to_url` | u16 | 遷移先 URL id |
| `is_external` | 0/1 | 外部リンクフラグ |
| `action_id` | u8 | アクションタイプ |
| `page_x_pct` / `page_y_pct` | u16 | ページ内のクリック位置（% × 100） |

---

## datalayer_event — dataLayer 統合インデックス

dataLayer イベント（`raw_g`）を送信するサイトでのみ利用可能です。すべてのイベントが統一スキーマでここに格納されます:

| カラム | 型 | 説明 |
|--------|------|-------------|
| `pv_id` | u32 | 結合キー |
| `session_id` | u32 | セッション id |
| `page_id` | u32 | ページ id |
| `event_name` | string | イベント名（解決済み） |
| `params_json` | string | 完全な params ペイロード（解決済みの JSON 文字列） |

イベント横断検索（「どのセッションが `add_to_cart` を発火したか?」）には `datalayer_event` を使用してください。型付きのパラメーターカラムが必要な場合は `events.{name}` マテリアルに切り替えてください。

### `events.{name}` — イベントごとの型付きマテリアル

サイトが発火する個別のイベント名それぞれに対して、そのイベントのマニフェストで宣言された型付きパラメーターをカラムとする動的マテリアルが公開されます。すべてのイベントに共通する固定カラム: `pv_id`、`session_id`。リストは `/guide` レスポンスの `sites[].datalayer_events[]` フィールドから発見できます。これは各イベントの `material`、`event_count`、型付きカラムスキーマを報告します。

例 — `events.purchase`:

| カラム | 型 | 説明 |
|--------|------|-------------|
| `pv_id` | u32 | |
| `session_id` | u32 | |
| `transaction_id` | string | |
| `value` | f64 | |
| `currency` | string | |
| `items` | string (JSON) | |

ディスカバリークエリ（`datalayer_event` からイベント名を集計）:

```json
{
  "tracking_id": "abc123",
  "materials": [{ "name": "datalayer_event" }],
  "time": { "start": "2026-03-01T00:00:00", "end": "2026-04-01T00:00:00", "tz": "Asia/Tokyo" },
  "make": {
    "events": {
      "from": ["datalayer_event"],
      "keep": ["datalayer_event.event_name"],
      "calc": { "n": "COUNT(datalayer_event.pv_id)" }
    }
  },
  "result": { "use": "events", "sort": [{"by":"n","dir":"desc"}] }
}
```

---

## データ型チートシート

| 型 | 範囲 | 代表的な用途 |
|------|-------|-------------|
| `uint8` / `u8` | 0-255 | 小さな id、ブール値、0-100 のパーセンテージ |
| `uint16` / `u16` | 0-65535 | 中程度の id、短いカウンター |
| `uint32` / `u32` | 0-4.29B | 大きな id、タイムスタンプ、カウント |
| `uint64` / `u64` | 巨大 | ビットフィールド（`page_type`） |
| `int8` | -128..127 | ステータスフラグ（例: `page_fetch_status`） |
| `float` | IEEE754 | 派生メトリクス（`ctr`、`position`） |
| `string` | UTF-8 | URL、タイトル、キーワード |

---

## ヒント

1. **`/guide` から始めてください。** 各トラッキングサイトにどのマテリアルが存在するか、データ範囲、どのゴール / datalayer イベントが設定済みかを教えてくれます。
2. **インデックスされたカラムを優先してフィルターしてください。** 各カラムの `search_hint` ノートを確認し、可能であればインデックスされたカラムに対して `eq` / `in` を使ってください。
3. **URL フィルター: `contains` より `eq` / `in` を優先してください。** URL ハッシュインデックスは完全一致を高速化します。`contains` はフルスキャンにフォールバックします。
4. **結合は文字列ではなく id で。** このバージョンでは整数の結合キーのみが許可されます。
5. **行動メトリクスには実トラッカーデータが必要です。** `depth_position`、`deep_read`、`stop_max_*` などは完全な JS トラッカーを必要とします（タグのみでは不可）。データが存在することを保証する必要がある場合は、`goal_x` 経由で `is_raw_p`/`is_raw_c`/`is_raw_e` をフィルターしてください。
6. **`device_type` の値は大文字小文字を区別します:** 正確に `"PC"`、`"SP"`、`"tablet"`。`desktop`、`mobile`、`smartphone` はマッチしません。

---

## 次のステップ

- **[QAL ガイド](./qal.md)** — これらのマテリアルに対するクエリの書き方
- **[エンドポイント](./endpoints.md)** — HTTP サーフェス
- **[QAL バリデーションマニフェスト](./qal-validation.md)** — 機械可読スキーマ
- **[はじめに](./index.md)** — 概要に戻る
