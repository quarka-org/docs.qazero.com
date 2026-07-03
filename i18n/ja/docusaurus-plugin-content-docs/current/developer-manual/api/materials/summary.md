---
id: material-summary
title: summary_*
sidebar_position: 7
---

# `summary_*` — 集計済みの期間累計ロールアップ

**Since:** 2026-05-21

3つのサマリーマテリアルは、夜間バッチがすでに保持している **年初来の積分（累計）** を公開します。`allpv` が1行 = 1ページビューなのに対し、サマリーマテリアルは *集計次元の組み合わせごとに1行* で、要求した期間にわたってカウントを累計したものです。

質問が **期間にわたるロールアップ**（「先四半期の入口ページ別セッション数」「今年のページビュー上位」「流入元／メディア／キャンペーン別のアクセス詳細」など）で、日ごとの内訳が不要なときに使ってください。各マテリアルは数百万行の `allpv` をスキャンする代わりに1つの累計ファイル（年跨ぎなら数ファイル）を読むだけなので、典型的なロールアップは2〜3桁高速です。

| マテリアル | 粒度（集計次元） | 用途 |
|---|---|---|
| `summary_landingpage` | 入口ページ × device × utm三軸 × is_newuser × second_page × is_QA | 入口（ランディング）ページのパフォーマンス |
| `summary_allpage` | ページ × device × utm三軸 × is_newuser × is_QA | サイト全体のページランキング |
| `summary_days_access_detail` | device × source × medium × campaign × is_newuser × is_QA | 流入／トラフィックソースの詳細 |

3種とも `supports_all: true` です — 実サイトの `tracking_id` でも、`tracking_id: "all"`（夜間に作られる全サイト集約）でもクエリできます。

:::caution `date` 次元はありません
サマリーマテリアルは **要求した期間に対する累計1セット** を返します。日次の系列ではありません。カウントは期間の積分（`(end) − (start − 1)`）なので年跨ぎ範囲は機能しますが、日別の行はありません。日次トレンドが必要なら `allpv`（`date` 次元あり）を使ってください。

カウントカラム（`pv_count`、`session_count` …）への数値範囲フィルターは、累計ロールアップの **後** に `post_filter` として適用されます（ストレージレベルのスキャンではありません）。
:::

## サンプル行 — `summary_allpage`

形を示す手作りのサンプルで、実データではありません。粒度といくつかの集計値だけを示しています。全カラムは [`ai/materials.yaml`](../../for-ai/materials.yaml) にあります。

| page_id | device_type | utm_source | is_newuser | pv_count | user_count | bounce_count | time_on_page |
|--------:|-------------|------------|-----------:|---------:|-----------:|-------------:|-------------:|
| 1042    | PC          | google     | 1          |    12894 |       9311 |         4120 |       903112 |
| 1042    | SP          | google     | 1          |    20557 |      17402 |         9881 |       742330 |
| 1088    | SP          | (direct)   | 0          |     3301 |       2210 |         1004 |        61120 |
| 1201    | PC          | pinterest  | 1          |      812 |        790 |          120 |       240551 |

読み方: ページ `1042` は Google からのモバイル（`SP`）新規ユーザートラフィックがデスクトップよりはるかに多いものの、モバイルの直帰率は明らかに悪い（`9881 / 20557` 対 `4120 / 12894`）。こうした比較を `summary_allpage` は1ファイル読み込みで答えます。

## カラム群

正確なカラムはマテリアルごとに少し異なります（正本は YAML 仕様書）。3種をまたぐと次のように分かれます:

- **集計次元**（これでフィルター／`keep` する）: `page_id`、`device_id`（値マッピングで仮想 `device_type` ラベル付き — `1 = PC`、`2 = SP`、`3 = tablet`）、`utm_source`、`utm_medium`、`utm_campaign`、`source_domain`、`is_newuser`、`is_QA`、加えて `second_page`（`summary_landingpage` のみ）。
- **累計の集計値**: `pv_count`、`session_count`、`user_count`、`bounce_count`、および時間合計（`summary_landingpage` は `session_time`、他2種は `time_on_page`）。マテリアル固有の追加: `exit_count` と `lp_count`（`summary_allpage`）、`is_newuser_count`（`summary_days_access_detail`）。
- **解決済みページ属性**（ページ粒度のマテリアルのみ）: `title`、`url`、`wp_qa_id` — loader 側で `page_id` から復元されます。

`utm_source` / `utm_medium` / `utm_campaign` は **ラベル文字列** で返る（loader 側で ID 解決済み）ので、生の `allpv` の ID のようにマスターテーブルへ JOIN する必要はありません。

## 最初の質問の例

- 「新規ユーザーのセッション数で上位20の入口ページ、直近90日。」
  → `summary_landingpage`、`is_newuser: 1` でフィルター、`session_count desc` でソート、`top: 20`。
- 「今年のサイト全体のページビューランキング。」
  → `summary_allpage`、`pv_count desc` でソート。
- 「キャンペーン期間の流入元／メディア別のページビューと直帰数。」
  → `summary_days_access_detail`、utm 三軸で集計。

## 次に読むページ

- **[`allpv`](./allpv.md)** — 日次トレンドや、サマリーが丸めてしまうページビュー単位の詳細が必要なときはこちら。
- **[`/query` リファレンス](../2026-05-11/reference/query.md)** — クエリをネットワーク経由で送る方法。
