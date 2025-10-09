---
id: materials-2025-10-20
title: Materials Reference
sidebar_position: 4
last_updated: 2025-10-06
---

# Materials Reference (2025-10-20)

Complete reference for available materials in QA  ZERO API version 2025-10-20.

:::caution Plugin Version Required
**Minimum Plugin Version:** 3.0.0.0+

Check your version: WordPress Admin → Plugins → QA Platform  
Or call `/guide` endpoint to see `plugin_version`

**Not compatible?** See [Compatibility Guide](../compatibility.md)
:::

---

## Overview

This version provides two materials:

| Material | Type | Source | Description | Plugin Ver |
|----------|------|--------|-------------|------------|
| `allpv` | Log | view_pv function | Page view data with visitor info | 3.0.0.0+ |
| `gsc` | Log | get_gsc_lp_query function | Google Search Console data | 3.0.0.0+ |

**Source:** Both materials are retrieved from `file_functions.php`

---

## allpv Material

Page view data including visitor information, device details, and behavioral metrics.

### Description

The `allpv` material provides comprehensive page view data extracted from the `view_pv` function. It includes identity information, page details, referral sources, UTM parameters, device/browser information, and timing metrics.

**Source Function:** `file_functions.php::view_pv`

### Field Changes in Plugin 3.0.0.0

**Removed Fields** (not available in this version):
- ❌ `session_id` - Session identifier
- ❌ `tracking_domain` - Tracking domain
- ❌ `path_prefix` - URL path prefix
- ❌ `utm_content` - UTM content parameter
- ❌ `utm_term` - UTM term parameter
- ❌ `version_id` - Version history ID
- ❌ All goal fields: `is_goal_0` through `is_goal_10`, `is_submit`

**Changed Fields**:
- 🔄 `country` → `country_code` (now ISO 3166-1 alpha-2 format)

### Available Columns

#### Identity & Session

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| `pv_id` | uint64 | Unique page view identifier | ✓ |

| `reader_id` | uint64 | Visitor identifier (persistent) | ✓ |

#### Page Information

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| `page_id` | uint64 | Page identifier | ✓ |
| `url` | string | Full page URL | Partial* |
| `title` | string | Page title | - |



*Partial index: Exact match or parameter-free exact match only

#### Referral & UTM Parameters

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| `source_domain` | string | Referrer domain | - |
| `referrer` | string | Full referrer URL | - |
| `utm_source` | string | UTM source parameter | - |
| `utm_medium` | string | UTM medium parameter | - |
| `utm_campaign` | string | UTM campaign parameter | - |



#### Device & Browser

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| `ua` | string | User Agent (partial) | - |
| `device_type` | string | Device type: "dsk", "smp", "tab" | - |
| `os` | string | Operating system (Windows, iOS, Android, etc.) | ✓ |
| `browser` | string | Browser (Chrome, Safari, Firefox, etc.) | ✓ |
| `language` | string | User language | ✓ |
| `country_code` | string | User country code (ISO 3166-1 alpha-2) | ✓ |

#### Timing & Behavior

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| `access_time` | int64 | Page view timestamp (ISO8601) | ✓ |
| `pv` | uint16 | Page number within session | - |
| `speed_msec` | uint16 | Page load time (milliseconds, 0-65535) | - |
| `browse_sec` | uint16 | Browse time (seconds, 0-65535) | - |
| `is_last` | bool | Exit flag (last page in session) | - |
| `is_newuser` | bool | New user flag | - |

### Common Column Sets

**Basic page info:**
```json
{
  "keep": [
    "allpv.url",
    "allpv.title",
    "allpv.access_time"
  ]
}
```

**Traffic source analysis:**
```json
{
  "keep": [
    "allpv.url",
    "allpv.source_domain",
    "allpv.utm_source",
    "allpv.utm_medium",
    "allpv.utm_campaign"
  ]
}
```

**Device analysis:**
```json
{
  "keep": [
    "allpv.url",
    "allpv.device_type",
    "allpv.os",
    "allpv.browser"
  ]
}
```

**User behavior:**
```json
{
  "keep": [
    "allpv.reader_id",
    "allpv.pv",
    "allpv.browse_sec",
    "allpv.is_newuser",
    "allpv.is_last"
  ]
}
```

### Example Queries

