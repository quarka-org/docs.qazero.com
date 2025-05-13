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

1. Navigate to **QA ZERO > Settings > Performance**
2. Enable **Optimize Script Loading**
3. Set **Tracking Precision** to "Balanced" (default)
4. Save changes

![Performance Settings](/img/placeholder-image.png)

### Advanced Optimization

For sites where performance is critical:

1. Navigate to **QA ZERO > Settings > Performance**
2. Enable **Minimal Tracking Mode**
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
2. User-specific data is handled via cookies and localStorage
3. The admin interface is automatically excluded from caching

For optimal performance with caching:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Cache Compatibility Mode**
3. Save changes

See the [Plugin Compatibility](/docs/user-manual/site-environment/plugin-compatibility) section for specific caching plugin configurations.

## CDN Compatibility

QA ZERO works with Content Delivery Networks (CDNs):

1. Navigate to **QA ZERO > Settings > Performance**
2. Enable **CDN Compatibility**
3. If your CDN requires specific configuration, enter the details in the provided fields
4. Save changes

## Database Optimization

QA ZERO stores collected data in your WordPress database. To optimize database performance:

1. Navigate to **QA ZERO > Settings > Database**
2. Configure **Data Retention Period** (shorter periods mean less database storage)
3. Set **Database Cleanup Schedule** (daily, weekly, or monthly)
4. Enable **Database Optimization** to automatically optimize tables
5. Save changes

![Database Settings](/img/placeholder-image.png)

## Reducing Server Load

For high-traffic websites:

1. Navigate to **QA ZERO > Settings > Performance**
2. Enable **Sampling Mode** to track only a percentage of visitors
3. Configure the sampling rate (e.g., 50% means only half of visitors are tracked)
4. Enable **Rate Limiting** to prevent traffic spikes from overwhelming your server
5. Save changes

## Mobile Optimization

To optimize performance for mobile users:

1. Navigate to **QA ZERO > Settings > Performance**
2. Enable **Mobile Optimization**
3. Configure **Mobile Tracking Level** (Full, Balanced, or Minimal)
4. Save changes

## Performance Monitoring

QA ZERO includes tools to monitor its own performance impact:

1. Navigate to **QA ZERO > Settings > Performance**
2. View the **Performance Impact** section
3. Check the **Script Load Time** and **Processing Time** metrics
4. If these values are higher than the benchmarks, consider applying the optimization techniques described above

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
