---
id: api-overview
title: QA  ZERO API
sidebar_position: 1
---

# QA ZERO API

## Overview

The QA ZERO REST API enables programmatic access to QA ZERO analytics data. Query your page view data, search console metrics, and behavioral analytics using a simple, structured query language (QAL).

**Base URL:**
```
/wp-json/qa-platform/
```

**Available Endpoints:**
- `/qa-platform/guide` - Retrieve API documentation and server information
- `/qa-platform/query` - Execute QAL queries

---

## Why QA ZERO API?

- **Simple & Structured**: QAL provides a clear, unambiguous way to query analytics data
- **WordPress Native**: Uses WordPress REST API and Application Passwords
- **Column-Oriented**: Fast queries on large datasets
- **AI-Friendly**: Designed for easy integration with AI tools and MCP servers

---

## Versioning Strategy

QA ZERO uses **calendar-based versioning** instead of traditional v1, v2 numbering.

### Why Calendar Versioning?

Following GitHub's approach, we use dates (YYYY-MM-DD) to represent natural API evolution:

- **Clear Timeline**: Easy to understand when features were introduced
- **Non-Linear Evolution**: Breaking changes don't force a complete version bump
- **Long-Term Support**: Each version maintained for minimum 24 months
- **Natural Naming**: No confusion about v1 vs v2 vs v3

### How to Specify Version

Add the `version` query parameter to any endpoint:

```
GET /qa-platform/guide?version=2026-05-11
```

### Default Behavior (QA ZERO)

If the `version` parameter is omitted, QA ZERO uses the **oldest stable version** for maximum reliability and backward compatibility. This ensures existing integrations continue to work even when new versions are released.

**Example:**
```
GET /qa-platform/query
# Uses the oldest stable version (currently 2025-10-20).
# Pin ?version=2026-05-11 explicitly to opt into the current release.
```

**Why oldest version?** QA ZERO acts as a reliable data warehouse for system integrations, prioritizing stability over new features.

---

## Available Versions

### 2026-05-11 (Current)

**Status:** ✅ Released
**Plugin Version Required:** 3.0.0.0+
**Support Until:** 2028-05-11 (minimum)

**What's new (breaking change vs. 2025-10-20):**
- Symmetric `calc` column declaration — a `material.column` reference inside a `calc` expression triggers fetch + preserve on **both** `from` and `join.with` sides. Eliminates the silent-zero bug that previously affected join-side `calc`.
- New validator error `E_CALC_COLUMN_UNRESOLVED` rejects bad `calc` references at validation time instead of silently producing 0 rows.
- `E_INVALID_JOIN` now returns structured `details` (`side`, `received_value`, `expected_prefix`, `hint`) and enforces pinpoint scope rules on `on.left` / `on.right`.

**Documentation:** [Version 2026-05-11 →](./2026-05-11/)

**Best For:**
- New integrations and any client composing queries with join-side `calc` references.
- AI-driven clients that need clean validation signals for repair loops.

---

### 2025-10-20 (Previous, Supported)

**Status:** ⚠️ Stable (still supported)
**Plugin Version Required:** 3.0.0.0+
**Support Until:** 2027-10-20 (minimum)

**Features:**
- Basic QAL queries with `from` and `keep`
- Two materials: `allpv` (page views) and `gsc` (Google Search Console)
- Simple result options: `limit` and `count_only`

**Documentation:** [Version 2025-10-20 →](./2025-10-20/)

**Best For:**
- Existing integrations that do not need symmetric join-side `calc`.
- Keep using until migration to `2026-05-11` is convenient — no forced upgrade.

---

## Quick Start

### 1. Set Up Authentication

Create an Application Password in WordPress:

1. Go to **Users → Your Profile**
2. Scroll to **Application Passwords**
3. Enter name: "QA API Access"
4. Click **Add New Application Password**
5. Copy the generated password

### 2. Test the Connection

```bash
curl -u "username:your_app_password" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2026-05-11"
```

### 3. Run Your First Query

```bash
curl -X POST \
  -u "username:your_app_password" \
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
      "my_view": {
        "from": ["allpv"],
        "keep": ["allpv.url", "allpv.title"]
      }
    },
    "result": {
      "use": "my_view",
      "limit": 10
    }
  }' \
  "https://your-site.com/wp-json/qa-platform/query?version=2026-05-11"
```

---

## Version Comparison

| Feature                                          | 2025-10-20                       | 2026-05-11                                        |
|--------------------------------------------------|----------------------------------|---------------------------------------------------|
| **QAL — `filter` / `join` / `calc` / `sort`**    | ✅ Supported                     | ✅ Supported (unchanged)                          |
| **`calc` — `material.column` on `from` side**    | ✅ Auto-fetched and aggregated   | ✅ Auto-fetched and aggregated (unchanged)        |
| **`calc` — `material.column` on `join.with` side** | ⚠️ Silent zero-row bug         | ✅ Symmetric with `from` side, returns correct counts |
| **Bad `calc` reference**                         | ⚠️ Silently returns 0 rows      | ✅ Rejected at validation (`E_CALC_COLUMN_UNRESOLVED`) |
| **`E_INVALID_JOIN` error shape**                 | `code` + `message` + `at`        | + `details.{side, received_value, expected_prefix, hint}` |
| **`features_detail.calc_join_symmetric`**        | absent                           | `{ enabled: true, since: "2026-05-11" }`          |

---

## Migration Guide

### When New Versions are Released

When a new version is released, your existing queries continue to work:

1. **Existing queries**: Keep using `?version=2026-05-11`
2. **New features**: Test with new version parameter
3. **Gradual migration**: Update queries one at a time
4. **No forced upgrades**: Old versions supported for 24+ months

### Breaking Changes Policy

Breaking changes only happen with new version dates:

- **Breaking change**: New version required (e.g., 2026-03-01)
- **New feature**: Same version, backward compatible
- **Bug fix**: Same version, no change needed
- **Documentation**: Version number unchanged

---

## Getting Help

- **Documentation**: [Version 2025-10-20](./2025-10-20/)
- **Support**: https://support.claude.com
- **Repository**: https://github.com/quarka-org/docs.qazero.com

---

## Next Steps

👉 **[Get Started with Version 2025-10-20](./2025-10-20/)** - Complete API documentation

**What you'll learn:**
- Authentication setup
- Available materials (allpv, gsc)
- QAL query basics
- Endpoint reference
- Code examples in multiple languages
