---
sidebar_position: 3
title: Frequently Asked Questions
---

# Frequently Asked Questions (Start Guide)

This section addresses common questions about getting started with QA ZERO.

## Understanding QA ZERO

### Is QA ZERO just a WordPress plugin?

No, QA ZERO is an independent analytics server solution that uses WordPress as middleware for easy installation and management. While it's distributed as a WordPress plugin for convenience, it functions as a standalone analytics server that provides comprehensive website analytics.

### Why does QA ZERO use WordPress?

QA ZERO uses WordPress primarily as an installation framework and management interface. This approach simplifies deployment while providing powerful analytics capabilities that operate independently of WordPress's core functions. WordPress serves as a familiar and user-friendly way to manage your analytics server.

## Installation Questions

### Is QA ZERO compatible with my WordPress theme?

Yes, QA ZERO is compatible with most WordPress themes since it operates largely independently of your theme. The WordPress integration layer is designed to work with standard WordPress themes. If you encounter any issues, please refer to the [Theme Layout](/docs/user-manual/site-environment/theme-layout) section.

### Will QA ZERO slow down my website?

QA ZERO is optimized for performance and has minimal impact on your website's loading speed. The tracking script is lightweight and loads asynchronously. The analytics server processes data independently of your website's operation. For more information, see the [Site Performance](/docs/user-manual/site-environment/site-performance) section.

### Can I use QA ZERO with a caching plugin?

Yes, QA ZERO is compatible with most popular caching plugins. However, you may need to configure your caching plugin to exclude the QA ZERO tracking script from being cached. See the [Plugin Compatibility](/docs/user-manual/site-environment/plugin-compatibility) section for details.

## Setup Questions

### How long does it take to start seeing data?

Data collection begins immediately after you enable tracking. However, it may take a few minutes for the data to appear in your dashboard as the analytics server processes the information. For meaningful heatmaps and analytics, we recommend collecting data for at least 24-48 hours.

### Can I exclude certain users from being tracked?

Yes, you can configure QA ZERO to exclude specific user roles, logged-in users, or specific IP addresses from tracking. These options are available in the Analytics Settings section of the management interface.

### Do I need to add any code to my website?

No, QA ZERO automatically adds the necessary tracking code to your website when you activate it through WordPress. The WordPress integration layer handles this for you, so no manual code insertion is required.

## Privacy and Compliance Questions

### Is QA ZERO GDPR compliant?

Yes, QA ZERO includes features to help you comply with GDPR and other privacy regulations:
- IP anonymization
- Cookie consent integration
- Data retention controls
- Data export and deletion tools

### Does QA ZERO use cookies?

QA ZERO is designed to operate without relying on cookies. It uses alternative tracking methods that don't require storing information on the visitor's device. This makes it easier to comply with privacy regulations while still providing comprehensive analytics.

### Can visitors opt out of tracking?

Yes, if you use a cookie consent solution, visitors can opt out of tracking. QA ZERO respects the visitor's privacy preferences and will not track users who have opted out.

## Getting Help

If your question isn't answered here, please check the [Troubleshooting](/docs/user-manual/troubleshooting/recording-issues) section or contact our support team at support@qazero.com.
