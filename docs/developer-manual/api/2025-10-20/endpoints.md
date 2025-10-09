---
id: endpoints-2025-10-20
title: API Endpoints
sidebar_position: 2
last_updated: 2025-10-06
---

# API Endpoints Reference (2025-10-20)

Complete reference for all QA  ZERO API endpoints in version 2025-10-20.

---

## Endpoint Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/qa-platform/guide` | GET | Get API documentation and server info |
| `/qa-platform/query` | POST | Execute QAL queries |

---

## 1. GET /qa-platform/guide

Retrieves API documentation and comprehensive server information including available sites, materials, goals, and system limits.

### Request

**URL:**
```
GET /wp-json/qa-platform/guide?version=2025-10-20
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version` | string | No | API version (default: oldest stable) |

**Authentication:** Required (WordPress Application Password)

### Response

Returns comprehensive server information including:
- API version and timestamp
- Available tracking sites with their configurations
- Material availability and data ranges per site  
- Goal definitions per site
- System limits and quotas
- Documentation content

```json
{
  "version": "2025-10-20",
  "timestamp": "2025-10-06T12:34:56Z",
  "plugin_version": "3.0.0.0",
  
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

### Response Fields

**Root Level:**
- `version` - API version used
- `timestamp` - Current server time (ISO 8601)
- `plugin_version` - QA Platform plugin version (e.g., "3.0.0.0")

**sites[] - Site Configurations:**
- `tracking_id` - Unique identifier for the tracking site
- `domain` - Primary domain  
- `name` - Display name
- `default` - Whether this is the default site for queries
- `data_available_from` - Earliest available data date
- `timezone` - Default timezone (IANA format)

**sites[].goals[] - Goal Definitions:**
- `id` - Goal ID (1-10)
- `name` - Goal display name
- `type` - Goal type (`url_match`, `click`, `scroll_depth`, etc.)
- `condition` - Goal trigger condition

**sites[].materials{} - Material Availability:**
- `available` - Whether this material is available
- `row_count` - Approximate number of rows
- `date_range` - Available date range

**summary - Overall Statistics:**
- `total_sites` - Number of tracking sites
- `total_pv` - Total page views across all sites
- `oldest_data` - Oldest available data date
- `newest_data` - Newest available data date

**limits - System Limits:**
- `max_query_rows` - Maximum rows a query can process
- `max_inline_rows` - Maximum rows returned inline
- `query_timeout_seconds` - Query timeout limit

**documentation - API Documentation:**
- `source` - GitHub repository URL
- `format` - Documentation format
- `sections[]` - Documentation sections with content

### Examples

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

### Use Cases

**1. Discover Available Materials:**
Check which materials are available for each site before querying.

**2. Check Data Ranges:**
Determine the valid date range for your queries.

**3. Find Goal IDs:**
Get goal IDs and conditions for goal-based queries (future versions).

**4. Verify System Limits:**
Check max row limits before executing large queries.

**5. Multi-Site Setup:**
Identify all tracking sites and their configurations.

### Error Responses

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

Executes a QAL query and returns results.

### Request

**URL:**
```
POST /wp-json/qa-platform/query?version=2025-10-20
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `version` | string | No | API version (default: oldest stable) |

**Authentication:** Required

**Headers:**
```
Content-Type: application/json
Authorization: Basic <credentials>
```

**Body:** JSON QAL query

### QAL Query Structure (2025-10-20)

```json
{
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
```

**Note:** API version is specified in the URL (`?version=2025-10-20`), not in the QAL query body.

### Supported QAL Features (2025-10-20)

**Required Fields:**
- `tracking_id` - Tracking site identifier (from /guide response)
- `materials` - Array of materials to use
- `time` - Time range (start, end, tz)
- `make` - View definitions
- `result` - Result specification

**make (View Definition):**
- ✅ `from` - Source material (array with one element)
- ✅ `keep` - Columns to keep (fully qualified names)
- ❌ `join` - Not supported in this version
- ❌ `filter` - Not supported in this version
- ❌ `calc` - Not supported in this version

**result (Output Options):**
- ✅ `use` - View name to return (required)
- ✅ `limit` - Maximum rows (default: 100, max: 5000)
- ✅ `count_only` - Return count instead of data (boolean)
- ❌ `sort` - Not supported in this version
- ❌ `sample` - Not supported in this version
- ❌ `return.mode` - Not supported (INLINE only)
- ❌ `return.format` - Not supported (JSON only)

### Response Format

**Standard Response:**
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

**Count Only Response:**
```json
{
  "count": 12456
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `data` | array | Result rows (if not count_only) |
| `count` | number | Row count (if count_only: true) |
| `meta.truncated` | boolean | Whether results were limited |
| `meta.row_count` | number | Number of rows returned |
| `meta.limits.row_limit` | number | Maximum allowed rows |

### Examples

**Example 1: Get Recent Page Views**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**Example 2: Get Mobile Device Page Views**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**Example 3: Count Total Page Views**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**Example 4: GSC Keywords**

```bash
curl -X POST \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
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
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

**JavaScript Example:**

```javascript
const auth = btoa('username:password');

const query = {
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

**Python Example:**

```python
import requests
from requests.auth import HTTPBasicAuth

query = {
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

### Error Responses

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

## Common HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid QAL syntax, unsupported feature |
| 401 | Unauthorized | Invalid or missing authentication |
| 404 | Not Found | Invalid endpoint or version |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limiting

Default rate limits:
- **100 requests per hour** per user
- **10 requests per minute** (burst)

Headers included in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1729468800
```

---

## Best Practices

1. **Always specify version** in production
2. **Use /guide endpoint** to discover available materials and data ranges
3. **Use count_only** for checking data volume before fetching
4. **Start with small limits** (10-100 rows) for testing
5. **Check server limits** from /guide response
6. **Implement retry logic** with exponential backoff
7. **Check meta.truncated** to know if results were limited

---

## Next Steps

- **[QAL Guide](./qal.md)** - Complete QAL syntax reference
- **[Materials Reference](./materials.md)** - Available materials and columns
- **[Getting Started](./index.md)** - Return to getting started guide
