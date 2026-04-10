---
id: getting-started-2025-10-20
title: Getting Started
sidebar_position: 1
last_updated: 2026-04-11
---

# QA  ZERO API - Getting Started (2025-10-20)

:::info Version Information
**API Version:** 2025-10-20  
**Plugin Version Required:** 3.0.0.0+  
**Status:** Current Release  
**Last Updated:** 2026-04-11  
**Documentation Version:** 1.1.1

**Check Compatibility:** [Version Compatibility Guide](../compatibility.md)
:::

---

## Changelog

### 2026-04-11 - Documentation v1.1.1
**Corrected:**
- 🔧 Removed inaccurate claims that `result.sort`, `result.sample`, `result.include_count` were implemented. They are not yet — `sort` is rejected as `E_RESULT_FORBIDDEN_KEY`, and `sample`/`include_count` pass validation but are no-ops. The examples, feature table, and validation manifest were updated accordingly. The `features` map reported by `/guide` is now the authoritative runtime state.

### 2026-04-10 - Documentation v1.1.0
**Added:**
- ✅ QAL `filter` (flat form, `eq`/`neq`/`gt`/`gte`/`lt`/`lte`/`in`/`contains`/`prefix`/`between`)
- ✅ QAL `join` (single equi-join per view, id-column only)
- ✅ QAL `calc` aggregation with whitelisted functions (`COUNT`, `COUNTUNIQUE`, `SUM`, `AVERAGE`, `MIN`, `MAX`)
- ✅ View chaining — `from` may reference previously defined views in the same `make` block
- ✅ M:N join filter requirement (`E_JOIN_FILTER_REQUIRED`) documented
- ✅ New materials: `goal_1`..`goal_N`, `ga4_age_gender`, `ga4_country`, `ga4_region`, `page_version`, `click_event`, `datalayer_event`, `events.{name}`
- ✅ `allpv` behavioral columns (`depth_position`, `deep_read`, `stop_max_sec`, `stop_max_pos`, `exit_pos`, `is_submit`, `dead_click_image_count`, `irritation_click_count`, `scroll_back_count`, `content_skip_count`, `exploration_count`)
- ✅ `allpv` page-type booleans (`is_article`, `is_product`, `is_form`, ...) and virtual goal columns (`is_goal_1`..`is_goal_10`)
- ✅ `gsc` column-DB schema (`clicks`, `impressions`, `position_x100`) with virtual `ctr`, `position`, `position_weighted`

**Changed:**
- 🔄 QAL Validation Manifest aligned with current runtime rules (filter/join/calc features enabled)
- 🔄 Materials Reference restructured to catalogue all materials from `/guide`

These features reflect work merged into qa-labo through April 2026. See the [Developer Blog](/blog) for context on what was built and why.

### 2025-10-06 - Documentation v1.0.0
**Added:**
- ✅ `tracking_id` required field in all QAL queries
- ✅ `/guide` endpoint now returns comprehensive server information
- ✅ `plugin_version` field in `/guide` response
- ✅ Site-specific materials and goals in `/guide` response
- ✅ System limits information
- ✅ Compatibility matrix documentation

**Removed:**
- ❌ `/materials` endpoint (replaced by `/guide`)
- ❌ Goal-related fields from `allpv` material
- ❌ Several deprecated fields: `session_id`, `tracking_domain`, `path_prefix`, `utm_content`, `utm_term`, `version_id`

**Changed:**
- 🔄 `country` → `country_code` (ISO 3166-1 alpha-2)
- 🔄 QAL version specification moved from query body to URL parameter

**Plugin Version:**
- 🔌 Requires QA Platform Plugin 3.0.0.0+

### 2025-10-20 - Initial Release
**Released:**
- Basic QAL with `from` and `keep` operations
- Two materials: `allpv` and `gsc`
- Simple result options: `limit` and `count_only`

---

## Overview

This is the initial release of QA  ZERO API, providing simple and straightforward access to page view and search console data.

**Version:** 2025-10-20  
**Status:** Current Release  


### What's Included in This Version

✅ **Materials:**
- `allpv` — Page views with identity, device, traffic source, and behavioral metrics
- `gsc` — Google Search Console (column-DB, N:M)
- `goal_1`..`goal_N` — Per-goal conversion logs
- `ga4_age_gender`, `ga4_country`, `ga4_region` — GA4 attribute aggregates
- `page_version` — Page content versions
- `click_event` — Element-level click events
- `datalayer_event` + `events.{name}` — dataLayer event index and per-event typed materials

✅ **QAL Features:**
- `from` — Material or previously-built view (view chaining)
- `filter` — Flat-form row filter with 10 operators (`eq`/`neq`/`gt`/`gte`/`lt`/`lte`/`in`/`contains`/`prefix`/`between`)
- `join` — Single equi-join per view, id-column only, M:N targets require a filter
- `keep` — Column projection / group-by keys
- `calc` — `COUNT` / `COUNTUNIQUE` / `SUM` / `AVERAGE` / `MIN` / `MAX`
- Virtual columns — `allpv.is_goal_N`, `gsc.ctr`, `gsc.position`, `gsc.position_weighted`, ...

