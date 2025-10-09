# Documentation Update Guide for Version Releases

**Quick reference for maintaining API documentation when releasing new versions**

---

## 📋 Update Checklist

When releasing a new API version or plugin version, follow this checklist:

### ☑️ Plugin Version Update (e.g., 3.0.0.0 → 3.1.0.0)

**If only adding backward-compatible features:**

1. **compatibility.md** - Update matrix
2. **materials.md** - Add new features section (if applicable)
3. **Changelog** - Document what's new

**If breaking changes exist:**

→ Create new API version directory (see "New API Version" below)

---

### ☑️ New API Version (e.g., 2025-10-20 → 2026-03-01)

**Create new version:**

1. **Copy directory**: `cp -r 2025-10-20/ 2026-03-01/`
2. **Update 5 files** in new directory (details below)
3. **Update 2 top-level files** (compatibility.md, index.md)

---

## 🔧 File-by-File Update Guide

### 1. `/developer/api/2026-03-01/index.md`

**Update 3 sections:**

#### A. Frontmatter
```yaml
---
id: getting-started-2026-03-01          # ← Change date
last_updated: 2026-03-01                # ← Update date
---
```

#### B. Version Info Box
```markdown
:::info Version Information
**API Version:** 2026-03-01             # ← Change date
**Plugin Version Required:** 3.1.0.0+   # ← Update if changed
**Last Updated:** 2026-03-01            # ← Update date
**Documentation Version:** 1.0.0        # ← Reset to 1.0.0
:::
```

#### C. Changelog
```markdown
## Changelog

### 2026-03-01 - Initial Release      # ← Add new entry
**Added:**
- ✅ New feature description

**Changed:**
- 🔄 Modified feature

**Removed:**
- ❌ Deprecated feature

### [Keep previous version entries below]
```

---

### 2. `/developer/api/2026-03-01/endpoints.md`

**Update 2 places:**

#### A. Frontmatter
```yaml
---
id: endpoints-2026-03-01               # ← Change date
last_updated: 2026-03-01               # ← Update date
---
```

#### B. Title
```markdown
# API Endpoints Reference (2026-03-01)  # ← Change date
```

#### C. Response examples (if changed)
Update `/guide` response example if plugin_version changed:
```json
{
  "version": "2026-03-01",              # ← Update
  "plugin_version": "3.1.0.0",          # ← Update if changed
  ...
}
```

---

### 3. `/developer/api/2026-03-01/materials.md`

**Update 4 places:**

#### A. Frontmatter
```yaml
---
id: materials-2026-03-01               # ← Change date
last_updated: 2026-03-01               # ← Update date
---
```

#### B. Title
```markdown
# Materials Reference (2026-03-01)     # ← Change date
```

#### C. Plugin Version Alert
```markdown
:::caution Plugin Version Required
**Minimum Plugin Version:** 3.1.0.0+   # ← Update if changed
:::
```

#### D. Add New Features Section (if applicable)
```markdown
### Field Changes in Plugin 3.1.0.0

**Added Fields:**
- ✅ `depth_read` - Scroll depth tracking
- ✅ `scroll_rate` - Scroll speed

**Removed Fields:**
- ❌ `old_field` - Deprecated field
```

OR use section-based approach:
```markdown
### Behavioral Metrics (Plugin 3.1.0.0+)

| Column | Type | Description | Indexed |
|--------|------|-------------|---------|
| depth_read | float | Read depth (0.0-1.0) | - |
| scroll_rate | float | Scroll rate | - |
```

---

### 4. `/developer/api/2026-03-01/qal.md`

**Update 2 places:**

#### A. Frontmatter
```yaml
---
id: qal-2026-03-01                    # ← Change date
last_updated: 2026-03-01              # ← Update date
---
```

#### B. Title and Overview
```markdown
# QAL Guide (2026-03-01)              # ← Change date

**Version:** 2026-03-01               # ← Change date
```

---

### 5. `/developer/api/compatibility.md`

**Add new version entry:**

```markdown
## Compatibility Matrix

| Plugin Version | Compatible API Versions | Status | Notes |
|----------------|------------------------|--------|-------|
| **3.1.0.0+** | 2026-03-01, 2025-10-20 | ✅ Current | New features |  # ← NEW
| **3.0.0.0** | 2025-10-20 | ⚠️ Stable | Still supported |              # ← UPDATE

---

## Version 2026-03-01                                                         # ← NEW SECTION

**Minimum Plugin Version:** 3.1.0.0
**Released:** 2026-03-01
**Status:** Current Release

### Plugin Requirements
[List requirements]

### Material Support
[List materials]
```

---

### 6. `/developer/api/index.md`

**Update Available Versions section:**

```markdown
## Available Versions

### 2026-03-01 (Current)                    # ← NEW

**Status:** ✅ Released  
**Plugin Version Required:** 3.1.0.0+
**Support Until:** 2028-03-01 (minimum)

**Features:**
- [List new features]

**Documentation:** [Version 2026-03-01 →](./2026-03-01/)

---

### 2025-10-20 (Previous)                   # ← UPDATE STATUS

**Status:** ⚠️ Stable (Still Supported)
**Plugin Version Required:** 3.0.0.0+
**Support Until:** 2027-10-20 (minimum)
```

---

## ⏱️ Time Estimates

| Task | Time Required |
|------|---------------|
| Copy and rename files | 5 minutes |
| Update frontmatter (4 files) | 5 minutes |
| Update version numbers | 10 minutes |
| Update compatibility.md | 15 minutes |
| Write changelog | 10 minutes |
| Add new features documentation | 20-60 minutes |
| Review and test | 15 minutes |
| **Total** | **1-2 hours** |

---

## 📝 Common Scenarios

### Scenario 1: Minor Plugin Update (3.0.0.0 → 3.0.1.0)
**No API changes, just bug fixes**

→ **No documentation update needed**

---

### Scenario 2: Plugin Feature Addition (3.0.0.0 → 3.1.0.0)
**New fields added to existing material**

**Update:**
1. compatibility.md - Add 3.1.0.0 entry
2. materials.md - Add "New in 3.1.0.0" section
3. Changelog in index.md

**DON'T create new API version**

---

### Scenario 3: Breaking Change (3.0.0.0 → 4.0.0.0)
**Field removed or behavior changed**

**Must create new API version:**
1. Create 2026-03-01/ directory
2. Update all 6 files above
3. Mark old version as "Previous" in main index.md

---

## ✅ Pre-Release Checklist

Before publishing:

- [ ] All dates updated (frontmatter, titles, version boxes)
- [ ] Plugin version requirements correct
- [ ] Changelog entries added
- [ ] compatibility.md matrix updated
- [ ] Code examples tested
- [ ] Links between pages work
- [ ] Build succeeds (`npm run build`)
- [ ] Preview looks good (`npm start`)

---

## 🆘 Troubleshooting

**Build fails:**
→ Check for broken internal links
→ Verify all frontmatter is valid YAML

**Version not showing:**
→ Clear cache: `rm -rf .docusaurus/`
→ Rebuild: `npm run build`

**Dates inconsistent:**
→ Use find/sed commands above to fix all at once

---

## 📞 Questions?

See full versioning strategy: `VERSION_MANAGEMENT.md`
