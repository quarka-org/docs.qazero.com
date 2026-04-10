# API ドキュメントのバージョン管理

## 2 層バージョニング（Version + Update） {#two-layer-versioning-version--update}

QA ZERO API は **2 層バージョニングスキーム**を採用しています。このドキュメントで最も重要なのはこの点の理解です。ここを間違えると、クライアントを壊すか、クライアントから新機能を隠してしまうことになります。

| 層 | フォーマット | 変わる条件 | 可視性 |
|-------|--------|---------------|------------|
| **Version** | `YYYY-MM-DD` | **破壊的変更のときのみ。** レスポンスの形状、必須フィールド、セマンティクスが変わるとき。 | URL（`?version=2025-10-20`）とディレクトリ名（`/developer-manual/api/2025-10-20/`）に現れます。リリースから **24 ヶ月** サポートされます。 |
| **Update**（`api_update`） | `YYYY-MM-DD` | 後方互換の追加すべて — 新マテリアル、新フィルター演算子、新 calc 関数、新 `features` フラグ、新しい任意フィールド。 | バージョンの**中**に存在します。`/guide` から `api_update` フィールドとして返されます。URL やディレクトリ名は**変わりません**。 |

**正式な呼称:** 「Version `2025-10-20`, update `2026-04-11`」— チケット、コミット、リリースノートではこの表記で特定の API リビジョンを指します。

### なぜ 2 層なのか？

- **クライアントは URL の変化を嫌います。** 機能を出荷するたびに `version` が変わっていたら、どのクライアントもピン留めし直さなければなりません。`version` は安定していると感じてほしいのです。
- **それでもクライアントには何が使えるかを伝える必要があります。** `between` のような新しい演算子が出荷されたとき、AI エージェントや SDK はその存在を知る必要があります — そのために `api_update` と `/guide` の `features` マップがあります。
- **Stripe、AWS などの成熟した API と同じ方式です。** リビングドキュメント + インラインの `Since: YYYY-MM-DD` バッジ + 機械可読な features マップ。

### 1 バージョン = 1 リビングドキュメント

`api_update` を bump するたびに `2025-10-20/` ディレクトリを**複製してはいけません**。このディレクトリは `2025-10-20` バージョンの全期間にわたる**単一のリビングドキュメント**です。機能を追加するときは、次のようにします。

1. `qal.md` / `materials.md` / `endpoints.md` の該当機能のセクションに `**Since:** YYYY-MM-DD` バッジを追加
2. `index.md` のアップデート台帳（Changelog）の**先頭**に新しいエントリーを追加
3. 編集したすべてのファイルの frontmatter で `api_update` と `last_updated` を bump
4. qa-labo プラグインソースの `QAHM_API_UPDATE` を bump して、`/guide` が新しい日付を報告するようにする

`cp -r 2025-10-20 2025-10-20-update-xxxx` と打ちそうになったら、止まってください。それは間違いです。

### `features` マップが実行時の真実

`/guide` レスポンスには、QAL / result の機能名（`filter`, `join`, `calc`, `view_chaining`, `sort`, `sample`, `include_count`, `return_file`, `return_csv`, `return_parquet`）をキーとする `features` オブジェクトが含まれます。各値は、executor が**このサーバー上で**実際にその機能を処理するかどうかを示すブール値です。

- クライアントは機能の利用可否をハードコードするのではなく、起動時に `/guide` から `features` を読む**必要があります**。
- `features` と矛盾するドキュメントの記述は常に間違いです — プラグインの `qal-validation-{version}.yaml` が権威あるソースであり、プラグインはそれを `/guide` を通じて公開します。
- 機能を追加するときは、その YAML でフラグを切り替え、`QAHM_API_UPDATE` を bump します。ドキュメントはそれに従います。

---

## バージョンフォーマット

**API Version:** `YYYY-MM-DD`（カレンダーバージョニング — まれで、破壊的変更のみ）
**API Update（`api_update`）:** `YYYY-MM-DD`（カレンダーバージョニング — 頻繁で、非破壊）
**Documentation Version:** `MAJOR.MINOR.PATCH`（セマンティックバージョニング、このドキュメントリポジトリ内部）

## 更新プロセス

### 1. ドキュメントを変更するとき

編集したファイルの frontmatter で `last_updated` と `api_update` の**両方**を更新します。`api_update` は機械可読であり、qa-labo プラグインソースの `QAHM_API_UPDATE` 定数と一致している必要があります。

