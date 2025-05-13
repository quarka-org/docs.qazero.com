---
sidebar_position: 1
title: Installation
---

# Installation

This guide will help you install the QA ZERO analytics server using WordPress as the deployment platform.

## Understanding the Installation Process

While QA ZERO is distributed as a WordPress plugin for convenience, it's important to understand that you're actually installing an independent analytics server that uses WordPress as middleware. The WordPress plugin format simply provides an easy installation and management interface for the underlying analytics server.

## System Requirements

Before installing QA ZERO, ensure your system meets the following requirements:

- WordPress 5.5 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Sufficient server resources to run the analytics server (minimum 1GB RAM recommended)

## Installation Methods

### Method 1: Install from WordPress Plugin Directory

1. Log in to your WordPress admin dashboard
2. Navigate to **Plugins > Add New**
3. Search for "QA ZERO"
4. Click **Install Now** next to the QA ZERO plugin
5. After installation completes, click **Activate**

### Method 2: Manual Installation

1. Download the QA ZERO plugin ZIP file from [our website](https://qazero.com/download) or the WordPress plugin directory
2. Log in to your WordPress admin dashboard
3. Navigate to **Plugins > Add New**
4. Click the **Upload Plugin** button at the top of the page
5. Click **Choose File** and select the QA ZERO ZIP file you downloaded
6. Click **Install Now**
7. After installation completes, click **Activate**

## What Happens During Installation

When you activate QA ZERO, the following components are set up:

1. **WordPress Integration Layer**: Creates the management interface within your WordPress admin
2. **Analytics Server Core**: Installs the independent analytics engine that processes visitor data
3. **Data Collection Scripts**: Adds the necessary tracking code to your website

## Verifying Installation

To verify that QA ZERO has been installed correctly:

1. In your WordPress admin dashboard, you should see a new menu item labeled "QA ZERO"
2. Click on the QA ZERO menu to access the analytics dashboard
3. You should see the QA ZERO welcome screen with server status information

![QA ZERO Welcome Screen](/img/placeholder-image.png)

If you don't see the QA ZERO menu or encounter any errors, please refer to the [Troubleshooting](/docs/user-manual/troubleshooting/recording-issues) section.

## Next Steps

After successfully installing the QA ZERO analytics server, proceed to the [Initial Setup](/docs/user-manual/start-guide/initial-setup) guide to configure your analytics environment.
