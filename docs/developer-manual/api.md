---
sidebar_position: 3
title: API Reference
---

# API Reference

This document provides information about the QA ZERO API for developers who want to integrate with or extend QA ZERO.

## REST API Endpoints

QA ZERO exposes several REST API endpoints for retrieving analytics data:

### Analytics Data

```
GET /wp-json/qa-zero/v1/analytics
```

Parameters:
- `start_date`: Start date for data range (YYYY-MM-DD)
- `end_date`: End date for data range (YYYY-MM-DD)
- `metrics`: Comma-separated list of metrics to retrieve

### Heatmap Data

```
GET /wp-json/qa-zero/v1/heatmap
```

Parameters:
- `page_id`: ID of the page to retrieve heatmap data for
- `type`: Type of heatmap (click, scroll, movement)
- `start_date`: Start date for data range (YYYY-MM-DD)
- `end_date`: End date for data range (YYYY-MM-DD)

### Session Recordings

```
GET /wp-json/qa-zero/v1/sessions
```

Parameters:
- `page_id`: (Optional) Filter by page ID
- `start_date`: Start date for data range (YYYY-MM-DD)
- `end_date`: End date for data range (YYYY-MM-DD)
- `limit`: Maximum number of sessions to return

## WordPress Hooks

QA ZERO provides several WordPress hooks for extending functionality:

### Actions

- `qa_zero_before_track`: Fired before tracking data is collected
- `qa_zero_after_track`: Fired after tracking data is collected
- `qa_zero_process_data`: Fired when data is being processed
- `qa_zero_generate_report`: Fired when a report is generated

### Filters

- `qa_zero_tracking_data`: Filter tracking data before it's stored
- `qa_zero_analytics_data`: Filter analytics data before it's displayed
- `qa_zero_heatmap_data`: Filter heatmap data before it's displayed
- `qa_zero_session_data`: Filter session data before it's displayed

## JavaScript API

QA ZERO provides a JavaScript API for interacting with the tracking system:

```javascript
// Track a custom event
QAZero.trackEvent('event_name', {
  category: 'category',
  label: 'label',
  value: 123
});

// Exclude an element from tracking
QAZero.excludeElement(document.getElementById('element-id'));

// Pause tracking temporarily
QAZero.pauseTracking();

// Resume tracking
QAZero.resumeTracking();
```

## Coming Soon

More detailed API documentation will be added in future updates.
