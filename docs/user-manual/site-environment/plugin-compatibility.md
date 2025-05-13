---
sidebar_position: 1
title: Plugin Compatibility
---

# Plugin Compatibility

QA ZERO is designed to work seamlessly with most WordPress plugins. However, some plugins may interact with QA ZERO in ways that require special consideration. This section covers compatibility issues and solutions for common plugin types.

## Caching Plugins

### Compatible Caching Plugins

QA ZERO works well with most popular caching plugins, including:

- WP Rocket
- W3 Total Cache
- WP Super Cache
- LiteSpeed Cache
- Autoptimize

### Potential Issues

Caching plugins may cache the QA ZERO tracking code, which can lead to inaccurate data collection. To prevent this:

1. **Exclude QA ZERO Scripts**: Configure your caching plugin to exclude QA ZERO JavaScript files from being cached or minified.
2. **Dynamic Content**: Ensure your caching plugin is configured to handle dynamic content correctly.

### Configuration Steps

#### WP Rocket

1. Go to **WP Rocket > Advanced Rules**
2. Add the following to the "Never Cache URLs" section:
   ```
   /wp-content/plugins/qa-zero/
   ```
3. Add the following to the "Excluded JavaScript Files" section:
   ```
   /wp-content/plugins/qa-zero/js/
   ```
4. Save changes

#### W3 Total Cache

1. Go to **Performance > Minify**
2. Add the following to the "Never minify the following JS files" section:
   ```
   /wp-content/plugins/qa-zero/js/
   ```
3. Save changes

![Caching Plugin Configuration Example](/img/placeholder-image.png)

## Security Plugins

### Compatible Security Plugins

QA ZERO is compatible with most security plugins, including:

- Wordfence
- Sucuri
- iThemes Security
- All In One WP Security

### Potential Issues

Some security plugins may block QA ZERO's data collection as suspicious activity. To prevent this:

1. **Whitelist QA ZERO**: Add QA ZERO's scripts and API endpoints to your security plugin's whitelist.
2. **Adjust Firewall Rules**: Modify firewall rules to allow QA ZERO's necessary operations.

### Configuration Steps

#### Wordfence

1. Go to **Wordfence > Firewall**
2. Click on "Allowlisted URLs"
3. Add the following patterns:
   ```
   /wp-content/plugins/qa-zero/
   /wp-admin/admin-ajax.php
   ```
4. Save changes

## SEO Plugins

### Compatible SEO Plugins

QA ZERO works well with all major SEO plugins, including:

- Yoast SEO
- Rank Math
- All in One SEO
- SEOPress

No special configuration is typically needed for SEO plugins.

## Page Builders

### Compatible Page Builders

QA ZERO is compatible with popular page builders, including:

- Elementor
- Beaver Builder
- Divi Builder
- WPBakery Page Builder
- Gutenberg (WordPress Block Editor)

### Potential Issues

Some page builders may use custom JavaScript that conflicts with QA ZERO's tracking. If you notice issues:

1. **Test in Safe Mode**: Many page builders offer a safe mode or debug mode. Test QA ZERO with this enabled.
2. **Update to Latest Versions**: Ensure both QA ZERO and your page builder are updated to the latest versions.

## Form Plugins

### Compatible Form Plugins

QA ZERO works with most form plugins, including:

- Contact Form 7
- WPForms
- Gravity Forms
- Ninja Forms
- Formidable Forms

### Special Integration Features

QA ZERO can track form submissions as conversion goals:

1. Navigate to **QA ZERO > Goals**
2. Click **Add New Goal**
3. Select "Form Submission" as the goal type
4. Select your form plugin and specific form
5. Save the goal

![Form Goal Configuration](/img/placeholder-image.png)

## Membership and E-commerce Plugins

### Compatible Plugins

QA ZERO is compatible with:

- WooCommerce
- Easy Digital Downloads
- MemberPress
- LearnDash
- WP-Members

### Special Integration Features

QA ZERO offers enhanced tracking for e-commerce activities:

1. Navigate to **QA ZERO > Settings > Integrations**
2. Enable the integration for your e-commerce or membership plugin
3. Configure tracking options for purchases, registrations, or course completions

## Troubleshooting Plugin Conflicts

If you suspect a plugin conflict with QA ZERO:

1. **Temporarily Disable Plugins**: Disable other plugins one by one to identify which one is causing the conflict.
2. **Check Browser Console**: Look for JavaScript errors in your browser's developer console.
3. **Update All Plugins**: Ensure all plugins are updated to their latest versions.
4. **Contact Support**: If you can't resolve the issue, contact QA ZERO support with details about the conflict.

For specific plugin conflict issues not covered here, please refer to the [Troubleshooting](/docs/user-manual/troubleshooting/recording-issues) section.
