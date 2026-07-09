---
sidebar_position: 1
title: FAQ
---

# FAQ

This page answers frequently asked questions about QA ZERO.

If you are experiencing a specific problem or error, please also see the **Troubleshooting** section.

---

## 1. Installation and Architecture

### Q. Is QA ZERO just a WordPress plugin?

No. QA ZERO is an independent analytics server solution that uses WordPress as its management platform.

It is distributed as a WordPress plugin for easy installation, but the analytics engine runs independently. WordPress mainly provides the installation and administration interface.

### Q. Why does QA ZERO use WordPress?

QA ZERO uses WordPress to simplify installation and provide an easy-to-use administration interface.

### Q. Does the website I want to track need to use WordPress?

No.

Only the QA ZERO server runs on WordPress. The tracked website can use any CMS or a custom-built system.

### Q. Can QA ZERO track Shopify websites?

Yes.

Shopify sites are supported. No special configuration for QA ZERO is required.

---

## 2. Compatibility and Performance

### Q. Is QA ZERO compatible with my WordPress theme?

Yes.

QA ZERO operates independently of your theme and is compatible with most WordPress themes.

### Q. Will QA ZERO slow down my website?

QA ZERO is designed with performance in mind.

The tracking script loads asynchronously, and analytics processing runs on the QA ZERO server. The impact on page speed is minimal.

### Q. Can I use QA ZERO with cache plugins?

Yes.

Most cache plugins are supported. If tracking issues occur, review your cache settings.

### Q. Will the tracking tag affect our internal network?

No.

Its impact is comparable to common analytics tags such as GA4.

### Q. What server specifications are recommended?

Requirements vary depending on your traffic volume and deployment.

Please refer to the server requirements page.

---

## 3. Data Collection and Tracking

### Q. How long does it take before data appears?

Data collection starts as soon as the tracking tag is installed correctly.

Dashboard updates may take several minutes.

### Q. Are bots excluded?

Yes.

By default, sessions with more than 120 page views are identified as bots and excluded from analysis.

### Q. Are UTM parameters supported?

Yes.

Supported parameters:

- utm_campaign
- utm_source
- utm_medium

### Q. Can QA ZERO collect referrer data?

Yes.

Browser privacy restrictions may limit the available information, but QA ZERO stores referrer data whenever possible.

### Q. Can QA ZERO distinguish Google Ads from Google Organic Search?

Yes.

QA ZERO uses **Source / Medium**, similar to GA4.

### Q. Is subdomain tracking supported?

Yes.

Subdomains can be analyzed from a single dashboard.

### Q. Can specific users be excluded from tracking?

Yes.

Logged-in users and specific IP addresses can be excluded.

### Q. Can I export data to another system?

Yes.

Use the Data API.

### Q. Can I change the data retention period?

Yes.

The default retention period is 740 days (about two years).

---

## 4. Aggregation and Reports

### Q. Why is the user count in the dashboard different from the user count I calculated from the detailed TSV download?

The dashboard and the detailed TSV download count users differently, so the numbers may not match.

The dashboard counts **unique users for each day**. If the same user visits on multiple days, that user is counted once on each day.

Example:

| Date | Visitor |
|------|---------|
| July 1 | A |
| July 2 | A |

The dashboard counts:

- July 1: 1 user
- July 2: 1 user

The total for the two-day period is **2 users**.

The detailed TSV download contains **one record per page view (PV)**. The user count depends on how you aggregate the exported data.

For example, if you count unique `reader_id` values across the selected period, the result is:

- A

which is **1 user**.

The dashboard shows aggregated daily user counts, while the TSV download provides raw data for your own analysis. Because of this difference, the numbers may not always match.

---

## 5. Heatmaps and Session Replay

### Q. How are A/B test pages displayed in Session Replay?

If URL parameters are used to switch variations, each variation is displayed separately.

### Q. Are modal dialogs reproduced in Session Replay?

Usually.

Some modal implementations may not be reproduced correctly.

### Q. Are form inputs shown in Session Replay?

No.

QA ZERO does not collect form input values.

### Q. Should I be concerned about storage usage?

No.

Session Replay stores HTML and event data rather than video files.

---

## 6. Privacy and Compliance

### Q. Does QA ZERO support GDPR?

QA ZERO includes features that help support privacy regulations such as GDPR.

- IP anonymization
- Cookie-free tracking
- Consent management integration
- Data retention management
- Data export

### Q. Does QA ZERO use cookies?

QA ZERO also supports cookie-free tracking.

### Q. Can QA ZERO work with consent management platforms?

Yes.

### Q. Can visitors opt out of tracking?

Yes.

When used with a consent management platform, tracking can be controlled based on visitor consent.

### Q. Is QA ZERO affected by Safari ITP?

QA ZERO supports cookie-free tracking, reducing the impact of ITP.

---

## 7. AI and Integrations

### Q. Does QA ZERO require a tracking tag?

Yes.

Install the tracking tag on the website you want to measure.

### Q. Can QA ZERO data be used for Google Ads Enhanced Conversions?

Not as a standard feature.

Custom development may be available.

### Q. Can QA ZERO integrate with our CDP?

Yes.

Custom integration is available.

### Q. Can funnel data be exported by product ID?

Not as a standard feature.

Custom development may be available.

### Q. Can referrer exclusion be configured for external payment sites?

Not as a standard feature.

Custom development may be available.

### Q. Does QA ZERO include generative AI?

No.

QA ZERO provides analytics data and AI-ready prompts. The AI analysis is performed by the AI service you choose.

### Q. Which AI services are recommended?

ChatGPT, Gemini, Claude, and Copilot have been tested.

Use the AI service approved by your organization.

---

## 8. Other

### Q. Can external partners, such as agencies, access the dashboard?

Yes.

QA ZERO supports multiple user accounts and permission management.

### Q. What should I do if my question is not listed here?

Please check the Troubleshooting section.

If you still need assistance, contact our support team.
