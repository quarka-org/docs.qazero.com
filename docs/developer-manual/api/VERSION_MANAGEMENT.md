# API Documentation Version Management

## Two-Layer Versioning (Version + Update)

QA ZERO API uses a **two-layer versioning scheme**. Understanding this is the most important thing in this document — get it wrong and you will either break clients or hide new features from them.

| Layer | Format | Changes when… | Visibility |
|-------|--------|---------------|------------|
| **Version** | `YYYY-MM-DD` | **Only on breaking changes.** Response shape, required fields, semantics change. | Appears in the URL (`?version=2025-10-20`) and in the directory name (`/developer-manual/api/2025-10-20/`). Supported for **24 months** after release. |
| **Update** (`api_update`) | `YYYY-MM-DD` | Any backward-compatible addition — new material, new filter operator, new calc function, new `features` flag, new optional field. | Lives **inside** a version. Returned by `/guide` as the `api_update` field. Does **not** change the URL or directory name. |

**Canonical name:** "Version `2025-10-20`, update `2026-04-11`" — this is how we refer to a specific API revision in tickets, commits, and release notes.

### Why two layers?

- **Clients hate URL churn.** If `version` changed every time a feature shipped, every client would have to re-pin. We want `version` to feel stable.
- **We still need to tell clients what's available.** When a new operator like `between` ships, AI agents and SDKs need to know it exists — that's what `api_update` + the `features` map in `/guide` are for.
- **It mirrors how Stripe, AWS, and other mature APIs do it.** Living documentation + `Since: YYYY-MM-DD` inline badges + a machine-readable feature map.

### One version = one living document

**Do not** duplicate the `2025-10-20/` directory every time you bump `api_update`. The directory is a **single living document** for the entire lifetime of version `2025-10-20`. When you add a feature:

1. Add a `**Since:** YYYY-MM-DD` badge to the feature's section in `qal.md` / `materials.md` / `endpoints.md`
2. Add a new entry at the **top** of the Update Ledger (Changelog) in `index.md`
3. Bump `api_update` and `last_updated` in the frontmatter of every edited file
4. Bump `QAHM_API_UPDATE` in the qa-labo plugin source so `/guide` reports the new date

If you ever catch yourself typing `cp -r 2025-10-20 2025-10-20-update-xxxx`, stop. That's wrong.

### The `features` map is the runtime truth

The `/guide` response includes a `features` object keyed by QAL/result feature name (`filter`, `join`, `calc`, `view_chaining`, `sort`, `sample`, `include_count`, `return_file`, `return_csv`, `return_parquet`). Each value is a boolean indicating whether the executor actually processes that feature on **this server**.

- Clients **must** read `features` from `/guide` at startup rather than hard-coding feature availability.
- Documentation claims that contradict `features` are always wrong — the plugin's `qal-validation-{version}.yaml` is the authoritative source and the plugin publishes it through `/guide`.
- When you add a feature, flip its flag in that YAML and bump `QAHM_API_UPDATE`. The doc should follow.

---

## Version Format

**API Version:** `YYYY-MM-DD` (Calendar versioning — rare, breaking only)
**API Update (`api_update`):** `YYYY-MM-DD` (Calendar versioning — frequent, non-breaking)
**Documentation Version:** `MAJOR.MINOR.PATCH` (Semantic versioning, internal to this docs repo)

## Update Process

### 1. When Making Documentation Changes

Update **both** `last_updated` and `api_update` in the frontmatter of modified files. `api_update` is machine-readable and should match the `QAHM_API_UPDATE` constant in the qa-labo plugin source.

```yaml
---
id: getting-started-2025-10-20
title: Getting Started
sidebar_position: 1
last_updated: 2026-04-11   # ← Human-readable "last touched" date
api_update: 2026-04-11     # ← Matches plugin's QAHM_API_UPDATE constant
---
```

For content describing a specific feature, add an inline **Since** badge so readers can tell when it shipped:

```markdown
### `filter` — row-level filter **Since:** 2026-04-10

The `filter` key accepts a flat map of column → condition...
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

| API Version | Current `api_update` | Doc Version | Status | Released | Support Until |
|-------------|----------------------|-------------|--------|----------|---------------|
| 2025-10-20  | 2026-04-11           | 1.1.2       | Current | 2025-10-20 | 2027-10-20 |

The `api_update` column is the latest non-breaking revision **documented** here. The actual runtime value is whatever the target server reports in `/guide` — a client talking to a stale plugin will see an older `api_update` and should adjust its expectations via the `features` map.

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
