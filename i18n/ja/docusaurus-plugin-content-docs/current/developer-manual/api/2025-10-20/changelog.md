---
id: changelog-2025-10-20
title: アップデート履歴
sidebar_position: 6
last_updated: 2026-04-14
api_update: 2026-04-14
---

# アップデート履歴 (2025-10-20)

これは API バージョン `2025-10-20` の **アップデート履歴** です。バージョンごとに 1 つのリビングドキュメントを持ち、新しいエントリーを最上部に追加していきます。各エントリーには、プラグインが `/guide` レスポンスで返す `api_update` の日付をタグ付けしています。上から下へ読むことで、初回リリース以降の API の成長を追うことができ、最新エントリーをお使いのサーバーの `api_update` と突き合わせれば、実際にどの機能が利用可能かを把握できます。

### 2026-04-14 — `api_update: 2026-04-14` — 開発者マニュアル再構成 + `features_detail` + `since`

**追加:**
- ✅ **`/guide` が `features_detail` を返すように** — 機能名をキーとする、エントリごとに `{ enabled, since }` 形式を持つリッチなマップ。既存のフラットな `features` マップも射影として保持されているので、古いクライアントはそのまま動きます。新しい AI クライアントは `features_detail` を優先し、各機能の `since` をサーバーの `api_update` と比較して可用性を判定してください。
- ✅ **`qal-validation.yaml` の機能ごとの `since`** — 検証マニフェストの `features:` 下の各エントリに、`enabled: true` のとき `since: YYYY-MM-DD` タグが付きました。`/guide` エンドポイントはここから射影しています。
- ✅ **`materials-manifest.yaml` のトップレベル `version` / `update`** — と、個別のマテリアル・フィールドへのオプショナルな `since:` タグ。純粋な追加で、既存の消費者には影響しません。
- ✅ **新しい `ai/` サブディレクトリ** を `developer-manual/api/2025-10-20/` 以下に追加。簡潔な AI 向け指示 (`README.md`) と2本の機械可読 YAML 仕様書 (`materials.yaml`, `qal-validation.yaml`) を含みます。`/guide` エンドポイントはレガシーなフラット markdown の代わりにこのサブディレクトリを配信するようになったので、MCP / LLM クライアントは必要な内容だけを受け取ります — 人間向けの冗長な散文は含まれません。

**変更:**
- 🔄 **開発者マニュアルの再編成**。`concepts/`, `materials/`, `reference/`, `ai/` のサブディレクトリに再構成しました。トップレベルの入口は、従来の curl 先行のクイックスタートではなく **「AI と使いはじめる」** という枠組みになりました。レガシーなフラットファイル (`qal.md`, `qal-validation.md`, `materials.md`, `endpoints.md`) はこの構造に置き換わる形で削除されました。
- 🔄 各マテリアルは手作りの **サンプル表** つきの専用ページを持つようになり、データの粒度が一目で分かります。サンプル表は3つの ID カラム (`page_id`, `session_id`, `pv_id`) だけを表示します — ID の全集合とスキーマは `ai/materials.yaml` が正本です。
- 🔄 **`/guide` のドキュメントコンテンツは AI 向けに最適化されました。** 以前このエンドポイントは人間向けの markdown ファイル4つ (`index.md`, `endpoints.md`, `materials.md`, `qal.md`) を fetch していましたが、今は簡潔な `README.md` と2本の YAML 仕様書を fetch します。人間向けのページは引き続き docs.qazero.com に残しています。

**このアップデートが非破壊である理由:**
- レガシーなフラット `features` マップは `/guide` レスポンスで変わらず保持されています。
- `version`, `api_update`, `features`, `sites`, あるいは `documentation.sections` の存在を読んでいる既存クライアントコードはそのまま動きます。`documentation.sections` の *内容* は変わりましたが、(AI クライアントのように) pass-through として扱っているクライアントには影響ありません。
- QAL クエリの形は何も変わっていません。既存のマテリアルやカラムが削除・リネームされたものはありません。

### 2026-04-13 — `api_update: 2026-04-13` — Documentation v1.2.0
**追加:**
- ✅ **QAL `make.sort`** — ビュー単位の行ソートとトップ N 抽出。`make` 内のビューに `sort: { by, order, top }` を置くことで、`filter` / `join` / `keep` / `calc` の後にそのビューの出力をソートします。`by` は修飾あり（`allpv.url`）でも修飾なし（`pageviews`）でも指定でき、`order` は `asc` / `desc`、`top` は省略可能な行数キャップです。[QAL とは何か?](./concepts/what-is-qal.md) コンセプトページと、正本の [`qal-validation.yaml`](./ai/qal-validation.yaml) を参照。
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
