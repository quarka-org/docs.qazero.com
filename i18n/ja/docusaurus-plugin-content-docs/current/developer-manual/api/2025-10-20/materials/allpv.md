---
id: material-allpv-2025-10-20
title: allpv
sidebar_position: 2
---

# `allpv` — 1行 = 1ページビュー

`allpv` はウェブサイトに関するほとんどの質問の **出発点** です。1行 = 1ページビュー = 1人が1つの URL に1つの瞬間に到達したこと。その瞬間のすべて — リファラー、デバイス、滞在時間、レイジクリックの有無、深読みだったか、セッションの最後だったか — が記録されます。

ユーザーの質問がトラフィック、セッション、リファラー、デバイス、「どのページが人気か」についてなら、欲しいのはこのマテリアルです。

## サンプル行

以下は手作りのサンプルで、期待される形を見せるためのものです。特定サイトの実データではありません。ID カラムは3つだけ (`page_id`, `session_id`, `pv_id`) 表示しています。[`ai/materials.yaml`](../ai/materials.yaml) のスキーマには他にも多数のカラムがあります。

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

簡潔さのため、以下のカラム群は省略しています。[`ai/materials.yaml`](../ai/materials.yaml) に定義があります。

- **流入元**: `source_id`, `medium_id`, `campaign_id`, `content_id` と生の `utm_*`。
- **デバイス詳細**: `device_type`, `os`, `browser`, `language`, `country_code`。
- **エンゲージメント深度**: `dead_click_image_count`, `scroll_back_count`, `content_skip_count`, `exploration_count`, `depth_position`, `exit_pos`。
- **ページ遷移**: `prev_page_id`, `next_page_id`（物理 ID）と、`prev_url`, `prev_title`, `next_url`, `next_title`（`qa_pages` から解決される仮想カラム）。**Since:** 2026-04-17
- **ページ種別フラグ**: `is_article`, `is_product`, `is_list`, `is_form`, `is_top_page`, … ページの種類を分類する boolean フラグ群。
- **ゴールフラグ**: `is_goal_1` から `is_goal_10` — このページビューが設定済みゴールを発火したか。
- **他の ID**: `reader_id`, `device_id`, `version_id` 等。サンプルに出している3つ (`pv_id`, `session_id`, `page_id`) が、通常 JOIN に使うものです。

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

どれも `allpv` の1-2ビューで書けます。

## 次に読むページ

- **[`click_event`](./click_event.md)** — 同じページビューのクリックレベル詳細。
- **[`gsc`](./gsc.md)** — `page_id` で JOIN 可能なオーガニック検索データ。
- **[`/query` リファレンス](../reference/query.md)** — QAL クエリを実際にネットワーク経由で送る方法。
