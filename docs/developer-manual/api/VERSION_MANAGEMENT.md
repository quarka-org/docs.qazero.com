# API Documentation Version Management

## Version Format

**API Version:** `YYYY-MM-DD` (Calendar versioning)  
**Documentation Version:** `MAJOR.MINOR.PATCH` (Semantic versioning)

## Update Process

### 1. When Making Documentation Changes

Update the `last_updated` field in the frontmatter of modified files:

```yaml
---
id: getting-started-2025-10-20
title: Getting Started
sidebar_position: 1
last_updated: 2025-10-06  # ← Update this date
---
```

### 2. Update Changelog

Add entries to the Changelog section in `index.md`:

```markdown
### YYYY-MM-DD - Documentation vX.Y.Z
**Added:**
- ✅ New feature description

**Removed:**
- ❌ Deprecated feature

**Changed:**
- 🔄 Modified feature
```

### 3. Documentation Version Bumping

Follow semantic versioning for documentation:

- **MAJOR (1.0.0 → 2.0.0)**: Breaking changes in documentation structure
- **MINOR (1.0.0 → 1.1.0)**: New content added (new sections, endpoints, features)
- **PATCH (1.0.0 → 1.0.1)**: Fixes, clarifications, typo corrections

## Current Versions

| API Version | Doc Version | Status | Released | Support Until |
|-------------|-------------|--------|----------|---------------|
| 2025-10-20 | 1.0.0 | Current | 2025-10-20 | 2027-10-20 |

## Files with Version Info

### Frontmatter (Machine-readable)
All `.md` files in `/developer/api/2025-10-20/` contain:
```yaml
last_updated: YYYY-MM-DD
```

### Changelog (Human-readable)
- `/developer/api/2025-10-20/index.md` - Contains full changelog

### Configuration
- `docusaurus.config.js` - Enables `showLastUpdateTime: true`

## Cache Busting

### How It Works

1. **Frontmatter `last_updated`**: 
   - Docusaurus reads this field
   - Generates new build with updated timestamps
   - CDN/browser cache keys change automatically

2. **Info Box**:
   - Visible version info at top of Getting Started page
   - Shows both API and Documentation versions

3. **Changelog Section**:
   - Detailed change history
   - Helps users understand what changed

### For CDN/Cache Systems

The `last_updated` field in frontmatter affects:
- Build output filenames (Docusaurus hash)
- Metadata sent to clients
- CDN cache invalidation triggers

## Example Update Flow

```bash
# 1. Make documentation changes
vim developer/api/2025-10-20/endpoints.md

# 2. Update frontmatter
# Change: last_updated: 2025-10-06

# 3. Update changelog in index.md
# Add entry under "### 2025-10-06 - Documentation v1.0.1"

# 4. Rebuild
npm run build

# 5. Deploy
# New hashed files automatically bust cache
```

## Best Practices

1. **Always update `last_updated`** when modifying content
2. **Use consistent date format**: `YYYY-MM-DD`
3. **Keep changelog detailed** but concise
4. **Group related changes** under single date entry
5. **Use emoji markers**: ✅ Added, ❌ Removed, 🔄 Changed

## Monitoring Updates

Users can:
- Check **Version Information** box at top of Getting Started
- Review **Changelog** section for details
- See **"Last updated"** timestamp at bottom of each page (Docusaurus feature)

Systems can:
- Parse `last_updated` from frontmatter
- Monitor file hashes in build output
- Track version numbers in Info box
