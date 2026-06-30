---
id: changelog-2026-05-11
title: アップデート履歴
sidebar_position: 6
last_updated: 2026-05-21
api_update: 2026-05-21
---

# アップデート履歴 (2026-05-11)

これは API バージョン `2026-05-11` の **アップデート履歴** です。バージョンごとに 1 つのリビングドキュメントを持ち、新しいエントリーを最上部に追加していきます。各エントリーには、プラグインが `/guide` レスポンスで返す `api_update` の日付をタグ付けしています。上から下へ読むことで、このバージョンの初回リリース以降の API の成長を追うことができ、最新エントリーをお使いのサーバーの `api_update` と突き合わせれば、実際にどの機能が利用可能かを把握できます。

**`2026-05-11` 初回リリース** セクション以下のエントリーは、前バージョン `2025-10-20` から文脈のために引き継いだものです。最上部の破壊的変更エントリーが、`2025-10-20` から移行する際に把握すべき契約の差分を説明しています。

### 2026-05-21 — `api_update: 2026-05-21` — サマリー積分マテリアル（T102）

**追加:**
- ✅ **集計済みサマリーマテリアル3種** — `summary_landingpage`、`summary_allpage`、`summary_days_access_detail` を QAL のファーストクラスマテリアルとしてクエリできるようになりました。それぞれ、夜間バッチがすでに保持している **期間累計**（年初来の積分、1ファイル読み込みで提供）を返すので、「任意期間の入口ページ別セッション数」や「ページビュー別のページランキング」といった問いに、数百万行の `allpv` をスキャンせず答えられます。3種とも `supports_all: true`（全サイト集約 `tracking_id: "all"` が存在します）。[`summary_*` マテリアル](./materials/summary.md) と正本の [`materials.yaml`](./ai/materials.yaml) を参照してください。**Since:** 2026-05-21
- ✅ **バリデータのマテリアルパターンを拡張** — `summary_landingpage` / `summary_allpage` / `summary_days_access_detail` が `materials[].name`、`make.*.from`、`make.*.keep` で受理されるようになりました（[`qal-validation.yaml`](./ai/qal-validation.yaml) を参照）。

**重要な性質（使う前に読んでください）:**
- 🔸 これらのマテリアルには **`date` 次元がありません**。各クエリは要求した期間に対する累計1セットを返します（年跨ぎの範囲に対応）。日次の内訳ではありません。日次トレンドが必要なら `allpv`（`date` 次元あり）を使ってください。カウントカラム（`pv_count`、`session_count` …）への数値範囲フィルターは、累計のロールアップ後に `post_filter` として適用されます。

**このアップデートが非破壊である理由:**
- 3種のマテリアルは純粋な追加です。既存のマテリアル・カラム・クエリ形・フィーチャフラグは何も変わりません。`summary_*` マテリアルを名指ししないクエリは完全に無影響です。

### 2026-05-20 — `api_update: 2026-05-20` — `allpv` ブラウザウィンドウサイズ列（T101）

**追加:**
- ✅ **`allpv.window_inner_width` / `allpv.window_inner_height`** — ページビュー時点のブラウザの `window.innerWidth` / `window.innerHeight` を CSS ピクセルで記録する2つの新規列（uint16）です。デバイスの画面解像度ではなく **実表示コンテンツ領域** を表します。レスポンシブブレークポイント分析やビューポート帯のセグメント分割（例: タブレット帯は `between: 768, 1199`、PC 帯は `gte: 1200`）に使います。値が `0` のときはそのページビューでソースヘッダーが欠落していたことを意味するので、実測値だけを残すには `gte: 1` でフィルターしてください。[`allpv`](./materials/allpv.md) と [`materials.yaml`](./ai/materials.yaml) を参照してください。**Since:** 2026-05-20

**このアップデートが非破壊である理由:**
- 両列とも追加（`nullable: true, default: 0`）です。参照しない既存クエリは無影響で、列導入より前の期間範囲はエラーではなく `0` を返します。

### 2026-05-11 — `api_update: 2026-05-11` — Version `2026-05-11` 初回リリース — calc 列宣言の対称化

**これは破壊的変更を伴うバージョン bump です。`2025-10-20` から移行する前に必ず読んでください。**

