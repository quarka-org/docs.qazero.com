---
id: qal-validation-2025-10-20
title: QAL Validation Manifest
sidebar_position: 4
version: "2025-10-20"
update: "2025-10-20"
type: validation_manifest
description: >
  Defines strict validation rules for QAL JSON execution requests.
  This frontmatter is parsed by QAL_Executor (PHP yaml_parse_file) for runtime validation.
structure:
  required: ["tracking_id", "materials", "time", "make", "result"]
rules:
  tracking_id:
    type: string
    description: "Unique identifier for the tracking site to query. Must match a tracking_id from the /guide endpoint response."
    pattern: "^[a-zA-Z0-9_-]+$"
    errors:
      - code: E_UNKNOWN_TRACKING_ID
        message: "Invalid tracking_id provided."

  materials:
    type: array
    description: "List of data sources (materials) to use in the query. Each material must have a 'name' property."
    items:
      type: object
      required: ["name"]
      properties:
        name:
          type: string
          description: "Material name. Only 'allpv' (page view data) and 'gsc' (Google Search Console data) are allowed."
          enum: ["allpv", "gsc"]
      additionalProperties: false
    minItems: 1
    errors:
      - code: E_UNKNOWN_MATERIAL
        message: "Material name not found in manifest."

  time:
    type: object
    required: ["start", "end", "tz"]
    properties:
      start: { type: string, format: date-time }
      end: { type: string, format: date-time }
      tz:
        type: string
        description: "IANA timezone identifier (e.g., Asia/Tokyo, UTC, America/New_York). Any valid IANA timezone is accepted."
        examples: ["Asia/Tokyo", "UTC", "Europe/London", "America/New_York", "America/Los_Angeles", "Europe/Paris"]
    errors:
      - code: E_TIME_REQUIRED
        message: "Missing time.start, time.end, or time.tz."

  make:
    type: object
    description: "Defines views (data transformations) to create from materials. Each key is a view name, and the value defines the view's structure."
    patternProperties:
      "^[a-zA-Z0-9_]+$":
        type: object
        description: "View definition. Must specify 'from' (source material) and 'keep' (columns to select)."
        required: ["from", "keep"]
        properties:
          from:
            type: array
            description: "Specify which material to use. Must contain exactly one material name."
            items: { type: string, enum: ["allpv", "gsc"] }
            minItems: 1
            maxItems: 1
          keep:
            type: array
            description: "List of columns to include in the result. Must use fully qualified names in the format 'material.column_name' (e.g., 'allpv.url', 'gsc.keyword')."
            items:
              type: string
              pattern: "^(allpv|gsc)\\.[a-zA-Z0-9_]+$"
            minItems: 1
        additionalProperties: false
    errors:
      - code: E_UNKNOWN_COLUMN
        message: "Invalid column name in keep list."

  result:
    type: object
    description: "Specifies which view to return and how to format the result."
    required: ["use"]
    properties:
      use:
        type: string
        description: "Name of the view (defined in 'make') to return as the result."
      limit:
        type: integer
        description: "Maximum number of rows to return. Default: 1000, Maximum: 50000."
        minimum: 1
        maximum: 50000
        default: 1000
      count_only:
        type: boolean
        description: "If true, return only the count of rows instead of the actual data. Default: false."
        default: false
    additionalProperties: false
    errors:
      - code: E_UNKNOWN_VIEW
        message: "Result.use does not match any defined view in make."

features:
  filter: false
  join: false
  calc: false
  sort: false
---

# QAL Validation Manifest — AI Accessible Version

This document defines **the exact schema that every QAL JSON must follow**.
The YAML frontmatter section is used by the PHP executor for validation. The body below duplicates this information for AI models and other tools reading via HTTP.

---

## Overview

**Purpose:** Single source of truth for QAL validation rules
**Version:** 2025-10-20
**Type:** validation_manifest
**Audience:** QAL Executor (PHP), AI Models (ChatGPT, Claude, MCP), Human Documentation

---

## Validation Manifest (AI-Readable Copy)