```yaml
---
id: getting-started-2025-10-20
title: Getting Started
sidebar_position: 1
last_updated: 2026-04-11   # ← 人間が読む「最終編集日」
api_update: 2026-04-11     # ← プラグインの QAHM_API_UPDATE 定数と一致
---
```

特定の機能を説明するコンテンツには、読者がいつ出荷されたかわかるようにインラインの **Since** バッジを追加します。

```markdown
### `filter` — row-level filter **Since:** 2026-04-10

The `filter` key accepts a flat map of column → condition...
```

### 2. Changelog の更新

`index.md` の Changelog セクションにエントリーを追加します。

```markdown
### YYYY-MM-DD - Documentation vX.Y.Z
**追加:**
- ✅ 新機能の説明

**削除:**
- ❌ 廃止予定の機能

**変更:**
- 🔄 変更された機能
```

### 3. ドキュメントバージョンの bump

ドキュメントについてはセマンティックバージョニングに従います。

- **MAJOR（1.0.0 → 2.0.0）**: ドキュメント構造の破壊的変更
- **MINOR（1.0.0 → 1.1.0）**: 新しいコンテンツの追加（新セクション、エンドポイント、機能）
- **PATCH（1.0.0 → 1.0.1）**: 修正、明確化、誤字の訂正

## 現在のバージョン

| API Version | 現在の `api_update` | Doc Version | ステータス | リリース | サポート期限 |
|-------------|----------------------|-------------|--------|----------|---------------|
| 2025-10-20  | 2026-04-11           | 1.1.2       | Current | 2025-10-20 | 2027-10-20 |

`api_update` 列は、ここで**ドキュメント化されている**最新の非破壊リビジョンです。実際の実行時の値は対象サーバーが `/guide` で報告するものです — 古いプラグインと通信しているクライアントは古い `api_update` を見ることになるので、`features` マップで期待値を調整すべきです。

## バージョン情報を持つファイル

### Frontmatter（機械可読）
`/developer/api/2025-10-20/` 内のすべての `.md` ファイルには以下が含まれます。
```yaml
last_updated: YYYY-MM-DD
```

### Changelog（人間可読）
- `/developer/api/2025-10-20/index.md` - 完全な changelog を含む

### 設定
- `docusaurus.config.js` - `showLastUpdateTime: true` を有効化

## キャッシュバスティング

### 仕組み

1. **Frontmatter の `last_updated`**: 
   - Docusaurus がこのフィールドを読み取る
   - タイムスタンプが更新された新しいビルドを生成
   - CDN とブラウザのキャッシュキーが自動的に変わる

2. **Info Box**:
   - Getting Started ページ上部に表示される可視のバージョン情報
   - API とドキュメントの両方のバージョンを表示

3. **Changelog セクション**:
   - 詳細な変更履歴
   - 何が変わったのかユーザーが理解するのに役立つ

### CDN / キャッシュシステム向け

frontmatter の `last_updated` フィールドは以下に影響します。
- ビルド出力のファイル名（Docusaurus のハッシュ）
- クライアントに送信されるメタデータ
- CDN キャッシュ無効化のトリガー

## 更新フローの例

```bash
# 1. ドキュメントを変更する
vim developer/api/2025-10-20/endpoints.md

# 2. frontmatter を更新する
# 変更: last_updated: 2025-10-06

# 3. index.md の changelog を更新する
# "### 2025-10-06 - Documentation v1.0.1" の下にエントリーを追加

# 4. 再ビルド
npm run build

# 5. デプロイ
# 新しいハッシュ付きファイルが自動的にキャッシュをバストする
```

## ベストプラクティス

1. コンテンツを変更したら**必ず `last_updated` を更新する**
2. **一貫した日付フォーマットを使う**: `YYYY-MM-DD`
3. **changelog は詳細かつ簡潔に保つ**
4. 関連する変更は単一の日付エントリー**にまとめる**
5. **絵文字マーカーを使う**: ✅ 追加、❌ 削除、🔄 変更

## 更新のモニタリング

ユーザーは次のことができます。
- Getting Started 上部の **バージョン情報** ボックスを確認
- **Changelog** セクションで詳細を確認
- 各ページ下部の **「Last updated」** タイムスタンプを確認（Docusaurus の機能）

システムは次のことができます。
- frontmatter から `last_updated` をパース
- ビルド出力のファイルハッシュをモニター
- Info ボックスのバージョン番号を追跡
