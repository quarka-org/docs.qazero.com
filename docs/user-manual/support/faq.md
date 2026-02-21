---
sidebar_position: 3
title: Frequently Asked Questions
---

# Frequently Asked Questions (Start Guide)

This section addresses common questions about getting started with QA ZERO.

---

## Understanding QA ZERO

### Is QA ZERO just a WordPress plugin?
No. QA ZERO is an independent analytics infrastructure that happens to use WordPress *only* as a middleware layer for setup and system management. It is **not** a WordPress CMS plugin in the traditional sense — it does not interact with posts, pages, or themes as content. Instead, it uses WordPress purely as a lightweight UI and plugin framework.

### Why does QA ZERO use WordPress?
WordPress is used exclusively as a familiar and extensible runtime environment. QA ZERO leverages WordPress's plugin system and admin interface for easy deployment and operation, but all analytics processing, data handling, and visualization are entirely independent from WordPress’s content features. Think of QA ZERO as a stand-alone server app that simply uses WordPress to "host" its management UI.

---

## Installation Questions

### Is QA ZERO compatible with my WordPress theme?
Theme compatibility is irrelevant. QA ZERO does **not** render or affect your WordPress site's front-end. Since it operates independently from WordPress's public pages and templates, your theme has no impact on its functionality. The plugin runs as a private analytics interface within the admin dashboard.

### Will QA ZERO slow down my website?
No. QA ZERO is optimized for performance. The tracking script loads asynchronously and does not block rendering. All analytics data is processed server-side in a way that is completely detached from your website's core operation.

### Can I use QA ZERO with a caching plugin?
Yes. Since QA ZERO doesn't modify your visible site pages, it is compatible with most caching plugins. However, make sure the tracking script is excluded from page caching if needed. 

---

## Setup Questions

### How long does it take to start seeing data?
Tracking begins as soon as the script is active on your site. Most users see data in the dashboard within a few minutes. For more comprehensive results like heatmaps, we recommend letting QA ZERO collect data for at least 24–48 hours.

### Can I exclude certain users from being tracked?
Yes. You can exclude logged-in users, specific user roles, or IP addresses using the built-in settings in the QA ZERO admin panel.

### Do I need to add any code to my website?
No manual code insertion is required. QA ZERO automatically injects the tracking script into your site's pages once activated.

---

## Privacy and Compliance Questions

### Is QA ZERO GDPR compliant?
Yes. QA ZERO is built with privacy in mind. It includes several tools to support GDPR and other privacy frameworks:
- No reliance on cookies
- IP address anonymization
- Configurable data retention periods
- Export and deletion tools for user data
- Respect for opt-out signals from consent tools

### Does QA ZERO use cookies?
No. QA ZERO is designed to be 100% cookieless. It uses privacy-friendly fingerprinting and session correlation techniques that do not store data on the user’s device.

### Can visitors opt out of tracking?
Yes. QA ZERO respects signals from consent tools (such as CookieYes) and disables tracking accordingly. If a visitor opts out, no data is recorded.
