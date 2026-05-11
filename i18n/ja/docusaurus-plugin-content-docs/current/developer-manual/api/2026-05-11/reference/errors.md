---
id: reference-errors-2026-05-11
title: エラー
sidebar_position: 5
---

# エラー

すべてのエラーレスポンスは同じ形です。

```json
{
  "ok": false,
  "error": {
    "code": "E_UNKNOWN_MATERIAL",
    "message": "Material 'allpvs' not found in manifest.",
    "at": "materials[0].name"
  }
}
```

- **`code`** — 安定した機械可読エラーコード。クライアントは `message` ではなく `code` で分岐すること。
- **`message`** — 人間が読める説明。文言はリリース間で変わる可能性あり。
- **`at`** — リクエストボディ内の該当値への JSON-pointer 風パス。フィールド固有のエラーのときだけ存在。

## 正式なエラーコード

### 認証 / 認可

| HTTP | コード                | 発生条件                                             |
|-----:|---------------------|-----------------------------------------------------|
|  401 | `E_UNAUTHORIZED`    | `Authorization` ヘッダが無いか無効                     |
|  403 | `E_FORBIDDEN`       | 認証は成功したが、このユーザーはこの tracking_id にアクセスできない |

### リクエスト構造

| HTTP | コード                  | 発生条件                                             |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_INVALID_JSON`      | ボディが JSON としてパースできない                     |
|  400 | `E_MISSING_FIELD`     | 必須トップレベルフィールドが無い                         |
|  400 | `E_UNKNOWN_FIELD`     | 認識できないトップレベルキーがある                       |
|  400 | `E_TIME_REQUIRED`     | `time.start` / `time.end` / `time.tz` のどれかが無い    |
|  400 | `E_INVALID_TZ`        | `time.tz` が有効な IANA タイムゾーンでない              |
|  400 | `E_INVALID_TIME_RANGE`| `time.end <= time.start`、または範囲がありえない値       |

### Materials / Views / Result

| HTTP | コード                  | 発生条件                                             |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_UNKNOWN_MATERIAL`  | 仕様書に存在しないマテリアル名                         |
|  400 | `E_UNKNOWN_VIEW`      | `result.use` が `make` で定義されていないビューを参照    |
|  400 | `E_UNKNOWN_COLUMN`    | `keep` / `filter` / `sort` がマテリアルに存在しないカラムを参照 |
|  400 | `E_DUPLICATE_VIEW`    | `make` 内で同名ビューが複数                            |
|  400 | `E_LIMIT_REQUIRED`    | `count_only` でないのに `result.limit` が無い          |

### 機能

| HTTP | コード                    | 発生条件                                               |
|-----:|--------------------------|-------------------------------------------------------|
|  400 | `E_FEATURE_DISABLED`     | このサーバーで `enabled: false` の機能を使っている     |
|  400 | `E_FEATURE_NOT_AVAILABLE`| 機能は存在するが、サーバーの `api_update` が機能の `since` より古い |

### calc バリデーション（2026-05-11+）

| HTTP | コード                       | 発生条件                                             |
|-----:|----------------------------|-----------------------------------------------------|
|  400 | `E_CALC_COLUMN_UNRESOLVED` | `calc` 内の `material.column` 参照がビューのスコープに解決できない: マテリアルが `from` か `join.with` に登場しない、またはそのマテリアルのスキーマに当該列が存在しない。**Since:** 2026-05-11。`from[0]` が事前定義 view を参照するビューチェイニングのビューはこのチェックから意図的に除外され、Material runtime 経路にフォールバックします。 |

`E_CALC_COLUMN_UNRESOLVED` は、前バージョン `2025-10-20` でサイレントに 0 行を返していたケースを置き換えるものです。AI クライアントが「成功したけれど結果が間違っている」状態を受け取らずに済むよう、意図的に大きな声で失敗させます。

例:

```json
{
  "ok": false,
  "error": {
    "code": "E_CALC_COLUMN_UNRESOLVED",
    "message": "calc references 'click_event.pv_id', but 'click_event' is not in this view's from or join.with scope.",
    "at": "make.top_clicks.calc.clicks"
  }
}
```

### JOIN バリデーション

| HTTP | コード                  | 発生条件                                             |
|-----:|-----------------------|-----------------------------------------------------|
|  400 | `E_INVALID_JOIN`      | `join` 構造が不正、完全修飾でない、非等値、または `on.left` / `on.right` が正しい側に解決しない。**2026-05-11 から（もとは 2026-05-10 に 2025-10-20 で追加）** エラーレスポンスにどちら側で失敗したかを示す構造化 `details` が乗ります。 |
|  400 | `E_BAD_JOIN`          | 宣言されていない JOIN キーで JOIN しようとした          |
|  400 | `E_CARDINALITY_GUARD` | JOIN で行数が安全閾値を超えそう (例: フィルタなしの `gsc` ↔ `allpv`) |

`E_INVALID_JOIN` の `details` フィールド（2026-05-11 から）:

| フィールド          | 型       | 意味                                                                                                                                          |
|---------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| `side`              | string  | 該当値が `on.left` にあるなら `"left"`、`on.right` にあるなら `"right"`。                                                                       |
| `received_value`    | string  | リクエストが渡してきたリテラル値（例: `"click_event.pv_id"` や `"top_pages.pv_id"`）。                                                            |
| `expected_prefix`   | string  | バリデータがその側に期待するプレフィックス。`on.left` は `from` 側の解決済み物理マテリアル名（view chain は事前解決済み）、`on.right` は `join.with` 文字列と一致。 |
| `hint`              | string  | 人間が読める修復ヒント（例: *"use 'allpv.pv_id' — view-name prefixes are not accepted on on.left"*）。                                          |

`on.left` は `from` 側の解決済み物理マテリアル名と完全一致する必要があります。**`from[0]` がビューチェイニングのときも同様**で、バリデータは比較前にビューを元のマテリアル名まで解決します。`on.left` に素のビュー名プレフィックスを書くと拒否されます。`on.right` は `join.with` 文字列と完全一致する必要があります。

例:

```json
{
  "ok": false,
  "error": {
    "code": "E_INVALID_JOIN",
    "message": "join.on.left must reference the from material, not a view name",
    "at": "make.top_clicks.join.on[0].left",
    "details": {
      "side": "left",
      "received_value": "top_pages.pv_id",
      "expected_prefix": "allpv",
      "hint": "Replace 'top_pages.pv_id' with 'allpv.pv_id'. on.left always uses the physical material name; the view chain is resolved by the validator before comparison."
    }
  }
}
```

### 実行

| HTTP | コード                  | 発生条件                                             |
|-----:|-----------------------|-----------------------------------------------------|
|  500 | `E_EXECUTOR_FAILED`   | 内部実行エラー。ジッター付きで1回だけリトライ可         |
|  504 | `E_TIMEOUT`           | クエリがサーバーの時間予算を超えた。`time` を狭める、フィルタを足す、または高価な JOIN を落とす |

## リトライ戦略

- **401/403** — リトライしない。認証情報を直す。
- **400 (構造系)** — 盲目的にリトライしない。クライアント側のバグ。AI クライアントが 400 を受けたら、スキーマが動いている可能性があるので `/guide` を読み直してクエリを再考する。
- **500** — ジッター付きで1回リトライ。
- **504** — 同じクエリをリトライしない。リクエストを狭める。

## 次に読むページ

- **[`/query` リファレンス](./query.md)** — エラーコードが指すリクエストの形。
- **[サンプル](./examples.md)** — デバッグ時の基準にできる動くリクエスト。
