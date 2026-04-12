---
id: changelog-2025-10-20
title: アップデート履歴
sidebar_position: 6
last_updated: 2026-04-13
api_update: 2026-04-13
---

# アップデート履歴 (2025-10-20)

これは API バージョン `2025-10-20` の **アップデート履歴** です。バージョンごとに 1 つのリビングドキュメントを持ち、新しいエントリーを最上部に追加していきます。各エントリーには、プラグインが `/guide` レスポンスで返す `api_update` の日付をタグ付けしています。上から下へ読むことで、初回リリース以降の API の成長を追うことができ、最新エントリーをお使いのサーバーの `api_update` と突き合わせれば、実際にどの機能が利用可能かを把握できます。

### 2026-04-13 — `api_update: 2026-04-13` — Documentation v1.2.0
**追加:**
- ✅ **QAL `make.sort`** — ビュー単位の行ソートとトップ N 抽出。`make` 内のビューに `sort: { by, order, top }` を置くことで、`filter` / `join` / `keep` / `calc` の後にそのビューの出力をソートします。`by` は修飾あり（`allpv.url`）でも修飾なし（`pageviews`）でも指定でき、`order` は `asc` / `desc`、`top` は省略可能な行数キャップです。[QAL ガイド §4.7](./qal.md#47-sort-オプション) を参照。
- ✅ 本アップデートを導入したサーバーでは `/guide` の `features.sort` が `true` を返すようになりました。クライアントは機能の可用性をハードコードせず、この値を参照して検出してください。

**訂正:**
- 🔧 ソートは意図的に **ビュー単位であり、`result` 単位ではありません**。`result.sort` キーは存在しません。1 つの QAL クエリで複数のチェインされたビューを要求できる以上、各ビューが自分の順序を所有するのが自然です。
- 🔧 本日時点の `result` ホワイトリストはちょうど `use` / `limit` / `count_only` です。`result.sample` / `result.include_count` / `result.return` は **現在受理されません**（以前は「バリデーターは受理するが no-op」と記載していましたが、その記述は廃止されました）。

### 2026-04-11 — `api_update: 2026-04-11` — Documentation v1.1.2
**ランタイム:**
- ✅ `/guide` が `api_update` フィールドと、`filter`、`join`、`calc`、`view_chaining`、`sort`、`sample`、`include_count`、`return_file`、`return_csv`、`return_parquet` をキーとする `features` マップを返すようになりました。これが実行時状態の正本であり、クライアント（AI エージェントを含む）は機能の可用性をハードコードせず、`features` を参照してください。
- ✅ プラグイン定数 `QAHM_API_VERSION` と `QAHM_API_UPDATE` を導入し、これらを使って guide レスポンスを生成するようになりました。

**訂正（ドキュメントのみ。v1.1.1 から持ち越し）:**
- 🔧 `result.sort` は `E_RESULT_FORBIDDEN_KEY` として拒否されます。`result.sample` / `result.include_count` はバリデーションを通過しますが no-op です。サンプル、機能表、バリデーションマニフェストは前リビジョンで更新済みで、引き続きその内容が正です。

### 2026-04-10 — `api_update: 2026-04-10` — Documentation v1.1.0
**追加:**
- ✅ QAL `filter`（フラット形式、`eq`/`neq`/`gt`/`gte`/`lt`/`lte`/`in`/`contains`/`prefix`/`between`）
- ✅ QAL `join`（ビューごとに 1 つの等結合（equi-join）、id カラムのみ）
- ✅ QAL `calc` 集計（ホワイトリスト関数: `COUNT`、`COUNTUNIQUE`、`SUM`、`AVERAGE`、`MIN`、`MAX`）
- ✅ ビューチェイニング — `from` で同じ `make` ブロック内で先に定義されたビューを参照可能
- ✅ M:N 結合のフィルター必須化（`E_JOIN_FILTER_REQUIRED`）をドキュメント化
- ✅ 新しいマテリアル: `goal_1`..`goal_N`、`ga4_age_gender`、`ga4_country`、`ga4_region`、`page_version`、`click_event`、`datalayer_event`、`events.{name}`
- ✅ `allpv` の行動カラム（`depth_position`、`deep_read`、`stop_max_sec`、`stop_max_pos`、`exit_pos`、`is_submit`、`dead_click_image_count`、`irritation_click_count`、`scroll_back_count`、`content_skip_count`、`exploration_count`）
- ✅ `allpv` のページタイプ判定フラグ（`is_article`、`is_product`、`is_form`、...）および仮想ゴールカラム（`is_goal_1`..`is_goal_10`）
- ✅ `gsc` のカラム DB スキーマ（`clicks`、`impressions`、`position_x100`）と仮想カラム `ctr`、`position`、`position_weighted`

**変更:**
- 🔄 QAL バリデーションマニフェストを現行の実行時ルール（filter/join/calc 機能を有効化）に合わせて整合
- 🔄 マテリアルリファレンスを再構成し、`/guide` 由来の全マテリアルをカタログ化

これらの機能は 2026 年 4 月までに qa-labo にマージされた成果を反映しています。何が作られたか、なぜ作られたかの背景は [Developer Blog](/blog) をご覧ください。

### 2025-10-06 - Documentation v1.0.0
**追加:**
- ✅ すべての QAL クエリで `tracking_id` フィールドを必須化
- ✅ `/guide` エンドポイントが包括的なサーバー情報を返すように
- ✅ `/guide` レスポンスに `plugin_version` フィールドを追加
- ✅ `/guide` レスポンスにサイト固有のマテリアルとゴールを追加
- ✅ システム上限情報を追加
- ✅ 互換性マトリクスのドキュメントを追加

**削除:**
- ❌ `/materials` エンドポイント（`/guide` に置き換え）
- ❌ `allpv` マテリアルからゴール関連フィールドを削除
- ❌ 複数の廃止予定フィールド: `session_id`、`tracking_domain`、`path_prefix`、`utm_content`、`utm_term`、`version_id`

**変更:**
- 🔄 `country` → `country_code`（ISO 3166-1 alpha-2）
- 🔄 QAL のバージョン指定をクエリボディから URL パラメーターに移動

**プラグインバージョン:**
- 🔌 QA Platform Plugin 3.0.0.0+ が必要

### 2025-10-20 - 初回リリース
**リリース内容:**
- `from` と `keep` 操作を備えた基本的な QAL
- 2 つのマテリアル: `allpv` と `gsc`
- シンプルな result オプション: `limit` と `count_only`
