---
id: getting-started-2025-10-20
title: はじめに
sidebar_position: 1
last_updated: 2026-04-11
api_update: 2026-04-11
---

# QA  ZERO API - はじめに (2025-10-20)

:::info バージョン情報
**API バージョン:** 2025-10-20  
**API アップデート:** 2026-04-11  
**必要なプラグインバージョン:** 3.0.0.0+  
**ステータス:** Current Release  
**最終更新日:** 2026-04-11  
**ドキュメントバージョン:** 1.1.2

`2025-10-20 / 2026-04-11` という組み合わせが、この API リビジョンの正式な識別子です。URL には `?version=2025-10-20` を指定し続け（破壊的変更があった場合にのみ変わります）、実行時には `/guide` から `api_update` と `features` を読み取り、対象サーバーでどの機能が利用可能かを判断してください。

**互換性の確認:** [バージョン互換性ガイド](../compatibility.md)
:::

---

## Changelog（アップデート台帳）

これは API バージョン `2025-10-20` の **アップデート台帳** です。バージョンごとに 1 つのリビングドキュメントを持ち、新しいエントリーを最上部に追加していきます。各エントリーには、プラグインが `/guide` レスポンスで返す `api_update` の日付をタグ付けしています。上から下へ読むことで、初回リリース以降の API の成長を追うことができ、最新エントリーをお使いのサーバーの `api_update` と突き合わせれば、実際にどの機能が利用可能かを把握できます。

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

---

## 概要

これは QA  ZERO API の初回リリースで、ページビューと Search Console のデータに対してシンプルで分かりやすいアクセスを提供します。

**バージョン:** 2025-10-20  
**ステータス:** Current Release  


### このバージョンに含まれるもの

✅ **マテリアル:**
- `allpv` — ページビュー（識別情報、デバイス、トラフィックソース、行動メトリクスを含む）
- `gsc` — Google Search Console（カラム DB、N:M）
- `goal_1`..`goal_N` — ゴールごとのコンバージョンログ
- `ga4_age_gender`、`ga4_country`、`ga4_region` — GA4 属性の集計
- `page_version` — ページコンテンツのバージョン
- `click_event` — 要素単位のクリックイベント
- `datalayer_event` + `events.{name}` — dataLayer イベントのインデックスおよびイベントごとの型付きマテリアル

✅ **QAL 機能:**
- `from` — マテリアル、または先に構築したビュー（ビューチェイニング）
- `filter` — 10 種類の演算子（`eq`/`neq`/`gt`/`gte`/`lt`/`lte`/`in`/`contains`/`prefix`/`between`）を持つフラット形式の行フィルター
- `join` — ビューごとに 1 つの等結合（equi-join）、id カラムのみ、M:N ターゲットにはフィルターが必須
- `keep` — カラムの射影 / group-by キー
- `calc` — `COUNT` / `COUNTUNIQUE` / `SUM` / `AVERAGE` / `MIN` / `MAX`
- 仮想カラム — `allpv.is_goal_N`、`gsc.ctr`、`gsc.position`、`gsc.position_weighted`、...

✅ **Result オプション（実装済み）:**
- `limit`（デフォルト 1000、上限 50000）
- `count_only`

⚠️ **未対応**（実行時の正は `/guide` の `features` マップを確認してください）:
- `result.sort` — `E_RESULT_FORBIDDEN_KEY` として拒否されます。現状ではクライアント側でソートしてください。
- `result.sample` / `result.include_count` — バリデーターは受け付けますが、実行時にはまだ処理されません（no-op）
- `result.return.mode = "FILE"` および JSON 以外の出力フォーマット — 現時点では `INLINE` + `JSON` のみ
- フィルター条件をまたぐ `OR`（複数回クエリを投げるか、後処理してください）
- 集計結果に対する HAVING 相当のフィルター
- 1 つのビュー内での多段 join（ビューあたり 1 回の join のみ）

---

## 認証

QA  ZERO API は認証に WordPress のアプリケーションパスワードを使用します。

### アプリケーションパスワードの作成

1. WordPress 管理画面にログイン
2. **ユーザー → プロフィール** に移動
3. **アプリケーションパスワード** セクションまでスクロール
4. アプリケーション名を入力: `"QA API Access"`
5. **新しいアプリケーションパスワードを追加** をクリック
6. **パスワードをコピー** — 二度と表示されません!

### パスワードの使い方

すべての API リクエストで Basic 認証の資格情報を含めてください:

**フォーマット:**
```
Authorization: Basic base64(username:application_password)
```

**例 (curl):**
```bash
curl -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```

