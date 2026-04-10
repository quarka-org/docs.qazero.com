---
id: endpoints-2025-10-20
title: API エンドポイント
sidebar_position: 2
last_updated: 2026-04-11
api_update: 2026-04-11
---

# API エンドポイントリファレンス (2025-10-20)

バージョン 2025-10-20 の QA ZERO API のすべてのエンドポイントに関する完全なリファレンスです。

---

## エンドポイント一覧

| エンドポイント | メソッド | 用途 |
|----------|--------|---------|
| `/qa-platform/guide` | GET | API ドキュメントとサーバー情報の取得 |
| `/qa-platform/query` | POST | QAL クエリの実行 |

---

## 1. GET /qa-platform/guide

API ドキュメントと、利用可能なサイト、マテリアル、ゴール、システム上限などの包括的なサーバー情報を取得します。

### リクエスト

**URL:**
```
GET /wp-json/qa-platform/guide?version=2025-10-20
```

**パラメーター:**

| パラメーター | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `version` | string | No | API バージョン（デフォルト: 最も古い安定版） |

**認証:** 必須（WordPress のアプリケーションパスワード）

### レスポンス

以下を含む包括的なサーバー情報を返します:
- API バージョンとタイムスタンプ
- 利用可能なトラッキングサイトとその設定
- サイトごとのマテリアル可用性とデータ範囲
- サイトごとのゴール定義
- システム上限とクォータ
- ドキュメントの内容

```json
{
  "version": "2025-10-20",
  "api_update": "2026-04-11",
  "timestamp": "2026-04-11T12:34:56Z",
  "plugin_version": "3.0.0.0",

  "features": {
    "filter":         true,
    "join":           true,
    "calc":           true,
    "view_chaining":  true,
    "sort":           false,
    "sample":         false,
    "include_count":  false,
    "return_file":    false,
    "return_csv":     false,
    "return_parquet": false
  },

  "sites": [
    {
      "tracking_id": "abc123",
      "domain": "example.com",
      "name": "コーポレートサイト",
      "default": true,
      "data_available_from": "2024-01-01",
      "timezone": "Asia/Tokyo",
      "goals": [
        {
          "id": 1,
          "name": "お問い合わせ完了",
          "type": "url_match",
          "condition": "/thanks/"
        },
        {
          "id": 2,
          "name": "資料ダウンロード",
          "type": "click",
          "condition": ".download-btn"
        }
      ],
      "materials": {
        "allpv": {
          "available": true,
          "row_count": 1250000,
          "date_range": {
            "start": "2024-01-01",
            "end": "2025-10-06"
          }
        },
        "gsc": {
          "available": true,
          "row_count": 45000,
          "date_range": {
            "start": "2024-03-01",
            "end": "2025-10-03"
          }
        }
      }
    },
    {
      "tracking_id": "def456",
      "domain": "blog.example.com",
      "name": "ブログサイト",
      "default": false,
      "data_available_from": "2024-06-01",
      "timezone": "Asia/Tokyo",
      "goals": [
        {
          "id": 1,
          "name": "記事読了",
          "type": "scroll_depth",
          "condition": "90"
        }
      ],
      "materials": {
        "allpv": {
          "available": true,
          "row_count": 320000,
          "date_range": {
            "start": "2024-06-01",
            "end": "2025-10-06"
          }
        },
        "gsc": {
          "available": false
        }
      }
    }
  ],
  
  "summary": {
    "total_sites": 2,
    "total_pv": 1570000,
    "oldest_data": "2024-01-01",
    "newest_data": "2025-10-06"
  },
  
  "limits": {
    "max_query_rows": 50000,
    "max_inline_rows": 5000,
    "query_timeout_seconds": 300
  },
  
  "documentation": {
    "source": "https://github.com/quarka-org/docs.qazero.com/tree/main/docs/developer-manual/api/2025-10-20",
    "format": "markdown",
    "sections": [
      {
        "category": "overview",
        "file": "index.md",
        "title": "Getting Started",
        "content": "# QA  ZERO API - Getting Started..."
      },
      {
        "category": "reference",
        "file": "endpoints.md",
        "title": "API Endpoints",
        "content": "# API Endpoints Reference..."
      },
      {
        "category": "reference",
        "file": "materials.md",
        "title": "Materials Reference",
        "content": "# Materials Reference..."
      },
      {
        "category": "reference",
        "file": "qal.md",
        "title": "QAL Guide",
        "content": "# QAL Guide..."
      }
    ]
  }
}
```

