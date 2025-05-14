---
sidebar_position: 3
title: Site Performance
---

# Site Performance

QA ZERO is designed to have minimal impact on your website's performance. However, it's important to understand how analytics tracking can affect site speed and how to optimize for the best balance between data collection and performance.

## Performance Impact

QA ZERO's impact on site performance is typically minimal:

- The tracking script is lightweight (< 50KB)
- Scripts load asynchronously to avoid blocking page rendering
- Data is sent to the server in the background
- Processing occurs on the server, not in the user's browser

### Measured Impact

In our testing across various website types:

| Metric | Average Impact |
|--------|---------------|
| Page Load Time | +0.1 to 0.3 seconds |
| First Contentful Paint | Negligible |
| Time to Interactive | Negligible |
| Lighthouse Performance Score | -1 to -3 points |

## Optimizing Performance

### Basic Optimization

QA ZERO is designed to be lightweight and have minimal impact on your site's performance. The tracking script is optimized for performance by default.

### Advanced Optimization

For sites where performance is critical:

1. Navigate to **QA ZERO > Settings**
2. Select the **Site Management** tab
3. Configure which tracking features to enable/disable:
   - Click Tracking
   - Scroll Tracking
   - Mouse Movement Tracking
   - Session Recording
4. Save changes

Note that disabling certain tracking features will limit the data available in your reports.

## Caching Compatibility

QA ZERO is designed to work with caching plugins:

1. The tracking script includes cache-busting parameters
2. User-specific data is handled via localStorage
3. The admin interface is automatically excluded from caching

For optimal performance with caching, ensure your caching plugin is configured correctly as described in the [Plugin Compatibility](/docs/user-manual/site-environment/plugin-compatibility) section.

See the [Plugin Compatibility](/docs/user-manual/site-environment/plugin-compatibility) section for specific caching plugin configurations.

## CDN Compatibility

QA ZERO works with Content Delivery Networks (CDNs) without requiring special configuration. The tracking script is designed to work with most CDN setups out of the box.

## Database Optimization

QA ZERO stores collected data in your WordPress database. To optimize database performance:

1. Navigate to **QA ZERO > Settings**
2. Select the **Site Management** tab
3. Configure **Data Retention Period** (shorter periods mean less database storage)
4. Save changes

QA ZERO automatically optimizes database tables during scheduled maintenance tasks.

## Reducing Server Load

For high-traffic websites, QA ZERO automatically optimizes data collection to minimize server load. The plugin is designed to handle high traffic volumes efficiently without requiring manual configuration.

## Mobile Optimization

QA ZERO automatically detects and optimizes tracking for mobile users. The tracking script is responsive and adjusts its behavior based on the device type without requiring manual configuration.

## Performance Monitoring

QA ZERO includes built-in performance monitoring to ensure minimal impact on your site:

1. The plugin automatically monitors its own performance impact
2. If performance issues are detected, the plugin will adjust its behavior accordingly
3. No manual configuration is required

## Best Practices

- Start with default settings and optimize only if needed
- Use sampling for high-traffic sites (100,000+ monthly pageviews)
- Regularly check performance metrics in your hosting dashboard
- Consider upgrading hosting if your site is already resource-constrained
- Balance data collection needs with performance requirements

## Troubleshooting Performance Issues

If you notice performance issues after installing QA ZERO:

1. Temporarily disable QA ZERO to confirm it's the source of the problem
2. Enable **Debug Mode** in QA ZERO settings to identify specific issues
3. Check browser console for JavaScript errors
4. Review server logs for PHP errors or slow queries
5. Contact QA ZERO support if issues persist after applying optimization techniques

For persistent performance issues, please refer to the [Troubleshooting](/docs/user-manual/troubleshooting/recording-issues) section.
