---
id: material-allpv
title: allpv
sidebar_position: 2
last_updated: 2026-11-02
api_update: 2026-11-02
---

# `allpv` — 1行 = 1ページビュー

`allpv` はウェブサイトに関するほとんどの質問の **出発点** です。1行 = 1ページビュー = 1人が1つの URL に1つの瞬間に到達したこと。その瞬間のすべて — リファラー、デバイス、滞在時間、レイジクリックの有無、深読みだったか、セッションの最後だったか — が記録されます。

ユーザーの質問がトラフィック、セッション、リファラー、デバイス、「どのページが人気か」についてなら、欲しいのはこのマテリアルです。

## サンプル行

以下は手作りのサンプルで、期待される形を見せるためのものです。特定サイトの実データではありません。ID カラムは3つだけ (`page_id`, `session_id`, `pv_id`) 表示しています。[`ai/materials.yaml`](../../for-ai/materials.yaml) のスキーマには他にも多数のカラムがあります。

| pv_id | session_id | page_id | url                       | referrer              | device  | browse_sec | deep_read | stop_max_sec | irritation_click | is_last |
|------:|-----------:|--------:|---------------------------|-----------------------|---------|-----------:|----------:|-------------:|-----------------:|:-------:|
| 91023 | 48217      | 1042    | `/blog/coffee-grinders/`   | google / organic      | mobile  |        312 |         1 |          142 |                0 | —       |
| 91024 | 48217      | 1088    | `/products/hario-slim/`    | (同サイト内遷移)           | mobile  |         28 |         0 |            8 |                2 | —       |
| 91025 | 48217      | 1042    | `/blog/coffee-grinders/`   | (同サイト内、戻る)         | mobile  |         64 |         0 |           22 |                0 | ✓       |
| 91026 | 48218      | 1003    | `/`                       | (ダイレクト)               | desktop |         11 |         0 |            6 |                0 | ✓       |
| 91027 | 48219      | 1201    | `/recipes/v60/`            | pinterest.com         | mobile  |        498 |         1 |          221 |                0 | ✓       |
| 91028 | 48220      | 1088    | `/products/hario-slim/`    | google / ads          | desktop |         15 |         0 |           11 |                4 | ✓       |

一目で読み取れるようにしている物語:

- **セッション 48217** は Google から来て、ブログ記事を深読みし (`stop_max_sec = 142`)、商品ページに飛び、イライラして (`irritation_click = 2`)、戻って、離脱。典型的な *「記事は良かったが商品ページがダメだった」* パターン。
- **セッション 48219** は期待したい行: 1ページビュー、8分以上の滞在、深読み、Pinterest から。これはコンテンツ発見の成功例。
- **セッション 48220** は 48217 がバウンスしたのと同じ商品ページに Google Ads で落ちていて、こちらもイライラクリックが出ている。同じページの問題を示す2つの独立したシグナル。

本物の `allpv` 行はここに出ているより多くのカラムを持っています。YAML 仕様書が正本です。

## サンプルが省いているカラム

簡潔さのため、以下のカラム群は省略しています。[`ai/materials.yaml`](../../for-ai/materials.yaml) に定義があります。

- **流入元**: `source_id`, `medium_id`, `campaign_id`, `content_id` と生の `utm_*`。
- **デバイス詳細**: `device_type`, `os`, `browser`, `language`, `country_code`。
- **ブラウザビューポート**: `window_inner_width`, `window_inner_height`（uint16） — ページビュー時点のブラウザの `window.innerWidth` / `window.innerHeight` を CSS ピクセルで表します。デバイスの画面解像度ではなく *実表示コンテンツ領域* です。`0` はそのビューでソースヘッダーが欠落していたことを意味するので、実測値だけを残すには `gte: 1` でフィルターしてください。レスポンシブブレークポイントやビューポート帯の分析（タブレット帯は `between: 768, 1199`、PC 帯は `gte: 1200`）に便利です。**Since:** 2026-05-20
- **エンゲージメント深度**: `dead_click_image_count`, `scroll_back_count`, `content_skip_count`, `exploration_count`, `depth_position`, `exit_pos`。
- **ページ遷移**: `prev_page_id`, `next_page_id`（物理 ID）と、`prev_url`, `prev_title`, `next_url`, `next_title`（`qa_pages` から解決される仮想カラム）。**Since:** 2026-04-17
- **ページ種別フラグ**: `is_article`, `is_product`, `is_list`, `is_form`, `is_top_page`, … ページの種類を分類する boolean フラグ群。
- **ゴールフラグ**: `is_goal_1` から `is_goal_10` — このページビューが設定済みゴールを発火したか。
- **他の ID**: `reader_id`, `device_id`, `version_id` 等。サンプルに出している3つ (`pv_id`, `session_id`, `page_id`) が、通常 JOIN に使うものです。

## 時間バケット: `month`、`hour`、`weekday` {#time-buckets}

QAL にはタイムスタンプを月・時間帯・曜日に丸める関数がありません（`calc` は固定のホワイトリストです）。代わりに `allpv` は、クエリ実行時に `access_time` から算出する仮想カラムを3本持っています。どれかを `keep` に入れると、その値で行がグループ化されます。

| カラム | 型 | 値 | Since |
|---|---|---|---|
| `month` | string | `"YYYY-MM"` | 2026-08-05 |
| `hour` | int | `0`〜`23` | 2026-11-02 |
| `weekday` | int | `0`〜`6`、`0` = 日曜（PHP の `w` と同じ） | 2026-11-02 |

