---
id: qal-2025-10-20
title: QAL Guide
sidebar_position: 3
last_updated: 2025-10-06
---

# QAL Guide (2025-10-20)

## Overview

This version of QAL (Query Abstraction Language) provides a **simplified subset** focused on basic data extraction. It's designed to be easy to learn and use while maintaining clarity and safety.

**Version:** 2025-10-20

### What's Supported

✅ **Basic extraction** - Select specific columns from materials  
✅ **Time filtering** - Filter by date/time range  
✅ **Simple results** - Return data or count  

❌ **Not yet available:**
- Row filtering (`filter`)
- Joining materials (`join`)
- Aggregations (`calc`)
- Sorting (`sort`)
- Sampling

---

## Document Structure

Every QAL query has four required sections:

```json
{
  "tracking_id": "abc123",
  "materials": [ /* data sources */ ],
  "time": { /* time range */ },
  "make": { /* view definitions */ },
  "result": { /* result specification */ }
}
```

**Note:** Version is specified in the URL query parameter (`?version=2025-10-20`), not in the QAL query body.

---

## 1. tracking_id (required)

Specify which tracking site to query. Use the `tracking_id` from the `/guide` endpoint response.

```json
{
  "tracking_id": "abc123"
}
```

**Rules:**
- Must match a `tracking_id` from `/guide` response
- Determines which site's data to query
- Each site may have different available materials
- Use `/guide` endpoint to discover available tracking IDs

**Example:**
```json
{"tracking_id": "abc123"}  // ✅ Valid site ID
{"tracking_id": "def456"}  // ✅ Another site
{"tracking_id": "invalid"} // ❌ Unknown site
```

**Finding Your tracking_id:**
```bash
curl -u "user:pass" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
```

Look for `sites[].tracking_id` in the response.

---

## 2. materials (required)

List the materials (data sources) you want to use.

### Format

```json
{
  "materials": [
    { "name": "allpv" }
  ]
}
```

### Available Materials

- `allpv` - Page view data
- `gsc` - Google Search Console data

### Rules

- Each material must have a `name` property
- Name must be exact (case-sensitive)
- ❌ No `as` (aliasing) allowed
- Can declare multiple materials (even if using only one)

### Examples

**Single material:**
```json
{
  "materials": [
    { "name": "allpv" }
  ]
}
```

**Multiple materials (for future use):**
```json
{
  "materials": [
    { "name": "allpv" },
    { "name": "gsc" }
  ]
}
```

---

## 3. time (required)

Define the time range for your query.

### Format

```json
{
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  }
}
```

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `start` | string | Yes | Start time (ISO 8601) |
| `end` | string | Yes | End time (ISO 8601) |
| `tz` | string | Yes | IANA timezone |

### Time Format

Use ISO 8601 local time format:
```
YYYY-MM-DDTHH:mm:ss
```

**Examples:**
- `2025-10-01T00:00:00` - October 1, 2025 at midnight
- `2025-10-20T23:59:59` - October 20, 2025 at 11:59:59 PM

### Timezones

Common timezone values:
- `Asia/Tokyo` - Japan
- `America/New_York` - US Eastern
- `America/Los_Angeles` - US Pacific
- `Europe/London` - UK
- `UTC` - Coordinated Universal Time