### レスポンスフィールド

**ルートレベル:**
- `version` - 使用されている API バージョン（破壊的変更の識別子。変更頻度は低く、URL に含まれます）
- `api_update` - 同一 `version` 内のアップデート日付（後方互換な追加のみ。新機能が出るたびに bump されます）。クライアントは `features` と合わせてこれを読むことで、サーバーが実際にサポートしている機能を把握できます。
- `timestamp` - 現在のサーバー時刻（ISO 8601）
- `plugin_version` - QA Platform プラグインバージョン（例: "3.0.0.0"）
- `features` - この `version` + `api_update` の組み合わせにおける実行時の機能マップ。各キーは QAL / result の機能で、値は Executor が実際にそれを処理するかどうかの真偽値です。これが正本の実行時情報です — 機能の可否をクライアント側にハードコードせず、起動時に `/guide` から読み取ってください。

**sites[] - サイト設定:**
- `tracking_id` - トラッキングサイトの一意識別子
- `domain` - 主要ドメイン
- `name` - 表示名
- `default` - クエリのデフォルトサイトかどうか
- `data_available_from` - データが利用可能になる最古の日付
- `timezone` - デフォルトタイムゾーン（IANA 形式）

**sites[].goals[] - ゴール定義:**
- `id` - ゴール ID (1-10)
- `name` - ゴールの表示名
- `type` - ゴールタイプ (`url_match`, `click`, `scroll_depth` など)
- `condition` - ゴールのトリガー条件

**sites[].materials{} - マテリアル可用性:**
- `available` - このマテリアルが利用可能かどうか
- `row_count` - 行数の概算
- `date_range` - 利用可能な日付範囲

**summary - 全体統計:**
- `total_sites` - トラッキングサイトの数
- `total_pv` - 全サイト合計のページビュー数
- `oldest_data` - 最も古い利用可能データの日付
- `newest_data` - 最も新しい利用可能データの日付

**limits - システム上限:**
- `max_query_rows` - クエリが処理できる最大行数
- `max_inline_rows` - インラインで返す最大行数
- `query_timeout_seconds` - クエリのタイムアウト時間

**documentation - API ドキュメント:**
- `source` - GitHub リポジトリ URL
- `format` - ドキュメント形式
- `sections[]` - ドキュメントセクションとその内容

### 例

**cURL:**
```bash
curl -u "username:password" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```

**JavaScript:**
```javascript
const auth = btoa('username:password');

fetch('https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20', {
  headers: { 'Authorization': `Basic ${auth}` }
})
  .then(res => res.json())
  .then(data => {
    console.log('API Version:', data.version);
    console.log('Plugin Version:', data.plugin_version);
    console.log('Available sites:', data.sites.length);
    console.log('Total PV:', data.summary.total_pv);
    data.sites.forEach(site => {
      console.log(`${site.name}: ${site.domain}`);
      console.log('  Materials:', Object.keys(site.materials));
      console.log('  Goals:', site.goals.length);
    });
  });
```

**Python:**
```python
import requests
from requests.auth import HTTPBasicAuth

response = requests.get(
    'https://your-site.com/wp-json/qa-platform/guide',
    params={'version': '2025-10-20'},
    auth=HTTPBasicAuth('username', 'password')
)

data = response.json()
print(f"API Version: {data['version']}")
print(f"Plugin Version: {data['plugin_version']}")
print(f"Total Sites: {data['summary']['total_sites']}")
print(f"Total PV: {data['summary']['total_pv']}")

for site in data['sites']:
    print(f"\n{site['name']} ({site['domain']})")
    print(f"  Default: {site['default']}")
    print(f"  Data from: {site['data_available_from']}")
    print(f"  Goals: {len(site['goals'])}")
    for material, info in site['materials'].items():
        if info['available']:
            print(f"  {material}: {info['row_count']:,} rows")
```

### ユースケース

**1. 利用可能なマテリアルの発見:**
クエリ前に、各サイトで利用可能なマテリアルを確認します。

**2. データ範囲の確認:**
クエリで使える有効な日付範囲を把握します。

**3. ゴール ID の取得:**
ゴールベースのクエリ（将来のバージョン）のためにゴール ID と条件を取得します。

**4. システム上限の確認:**
大きなクエリを実行する前に最大行数の上限を確認します。

**5. マルチサイト構成:**
すべてのトラッキングサイトとその設定を把握します。

### エラーレスポンス