```yaml
id: qal-validation-2025-10-20
title: QAL Validation Manifest (for Executor and AI)
version: "2025-10-20"
update: "2025-10-20"
type: validation_manifest
description: >
  Defines strict validation rules for QAL JSON execution requests.
  Used for validating QAL structures before execution.

structure:
  required: ["tracking_id", "materials", "time", "make", "result"]

rules:
  tracking_id:
    type: string
    description: "Unique identifier for the tracking site to query. Must match a tracking_id from the /guide endpoint response."
    pattern: "^[a-zA-Z0-9_-]+$"
    errors:
      - code: E_UNKNOWN_TRACKING_ID
        message: "Invalid tracking_id provided."

  materials:
    type: array
    description: "List of data sources (materials) to use in the query. Each material must have a 'name' property."
    items:
      type: object
      required: ["name"]
      properties:
        name:
          type: string
          description: "Material name. Only 'allpv' (page view data) and 'gsc' (Google Search Console data) are allowed."
          enum: ["allpv", "gsc"]
      additionalProperties: false
    minItems: 1
    errors:
      - code: E_UNKNOWN_MATERIAL
        message: "Material name not found in manifest."

  time:
    type: object
    required: ["start", "end", "tz"]
    properties:
      start: { type: string, format: date-time }
      end: { type: string, format: date-time }
      tz:
        type: string
        description: "IANA timezone identifier (e.g., Asia/Tokyo, UTC, America/New_York). Any valid IANA timezone is accepted."
        examples: ["Asia/Tokyo", "UTC", "Europe/London", "America/New_York", "America/Los_Angeles", "Europe/Paris"]
    errors:
      - code: E_TIME_REQUIRED
        message: "Missing time.start, time.end, or time.tz."

  make:
    type: object
    description: "Defines views (data transformations) to create from materials. Each key is a view name, and the value defines the view's structure."
    patternProperties:
      "^[a-zA-Z0-9_]+$":
        type: object
        description: "View definition. Must specify 'from' (source material) and 'keep' (columns to select)."
        required: ["from", "keep"]
        properties:
          from:
            type: array
            description: "Specify which material to use. Must contain exactly one material name."
            items: { type: string, enum: ["allpv", "gsc"] }
            minItems: 1
            maxItems: 1
          keep:
            type: array
            description: "List of columns to include in the result. Must use fully qualified names in the format 'material.column_name' (e.g., 'allpv.url', 'gsc.keyword')."
            items:
              type: string
              pattern: "^(allpv|gsc)\\.[a-zA-Z0-9_]+$"
            minItems: 1
        additionalProperties: false
    errors:
      - code: E_UNKNOWN_COLUMN
        message: "Invalid column name in keep list."

  result:
    type: object
    description: "Specifies which view to return and how to format the result."
    required: ["use"]
    properties:
      use:
        type: string
        description: "Name of the view (defined in 'make') to return as the result."
      limit:
        type: integer
        description: "Maximum number of rows to return. Default: 1000, Maximum: 50000."
        minimum: 1
        maximum: 50000
        default: 1000
      count_only:
        type: boolean
        description: "If true, return only the count of rows instead of the actual data. Default: false."
        default: false
    additionalProperties: false
    errors:
      - code: E_UNKNOWN_VIEW
        message: "Result.use does not match any defined view in make."

features:
  filter: false
  join: false
  calc: false
  sort: false
```

---

## How to Use

### For AI Models (ChatGPT, Claude, MCP)

**You are a QAL Generator.**

Your task is to produce valid QAL JSON objects that conform to this schema:

1. **Always include these required sections:**
   - `tracking_id` - string matching `^[a-zA-Z0-9_-]+$`
   - `materials` - array with at least one material (`allpv` or `gsc`)
   - `time` - object with `start`, `end`, and `tz`
   - `make` - object with at least one view definition
   - `result` - object with `use` (required), optional `limit` and `count_only`