**例 (JavaScript):**
```javascript
const username = 'admin';
const password = 'xxxx xxxx xxxx xxxx xxxx xxxx';
const auth = btoa(`${username}:${password}`);

fetch('https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20', {
  headers: {
    'Authorization': `Basic ${auth}`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ベース URL

すべてのエンドポイントは WordPress REST API 名前空間の配下にあります:

```
https://your-site.com/wp-json/qa-platform/
```

### 利用可能なエンドポイント

| エンドポイント | メソッド | 用途 |
|----------|--------|---------|
| `/qa-platform/guide` | GET | API ドキュメント、利用可能なサイト、マテリアル、ゴール、上限情報を取得 |
| `/qa-platform/query` | POST | QAL クエリを実行（リクエストボディは QAL オブジェクトを `qal` キーでラップすること） |

---

## バージョンパラメーター

リクエストでは必ず API バージョンを指定してください:

```
?version=2025-10-20
```

**例:**
```
GET /qa-platform/guide?version=2025-10-20
POST /qa-platform/query?version=2025-10-20
```

**省略した場合:** 最新の安定バージョンが使用されます（現時点では 2025-10-20）

---

## 最初のクエリ

### ステップ 1: サイト、マテリアル、ゴールを探索する

```bash
curl -u "username:password" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```

`/guide` レスポンスは、利用可能なトラッキングサイト、各サイトのマテリアル（行数とデータ範囲付き）、設定済みのゴール、dataLayer イベント、システム上限を報告します。これが探索における唯一の正です。完全なスキーマは [エンドポイントリファレンス](./endpoints.md) を参照してください。

### ステップ 2: シンプルなクエリを実行する

直近 10 件のページビューを取得します:

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "qal": {
      "tracking_id": "abc123",
      "materials": [{"name": "allpv"}],
      "time": {
        "start": "2026-03-01T00:00:00",
        "end":   "2026-04-01T00:00:00",
        "tz":    "Asia/Tokyo"
      },
      "make": {
        "recent_pvs": {
          "from": ["allpv"],
          "keep": ["allpv.url", "allpv.title", "allpv.access_time"]
        }
      },
      "result": {
        "use": "recent_pvs",
        "limit": 10
      }
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**メモ:** リクエストボディは QAL オブジェクトをトップレベルの `"qal"` キーでラップする必要があります — [エンドポイントリファレンス](./endpoints.md#request-body-structure) を参照してください。

**レスポンス:**
```json
{
  "data": [
    {
      "url": "https://example.com/page1",
      "title": "Page 1",
      "access_time": "2025-10-15T14:30:00"
    },
    ...
  ],
  "meta": {
    "truncated": false,
    "row_count": 10,
    "limits": {
      "row_limit": 5000
    }
  }
}
```

### ステップ 3: 総行数をカウントする

`count_only` を使うとカウントだけを取得できます:

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "qal": {
      "tracking_id": "abc123",
      "materials": [{"name": "allpv"}],
      "time": {
        "start": "2026-03-01T00:00:00",
        "end":   "2026-04-01T00:00:00",
        "tz":    "Asia/Tokyo"
      },
      "make": {
        "all_pvs": {
          "from": ["allpv"],
          "keep": ["allpv.pv_id"]
        }
      },
      "result": {
        "use": "all_pvs",
        "count_only": true
      }
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**レスポンス:**
```json
{
  "count": 15234
}
```

---

## QAL の基本（2025-10-20 バージョン）

### 最小クエリ構造

```json
{
  "tracking_id": "abc123",
  "materials": [{"name": "allpv"}],
  "time": {
    "start": "YYYY-MM-DDTHH:mm:ss",
    "end": "YYYY-MM-DDTHH:mm:ss",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "view_name": {
      "from": ["allpv"],
      "keep": ["allpv.column1", "allpv.column2"]
    }
  },
  "result": {
    "use": "view_name",
    "limit": 100
  }
}
```

### 各パートの役割

**tracking_id**: クエリ対象のサイトを指定します
- `/guide` エンドポイントが返す tracking_id と一致する必要があります
- 各サイトは独自のデータとマテリアルを持ちます

**materials**: 使用するデータソースを宣言します
- 利用可能なマテリアルと一致する必要があります（`allpv` または `gsc`）

**time**: 時間範囲を指定します
- `start`: 範囲の開始（含む）
- `end`: 範囲の終了（含まない）
- `tz`: タイムゾーン（IANA 形式）

**make**: ビューを定義します
- `from`: ソースのマテリアル（要素 1 つの配列）
- `keep`: 含めるカラム（完全修飾名: `material.column`）

**result**: 出力を指定します
- `use`: 返すビュー
- `limit`: 最大行数（デフォルト: 100、最大: 5000）
- `count_only`: データの代わりにカウントを返す（任意）

---

## よくあるパターン

### パターン 1: 特定のカラムを取得する

```json
{
  "tracking_id": "abc123",
  "materials": [{"name": "allpv"}],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "basic_info": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.title",
        "allpv.device_type",
        "allpv.access_time"
      ]
    }
  },
  "result": {
    "use": "basic_info",
    "limit": 100
  }
}
```

### パターン 2: GSC キーワード

```json
{
  "materials": [{"name": "gsc"}],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "keywords": {
      "from": ["gsc"],
      "keep": [
        "gsc.keyword",
        "gsc.clicks_sum",
        "gsc.impressions_sum",
        "gsc.ctr"
      ]
    }
  },
  "result": {
    "use": "keywords",
    "limit": 50
  }
}
```

### パターン 3: 行数をカウントする

```json
{
  "tracking_id": "abc123",
  "materials": [{"name": "allpv"}],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "total": {
      "from": ["allpv"],
      "keep": ["allpv.pv_id"]
    }
  },
  "result": {
    "use": "total",
    "count_only": true
  }
}
```

---

## エラーハンドリング

標準の HTTP ステータスコード:

| ステータス | 意味 |
|--------|---------|
| 200 | 成功 |
| 400 | Bad Request（無効な QAL） |
| 401 | Unauthorized（認証情報が無効） |
| 404 | Not Found（無効な tracking_id またはエンドポイント） |
| 500 | Internal Server Error |

**エラーレスポンス形式:**
```json
{
  "code": "E_UNKNOWN_TRACKING_ID",
  "message": "Unknown tracking_id: 'invalid123'",
  "data": {
    "tracking_id": "invalid123",
    "available_sites": [
      {"tracking_id": "abc123", "domain": "example.com"},
      {"tracking_id": "def456", "domain": "blog.example.com"}
    ]
  }
}
```

**よくあるエラーコード:**
- `E_UNKNOWN_TRACKING_ID` - tracking_id が無効または欠落
- `E_UNKNOWN_MATERIAL` - このサイトで利用できないマテリアル
- `E_UNKNOWN_COLUMN` - 無効なカラム名
- `E_TIME_REQUIRED` - time 指定が欠落
- `E_FEATURE_NOT_SUPPORTED` - サポートされていない QAL 機能

---

## コード例

### JavaScript (Fetch API)

```javascript
const auth = btoa('username:password');
const baseUrl = 'https://your-site.com/wp-json/qa-platform';

