---
sidebar_position: 2
title: Initial Setup
---

# Initial Setup

After installing the QA ZERO analytics server, you'll need to complete the initial setup to configure the system and start collecting data.

## Understanding the Setup Process

The initial setup configures both the WordPress integration layer and the underlying analytics server. While you'll be interacting with the setup through the WordPress admin interface, you're actually configuring an independent analytics system that operates alongside WordPress.

## Accessing QA ZERO Management Interface

1. Log in to your WordPress admin dashboard
2. Navigate to **QA ZERO** in the main menu
3. Click on **Analytics Settings** to access the configuration options

![QA ZERO Management Interface](/img/placeholder-image.png)

## Server Configuration

### General Settings

1. **Enable Analytics Server**: Toggle this option to start the analytics server and begin data collection
2. **Server Resources**: Configure how much of your server resources the analytics engine can utilize
3. **Track Logged-in Users**: Choose whether to track users who are logged in to your WordPress site
4. **Data Retention Period**: Select how long to keep collected data (30 days, 90 days, 180 days, 1 year, or forever)
5. **Save Changes**: Click the Save button to apply your settings

### Privacy Settings

QA ZERO is designed with privacy in mind and complies with regulations like GDPR and CCPA:

1. **IP Anonymization**: Enable to anonymize visitor IP addresses
2. **Personal Data Collection**: Configure what personal data is collected, if any
3. **Data Processing Location**: Specify where analytics data should be processed and stored
4. **Save Changes**: Click the Save button to apply your settings

## Configuring Analytics Features

### Setting Up Data Collection

1. Navigate to **QA ZERO > Analytics** in the main menu
2. In the **Data Collection** tab, configure which pages and interactions to track
3. Set up event tracking for specific user actions (clicks, form submissions, etc.)
4. Configure conversion goals if needed
5. Save your settings

### Viewing Analytics Data

The analytics data is accessible through the Analytics dashboard:

1. Navigate to **QA ZERO > Analytics Dashboard**
2. View real-time data in the dashboard
3. Access heatmaps and other visualization tools through the Analytics interface

![Analytics Dashboard](/img/placeholder-image.png)

## Verifying Server Operation

After completing the initial setup:

1. Visit your website as a normal user
2. Perform some actions (click links, scroll, etc.)
3. Return to the QA ZERO analytics dashboard
4. Check the server status indicator to ensure the analytics server is running properly
5. Verify that data is being collected in the Analytics section

Note that it may take a few minutes for data to appear in your dashboard as the analytics server processes the information.

## Next Steps

Now that you've completed the initial setup of your analytics server, explore the following features:

- [Screens and Operations Overview](/docs/user-manual/screens-operations/overview)
- [Heatmap Usage](/docs/user-manual/screens-operations/heatmap-usage)
- [Article Data Analysis](/docs/user-manual/screens-operations/article-data)