2. **Follow these rules:**
   - Only use materials: `allpv`, `gsc` (strictly limited)
   - Use any valid IANA timezone (examples: `Asia/Tokyo`, `UTC`, `Europe/London`, `America/New_York`, `America/Los_Angeles`, `Europe/Paris`)
   - Column names must be fully qualified: `material.column`
   - Each view in `make` must have exactly ONE item in `from` array
   - `result.use` must reference a view name defined in `make`
   - `result.limit` must be 1-50000 (default: 1000)

3. **Do NOT use these features (disabled in this version):**
   - `filter` - Not supported
   - `join` - Not supported
   - `calc` - Not supported
   - `sort` - Not supported

---

### For QAL Executor (PHP)

**Runtime Validation:**

```php
<?php
// Load validation manifest
$manifest = yaml_parse_file('/path/to/qal-validation.md');

// Validate QAL JSON
$result = QAL_Executor::qal_validate_by_manifest($qal_json, $manifest);

if (!$result['valid']) {
    // Return validation errors
    return [
        'success' => false,
        'errors' => $result['errors']
    ];
}

// Proceed with execution
```

**Validation Steps:**

1. **Structure validation** - Check all required top-level keys exist
2. **tracking_id validation** - Verify format and existence
3. **materials validation** - Check material names are valid
4. **time validation** - Validate datetime format and timezone
5. **make validation** - Verify view structure, from, and keep rules
6. **result validation** - Check use references valid view, limit is in range
7. **Feature check** - Reject any disabled features (filter, join, calc, sort)

---

### For Human Documentation (Docusaurus)

This page is rendered as part of the API documentation. The YAML frontmatter is parsed by Docusaurus, and this markdown body provides human-readable guidance.

**Navigation:**
- [QAL Guide](./qal.md) - Learn how to write QAL queries
- [Materials Reference](./materials.md) - See available columns
- [Endpoints](./endpoints.md) - API endpoint details

---

## Validation Rules Details

### 1. tracking_id

**Type:** `string`
**Pattern:** `^[a-zA-Z0-9_-]+$`
**Error Code:** `E_UNKNOWN_TRACKING_ID`

**Valid Examples:**
```json
{"tracking_id": "abc123"}
{"tracking_id": "site-001"}
{"tracking_id": "my_tracking_id"}
```

**Invalid Examples:**
```json
{"tracking_id": ""}          // Empty
{"tracking_id": "abc 123"}   // Contains space
{"tracking_id": "abc@123"}   // Contains special char
```

---

### 2. materials

**Type:** `array` of objects
**Min Items:** 1
**Allowed Values:** `allpv`, `gsc`
**Error Code:** `E_UNKNOWN_MATERIAL`

**Valid Examples:**
```json
{
  "materials": [
    {"name": "allpv"}
  ]
}
```

```json
{
  "materials": [
    {"name": "allpv"},
    {"name": "gsc"}
  ]
}
```

**Invalid Examples:**
```json
{
  "materials": []  // Empty array
}
```

```json
{
  "materials": [
    {"name": "unknown"}  // Invalid material name
  ]
}
```

```json
{
  "materials": [
    {"name": "allpv", "as": "pv"}  // additionalProperties not allowed
  ]
}
```

---

### 3. time

**Type:** `object`
**Required Fields:** `start`, `end`, `tz`
**Error Code:** `E_TIME_REQUIRED`

**Valid Example:**
```json
{
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  }
}
```