Full list: [IANA Timezone Database](https://www.iana.org/time-zones)

### Time Range Interpretation

- **Inclusive start:** Data from `start` time is included
- **Exclusive end:** Data from `end` time is excluded
- Think of it as: `[start, end)`

**Example:**
```json
{
  "start": "2025-10-01T00:00:00",
  "end": "2025-10-02T00:00:00"
}
```
Returns all data from October 1st, but nothing from October 2nd.

---

## 4. make (required)

Define views to transform your data.

### Format

```json
{
  "make": {
    "view_name": {
      "from": ["material_name"],
      "keep": ["material.column1", "material.column2"]
    }
  }
}
```

### View Name

The key in `make` is your view name:
- Can be any valid string
- Use descriptive names (e.g., `recent_pvs`, `mobile_data`)
- Will be referenced in `result.use`

### from (required)

Specify which material to use.

**Format:**
```json
{
  "from": ["allpv"]
}
```

**Rules:**
- Must be an array with **exactly one element**
- Element must match a material declared in `materials`
- In this version, can only reference materials (not other views)

**Examples:**
```json
{"from": ["allpv"]}    // ✅ Correct
{"from": ["gsc"]}      // ✅ Correct
{"from": ["allpv", "gsc"]}  // ❌ Wrong - only one allowed
{"from": "allpv"}      // ❌ Wrong - must be array
```

### keep (required)

List the columns you want in your result.

**Format:**
```json
{
  "keep": [
    "allpv.url",
    "allpv.title",
    "allpv.access_time"
  ]
}
```

**Rules:**
- Must use **fully qualified names**: `material.column`
- At least one column required
- Order in `keep` determines column order in results
- Unknown columns will cause an error

**Examples:**

```json
// ✅ Correct
{
  "keep": [
    "allpv.url",
    "allpv.title"
  ]
}

// ❌ Wrong - not qualified
{
  "keep": ["url", "title"]
}

// ❌ Wrong - wrong material name
{
  "keep": ["wrong.url"]
}
```

### Complete make Example

```json
{
  "make": {
    "page_views": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.title",
        "allpv.device_type",
        "allpv.access_time"
      ]
    }
  }
}
```

---

## 5. result (required)

Specify which view to return and how.

### Format

```json
{
  "result": {
    "use": "view_name",
    "limit": 100,
    "count_only": false
  }
}
```

### use (required)

Name of the view (from `make`) to return.

```json
{
  "use": "page_views"
}
```

**Rules:**
- Must match a view name defined in `make`
- Only ONE view can be returned

### limit (optional)

Maximum number of rows to return.

```json
{
  "limit": 100
}
```

**Rules:**
- Default: `100`
- Maximum: `5000`
- Values above 5000 will be capped at 5000

**Examples:**
```json
{"limit": 10}     // Return up to 10 rows
{"limit": 1000}   // Return up to 1000 rows
{"limit": 5000}   // Maximum allowed
```

### count_only (optional)

Return only the count instead of data.

```json
{
  "count_only": true
}
```

**Rules:**
- Default: `false`
- When `true`, returns only `{count: N}`
- When `false`, returns full data array

**Examples:**

```json
// Get data
{
  "use": "page_views",
  "limit": 100,
  "count_only": false
}
// Returns: {"data": [...], "meta": {...}}

// Get count only
{
  "use": "page_views",
  "count_only": true
}
// Returns: {"count": 12456}
```

---

## Complete Examples

### Example 1: Basic Page View Query

Get the most recent 10 page views with URL and title:

```json
{
  "materials": [
    { "name": "allpv" }
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "recent_views": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.title",
        "allpv.access_time"
      ]
    }
  },
  "result": {
    "use": "recent_views",
    "limit": 10
  }
}
```

### Example 2: Device and Browser Info

Get device and browser information:

```json
{
  "materials": [
    { "name": "allpv" }
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "device_info": {
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
    "use": "device_info",
    "limit": 100
  }
}
```

### Example 3: Count Total Page Views

Get the count without retrieving data:

```json
{
  "materials": [
    { "name": "allpv" }
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
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
```

**Response:**
```json
{
  "count": 15234
}
```

### Example 4: UTM Campaign Data

Get UTM campaign information:

```json
{
  "materials": [
    { "name": "allpv" }
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "campaign_data": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.utm_source",
        "allpv.utm_medium",
        "allpv.utm_campaign"
      ]
    }
  },
  "result": {
    "use": "campaign_data",
    "limit": 200
  }
}
```

### Example 5: GSC Keywords

Get Google Search Console keywords:

```json
{
  "materials": [
    { "name": "gsc" }
  ],
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
        "gsc.url",
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
```

### Example 6: New vs Returning Visitors

Get new user flag information:

```json
{
  "materials": [
    { "name": "allpv" }
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "visitor_type": {
      "from": ["allpv"],
      "keep": [
        "allpv.reader_id",
        "allpv.is_newuser",
        "allpv.access_time"
      ]
    }
  },
  "result": {
    "use": "visitor_type",
    "limit": 500
  }
}
```

---

## Error Codes

Common errors you might encounter:

| Error Code | Cause | Solution |
|------------|-------|----------|
| `E_UNKNOWN_TRACKING_ID` | Invalid tracking_id | Use tracking_id from /guide endpoint |
| `E_TIME_REQUIRED` | Missing time fields | Add start, end, and tz |
| `E_UNKNOWN_MATERIAL` | Invalid material name | Use "allpv" or "gsc" |
| `E_UNKNOWN_COLUMN` | Invalid column name | Check materials reference |
| `E_UNKNOWN_VIEW` | result.use references non-existent view | Match view name in make |
| `E_FEATURE_NOT_SUPPORTED` | Used unsupported feature | Remove filter/join/calc |

---

## Common Patterns

### Pattern 1: Check Data Volume First

```json
// Step 1: Count how many rows
{
  "result": {
    "use": "my_view",
    "count_only": true
  }
}

// Step 2: If count is reasonable, get the data
{
  "result": {
    "use": "my_view",
    "limit": 1000
  }
}
```

### Pattern 2: Incremental Limits

Start small, then increase:

```json
// Test with 10
{"limit": 10}

// If okay, try 100
{"limit": 100}

// If okay, get more
{"limit": 1000}
```

### Pattern 3: All Available Columns

To see all data available:

```json
{
  "keep": [
    "allpv.pv_id",
    "allpv.session_id",
    "allpv.reader_id",
    "allpv.page_id",
    "allpv.url",
    "allpv.title",
    "allpv.device_type",
    "allpv.os",
    "allpv.browser",
    "allpv.access_time",
    "allpv.utm_source",
    "allpv.utm_medium",
    "allpv.utm_campaign"
    // ... add more as needed
  ]
}
```

---

## Tips & Best Practices

### 1. Start Simple

Begin with a minimal query:
```json
{
  "keep": ["allpv.url"]
}
```

Then add more columns as needed.

### 2. Use Descriptive View Names

```json
// ✅ Good
{"blog_posts": {...}}
{"mobile_users": {...}}

// ❌ Not helpful
{"view1": {...}}
{"data": {...}}
```

### 3. Test with Small Limits

Always test with `limit: 10` first:
```json
{
  "result": {
    "use": "my_view",
    "limit": 10
  }
}
```

### 4. Check Column Names

Use `/materials` endpoint to verify column names before querying:
```bash
curl -u "user:pass" \
  "https://your-site.com/wp-json/qa-platform/materials?version=2025-10-20"
```

### 5. Use count_only for Planning

Before fetching large datasets:
```json
{
  "result": {
    "use": "my_view",
    "count_only": true
  }
}
```

---

## What's Coming in Future Versions

Planned features for future releases:

- **filter** - Row-level filtering (e.g., only mobile devices)
- **join** - Combine multiple materials
- **calc** - Aggregations (COUNT, SUM, AVERAGE, etc.)
- **sort** - Sort results by column
- **CSV/Parquet export** - Alternative output formats
- **More materials** - Additional data sources

---

## Comparison with Full QAL

This version implements a **minimal subset** of QAL:

| Feature | 2025-10-20 | Future Versions |
|---------|------------|-----------------|
| materials | ✅ Supported | ✅ |
| time | ✅ Supported | ✅ |
| make.from | ✅ Supported | ✅ |
| make.keep | ✅ Supported | ✅ |
| make.filter | ❌ Not yet | ✅ Planned |
| make.join | ❌ Not yet | ✅ Planned |
| make.calc | ❌ Not yet | ✅ Planned |
| result.use | ✅ Supported | ✅ |
| result.limit | ✅ Supported | ✅ |
| result.count_only | ✅ Supported | ✅ |
| result.sort | ❌ Not yet | ✅ Planned |
| result.return (CSV) | ❌ Not yet | ✅ Planned |

---

## Next Steps

- **[Materials Reference](./materials.md)** - See all available columns
- **[Endpoints](./endpoints.md)** - API endpoint details
- **[Getting Started](./index.md)** - Return to overview