**追加:**
- ✅ **calc 列宣言の対称化（T87c）。** `calc` 式の中の `material.column` 参照は、その列の単一の宣言サイトとして、**`from` 側と `join.with` 側の両方で** 同じ意味を持つようになりました。Executor はそのマテリアルがどちら側にあるかに関わらず列を fetch + preserve し、出力からは取り除きます（出力は `keep` 列と `calc` キーのみ）。これにより、`from` 側列は自動 fetch されるが `join` 側列は fetch されないという長年の非対称が解消されました。前バージョンでは `click_event` を join 対象としたときに `COUNT(click_event.pv_id)` のような集計がサイレントに 0 を返していましたが、新バージョンでは正しく動作します。**Since:** 2026-05-11。`/guide` の `features_detail.calc_join_symmetric.enabled: true` で検出可能。
- ✅ **`E_CALC_COLUMN_UNRESOLVED`（バリデータ）。** 実行前バリデーションで、`calc` 式が参照する `material.column` がビューのスコープ（`from` または `join.with` にそのマテリアルが存在する）に解決できないか、列がマテリアルのスキーマに存在しない場合に拒否するようになりました。以前はサイレントに 0 行を返していたケースを明示的なバリデーションエラーに変換することで、AI が組み立てたクエリの「修復ループ」シグナルを取り戻します。詳細は [エラー](./reference/errors.md) を参照。
- ✅ **JOIN `on.left` / `on.right` ピンポイント・スコープ事前検証 + エラー詳細の構造化（T87、もともと 2026-05-10 に `2025-10-20` で出荷）。** `on.left` は `from` 側の解決済み物理マテリアル名（view chain は事前解決）と完全一致、`on.right` は `join.with` 文字列と完全一致を要求します。エラーには `side`（`"left"` または `"right"`）、`received_value`、`expected_prefix`、`hint` を含む `details` が乗ります。`2026-05-11` にもそのまま引き継がれます。

**変更（2025-10-20 からの破壊的変更）:**
- 🔄 **`calc` セマンティクス: `material.column` が列の宣言。** `2025-10-20` では fetch + preserve を確実にトリガーする宣言サイトは `from` 側だけでした。`2026-05-11` からはルールが対称化され、仕様が統一されます: **`calc` 式の中の `material.column` の出現そのものが「Executor がこの列を fetch する」という宣言であり、それが join のどちら側にあるかは問いません。** 出力は依然として `keep` 列と `calc` キーのみで、`calc` の入力列は merge を通り抜けるけれども最終結果からは取り除かれます（`GROUP BY = keep` セマンティクスが保たれる）。

**2025-10-20 からの移行:**
- 動いていたクエリは引き続き正しいです: `from` 側 calc 参照の動きは同一です。クライアントの変更は不要。
- 以前 *サイレントに 0 行を返していた* `join` 側列を `calc` で参照していたクエリは、変更なしで正しい集計を返すようになります。再実行してください。
- `calc` から見えるようにするためだけに join 側列を `keep` に入れていた回避策は、`keep` から外せます。残しても合法ですが GROUP BY の粒度が変わるため、本来は不要です。
- 列名の typo や `from` / `join.with` に登場しないマテリアル参照など、無効な `calc` 参照は、以前サイレントに 0 行を返していたものが、いまは `E_CALC_COLUMN_UNRESOLVED` でバリデーション時に失敗します。参照を修正するか削除してください。
- `/guide` の `features.calc_join_symmetric` フラグで、サーバーが新しい対称ルールで動いているかを判定できます。存在しないか `false` の場合は「旧挙動 — join 側 calc 参照に依存する前に列の配置を再確認」扱いにしてください。

**既知の制限（引き継ぎ事項、本 bump では意図的にスコープ外）:**
- 🚧 **view chain × calc 対称化はスコープ外です。** `from[0]` が事前定義の view を参照する場合（ビューチェイニング）、バリデータはそのビューに対する `E_CALC_COLUMN_UNRESOLVED` チェックをスキップし、Executor は calc の preserve を旧 Material runtime 経路にフォールバックします。実マテリアル名プレフィックスは Material runtime 経由で引き続き解決されますが、`calc` 内の素の view 名プレフィックス（`<from_view>.column`）はまだ preserve できません。将来課題として追跡しており、本バージョン bump のブロッカーには意図的にしていません。

