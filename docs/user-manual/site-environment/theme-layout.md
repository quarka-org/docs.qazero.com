---
sidebar_position: 2
title: Theme Layout Issues
---

# Theme Layout Issues

QA ZERO is designed to work with most WordPress themes, but occasionally you may encounter layout issues. This section covers common theme-related issues and how to resolve them.

## Common Layout Issues

### Heatmap Overlay Misalignment

The most common theme-related issue is misalignment between the heatmap overlay and the actual website content.

![Heatmap Misalignment Example](/img/placeholder-image.png)

Possible causes:

1. **Dynamic Content**: Elements that load after the initial page load (sliders, lazy-loaded images)
2. **Responsive Layouts**: Themes that significantly alter layout across different screen sizes
3. **Custom Positioning**: Elements with absolute or fixed positioning
4. **iFrames**: Content loaded within iFrames

### Solution Steps

QA ZERO automatically handles most theme-related issues without requiring manual configuration. However, if you encounter heatmap misalignment:

1. Navigate to **QA ZERO > Settings**
2. Select the **Site Management** tab
3. Adjust tracking settings as needed
4. Save changes and test the heatmap again

For persistent issues, you can add custom JavaScript to your theme's header:

```javascript
window.qaZeroConfig = {
  adjustForDynamicContent: true,
  trackingDelay: 2500,
  resizeThrottle: 500
};
```

## Theme-Specific Adjustments

### WordPress Default Themes

QA ZERO works well with all default WordPress themes (Twenty Twenty, Twenty Twenty-One, etc.) without any special configuration.

### Popular Theme Frameworks

QA ZERO is designed to work with most popular theme frameworks without requiring special configuration:

#### Divi

QA ZERO works well with Divi themes without any special configuration.

#### Avada

QA ZERO works well with Avada themes without any special configuration.

#### Astra

QA ZERO works well with Astra themes without any special configuration.

#### GeneratePress

QA ZERO works well with GeneratePress without any special configuration.

## Fixing Z-index Issues

Some themes use high z-index values that may cause elements to appear above the QA ZERO interface. QA ZERO automatically handles most z-index issues without requiring manual configuration.

If you encounter z-index issues, you can add custom CSS to your theme to adjust the z-index values of specific elements.

## Handling Custom Post Types

QA ZERO automatically detects and tracks custom post types without requiring special configuration. All post types are tracked by default.

## Mobile Theme Compatibility

QA ZERO automatically detects and optimizes tracking for mobile themes and responsive layouts without requiring manual configuration.

## AMP Pages Compatibility

QA ZERO is designed to work with AMP (Accelerated Mobile Pages) without requiring special configuration. The tracking script is compatible with AMP pages out of the box.

## Custom Theme Hooks

QA ZERO automatically detects and works with most theme hooks without requiring special configuration.

## Testing After Theme Updates

After updating your theme:

1. Visit your website and check that QA ZERO tracking is still working
2. View a heatmap to ensure proper alignment
3. Test on multiple devices to ensure responsive compatibility

If issues occur after a theme update:

1. Navigate to **QA ZERO > Settings**
2. Select the **Site Management** tab
3. Adjust tracking settings as needed
4. Save changes

## Getting Help with Theme Issues

If you continue to experience theme-related issues:

1. Check if your theme has specific documentation for analytics plugin compatibility
2. Contact your theme developer to ask about compatibility with heatmap and analytics tools
3. Contact QA ZERO support with details about your theme and the specific issues you're experiencing