**Get recent page views:**
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
    "recent": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.title",
        "allpv.access_time"
      ]
    }
  },
  "result": {
    "use": "recent",
    "limit": 10
  }
}
```

**Mobile traffic:**
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
    "mobile": {
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
    "use": "mobile",
    "limit": 100
  }
}
```

**New vs returning visitors:**
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
    "visitors": {
      "from": ["allpv"],
      "keep": [
        "allpv.reader_id",
        "allpv.is_newuser",
        "allpv.access_time"
      ]
    }
  },
  "result": {
    "use": "visitors",
    "limit": 500
  }
}
```

---

## gsc Material

Google Search Console data for SEO analysis.

### Description

The `gsc` material provides search performance data from Google Search Console, including keywords, impressions, clicks, and ranking positions. Data is aggregated by page and keyword combination.

**Source Function:** `file_functions.php::get_gsc_lp_query`

### Available Columns

| Column | Type | Description |
|--------|------|-------------|
| `page_id` | int | Page identifier |
| `title` | string | Page title |
| `url` | string | Page URL |
| `search_type` | int | Search type (web, image, video) |
| `keyword` | string | Search keyword/query |
| `clicks_sum` | int | Total clicks for period |
| `impressions_sum` | int | Total impressions for period |
| `ctr` | float | Click-through rate (clicks/impressions) |
| `position_wavg` | float | Weighted average position |
| `first_position` | float | First position in period |
| `latest_position` | float | Latest position in period |
| `position_history` | string | Daily position history (CSV format) |

### Column Details

**page_id:**
- Links to the same page_id in allpv material
- Can be used for joining (in future versions)

**search_type:**
- Numeric code for search type
- Common values: web search, image search, video search

**keyword:**
- The actual search query users entered
- Exact match from Google Search Console

**clicks_sum:**
- Total number of clicks from this keyword to this page
- Aggregated over the time period

**impressions_sum:**
- Total number of times the page appeared in search results
- For this specific keyword

**ctr:**
- Click-through rate: `clicks_sum / impressions_sum`
- Calculated automatically
- Range: 0.0 to 1.0 (0% to 100%)

**position_wavg:**
- Weighted average ranking position
- Lower is better (1.0 = top position)
- Weighted by impressions

**first_position:**
- Ranking position at the start of the period
- Useful for tracking movement

**latest_position:**
- Ranking position at the end of the period
- Compare with first_position to see trends

**position_history:**
- Daily position data in CSV format
- Example: "2025-10-01:5.2,2025-10-02:4.8,2025-10-03:4.5"

### Common Column Sets

**Basic keyword performance:**
```json
{
  "keep": [
    "gsc.keyword",
    "gsc.clicks_sum",
    "gsc.impressions_sum",
    "gsc.ctr"
  ]
}
```

**Ranking analysis:**
```json
{
  "keep": [
    "gsc.keyword",
    "gsc.url",
    "gsc.position_wavg",
    "gsc.first_position",
    "gsc.latest_position"
  ]
}
```

**Complete keyword data:**
```json
{
  "keep": [
    "gsc.keyword",
    "gsc.url",
    "gsc.title",
    "gsc.clicks_sum",
    "gsc.impressions_sum",
    "gsc.ctr",
    "gsc.position_wavg"
  ]
}
```

### Example Queries

**Top keywords by clicks:**
```json
{
  "tracking_id": "abc123",
  "materials": [{"name": "gsc"}],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "top_keywords": {
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
    "use": "top_keywords",
    "limit": 50
  }
}
```

**Ranking positions:**
```json
{
  "tracking_id": "abc123",
  "materials": [{"name": "gsc"}],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "rankings": {
      "from": ["gsc"],
      "keep": [
        "gsc.keyword",
        "gsc.url",
        "gsc.position_wavg",
        "gsc.first_position",
        "gsc.latest_position"
      ]
    }
  },
  "result": {
    "use": "rankings",
    "limit": 100
  }
}
```

**Page-level SEO performance:**
```json
{
  "tracking_id": "abc123",
  "materials": [{"name": "gsc"}],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "page_seo": {
      "from": ["gsc"],
      "keep": [
        "gsc.url",
        "gsc.title",
        "gsc.keyword",
        "gsc.clicks_sum"
      ]
    }
  },
  "result": {
    "use": "page_seo",
    "limit": 200
  }
}
```

---

## Data Types Reference

| Type | Range | Description | Example |
|------|-------|-------------|---------|
| `uint8` | 0-255 | Small integer | goal flags |
| `uint16` | 0-65,535 | Medium integer | browse_sec, speed_msec |
| `uint32` | 0-4,294,967,295 | Large integer | version_id |
| `uint64` | 0-18+ quintillion | Very large integer | pv_id, reader_id |
| `int` | -2B to +2B | Signed integer | page_id, search_type |
| `int64` | Very large range | Large signed integer | access_time (timestamp) |
| `float` | Decimal | Floating point number | ctr, position_wavg |
| `string` | Variable | Text data | url, title, keyword |
| `bool` | true/false | Boolean flag | is_newuser, is_last |

---

## Using Indexed Columns

Columns marked "Indexed: ✓" support faster queries in future versions when filtering becomes available.

**Currently indexed columns:**

**allpv:**
- `pv_id` - Unique identifier
- `reader_id` - Visitor tracking
- `page_id` - Page reference
- `tracking_domain` - Site filtering
- `url` - Page URL (partial)
- `os` - Operating system
- `browser` - Browser type
- `language` - User language
- `country` - Geographic data
- `access_time` - Time-based queries

**Note:** While indexing exists in the database, this version doesn't support filtering yet. Indexes will be utilized when the `filter` feature is added in future versions.

---

## Future Enhancements

Planned for future versions:

**Additional Materials:**
- `clicks` - Click event data
- `ec` - E-commerce transactions
- `inner_search` - Internal site search
- `page_detail` - Extended page information

**Enhanced Columns:**
- Behavioral metrics (scroll depth, dwell time)
- Page type classification
- Enhanced UTM tracking
- Custom dimensions

---

## Tips & Best Practices

### 1. Start with Essential Columns

Don't request all columns at once. Start with what you need:

```json
// ✅ Good - only necessary columns
{
  "keep": ["allpv.url", "allpv.title"]
}

