---
id: materials-index
title: Materials
sidebar_position: 1
---

# Materials

**マテリアル** は、クエリ対象のデータ面です。1行 = 1観測 = 決まった粒度のレコード。QAL は固定数のマテリアルの上に作られていて、各マテリアルの粒度は、ウェブサイトに対する自然な人間の質問にそのまま対応するように選ばれています。

> マテリアルを一番速く理解する方法は、そのマテリアルのページにあるサンプル表を見ることです。人間はカラム一覧よりサンプル行の方が速く読めます。

:::tip 対話型 — Materials Explorer
**[Materials Explorer を開く →](pathname:///tools/materials-explorer/index.html)** — 全マテリアル・全フィールドを検索して探せるビュー（キー/シグナル、意味ファミリー、`since` 日付）。同じ機械可読仕様から生成。*（プロトタイプ）*
:::

## このセクションの内容

- **[`allpv`](./allpv.md)** — 1行 = 1ページビュー。トラフィック、セッション、リファラー、ページ人気度の質問はここから始めてください。
- **[`click_event`](./click_event.md)** — 1行 = 1クリック。クリックスルー率、レイジクリック、要素レベルの関心度に。
- **[`gsc`](./gsc.md)** — Google Search Console データ。検索クエリ、インプレッション、オーガニック CTR に。
- **[`goal_N`](./goal_n.md)** — サイトごとに設定された conversion / goal イベント。コンバージョン率の質問に。
- **[`page_version`](./page_version.md)** — ページバージョンのメタデータ。コンテンツ変更や A/B テストのスライシングに。
- **[`summary_landingpage` / `summary_allpage` / `summary_days_access_detail`](./summary.md)** — 1ファイル読み込みで提供される、集計済みの期間累計サマリー。入口ページ別セッション数、ページランキング、流入元別アクセス詳細など、期間にわたるロールアップが欲しく、*日次の内訳は不要* なときに使います。**Since:** 2026-05-21

すべてのマテリアルの正式なカラム一覧は **[`ai/materials.yaml`](../../for-ai/materials.yaml)** にあります。ここのページは親しみやすいプレビューで、正本は YAML です。

YAML 内の各マテリアルには、そのマテリアルが `tracking_id: "all"`（全サイト集約）を受け付けるかどうかを宣言する `supports_all: true | false` フラグも付いています。おおまかには、トラフィック系マテリアル (`allpv`, `click_event`, `datalayer_event`, `events.{name}`) は `true`、サイト別専用の分析マテリアル (`gsc`, `goal_N`, `page_version`, `ga4_*`) は `false` です。実行時にどう読むかは [`/guide` リファレンス](../2026-05-11/reference/guide.md) を参照してください。**Since:** 2026-04-29

## サンプル表について

各マテリアルページには、現実的な行を手作りしたサンプル表があります。意図的に **3つの ID カラム** — `page_id`, `session_id`, `pv_id` — だけを出しています。これらが JOIN に一番使う鍵だからです。実際のマテリアルは event_id, page_version_id などの追加 ID も持っていますが、YAML 仕様書で追えるので、サンプル表からは外して、データの形が一目で分かるようにしています。
