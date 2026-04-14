---
id: reference-authentication-2025-10-20
title: Authentication
sidebar_position: 2
---

# Authentication

Both QA ZERO endpoints (`/guide`, `/query`) require authentication
via a **WordPress Application Password**. There is no OAuth flow,
no API key dashboard — credentials are generated from the standard
WordPress user management screen.

## Obtaining a credential

1. Log in to the WordPress admin of the site running QA ZERO.
2. Go to **Users → Profile** (or Users → (the user) for admins
   editing other users).
3. Scroll to the **Application Passwords** section.
4. Enter a name (e.g. `mcp-client`, `my-ai-agent`) and click
   **Add New Application Password**.
5. WordPress will display the generated password **once**. Copy
   it immediately — it cannot be retrieved later.

The credential is a pair: `(username, application_password)`.

## Sending credentials

Both endpoints accept the standard WordPress Basic Auth header:

```
Authorization: Basic base64(username:application_password)
```

Most HTTP clients set this automatically if you pass the
`username` / `password` tuple.

### curl

```bash
curl -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx" \
  "https://example.com/wp-json/qa-platform/guide?version=2025-10-20"
```

Note the spaces in the application password are part of the
password — do **not** strip them.

### Python (requests)

```python
import requests
r = requests.get(
    "https://example.com/wp-json/qa-platform/guide",
    params={"version": "2025-10-20"},
    auth=("admin", "xxxx xxxx xxxx xxxx xxxx xxxx"),
)
```

### Node (fetch)

```js
const auth = Buffer.from("admin:xxxx xxxx xxxx xxxx xxxx xxxx").toString("base64");
const res = await fetch(
  "https://example.com/wp-json/qa-platform/guide?version=2025-10-20",
  { headers: { Authorization: `Basic ${auth}` } }
);
```

## Required user capabilities

The WordPress user owning the application password must be able
to see analytics data for the tracking_ids being queried. In
practice, this means:

- `administrator` role → full access.
- Other roles → access is site-dependent; check with the admin
  of the site.

QA ZERO does not add its own capability layer on top of
WordPress — it trusts the standard role/capability system.

## Credential hygiene

- Issue a **separate application password per client**. Do not
  reuse one across two services. WordPress lets you revoke one
  without affecting the others.
- Rotate credentials any time you suspect a leak. Revocation is
  instant.
- Never commit application passwords to a repo. Use a secrets
  store (Keychain, 1Password, environment variables via a
  `.envrc`, etc.).

## Where to go next

- **[`/guide` reference](./guide.md)** — the first call you will
  make.
- **[`/query` reference](./query.md)** — how to submit a QAL
  query.
- **[Errors](./errors.md)** — auth-related error codes to watch
  for (`401 E_UNAUTHORIZED`, `403 E_FORBIDDEN`).