✅ **Result Options (implemented):**
- `limit` (default 1000, cap 50000)
- `count_only`

⚠️ **Not yet available** (check `/guide` `features` map for the runtime truth):
- `result.sort` — rejected as `E_RESULT_FORBIDDEN_KEY`. Sort client-side for now.
- `result.sample` / `result.include_count` — accepted by the validator but not processed by the executor yet (no-op)
- `result.return.mode = "FILE"` and non-JSON output formats — `INLINE` + `JSON` only
- `OR` across filter conditions (use multiple queries or post-process)
- HAVING-style filter on aggregated results
- Multi-step joins within a single view (one join per view)

---

## Authentication

QA  ZERO API uses WordPress Application Passwords for authentication.

### Creating an Application Password

1. Log in to WordPress admin
2. Go to **Users → Your Profile**
3. Scroll to **Application Passwords** section
4. Enter application name: `"QA API Access"`
5. Click **Add New Application Password**
6. **Copy the password** - you won't see it again!

### Using the Password

Include credentials in every API request using Basic Authentication:

**Format:**
```
Authorization: Basic base64(username:application_password)
```

**Example (curl):**
```bash
curl -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```

**Example (JavaScript):**
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

## Base URL

All endpoints are under the WordPress REST API namespace:

```
https://your-site.com/wp-json/qa-platform/
```

### Available Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/qa-platform/guide` | GET | Get API documentation, available sites, materials, goals, limits |
| `/qa-platform/query` | POST | Execute QAL query (request body must wrap the QAL object in a `qal` key) |

---

## Version Parameter

Always specify the API version in your requests:

```
?version=2025-10-20
```

**Example:**
```
GET /qa-platform/guide?version=2025-10-20
POST /qa-platform/query?version=2025-10-20
```

**If omitted:** Latest stable version is used (currently 2025-10-20)

---

## Your First Query

### Step 1: Discover sites, materials, and goals

```bash
curl -u "username:password" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```

The `/guide` response reports the available tracking sites, each site's materials (with row counts and data ranges), configured goals, dataLayer events, and system limits. It is the single source of truth for discovery. See [Endpoints Reference](./endpoints.md) for the full schema.

### Step 2: Run a Simple Query

Get the latest 10 page views:

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

**Note:** The request body must wrap the QAL object in a top-level `"qal"` key — see [Endpoints Reference](./endpoints.md#request-body-structure).

**Response:**
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

### Step 3: Count Total Rows

Use `count_only` to get just the count:

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

**Response:**
```json
{
  "count": 15234
}
```

---

## QAL Basics (2025-10-20 Version)

### Minimal Query Structure

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

### What Each Part Does

**tracking_id**: Specify which site to query
- Must match a tracking_id from /guide endpoint
- Each site has its own data and materials

**materials**: Declare which data sources you'll use
- Must match available materials: `allpv` or `gsc`

**time**: Set the time range
- `start`: Beginning of range (inclusive)
- `end`: End of range (exclusive)
- `tz`: Timezone (IANA format)

**make**: Define your view
- `from`: Source material (array with one element)
- `keep`: Columns to include (fully qualified: `material.column`)

**result**: Specify output
- `use`: Which view to return
- `limit`: Maximum rows (default: 100, max: 5000)
- `count_only`: Return count instead of data (optional)

---

## Common Patterns

### Pattern 1: Get Specific Columns

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

### Pattern 2: GSC Keywords

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

### Pattern 3: Count Rows

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

## Error Handling

Standard HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 400 | Bad Request (invalid QAL) |
| 401 | Unauthorized (invalid credentials) |
| 404 | Not Found (invalid tracking_id or endpoint) |
| 500 | Internal Server Error |

**Error Response Format:**
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

**Common Error Codes:**
- `E_UNKNOWN_TRACKING_ID` - Invalid or missing tracking_id
- `E_UNKNOWN_MATERIAL` - Material not available for this site
- `E_UNKNOWN_COLUMN` - Invalid column name
- `E_TIME_REQUIRED` - Missing time specification
- `E_FEATURE_NOT_SUPPORTED` - Unsupported QAL feature

---

## Code Examples

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

## Next Steps

- **[Endpoints Reference](./endpoints.md)** - Detailed endpoint documentation
- **[QAL Guide](./qal.md)** - Complete QAL syntax for this version
- **[Materials Reference](./materials.md)** - Available materials and columns

## Future Versions

Planned additions tracked in qa-labo:
- `OR` logic across filter conditions
- HAVING-style filters over aggregated results
- Multi-step joins within a single view
- `return.mode = "FILE"` with CSV / Parquet output
- Additional attribute materials

Read the [Developer Blog](/blog) for ongoing notes from the qa-labo experiments that feed this API.