**Invalid Version:**
```json
{
  "code": "invalid_version",
  "message": "Version '2024-01-01' not found",
  "data": {
    "status": 404,
    "available_versions": ["2025-10-20"]
  }
}
```

---

## 2. POST /qa-platform/query

QAL クエリを実行して結果を返します。

### リクエスト

**URL:**
```
POST /wp-json/qa-platform/query?version=2025-10-20
```

**パラメーター:**

| パラメーター | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `version` | string | No | API バージョン（デフォルト: 最も古い安定版） |

**認証:** 必須

**ヘッダー:**
```
Content-Type: application/json
Authorization: Basic <credentials>
```

**ボディ:** QAL クエリを含む `qal` キーを持つ JSON オブジェクト

### リクエストボディの構造 {#request-body-structure}

リクエストボディは、QAL クエリを格納する `qal` キーを持つ JSON オブジェクトでなければなりません。

```json
{
  "qal": {
    "tracking_id": "abc123",
    "materials": [
      { "name": "allpv" }
    ],
    "time": {
      "start": "2025-10-01T00:00:00",
      "end": "2025-10-20T00:00:00",
      "tz": "Asia/Tokyo"
    },
    "make": {
      "view_name": {
        "from": ["allpv"],
        "keep": ["allpv.url", "allpv.title"]
      }
    },
    "result": {
      "use": "view_name",
      "limit": 100
    }
  }
}
```

### QAL クエリ構造 (2025-10-20)

**メモ:** API バージョンは URL (`?version=2025-10-20`) で指定し、QAL クエリ本体には含めません。

### サポートされる QAL 機能 (2025-10-20)

**必須フィールド:**
- `tracking_id` - トラッキングサイト識別子（/guide レスポンスから取得）
- `materials` - 使用するマテリアルの配列
- `time` - 時間範囲（start, end, tz）
- `make` - ビュー定義
- `result` - 結果指定

**make (ビュー定義):**
- ✅ `from` - ソースマテリアル（要素数 1 の配列）
- ✅ `keep` - 保持するカラム（完全修飾名）
- ❌ `join` - 本バージョンではサポート外
- ❌ `filter` - 本バージョンではサポート外
- ❌ `calc` - 本バージョンではサポート外

**result (出力オプション):**
- ✅ `use` - 返却するビュー名（必須）
- ✅ `limit` - 最大行数（デフォルト: 100、最大: 5000）
- ✅ `count_only` - データの代わりに件数を返す（boolean）
- ❌ `sort` - 本バージョンではサポート外
- ❌ `sample` - 本バージョンではサポート外
- ❌ `return.mode` - サポート外（INLINE のみ）
- ❌ `return.format` - サポート外（JSON のみ）

### レスポンス形式

**標準レスポンス:**
```json
{
  "data": [
    {
      "url": "https://example.com/page1",
      "title": "Page Title 1"
    },
    {
      "url": "https://example.com/page2",
      "title": "Page Title 2"
    }
  ],
  "meta": {
    "truncated": false,
    "row_count": 2,
    "limits": {
      "row_limit": 5000
    }
  }
}
```

**Count Only レスポンス:**
```json
{
  "count": 12456
}
```

**レスポンスフィールド:**

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `data` | array | 結果行（count_only でない場合） |
| `count` | number | 行数（count_only: true の場合） |
| `meta.truncated` | boolean | 結果が上限により制限されたかどうか |
| `meta.row_count` | number | 返却された行数 |
| `meta.limits.row_limit` | number | 許容される最大行数 |

### 例

