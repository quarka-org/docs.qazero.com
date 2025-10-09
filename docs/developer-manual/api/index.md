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
GET /qa-platform/guide?version=2025-10-20
```

### Default Behavior (QA ZERO)

If the `version` parameter is omitted, QA ZERO uses the **oldest stable version** for maximum reliability and backward compatibility. This ensures existing integrations continue to work even when new versions are released.

**Example:**
```
GET /qa-platform/query
# Uses the oldest stable version (currently 2025-10-20)
```

**Why oldest version?** QA ZERO acts as a reliable data warehouse for system integrations, prioritizing stability over new features.

---

## Available Versions

### 2025-10-20 (Current)

**Status:** ✅ Released  
**Plugin Version Required:** 3.0.0.0+  
**Support Until:** 2027-10-20 (minimum)

**Features:**
- Basic QAL queries with `from` and `keep`
- Two materials: `allpv` (page views) and `gsc` (Google Search Console)
- Simple result options: `limit` and `count_only`

**Documentation:** [Version 2025-10-20 →](./2025-10-20/)

**Best For:**
- Getting started with QA ZERO API
- Simple page view queries
- SEO keyword analysis
- Learning QAL basics
QR
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
  "https://your-site.com/wp-json/qa-platform/guide?version=2025-10-20"
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
  "https://your-site.com/wp-json/qa-platform/query?version=2025-10-20"
```

---

## Version Comparison

| Feature | 2025-10-20 |
|---------|------------|
| **Materials** | `allpv`, `gsc` |
| **QAL - make** | `from`, `keep` only |
| **QAL - filter** | ❌ Not supported |
| **QAL - join** | ❌ Not supported |
| **QAL - calc** | ❌ Not supported |
| **Result options** | `limit`, `count_only` |
| **Return formats** | JSON only |

---

## Migration Guide

### When New Versions are Released

When a new version is released, your existing queries continue to work:

1. **Existing queries**: Keep using `?version=2025-10-20`
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