**これがアップデートではなくバージョン bump である理由:**
- この修正は、*バリデータが妥当と判定していたクエリ* に対する観測可能な実行セマンティクスを変えています。新しいセマンティクスはおそらく「すべてのクライアントがずっとそう意図していたもの」でもありますが、旧挙動に依存していたもの（例: silent-zero バグを `keep` に列を追加して回避していた連携）は厳密には別の契約で動くことになります。バージョン管理ポリシーに従い、これはアップデートではなくバージョン bump 扱いです。

### 2026-05-11 — `api_update: 2026-05-11` — `/guide` ローカル参照 + 観測 dataLayer イベント（T86）

*`2026-05-11` 初回リリースと同時に出荷されましたが、ここに遡って記録します。以下の2項目はどちらも `/guide` への追加変更で、`since: 2026-05-11` を持ちます。*

**追加:**
- ✅ **`features.datalayer_observed_events`**（および `features_detail.datalayer_observed_events`、`since: 2026-05-11`）。有効な場合、`/guide` の `sites[]` の各エントリー — 全サイト集約 `all` を含む — に `observed_events` マップが追加されます。これはそのサイトで実際に観測された **テナント固有の dataLayer スキーマ** を記述します: `{ event_name: { material: "events.{name}", columns: { … } } }`。これにより AI クライアントは、どのカスタム `events.{name}` マテリアルが存在し、各イベントがどのパラメータキー／型を持つかを発見でき、推測なしで正しい `events.{name}` クエリを組み立てられます。マップはスキーマのみで、値は QAL の `calc` で集計します（ここでは返しません）。QAL 安全（`[A-Za-z0-9_]+`）なイベント名のみが載ります。あるイベントのマニフェストが欠落・破損していても、そのイベントだけをスキップし、サイト全体が空になることはありません。
- ✅ **`features.guide_local_source`**（`since: 2026-05-11`）。`/guide` エンドポイントは `documentation.sections`（`README.md`、`materials.yaml`、`qal-validation.yaml`）を、実行時に GitHub から取得するのではなく、プラグイン同梱の `src/core/yaml/` ファイルから直接読むようになりました。これによりプラグインバージョンと配信される仕様が必ず一致し、GitHub 往復もキャッシュ無効化のステップも発生しません。`documentation.source` は参照用に、それらファイルの docs.qazero.com 上の人間向けミラーを指すようになりました。クライアントから見ると、仕様がインストール済みプラグインより遅れることがなくなる以外は実質的に no-op です。

**このアップデートが非破壊である理由:**
- `observed_events` は各 `sites[]` エントリー内の追加的なオプションキーです。無視するクライアントは無影響で、旧バージョンのサーバーは（フィーチャフラグで gate されているため）単にキーを省略します。ローカル参照への切り替えは、サーバーが自分の同梱ファイルをどこから読むかを変えるだけで、クライアントが消費するレスポンス形は変わりません。

---

## `2026-05-11` より前の履歴（`2025-10-20` から文脈のため引き継ぎ）

### 2026-04-29 — `api_update: 2026-04-29` — `materials.supports_all` フラグ

**追加:**
- ✅ **`materials.{name}.supports_all: true | false`** を [`materials.yaml`](./ai/materials.yaml) に追加 — すべてのマテリアルが、`tracking_id: "all"`（夜間バッチで生成される全サイト集約）でクエリできるかどうかを宣言するようになりました。現時点で `true` は `allpv`, `click_event`, `datalayer_event`, `events_template`、`false` は `gsc`, `goal_x`, `page_version`, `ga4_*` です。AI クライアントや管理画面 UI は、特定のマテリアルに対して "全サイト" を tracking_id の選択肢として提示する前に、このフラグを必ず参照してください。
- ✅ **`features.materials_supports_all`** を `/guide` で返すようになりました — クライアントはこの機能フラグを確認することで、新フラグの可用性を検出できます。旧バージョンのサーバーは個別マテリアルの `supports_all` を省略する可能性があります。フラグ非存在時は「不明 — クエリを投げてエラーで判定する」扱いにしてください。**Since:** 2026-04-29
- ✅ **`ai/materials.yaml` と `ai/qal-validation.yaml` を qa-labo ソースと同期** — 今回のアップデートだけでなく、直前の 2026-04-17 アップデートぶんも反映しました。AI に配信される YAML が、2026-04-17 で追加された `prev_page_id` / `next_page_id` / `prev_url` / `prev_title` / `next_url` / `next_title` カラムと `allpv_prev_next_page` 機能フラグを反映するようになっています。人間向けの `materials/allpv.md` と `/guide` リファレンス例はすでに正しい状態でしたが、AI 向け YAML だけが追従できていませんでした。