// ❌ Excessive - too many columns
{
  "keep": [
    "allpv.pv_id", "allpv.session_id", "allpv.reader_id",
    "allpv.page_id", "allpv.url", "allpv.title",
    // ... 20 more columns
  ]
}
```

### 2. Use count_only to Check Data Volume

Before fetching large datasets:

```json
{
  "result": {
    "use": "my_view",
    "count_only": true
  }
}
```

### 3. Verify Column Names

Check available columns using the materials endpoint:

```bash
curl -u "user:pass" \
  "https://your-site.com/wp-json/qa-platform/materials?version=2025-10-20"
```

### 4. Understand Data Types

Choose appropriate columns for your analysis:
- Use `pv_id` or `session_id` for counting
- Use `access_time` for time-series analysis
- Use `url` or `title` for content analysis
- Use `device_type`/`os`/`browser` for device analysis

### 5. Plan for Future Joins

Even though joins aren't supported yet, keep in mind:
- `page_id` links allpv and gsc
- `reader_id` tracks visitors across sessions
- These will be useful when join functionality is added

---

## Common Use Cases

### Use Case 1: Traffic Overview

Get basic traffic information:

```json
{
  "keep": [
    "allpv.url",
    "allpv.title",
    "allpv.access_time",
    "allpv.device_type"
  ]
}
```

### Use Case 2: SEO Analysis

Analyze search performance:

```json
{
  "keep": [
    "gsc.keyword",
    "gsc.url",
    "gsc.clicks_sum",
    "gsc.position_wavg"
  ]
}
```

### Use Case 3: Campaign Tracking

Track UTM campaigns:

```json
{
  "keep": [
    "allpv.url",
    "allpv.utm_source",
    "allpv.utm_medium",
    "allpv.utm_campaign",
    "allpv.access_time"
  ]
}
```

### Use Case 4: Device Analysis

Analyze device usage:

```json
{
  "keep": [
    "allpv.device_type",
    "allpv.os",
    "allpv.browser",
    "allpv.url"
  ]
}
```

---

## Next Steps

- **[QAL Guide](./qal.md)** - Learn how to query these materials
- **[Endpoints](./endpoints.md)** - API endpoint reference
- **[Getting Started](./index.md)** - Return to overview