**Timezone (`tz`):**
- **Type:** String
- **Format:** IANA timezone identifier
- **Any valid IANA timezone is accepted** (see [IANA Time Zone Database](https://www.iana.org/time-zones))
- **Common examples:**
  - `Asia/Tokyo` - Japan Standard Time
  - `UTC` - Coordinated Universal Time
  - `Europe/London` - UK
  - `America/New_York` - US Eastern
  - `America/Los_Angeles` - US Pacific
  - `Europe/Paris` - Central European Time
  - `Australia/Sydney` - Australian Eastern Time

**Invalid Examples:**
```json
{
  "time": {
    "start": "2025-10-01",  // Missing time component
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  }
}
```

```json
{
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "JST"  // Use IANA format like "Asia/Tokyo", not abbreviations
  }
}
```

```json
{
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Tokyo"  // Must use full IANA identifier "Asia/Tokyo"
  }
}
```

---

### 4. make

**Type:** `object`
**Pattern:** View names must match `^[a-zA-Z0-9_]+$`
**Error Code:** `E_UNKNOWN_COLUMN`

**Structure:**
- Each view must have `from` (array with exactly 1 material)
- Each view must have `keep` (array with at least 1 column)
- Column names must match `^(allpv|gsc)\.[a-zA-Z0-9_]+$`

**Valid Example:**
```json
{
  "make": {
    "page_views": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.title",
        "allpv.access_time"
      ]
    }
  }
}
```

**Invalid Examples:**
```json
{
  "make": {
    "page_views": {
      "from": ["allpv", "gsc"],  // More than 1 item
      "keep": ["allpv.url"]
    }
  }
}
```

```json
{
  "make": {
    "page_views": {
      "from": ["allpv"],
      "keep": ["url"]  // Not fully qualified
    }
  }
}
```

```json
{
  "make": {
    "page_views": {
      "from": ["allpv"],
      "keep": []  // Empty keep array
    }
  }
}
```

---

### 5. result

**Type:** `object`
**Required:** `use`
**Optional:** `limit` (1-50000, default: 1000), `count_only` (boolean, default: false)
**Error Code:** `E_UNKNOWN_VIEW`

**Valid Examples:**
```json
{
  "result": {
    "use": "page_views"
  }
}
```

```json
{
  "result": {
    "use": "page_views",
    "limit": 100,
    "count_only": false
  }
}
```

```json
{
  "result": {
    "use": "page_views",
    "count_only": true
  }
}
```

**Invalid Examples:**
```json
{
  "result": {
    "use": "nonexistent_view"  // View not defined in make
  }
}
```

```json
{
  "result": {
    "use": "page_views",
    "limit": 100000  // Exceeds maximum of 50000
  }
}
```

```json
{
  "result": {
    "use": "page_views",
    "limit": 0  // Below minimum
  }
}
```

---

## Error Codes Reference

| Error Code | Field | Cause | Solution |
|------------|-------|-------|----------|
| `E_UNKNOWN_TRACKING_ID` | `tracking_id` | Invalid or missing tracking_id | Use tracking_id from `/guide` endpoint |
| `E_UNKNOWN_MATERIAL` | `materials` | Invalid material name | Use only `allpv` or `gsc` |
| `E_TIME_REQUIRED` | `time` | Missing start, end, or tz | Include all three fields |
| `E_UNKNOWN_COLUMN` | `make.*.keep` | Invalid column name | Use fully qualified names (material.column) |
| `E_UNKNOWN_VIEW` | `result.use` | View name doesn't exist in make | Reference a view defined in make |
| `E_FEATURE_NOT_SUPPORTED` | Various | Used disabled feature | Remove filter, join, calc, or sort |

---

## Design Principles

### 1. Single Source of Truth

Both the PHP executor and AI models read the same schema definition. This ensures consistency between validation and generation.

### 2. Frictionless Versioning

Each version gets its own manifest file:
- `/docs/developer-manual/api/2025-10-20/qal-validation.md`
- `/docs/developer-manual/api/2025-11-01/qal-validation.md`
- etc.

### 3. Double YAML Format

**Frontmatter YAML:** Parsed by PHP `yaml_parse_file()` or Symfony YAML component
**Body YAML:** Readable by AI models via HTTP fetch or markdown context

Both sections are identical and serve different consumers.

### 4. AI-Friendly Structure

- Flat, explicit rules
- No cross-references
- Clear error codes
- Enum values explicitly listed
- Pattern validation with regex

---

## PHP Integration Example

### Method 1: Parse Frontmatter Only

```php
<?php
// Using symfony/yaml
use Symfony\Component\Yaml\Yaml;

$content = file_get_contents('/path/to/qal-validation.md');
preg_match('/^---\n(.*?)\n---/s', $content, $matches);
$manifest = Yaml::parse($matches[1]);
```

### Method 2: Parse Body YAML Block

```php
<?php
$content = file_get_contents('/path/to/qal-validation.md');
preg_match('/```yaml\n(.*?)\n```/s', $content, $matches);
$manifest = Yaml::parse($matches[1]);
```

### Validation Function

```php
<?php
class QAL_Executor {
    public static function qal_validate_by_manifest($qal_json, $manifest) {
        $errors = [];

        // 1. Check required structure
        foreach ($manifest['structure']['required'] as $field) {
            if (!isset($qal_json[$field])) {
                $errors[] = "Missing required field: $field";
            }
        }

        // 2. Validate tracking_id
        if (isset($qal_json['tracking_id'])) {
            $pattern = $manifest['rules']['tracking_id']['pattern'];
            if (!preg_match("/$pattern/", $qal_json['tracking_id'])) {
                $errors[] = $manifest['rules']['tracking_id']['errors'][0]['message'];
            }
        }

        // 3. Validate materials
        if (isset($qal_json['materials'])) {
            $allowed = $manifest['rules']['materials']['items']['properties']['name']['enum'];
            foreach ($qal_json['materials'] as $material) {
                if (!in_array($material['name'], $allowed)) {
                    $errors[] = $manifest['rules']['materials']['errors'][0]['message'];
                }
            }
        }

        // ... more validation steps

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}
```

---

## Complete Validation Example

### Valid QAL JSON

```json
{
  "tracking_id": "abc123",
  "materials": [
    {"name": "allpv"}
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Asia/Tokyo"
  },
  "make": {
    "page_views": {
      "from": ["allpv"],
      "keep": [
        "allpv.url",
        "allpv.title",
        "allpv.access_time"
      ]
    }
  },
  "result": {
    "use": "page_views",
    "limit": 100
  }
}
```

**Validation Result:**
```php
[
  'valid' => true,
  'errors' => []
]
```

### Invalid QAL JSON

```json
{
  "tracking_id": "abc123",
  "materials": [
    {"name": "unknown_material"}
  ],
  "time": {
    "start": "2025-10-01T00:00:00",
    "end": "2025-10-20T00:00:00",
    "tz": "Invalid/Timezone"
  },
  "make": {
    "page_views": {
      "from": ["allpv"],
      "keep": ["url"]
    }
  },
  "result": {
    "use": "nonexistent_view",
    "limit": 10000
  }
}
```

**Validation Result:**
```php
[
  'valid' => false,
  'errors' => [
    'Material name not found in manifest.',
    'Invalid timezone: Invalid/Timezone',
    'Invalid column name in keep list.',
    'Result.use does not match any defined view in make.',
    'Limit exceeds maximum of 50000.'
  ]
]
```

---

## Future Extensions

As QAL evolves, this manifest will be updated to support:

- `filter` rules and validation
- `join` structure validation
- `calc` aggregation rules
- `sort` specification validation
- Additional materials
- New timezones
- Custom column patterns

Each new version will get its own dated manifest file.

---

## Related Documentation

- **[QAL Guide](./qal.md)** - Learn how to write QAL queries
- **[Materials Reference](./materials.md)** - Available columns and data types
- **[Endpoints](./endpoints.md)** - API endpoint specifications
- **[API Overview](./index.md)** - Return to API documentation home

---

## Why This Format?

| Target | Reads Which Part | How |
|--------|------------------|-----|
| **PHP Executor** | Frontmatter YAML | `yaml_parse_file()` or `Symfony\Yaml::parseFile()` |
| **AI Models** | Body YAML block | Via HTTP fetch or markdown context |
| **Humans** | Entire markdown | Rendered by Docusaurus |
| **Docusaurus** | Frontmatter | For metadata and navigation |

This format serves all consumers with a single file, ensuring consistency and reducing maintenance burden.

---

**Last Updated:** 2025-10-20
**Version:** 2025-10-20
**Manifest ID:** qal-validation-2025-10-20
