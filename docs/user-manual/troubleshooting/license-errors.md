---
sidebar_position: 3
title: License Errors
---

# Troubleshooting License Errors

If you're experiencing issues with your QA ZERO license, this guide will help you identify and resolve common license-related problems.

## Common License Errors

### Invalid License Key

If you see an "Invalid License Key" error:

![Invalid License Key Error](/img/placeholder-image.png)

Possible causes:

1. **Typo in License Key**: The license key was entered incorrectly
2. **Expired License**: The license has expired and needs renewal
3. **Revoked License**: The license has been revoked due to terms violation

### License Activation Limit Reached

If you see a "License Activation Limit Reached" error:

![Activation Limit Error](/img/placeholder-image.png)

This means you've activated the license on the maximum number of sites allowed by your license tier.

### Connection Error

If you see a "Connection Error" when trying to activate or verify your license:

![License Connection Error](/img/placeholder-image.png)

This indicates that your WordPress site cannot connect to the QA ZERO license server.

### License Deactivated Unexpectedly

If your previously activated license shows as deactivated:

![License Deactivated Error](/img/placeholder-image.png)

This can occur if the license was deactivated from another location or if there are connectivity issues.

## Resolving License Issues

### Verify License Key

1. Navigate to **QA ZERO > License**
2. Check the license key for typos or extra spaces
3. Re-enter the license key if necessary
4. Click **Activate License**

### Check License Status

1. Log in to your QA ZERO account at [https://qazero.com/account/](https://qazero.com/account/)
2. Go to the **Licenses** section
3. Check the status, expiration date, and activation count of your license
4. If expired, renew your license

![License Status in Account](/img/placeholder-image.png)

### Deactivate Unused Sites

If you've reached your activation limit:

1. Log in to your QA ZERO account at [https://qazero.com/account/](https://qazero.com/account/)
2. Go to the **Licenses** section
3. View the list of sites where your license is activated
4. Click **Deactivate** next to sites you no longer need
5. Return to your WordPress site and activate the license again

### Fix Connection Issues

If you're experiencing connection errors:

1. Navigate to **QA ZERO > Tools > System Info**
2. Check the **Connectivity** section
3. Verify that your site can connect to qazero.com

If connection issues are detected:

1. Check if your server has outbound connection restrictions
2. Temporarily disable any security plugins or firewalls
3. Contact your hosting provider to ensure they don't block outbound connections

### Manual License Activation

If automatic activation fails, you can try manual activation:

1. Navigate to **QA ZERO > License**
2. Click **Manual Activation**
3. Copy the site key displayed
4. Log in to your QA ZERO account
5. Go to the **Manual Activation** section
6. Paste your site key and generate an activation code
7. Copy the activation code and paste it back in your WordPress site
8. Click **Activate License**

![Manual License Activation](/img/placeholder-image.png)

## License Tiers and Upgrades

### Understanding License Tiers

QA ZERO offers several license tiers:

| Tier | Sites | Features | Support |
|------|-------|----------|---------|
| Free | 1 | Basic analytics, limited heatmaps | Community forum |
| Personal | 1 | Full analytics, all heatmap types | Email support |
| Business | 3 | All features + advanced reporting | Priority support |
| Agency | 10 | All features + white labeling | Dedicated support |

### Upgrading Your License

To upgrade your license:

1. Log in to your QA ZERO account at [https://qazero.com/account/](https://qazero.com/account/)
2. Go to the **Licenses** section
3. Click **Upgrade** next to your current license
4. Select the new license tier
5. Complete the checkout process
6. Your license will be automatically upgraded

### Downgrading Your License

To downgrade your license:

1. Wait until your current license expires
2. Purchase the lower-tier license
3. Activate the new license on your site

Note that downgrading may result in loss of access to certain features.

## License Renewal

### Automatic Renewal

By default, QA ZERO licenses are set to renew automatically:

1. You will receive email notifications before the renewal date
2. The renewal will use the payment method on file
3. Your license will continue without interruption

### Manual Renewal

If you've disabled automatic renewal:

1. Log in to your QA ZERO account at [https://qazero.com/account/](https://qazero.com/account/)
2. Go to the **Licenses** section
3. Click **Renew** next to the expiring license
4. Complete the checkout process

### Renewal Discounts

QA ZERO offers renewal discounts:

1. 15% discount for 1-year renewals
2. 25% discount for 2-year renewals
3. 35% discount for 3-year renewals

## Transferring Licenses

To transfer a license to a different site:

1. Deactivate the license on the current site
2. Navigate to **QA ZERO > License** on the new site
3. Enter your license key
4. Click **Activate License**

## Getting Support for License Issues

If you continue to experience license issues:

1. Check the [QA ZERO Knowledge Base](https://qazero.com/kb/) for license-related articles
2. Contact QA ZERO support with:
   - Your license key (last 4 characters only for security)
   - Description of the issue
   - Screenshots of any error messages
   - Steps you've already taken to troubleshoot
