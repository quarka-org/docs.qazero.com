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

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Delayed Tracking** and set the delay to 2-3 seconds
3. Enable **Enhanced Element Tracking**
4. Save changes and test the heatmap again

For persistent issues:

1. Navigate to **QA ZERO > Settings > Advanced**
2. In the **Custom Code** section, add the following JavaScript:
   ```javascript
   window.qaZeroConfig = {
     adjustForDynamicContent: true,
     trackingDelay: 2500,
     resizeThrottle: 500
   };
   ```
3. Save changes and test the heatmap again

## Theme-Specific Adjustments

### WordPress Default Themes

QA ZERO works well with all default WordPress themes (Twenty Twenty, Twenty Twenty-One, etc.) without any special configuration.

### Popular Theme Frameworks

#### Divi

For Divi themes:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Divi Compatibility Mode**
3. Save changes

#### Avada

For Avada themes:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Fusion Builder Compatibility**
3. Save changes

#### Astra

For Astra themes:

1. Ensure you're using Astra 3.0 or higher
2. No special configuration is typically needed

#### GeneratePress

QA ZERO works well with GeneratePress without any special configuration.

## Fixing Z-index Issues

Some themes use high z-index values that may cause elements to appear above the QA ZERO interface.

To fix this:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Force Interface Layer**
3. Adjust the **Interface Z-Index** value if needed (default is 9999)
4. Save changes

![Z-index Settings](/img/placeholder-image.png)

## Handling Custom Post Types

If your theme uses custom post types with unique layouts:

1. Navigate to **QA ZERO > Settings > Tracking**
2. Under **Content Types**, ensure your custom post types are selected
3. Click **Advanced Settings**
4. Configure tracking settings specifically for each custom post type
5. Save changes

## Mobile Theme Compatibility

If your site uses a separate mobile theme or significantly different mobile layout:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Enhanced Mobile Tracking**
3. Configure the **Mobile Breakpoint** value to match your theme's mobile breakpoint
4. Save changes

## AMP Pages Compatibility

For themes that support AMP (Accelerated Mobile Pages):

1. Navigate to **QA ZERO > Settings > Integrations**
2. Enable **AMP Compatibility Mode**
3. Choose whether to track AMP pages separately or combine with regular page data
4. Save changes

## Custom Theme Hooks

If your theme uses custom action hooks for header and footer:

1. Navigate to **QA ZERO > Settings > Advanced**
2. In the **Custom Hooks** section, enter your theme's header and footer hook names
3. Save changes

## Testing After Theme Updates

After updating your theme:

1. Visit your website and check that QA ZERO tracking is still working
2. View a heatmap to ensure proper alignment
3. Test on multiple devices to ensure responsive compatibility

If issues occur after a theme update:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Click **Reset Compatibility Settings**
3. Follow the setup wizard to reconfigure theme compatibility

## Getting Help with Theme Issues

If you continue to experience theme-related issues:

1. Check if your theme has specific documentation for analytics plugin compatibility
2. Contact your theme developer to ask about compatibility with heatmap and analytics tools
3. Contact QA ZERO support with details about your theme and the specific issues you're experiencing