- **サイト時計で算出します。** 3本ともサイト自身の時計（WordPress のタイムゾーン）で算出します。`time.tz` はこれらの値を変えません。`time.tz` が決めるのは、どの日のファイルを読むかだけです。
- **夏時間（DST）。** 時間帯は壁時計の時刻で数えます。秋の夏時間の終了日は `hour = 1` に2時間分のアクセスが入り、春の開始日は `hour = 2` が0件になります。GA4 も同じ数え方です。
- **先に `time` で絞ります。** これらのカラムは `keep` で使う前提です。これらのカラムでの絞り込みは全行を復号した後のポストフィルターになるため遅くなります。期間は `time` で絞り、物理カラム（`source_id`、`medium_id`、`is_newuser` など）の `filter` で先に絞ってから、バケットを `keep` に入れてください。絞り込みの無い12ヶ月分のクエリは、これらのカラムを使うかどうかに関係なく重くなります。
- **整数のみです。** `hour` と `weekday` は整数なので、`prefix` と `contains` は効きません。
- **ゼロ埋めせず、並び順も保証しません。** ページビューの無い時間帯・曜日は行が出ません。行は初出順で返るので、時刻順・曜日順にするにはバケットのカラムで `sort` を指定してください。
- **ラベルはクライアント側で付けます。** `weekday` は数値を返します。「日」「月」… への対応づけはクライアント側で行ってください。

例 — 時間帯別のページビュー数を時刻順に:

```json
"make": {
  "by_hour": {
    "from": "allpv",
    "keep": ["hour"],
    "calc": { "views": { "count": "*" } },
    "sort": [{ "column": "hour", "direction": "asc" }]
  }
}
```

`gsc` にも `month` はありますが、`hour` と `weekday` はありません（行が日単位のため）。[`gsc`](./gsc.md#month) を参照してください。

**Since:** `month` 2026-08-05 · `hour` / `weekday` 2026-11-02。使う前に `/guide` の `features.material_month_bucket` と `features.material_hour_weekday_bucket` を確認してください。

## 集客チャネル: `channel` {#channel}

`channel`（string）は、そのページビューのセッションがどの集客チャネルから来たかを表す仮想カラムです。QA ZERO の集客画面にあるチャネル表と同じルールで判定するので、両者の数字は一致します。

- **値。** 16種の固定の英語名のどれかです: `"Direct"`、`"Organic Search"`、`"Paid Search"`、`"Organic Social"`、`"Paid Social"`、`"Organic Video"`、`"Paid Video"`、`"Organic Shopping"`、`"Paid Shopping"`、`"Display"`、`"Paid Other"`、`"Email"`、`"Affiliates"`、`"Referral"`、`"AI Referral"`、`"Unassigned"`。判定できない行は `"Unassigned"` になり、`null` にはなりません（JOIN の右側で左に一致しない行は、他の右側カラムと同じく `null` になります）。表示ラベルの翻訳はクライアント側で行い、知らない値は「その他」として扱ってください。
- **読み出し時に判定します。** 値は保存されていません。サイトの *現在の* チャネルルール（カスタムチャネルを含む）で算出します。ルールを変えると、過去期間の数字も次のクエリから変わります。集客画面と同じ挙動です。
- **セッション数の数え方。** 各ページビューは、そのセッションの流入元で判定されます。ページビュー数ではなくセッション数を数えるには、着地 PV（`pv` `eq` `1`）で絞ってください。
- **先に絞ります。** `channel` での絞り込みは全行を復号した後のポストフィルターなので遅く、`count_only` のクエリも遅くなります。`time` と物理カラム（`source_id`、`medium_id`、`is_newuser` など）で先に絞ってください。特定の参照元1つだけを見るなら、`channel` より `source_domain` の filter のほうが速く動きます。
- チャネルルールを読み込めない場合、`channel` を要求したクエリは、全行を `Direct` / `Unassigned` として返すのではなく `E_DEPENDENCY_NOT_AVAILABLE` で失敗します。

例 — チャネル別のセッション数:

```json
"make": {
  "by_channel": {
    "from": "allpv",
    "keep": ["channel"],
    "filter": { "pv": { "eq": 1 } },
    "calc": { "sessions": { "count": "*" } },
    "sort": [{ "column": "sessions", "direction": "desc" }]
  }
}
```

**Since:** 2026-11-02（`/guide` の `features.material_channel_column`）

## よく使う JOIN キー

- `pv_id` → `click_event.pv_id` (このページビューで起きたクリック)
- `session_id` → `click_event.session_id` (セッション単位の分析)
- `page_id` → `gsc.page_id` (同じ URL のオーガニック検索データ)
- `page_id` → `page_version.page_id` (閲覧時点のコンテンツバージョン)

## `allpv` に向いた最初の質問

- 「直近30日で一番トラフィックが落ちたページは?」
- 「一番長いセッションを生むリファラーは?」
- 「チェックアウトページの mobile vs desktop 比は?」
- 「deep_read は高いが conversion は低いページは?」
- 「`irritation_click_count` が異常に高いページは?」
- 「ダイレクト流入は何時台・何曜日に来ている?」（`keep: ["channel", "hour", "weekday"]`）

どれも `allpv` の1-2ビューで書けます。

## 次に読むページ

- **[`click_event`](./click_event.md)** — 同じページビューのクリックレベル詳細。
- **[`gsc`](./gsc.md)** — `page_id` で JOIN 可能なオーガニック検索データ。
- **[`/query` リファレンス](../2026-05-11/reference/query.md)** — QAL クエリを実際にネットワーク経由で送る方法。
