---
id: cookie-consent-tool-setup
title: Cookie Consent Tool Integration
sidebar_position: 5
---

# Cookie Consent Tool Integration

## About This Page

This page explains how to integrate QA ZERO with a **cookie consent tool** (cookie banner, etc.).

This setup is only required if your site uses a cookie consent tool.  
QA ZERO can track users without cookies, so this setup is not required in all cases.

---

## Why Use This Integration

QA ZERO can switch tracking behavior based on whether a visitor has consented to cookies.

By integrating with a cookie consent tool, you can:

- Use cookies only when consent is given
- Avoid using cookies when consent is rejected

To enable this behavior, your site needs to pass the consent status to QA ZERO.

---

## Tag Placement and Order

Place the integration script with attention to loading order.

### 1. Relation to the Cookie Consent Tool

The script must run **after the cookie consent tool is loaded**.

Add it inside:

- A callback function  
- Or an event triggered when consent is determined  

---

### 2. Order with QA ZERO Tags

Install QA ZERO-related tags in this order:

1. **Cookie consent integration script (first)**
2. **Tracking tag (after)**

This ensures tracking starts with the correct consent state.

---

## What the Integration Script Does

The integration uses the `qahmz` and `qahmz_pub` objects.

Start with:

```html
<script>
var qahmz = qahmz || {};
var qahmz_pub = qahmz_pub || {};
</script>
````

Then implement the following:

* Check previous consent (for returning visitors)
* Notify consent changes

---

### 1. Check Existing Consent (Returning Visitors)

If a visitor has already consented, a cookie is stored.

```html
<script>
if (document.cookie.indexOf("qa_cookieConsent=true") !== -1) {
  qahmz.cookieConsentObject = true;
}
</script>
```

---

### 2. Notify Consent via Callback or Event

Call the following based on consent status:

* **When accepted**

```js
qahmz.cookieConsentObject = true;
qahmz_pub.cookieConsent(true);
```

* **When rejected**

```js
qahmz_pub.cookieConsent(false);
```

---

## Implementation Examples

These are sample implementations.
Adjust them based on your cookie consent tool.

---

### Example 1: Callback Function

```html
<script>
var qahmz = qahmz || {};
var qahmz_pub = qahmz_pub || {};

if (document.cookie.indexOf("qa_cookieConsent=true") !== -1) {
  qahmz.cookieConsentObject = true;
}

window.onCookieConsentChange = function(consent) {
  if (consent) {
    qahmz.cookieConsentObject = true;
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(true);
  } else {
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(false);
  }
};
</script>

<!-- Tracking tag goes here -->
```

---

### Example 2: Event Listener

```html
<script>
var qahmz = qahmz || {};
var qahmz_pub = qahmz_pub || {};

if (document.cookie.indexOf("qa_cookieConsent=true") !== -1) {
  qahmz.cookieConsentObject = true;
}

window.addEventListener('cookieConsent', function(e) {
  if (e.detail.agreed) {
    qahmz.cookieConsentObject = true;
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(true);
  } else {
    qahmz_pub.cookieConsent && qahmz_pub.cookieConsent(false);
  }
});
</script>

<!-- Tracking tag goes here -->
```

---

## Important

* Callback names, event names, and data structures depend on your tool
* Always follow your cookie consent tool’s specification

---

## Next Steps

* See [Tracking Tag Setup](./tracking-tag-setup.md) for basic installation
* After setup, test both consent and rejection on your site