**このアップデートが非破壊である理由:**
- `supports_all` フラグは純粋な追加メタデータです。既存のクエリ — `supports_all: false` のマテリアルに `tracking_id: "all"` を渡すクエリも含めて — は従前と全く同じ動作になります（従来どおりエラーまたは空結果を返します）。
- qa-labo ランタイムは引き続き `tracking_id` のセマンティクスを強制します。本フラグはあくまで既存の振る舞いを文書化するだけなので、AI クライアントはクエリを投げる前に判定できるようになります。

### 2026-04-17 — `api_update: 2026-04-17` — `allpv` ページ遷移カラム

**追加:**
- ✅ **`allpv.prev_page_id` / `allpv.next_page_id`** — 同一セッション内で各ページビューの直前・直後に閲覧されたページを記録する新しい物理カラム (uint32) です。ランディング PV は `prev_page_id = 0`、離脱 PV は `next_page_id = 0` になります。これらの値でフィルターすれば、1つの QAL クエリでランディング PV や離脱 PV を抽出できます。
- ✅ **`allpv.prev_url` / `allpv.prev_title` / `allpv.next_url` / `allpv.next_title`** — `prev_page_id` / `next_page_id` から `qa_pages` マスターテーブル経由で解決される仮想カラムです。`keep` に含めれば、前後ページの人間が読める URL やタイトルを取得できます。
- ✅ **`features.allpv_prev_next_page`** が `/guide` で返されるようになりました — クライアントはこの機能フラグを確認することで、新カラムの可用性を検出できます。**Since:** 2026-04-17

**このアップデートが非破壊である理由:**
- すべての新カラムは追加のみです。`prev_page_id` / `next_page_id` を参照しない既存のクエリにはまったく影響しません。
- 新しい物理カラムは `nullable: true, default: 0` を使用しているため、このアップデート以前の日付範囲では、エラーではなく `0`（遷移データなし）が返ります。

### 2026-04-14 — `api_update: 2026-04-14` — 開発者マニュアル再構成 + `features_detail` + `since`

**追加:**
- ✅ **`/guide` が `features_detail` を返すように** — 機能名をキーとする、エントリごとに `{ enabled, since }` 形式を持つリッチなマップ。既存のフラットな `features` マップも射影として保持されているので、古いクライアントはそのまま動きます。新しい AI クライアントは `features_detail` を優先し、各機能の `since` をサーバーの `api_update` と比較して可用性を判定してください。
- ✅ **`qal-validation.yaml` の機能ごとの `since`** — 検証マニフェストの `features:` 下の各エントリに、`enabled: true` のとき `since: YYYY-MM-DD` タグが付きました。`/guide` エンドポイントはここから射影しています。
- ✅ **`materials-manifest.yaml` のトップレベル `version` / `update`** — と、個別のマテリアル・フィールドへのオプショナルな `since:` タグ。純粋な追加で、既存の消費者には影響しません。
- ✅ **新しい `ai/` サブディレクトリ** を `developer-manual/api/2026-05-11/` 以下に追加。簡潔な AI 向け指示 (`README.md`) と2本の機械可読 YAML 仕様書 (`materials.yaml`, `qal-validation.yaml`) を含みます。`/guide` エンドポイントはレガシーなフラット markdown の代わりにこのサブディレクトリを配信するようになったので、MCP / LLM クライアントは必要な内容だけを受け取ります — 人間向けの冗長な散文は含まれません。

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
- ✅ **QAL `make.sort`** — ビュー単位の行ソートとトップ N 抽出。`make` 内のビューに `sort: { by, order, top }` を置くことで、`filter` / `join` / `keep` / `calc` の後にそのビューの出力をソートします。`by` は修飾あり（`allpv.url`）でも修飾なし（`pageviews`）でも指定でき、`order` は `asc` / `desc`、`top` は省略可能な行数キャップです。[QAL とは何か?](../../concepts/what-is-qal.md) コンセプトページと、正本の [`qal-validation.yaml`](./ai/qal-validation.yaml) を参照。
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
