# Documentation Update Guide for Version Releases

**Quick reference for maintaining API documentation when shipping new features or new versions**

First: understand the [two-layer versioning scheme](./VERSION_MANAGEMENT.md#two-layer-versioning-version--update). Almost every release you do will be an **update**, not a new **version**. New versions are rare (breaking changes only); updates happen continuously.

---

## 🟢 Scenario A (most common): Non-breaking Update

**Examples:** a new filter operator ships, a new material is added, `allpv` gains a behavioral column, the `features` map changes, a new calc function is whitelisted.

→ **Stay inside the existing `YYYY-MM-DD/` directory.** Do not copy it. Do not create a new one. The directory is a living document.

### 3-step workflow

1. **In qa-labo (plugin source), bump the update date**
   - Edit the implementation (executor / validator / material loader).
   - Update `src/core/yaml/qal-validation-{version}.yaml` — either flip a `features:` flag to `true`, add to an enum list, or add a new rule.
   - **Bump `QAHM_API_UPDATE` in `src/core/qahm-const.php` to today's date.** This is the single most important step — if you forget it, clients (including AI agents) will never discover the new feature via `/guide`.
   - Make sure the edited files are listed in `qa-labo-override-files.txt` so the nightly sync from qa-platform does not clobber them.

2. **In docs.qazero.com (this repo), reflect the new feature**
   - Edit the relevant `.md` file(s) inside `docs/developer-manual/api/{version}/` (`qal.md`, `materials.md`, `endpoints.md`, `qal-validation.md`).
   - Add a `**Since:** YYYY-MM-DD` badge next to the new feature's heading or row.
   - Bump `last_updated` **and** `api_update` in the frontmatter of every file you touched.
   - Add a new entry at the **top** of the Update History in `{version}/changelog.md`:
     ```markdown
     ### YYYY-MM-DD — `api_update: YYYY-MM-DD` — Documentation vX.Y.Z
     **Added:**
     - ✅ Short description of the new feature
     ```
   - If the `features` map or response shape in `endpoints.md` is visible in the `/guide` response example, update the example too.

3. **Commit and push**
   - Single commit to this repo, pushed to `main`. GitHub Actions deploys to `gh-pages` automatically.
   - Commit message convention: `docs(api/{version}): update YYYY-MM-DD — <one-line summary>`
   - Verify on https://docs.qazero.com after a few minutes.

### What you do **not** do in Scenario A

- ❌ Do not `cp -r 2025-10-20 2025-10-20-update-YYYY`
- ❌ Do not create a new `api/YYYY-MM-DD/` directory
- ❌ Do not touch `compatibility.md` for non-breaking updates (it tracks **versions**, not updates)
- ❌ Do not hand-edit the `features` map in docs to disagree with the YAML — the YAML is the source of truth

---

## 🔴 Scenario B (rare): New API Version (breaking change)

**Examples:** response envelope shape changes, a required field is removed, a column is renamed, semantics of an operator changes.

Breaking changes are rare. Before going down this path, ask: "can I add a new field and keep the old one working?" If yes, it's Scenario A.

---

### ☑️ New API Version (e.g., 2025-10-20 → 2026-03-01) — BREAKING ONLY

**Create new version (Scenario B only):**

1. **Copy directory**: `cp -r 2025-10-20/ 2026-03-01/`
2. **Update 5 files** in new directory (details below)
3. **Update 2 top-level files** (compatibility.md, index.md)
4. **Reset** `api_update` to the new version's release date (the two layers are scoped per-version)
5. **Keep the old version directory for 24 months** as part of the support policy

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

→ **No documentation update needed.** `api_update` stays put.

---

### Scenario 2: Plugin Feature Addition (3.0.0.0 → 3.1.0.0)
**New fields added to existing material, new operator, new material — all backward-compatible**

This is Scenario A from the top of this document. **Do not create a new API version directory.** Bump `api_update`, add `**Since:**` badges, update the Update History, and push. Update `compatibility.md` only if plugin version requirements changed — not for every `api_update` bump.

---

### Scenario 3: Breaking Change (3.0.0.0 → 4.0.0.0)
**Field removed or behavior changed**

This is Scenario B. Must create a new API version directory, reset `api_update` to the new release date, keep the old version directory for 24 months.

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
