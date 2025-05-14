---
sidebar_position: 1
title: Recording Issues
---

# Troubleshooting Recording Issues

If QA ZERO isn't recording visitor data correctly, this guide will help you identify and resolve common issues.

## Common Recording Issues

### No Data Being Recorded

If you're not seeing any data in your QA ZERO dashboard:

#### Verify Tracking is Enabled

1. Navigate to **QA ZERO > Settings**
2. Select the **Site Management** tab
3. Ensure tracking options are enabled
4. Save changes if needed

#### Check Script Installation

1. Visit your website in an incognito/private browsing window
2. Right-click and select "View Page Source"
3. Search for "qa-zero" in the source code
4. Verify the tracking script is present in the `<head>` or before the closing `</body>` tag

![Tracking Script in Page Source](/img/placeholder-image.png)

If the script is missing:

1. Navigate to **QA ZERO > Tag**
2. Verify that the tracking code is properly installed
3. If using a caching plugin, clear your cache
4. Check your site again

#### Check for JavaScript Errors

1. Open your website in Chrome or Firefox
2. Open the browser's developer tools (F12 or right-click > Inspect)
3. Go to the Console tab
4. Look for any errors related to QA ZERO

### Partial Data Recording

If some data is being recorded but not all:

#### Check Tracking Configuration

1. Navigate to **QA ZERO > Settings**
2. Select the **Site Management** tab
3. Verify that all desired tracking options are enabled
4. Save changes if needed

#### Check Site Configuration

1. Navigate to **QA ZERO > Settings**
2. Review the settings in all tabs to ensure proper configuration
3. Make sure your site type and attributes are correctly set
4. Save changes if needed

### Heatmap Not Displaying Correctly

If heatmaps are not displaying correctly on your pages:

#### Check Page Compatibility

1. Navigate to **QA ZERO > Behavior**
2. Select the page with the problematic heatmap
3. Check if the page content has changed significantly since data collection
4. If needed, clear old data and collect new heatmap data

#### Adjust Browser View

1. Navigate to **QA ZERO > Behavior**
2. Select the page with the problematic heatmap
3. Try switching between device views (desktop, tablet, mobile)
4. Check if the heatmap displays correctly in different views

## Browser-Specific Issues

### Chrome

If recording issues occur specifically in Chrome:

1. Check if any ad blockers or privacy extensions are installed
2. Verify that third-party cookies are allowed
3. Try disabling any content blocking features

### Safari

Safari's Intelligent Tracking Prevention (ITP) can affect analytics:

1. QA ZERO is designed to work with Safari's privacy features
2. No special configuration is typically needed
3. If issues persist, check for browser-specific console errors

### Firefox

If recording issues occur specifically in Firefox:

1. Check if Enhanced Tracking Protection is blocking QA ZERO
2. QA ZERO is designed to work with Firefox's privacy features
3. If issues persist, check for browser-specific console errors

## Plugin Conflict Resolution

If you suspect a plugin conflict:

1. Temporarily deactivate other plugins one by one
2. After each deactivation, check if QA ZERO recording works
3. If you identify a conflicting plugin, check the [Plugin Compatibility](/docs/user-manual/site-environment/plugin-compatibility) section for specific guidance

## Server Configuration Issues

### PHP Settings

Ensure your server meets these requirements:

- PHP 5.6 or higher
- Memory limit: 64MB or higher
- Max execution time: 30 seconds or higher
- POST max size: 8MB or higher

### WordPress Configuration

Check these WordPress settings:

1. Ensure WordPress address (URL) and Site address (URL) are correctly set in Settings > General
2. Verify that permalink settings are configured and working

## Advanced Troubleshooting

### Manual Script Verification

Add this code to your theme's header.php file (before the closing `</head>` tag) to force the tracking script:

```php
<?php if (function_exists('qahm_zero_print_tracking_code')) { qahm_zero_print_tracking_code(); } ?>
```

### Database Verification

1. Use a database management tool like phpMyAdmin
2. Check the WordPress database tables related to QA ZERO
3. Verify that the tables exist and contain data
4. If issues are found, consider reinstalling the plugin

## Getting Support

If you've tried the troubleshooting steps above and still have issues:

1. Gather information about your system:
   - WordPress version
   - PHP version
   - Server environment
   - Browser and device information
2. Contact QA ZERO support with:
   - Your system information
   - Description of the issue
   - Steps you've already taken to troubleshoot
   - Screenshots of any error messages