**例 1: 最近のページビューを取得**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "qal": {
      "tracking_id": "abc123",
      "materials": [{"name": "allpv"}],
      "time": {
        "start": "2025-10-01T00:00:00",
        "end": "2025-10-20T00:00:00",
        "tz": "Asia/Tokyo"
      },
      "make": {
        "recent": {
          "from": ["allpv"],
          "keep": ["allpv.url", "allpv.title", "allpv.access_time"]
        }
      },
      "result": {
        "use": "recent",
        "limit": 10
      }
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**例 2: モバイルデバイスのページビューを取得**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "qal": {
      "tracking_id": "abc123",
      "materials": [{"name": "allpv"}],
      "time": {
        "start": "2025-10-01T00:00:00",
        "end": "2025-10-20T00:00:00",
        "tz": "Asia/Tokyo"
      },
      "make": {
        "mobile_pvs": {
          "from": ["allpv"],
          "keep": [
            "allpv.url",
            "allpv.device_type",
            "allpv.os",
            "allpv.browser"
          ]
        }
      },
      "result": {
        "use": "mobile_pvs",
        "limit": 50
      }
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**例 3: 総ページビュー数をカウント**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "qal": {
      "tracking_id": "abc123",
      "materials": [{"name": "allpv"}],
      "time": {
        "start": "2025-10-01T00:00:00",
        "end": "2025-10-20T00:00:00",
        "tz": "Asia/Tokyo"
      },
      "make": {
        "all": {
          "from": ["allpv"],
          "keep": ["allpv.pv_id"]
        }
      },
      "result": {
        "use": "all",
        "count_only": true
      }
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**例 4: GSC キーワード**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "qal": {
      "tracking_id": "abc123",
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
            "gsc.ctr",
            "gsc.position_wavg"
          ]
        }
      },
      "result": {
        "use": "keywords",
        "limit": 100
      }
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**JavaScript の例:**

```javascript
const auth = btoa('username:password');

const query = {
  qal: {
    tracking_id: "abc123",
    materials: [{name: "allpv"}],
    time: {
      start: "2025-10-01T00:00:00",
      end: "2025-10-20T00:00:00",
      tz: "Asia/Tokyo"
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

fetch('https://your-site.com/wp-json/qa-platform/query?version=2025-10-20', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(query)
})
  .then(res => res.json())
  .then(data => console.log(data));
```

**Python の例:**

```python
import requests
from requests.auth import HTTPBasicAuth

query = {
    "qal": {
        "tracking_id": "abc123",
        "materials": [{"name": "allpv"}],
        "time": {
            "start": "2025-10-01T00:00:00",
            "end": "2025-10-20T00:00:00",
            "tz": "Asia/Tokyo"
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
    'https://your-site.com/wp-json/qa-platform/query',
    params={'version': '2025-10-20'},
    json=query,
    auth=HTTPBasicAuth('username', 'password')
)

data = response.json()
for row in data['data']:
    print(f"{row['url']}: {row['title']}")
```

### エラーレスポンス

**Invalid tracking_id:**
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

**Invalid Material:**
```json
{
  "code": "E_UNKNOWN_MATERIAL",
  "message": "Unknown material: 'unknown'",
  "data": {
    "material": "unknown",
    "available_materials": ["allpv", "gsc"]
  }
}
```

**Invalid Column:**
```json
{
  "code": "E_UNKNOWN_COLUMN",
  "message": "Unknown column: allpv.invalid_col",
  "data": {
    "material": "allpv",
    "column": "invalid_col"
  }
}
```

**Missing Time:**
```json
{
  "code": "E_TIME_REQUIRED",
  "message": "Missing required field: time",
  "data": {
    "field": "time",
    "required_fields": ["start", "end", "tz"]
  }
}
```

**Unsupported Feature:**
```json
{
  "code": "E_FEATURE_NOT_SUPPORTED",
  "message": "Feature 'filter' is not supported in version 2025-10-20",
  "data": {
    "feature": "filter",
    "version": "2025-10-20",
    "available_in": "future versions"
  }
}
```

---

## 共通 HTTP ステータスコード

| ステータス | 意味 | 主な原因 |
|--------|---------|---------------|
| 200 | Success | リクエストが正常に完了 |
| 400 | Bad Request | QAL 構文が不正、サポート外の機能を使用 |
| 401 | Unauthorized | 認証情報が無効または欠落 |
| 404 | Not Found | エンドポイントまたはバージョンが無効 |
| 500 | Internal Server Error | サーバー側のエラー |

---

## レートリミット

デフォルトのレートリミット:
- **1 時間あたり 100 リクエスト**（ユーザー単位）
- **1 分あたり 10 リクエスト**（バースト）

レスポンスに含まれるヘッダー:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1729468800
```

---

## ベストプラクティス

1. **本番では必ずバージョンを指定する**
2. **/guide エンドポイントを使って** 利用可能なマテリアルとデータ範囲を発見する
3. **count_only を使って** 取得前にデータ量を確認する
4. **テストでは小さい limit から始める**（10〜100 行）
5. **/guide レスポンスから** サーバー上限を確認する
6. **指数バックオフ付きのリトライロジックを実装する**
7. **meta.truncated を確認して** 結果が制限されたかを知る

---

## 次のステップ

- **[QAL Guide](./qal.md)** - QAL 構文の完全リファレンス
- **[Materials Reference](./materials.md)** - 利用可能なマテリアルとカラム
- **[Getting Started](./index.md)** - 入門ガイドへ戻る
