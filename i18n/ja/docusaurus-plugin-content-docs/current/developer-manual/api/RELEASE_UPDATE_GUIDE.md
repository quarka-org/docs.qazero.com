# バージョンリリース時のドキュメント更新ガイド

**新機能や新バージョンを出荷する際の API ドキュメントメンテナンスのクイックリファレンス**

まず、[2 層バージョニングスキーム](./VERSION_MANAGEMENT.md#two-layer-versioning-version--update)を理解してください。行うリリースのほとんどは新しい **version** ではなく **update** です。新しい version はまれ（破壊的変更のみ）で、update は継続的に発生します。

---

## 🟢 シナリオ A（最も一般的）: 非破壊アップデート

**例:** 新しいフィルター演算子の出荷、新マテリアルの追加、`allpv` への行動カラムの追加、`features` マップの変更、新しい calc 関数のホワイトリスト化。

→ **既存の `YYYY-MM-DD/` ディレクトリの中にとどまってください。** コピーしないでください。新しいディレクトリを作らないでください。このディレクトリはリビングドキュメントです。

### 3 ステップのワークフロー

1. **qa-labo（プラグインソース）で update 日付を bump する**
   - 実装を編集（executor / validator / material loader）。
   - `src/core/yaml/qal-validation-{version}.yaml` を更新 — `features:` フラグを `true` に切り替える、enum リストに追加する、新しいルールを追加する、のいずれかを行います。
   - **`src/core/qahm-const.php` の `QAHM_API_UPDATE` を今日の日付に bump します。** これが最も重要な 1 ステップです — これを忘れると、クライアント（AI エージェント含む）は `/guide` 経由で新機能を発見できません。
   - 編集したファイルが `qa-labo-override-files.txt` にリストされていることを確認し、qa-platform からの夜間同期で上書きされないようにします。

2. **docs.qazero.com（このリポジトリ）で新機能を反映する**
   - `docs/developer-manual/api/{version}/` 内の該当する `.md` ファイル（`qal.md`, `materials.md`, `endpoints.md`, `qal-validation.md`）を編集します。
   - 新機能の見出しや行の横に `**Since:** YYYY-MM-DD` バッジを追加します。
   - 編集した各ファイルの frontmatter で `last_updated` **と** `api_update` を bump します。
   - `{version}/changelog.md` のアップデート履歴の**先頭**に新しいエントリーを追加します。
     ```markdown
     ### YYYY-MM-DD — `api_update: YYYY-MM-DD` — Documentation vX.Y.Z
     **追加:**
     - ✅ 新機能の簡潔な説明
     ```
   - `endpoints.md` の `features` マップやレスポンス形状が `/guide` レスポンス例に表示されている場合は、その例も更新します。

3. **コミットとプッシュ**
   - このリポジトリへの単一コミットを `main` にプッシュします。GitHub Actions が `gh-pages` に自動デプロイします。
   - コミットメッセージの規約: `docs(api/{version}): update YYYY-MM-DD — <one-line summary>`
   - 数分後に https://docs.qazero.com で確認します。

### シナリオ A で**やってはいけないこと**

- ❌ `cp -r 2025-10-20 2025-10-20-update-YYYY` を実行しない
- ❌ 新しい `api/YYYY-MM-DD/` ディレクトリを作らない
- ❌ 非破壊アップデートで `compatibility.md` を触らない（これは **update** ではなく **version** を追跡するものです）
- ❌ YAML と食い違うように `features` マップをドキュメントで手編集しない — YAML が唯一の真実のソースです

---

## 🔴 シナリオ B（まれ）: 新しい API バージョン（破壊的変更）

**例:** レスポンスのエンベロープの形状が変わる、必須フィールドが削除される、カラム名が変わる、演算子のセマンティクスが変わる。

破壊的変更はまれです。この道を進む前に「新しいフィールドを追加して古いほうも動作させ続けられないか？」と自問してください。もしそれが可能ならシナリオ A です。

---

### ☑️ 新しい API バージョン（例: 2025-10-20 → 2026-03-01）— 破壊的変更のみ

**新バージョンの作成（シナリオ B のみ）:**

1. **ディレクトリをコピー**: `cp -r 2025-10-20/ 2026-03-01/`
2. 新しいディレクトリ内の **5 ファイルを更新**（詳細は以下）
3. **トップレベルの 2 ファイルを更新**（compatibility.md, index.md）
4. `api_update` を新バージョンのリリース日に**リセット**（2 つの層はバージョンごとにスコープされます）
5. サポートポリシーの一環として、古いバージョンのディレクトリを **24 ヶ月保持**

---

## 🔧 ファイルごとの更新ガイド

### 1. `/developer/api/2026-03-01/index.md`

**3 つのセクションを更新:**

#### A. Frontmatter
```yaml
---
id: getting-started-2026-03-01          # ← 日付を変更
last_updated: 2026-03-01                # ← 日付を更新
---
```

#### B. バージョン情報ボックス
```markdown
:::info Version Information
**API Version:** 2026-03-01             # ← 日付を変更
**Plugin Version Required:** 3.1.0.0+   # ← 変わっていれば更新
**Last Updated:** 2026-03-01            # ← 日付を更新
**Documentation Version:** 1.0.0        # ← 1.0.0 にリセット
:::
```

#### C. Changelog
```markdown
## Changelog

### 2026-03-01 - Initial Release      # ← 新しいエントリーを追加
**追加:**
- ✅ 新機能の説明

**変更:**
- 🔄 変更された機能

**削除:**
- ❌ 廃止予定の機能

### [以前のバージョンのエントリーは下に残す]
```

---

### 2. `/developer/api/2026-03-01/endpoints.md`

**2 箇所を更新:**

#### A. Frontmatter
```yaml
---
id: endpoints-2026-03-01               # ← 日付を変更
last_updated: 2026-03-01               # ← 日付を更新
---
```

#### B. タイトル
```markdown
# API Endpoints Reference (2026-03-01)  # ← 日付を変更
```

#### C. レスポンス例（変更されていれば）
plugin_version が変わっていれば `/guide` レスポンス例を更新:
```json
{
  "version": "2026-03-01",              # ← 更新
  "plugin_version": "3.1.0.0",          # ← 変わっていれば更新
  ...
}
```

---

### 3. `/developer/api/2026-03-01/materials.md`

**4 箇所を更新:**

#### A. Frontmatter
```yaml
---
id: materials-2026-03-01               # ← 日付を変更
last_updated: 2026-03-01               # ← 日付を更新
---
```

#### B. タイトル
```markdown
# Materials Reference (2026-03-01)     # ← 日付を変更
```

#### C. プラグインバージョンのアラート
```markdown
:::caution Plugin Version Required
**Minimum Plugin Version:** 3.1.0.0+   # ← 変わっていれば更新
:::
```

#### D. 新機能セクションの追加（該当する場合）
```markdown
### Field Changes in Plugin 3.1.0.0

**Added Fields:**
- ✅ `depth_read` - Scroll depth tracking
- ✅ `scroll_rate` - Scroll speed

**Removed Fields:**
- ❌ `old_field` - Deprecated field
```

あるいはセクションベースのアプローチを使う:
```markdown
### Behavioral Metrics (Plugin 3.1.0.0+)

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| depth_read | float | Read depth (0.0-1.0) | - |
| scroll_rate | float | Scroll rate | - |
```

---

### 4. `/developer/api/2026-03-01/qal.md`

**2 箇所を更新:**

#### A. Frontmatter
```yaml
---
id: qal-2026-03-01                    # ← 日付を変更
last_updated: 2026-03-01              # ← 日付を更新
---
```

#### B. タイトルと概要
```markdown
# QAL Guide (2026-03-01)              # ← 日付を変更

**Version:** 2026-03-01               # ← 日付を変更
```

---

### 5. `/developer/api/compatibility.md`

**新バージョンのエントリーを追加:**

```markdown
## Compatibility Matrix

| Plugin Version | Compatible API Versions | Status | Notes |
|----------------|------------------------|--------|-------|
| **3.1.0.0+** | 2026-03-01, 2025-10-20 | ✅ Current | New features |  # ← NEW
| **3.0.0.0** | 2025-10-20 | ⚠️ Stable | Still supported |              # ← UPDATE

---

## Version 2026-03-01                                                         # ← NEW SECTION

**Minimum Plugin Version:** 3.1.0.0
**Released:** 2026-03-01
**Status:** Current Release

### Plugin Requirements
[要件をリスト]

### Material Support
[マテリアルをリスト]
```

---

### 6. `/developer/api/index.md`

**Available Versions セクションを更新:**

```markdown
## Available Versions

### 2026-03-01 (Current)                    # ← NEW

**Status:** ✅ Released  
**Plugin Version Required:** 3.1.0.0+
**Support Until:** 2028-03-01 (minimum)

**Features:**
- [新機能をリスト]

**Documentation:** [Version 2026-03-01 →](./2026-03-01/)

---

### 2025-10-20 (Previous)                   # ← ステータスを更新

**Status:** ⚠️ Stable (Still Supported)
**Plugin Version Required:** 3.0.0.0+
**Support Until:** 2027-10-20 (minimum)
```

---

## ⏱️ 所要時間の目安

| タスク | 所要時間 |
|------|---------------|
| ファイルのコピーとリネーム | 5 分 |
| frontmatter の更新（4 ファイル） | 5 分 |
| バージョン番号の更新 | 10 分 |
| compatibility.md の更新 | 15 分 |
| changelog の記述 | 10 分 |
| 新機能ドキュメントの追加 | 20–60 分 |
| レビューとテスト | 15 分 |
| **合計** | **1–2 時間** |

---

## 📝 よくあるシナリオ

### シナリオ 1: プラグインのマイナー更新（3.0.0.0 → 3.0.1.0）
**API に変更なし、バグ修正のみ**

→ **ドキュメントの更新は不要。** `api_update` はそのままにします。

---

### シナリオ 2: プラグインの機能追加（3.0.0.0 → 3.1.0.0）
**既存マテリアルへの新フィールド追加、新演算子、新マテリアル — すべて後方互換**

これは本ドキュメント冒頭のシナリオ A です。**新しい API バージョンのディレクトリを作らないでください。** `api_update` を bump し、`**Since:**` バッジを追加し、アップデート履歴を更新してプッシュします。`compatibility.md` の更新は、プラグインバージョン要件が変わったときだけ行います — `api_update` を bump するたびに更新するものではありません。

---

### シナリオ 3: 破壊的変更（3.0.0.0 → 4.0.0.0）
**フィールドが削除される、または挙動が変わる**

これはシナリオ B です。新しい API バージョンのディレクトリを必ず作成し、`api_update` を新しいリリース日にリセットし、古いバージョンのディレクトリを 24 ヶ月保持します。

---

## ✅ リリース前チェックリスト

公開前に次を確認します。

- [ ] すべての日付が更新されている（frontmatter、タイトル、バージョンボックス）
- [ ] プラグインバージョン要件が正しい
- [ ] Changelog のエントリーが追加されている
- [ ] compatibility.md のマトリクスが更新されている
- [ ] コード例がテストされている
- [ ] ページ間のリンクが機能する
- [ ] ビルドが成功する（`npm run build`）
- [ ] プレビューが問題ない（`npm start`）

---

## 🆘 トラブルシューティング

**ビルドが失敗する:**
→ 壊れた内部リンクがないか確認
→ frontmatter が有効な YAML か検証

**バージョンが表示されない:**
→ キャッシュをクリア: `rm -rf .docusaurus/`
→ 再ビルド: `npm run build`

**日付が一貫していない:**
→ 上記の find/sed コマンドでまとめて修正

---

## 📞 質問は？

完全なバージョニング戦略は `VERSION_MANAGEMENT.md` を参照してください。
