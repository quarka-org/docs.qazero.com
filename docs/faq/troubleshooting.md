---
sidebar_position: 4
title: Troubleshooting
---

# Troubleshooting

Solutions to common issues with QA ZERO.

## Tracking Not Working

If tracking is not working:

1. Check that QA ZERO is activated in your WordPress plugins
2. Verify that tracking is enabled in the QA ZERO settings
3. Check for JavaScript errors in your browser console
4. Ensure that your theme is properly loading the WordPress wp_head and wp_footer hooks
5. Temporarily disable other plugins to check for conflicts

## No Data Showing in Dashboard

If no data is showing in the dashboard:

1. Verify that tracking is working (see above)
2. Check that enough time has passed for data to be collected
3. Ensure that the WordPress cron is running properly
4. Check the date range filter in the dashboard
5. Verify that you have visited the site as a normal user (not logged in as admin)

## Heatmaps Not Displaying Correctly

If heatmaps are not displaying correctly:

1. Check that you have enough data for the selected page
2. Verify that the page layout hasn't changed significantly since data collection
3. Try adjusting the heatmap settings (opacity, radius, etc.)
4. Clear your browser cache and try again
5. Check for JavaScript errors in your browser console

## Performance Issues

If you're experiencing performance issues:

1. Check your server resources (CPU, memory, disk space)
2. Consider adjusting the data retention settings
3. Optimize your WordPress database
4. Reduce the amount of data being collected by configuring tracking settings
5. Consider upgrading your hosting plan if necessary

## Error Messages

For specific error messages:

- "Database error": Check your WordPress database connection and permissions
- "File permission error": Check the permissions on the qa-zero-data directory
- "API error": Verify that your server can make outgoing connections
- "Configuration error": Check your QA ZERO settings

## Coming Soon

More troubleshooting guides will be added in future updates.