async function getPageViews() {
  const body = {
    qal: {
      tracking_id: "abc123",
      materials: [{name: "allpv"}],
      time: {
        start: "2026-03-01T00:00:00",
        end:   "2026-04-01T00:00:00",
        tz:    "Asia/Tokyo"
      },
      make: {
        pvs: {
          from: ["allpv"],
          keep: ["allpv.url", "allpv.title"]
        }
      },
      result: {
        use: "pvs",
        limit: 10
      }
    }
  };

  const response = await fetch(`${baseUrl}/query?version=2025-10-20`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data;
}

getPageViews().then(console.log);
```

### Python (Requests)

```python
import requests
from requests.auth import HTTPBasicAuth

base_url = 'https://your-site.com/wp-json/qa-platform'

body = {
    "qal": {
        "tracking_id": "abc123",
        "materials": [{"name": "allpv"}],
        "time": {
            "start": "2026-03-01T00:00:00",
            "end":   "2026-04-01T00:00:00",
            "tz":    "Asia/Tokyo"
        },
        "make": {
            "pvs": {
                "from": ["allpv"],
                "keep": ["allpv.url", "allpv.title"]
            }
        },
        "result": {
            "use": "pvs",
            "limit": 10
        }
    }
}

response = requests.post(
    f'{base_url}/query?version=2025-10-20',
    json=body,
    auth=HTTPBasicAuth('username', 'password')
)

data = response.json()
print(data)
```

---

## 次のステップ

- **[エンドポイントリファレンス](./endpoints.md)** - 詳細なエンドポイントドキュメント
- **[QAL ガイド](./qal.md)** - このバージョンの完全な QAL 構文
- **[マテリアルリファレンス](./materials.md)** - 利用可能なマテリアルとカラム

## 今後のバージョン

qa-labo で追跡中の予定機能:
- フィルター条件をまたぐ `OR` 論理
- 集計結果に対する HAVING 相当のフィルター
- 1 つのビュー内での多段 join
- CSV / Parquet 出力に対応した `return.mode = "FILE"`
- 追加の属性マテリアル

この API の土台となる qa-labo 実験の継続的なメモは [Developer Blog](/blog) を参照してください。
