---
id: api-compatibility
title: API Compatibility
sidebar_position: 2
last_updated: 2026-05-11
---

# API Version Compatibility

## Quick Version Check

Not sure which version you have? Check in:
**WordPress Admin → Plugins → QA Platform**

Or call the `/guide` endpoint to see your `plugin_version`.

---

## Compatibility Matrix

| Plugin Version | Compatible API Versions | Status | Notes |
|----------------|------------------------|--------|-------|
| **3.0.0.0+** | 2026-05-11, 2025-10-20 | ✅ Current | Both versions ship in the same plugin; pick via `?version=` |
| 2.x.x.x | - | ❌ Unsupported | API not available |

---

## Version 2026-05-11

**Minimum Plugin Version:** `3.0.0.0`
**Released:** 2026-05-11
**Status:** Current Release

### What changed vs. 2025-10-20

- **Breaking:** `calc` `material.column` references on the `join.with` side now trigger fetch + preserve, matching the `from`-side behavior. Aggregates like `COUNT(click_event.pv_id)` that previously returned 0 when `click_event` was the join target now return correct counts.
- **New error:** `E_CALC_COLUMN_UNRESOLVED` — `calc` expressions referencing a material outside the view's scope, or a column that does not exist in the material's schema, now fail at validation instead of silently producing 0 rows.
- **New error details:** `E_INVALID_JOIN` responses include `details.side`, `details.received_value`, `details.expected_prefix`, and `details.hint` so AI repair loops can fix the offending side without guessing.
- **New feature flag:** `features_detail.calc_join_symmetric` (since `2026-05-11`).

Existing client code that does **not** rely on join-side `calc` reads
identically against both versions. No migration is required for those
clients — pin `?version=2026-05-11` when you want the new behavior.

---

## Version 2025-10-20

**Minimum Plugin Version:** `3.0.0.0`
**Released:** 2025-10-20
**Status:** Previous (still supported)

### Plugin Requirements

| Feature | Min Plugin Version | Notes |
|---------|-------------------|-------|
| **Core API** | 3.0.0.0 | Base functionality |
| tracking_id parameter | 3.0.0.0 | Required for all queries |
| /guide endpoint (full) | 3.0.0.0 | Server info, sites, materials, goals |
| /query endpoint | 3.0.0.0 | QAL query execution |

### Material Support

| Material | Min Plugin Version | Feature Set |
|----------|-------------------|-------------|
| **allpv** | 3.0.0.0 | Full column set |
| **gsc** | 3.0.0.0 | Full column set |

---

## Checking Your Plugin Version

### Method 1: WordPress Admin
1. Go to **Plugins** page
2. Find **QA Platform**
3. Version shown below plugin name

### Method 2: API Call

```bash
curl -u "username:password" \
  "https://your-site.com/wp-json/qa-platform/guide?version=2026-05-11"
```

Response includes:
```json
{
  "version": "2026-05-11",
  "plugin_version": "3.0.0.0",
  ...
}
```

---

## Feature Availability by Plugin Version

### Plugin 3.0.0.0

**New in This Version:**
- ✅ REST API support (2025-10-20)
- ✅ Multi-site tracking with tracking_id
- ✅ Enhanced /guide endpoint
- ✅ QAL query language
- ✅ Materials: allpv, gsc

**Field Changes:**
- 🔄 `country` → `country_code` (ISO 3166-1 alpha-2)
- ❌ Removed: `session_id`, `tracking_domain`, `path_prefix`, `utm_content`, `utm_term`, `version_id`
- ❌ Removed: All goal fields (is_goal_0 through is_goal_10, is_submit)

---

## Migration Guide

### From Pre-API Versions (< 3.0)

If you're upgrading from earlier plugin versions:

1. **Update Plugin**: Upgrade to 3.0.0.0+
2. **Get tracking_id**: Call `/guide` endpoint
3. **Update Integrations**: Add `tracking_id` to all queries
4. **Field Changes**: Update `country` to `country_code`
5. **Test**: Verify queries work with new API

**Breaking Changes:**
- API endpoints did not exist before 3.0.0.0
- If you had custom integrations, they need complete rewrite

---

## Future Versions

### Planned Features (Future Plugin Versions)

Features currently under consideration:

- Advanced filtering (`filter` in QAL)
- Material joins (`join` in QAL)
- Aggregations (`calc` in QAL)
- Additional materials (clicks, ec, inner_search)
- CSV/Parquet export formats

*Release dates and versions TBD*

---

## Support Policy

### Long-Term Support

- **Minimum Support Period**: 24 months from release
- **API Version 2025-10-20**: Supported until at least 2027-10-20

### Plugin Version Support

- **Latest Version**: Full support
- **One Version Back**: Security updates only
- **Older Versions**: No support

**Current Support Status:**
- 3.0.0.0: ✅ Full support

---

## Troubleshooting

### "Unknown tracking_id" Error

**Cause:** Plugin version < 3.0.0.0  
**Solution:** Upgrade to 3.0.0.0+

### "Endpoint not found" Error

**Cause:** Plugin version < 3.0.0.0  
**Solution:** Upgrade to 3.0.0.0+

### Missing Materials or Fields

**Cause:** Plugin version too old  
**Solution:** Check compatibility matrix above and upgrade

---

## Getting Help

- **Documentation**: [Version 2025-10-20](./2025-10-20/)
- **Plugin Updates**: Check WordPress plugin repository
- **Support**: Contact your system administrator

---

## Version History

| Plugin Version | API Versions | Release Date | Status |
|----------------|--------------|--------------|---------|
| 3.0.0.0 | 2026-05-11, 2025-10-20 | 2026-05-11 (latest version bump) | Current |
| 3.0.0.0 | 2025-10-20 | 2025-10-20 | Initial release |

---

## Next Steps

- **[Getting Started with 2025-10-20](./2025-10-20/)** - Start using the API
- **[Version Management](./VERSION_MANAGEMENT.md)** - How we version the API
