---
sidebar_position: 2
title: Data Loss Issues
---

# Troubleshooting Data Loss

If you're experiencing data loss or missing data in QA ZERO, this guide will help you identify and resolve common causes.

## Types of Data Loss

### Complete Data Loss

Complete data loss occurs when all historical data disappears from your QA ZERO dashboard.

Possible causes:

1. **Database Reset**: Accidental use of the "Reset Data" function
2. **Plugin Reinstallation**: Uninstalling and reinstalling the plugin without proper backup
3. **Database Corruption**: Server issues affecting the WordPress database

### Partial Data Loss

Partial data loss occurs when some data is missing for specific time periods or pages.

Possible causes:

1. **Tracking Interruption**: Temporary issues with the tracking script
2. **Data Processing Errors**: Background processing failures
3. **Data Retention Settings**: Automatic deletion of older data
4. **Content Filtering**: Exclusion rules preventing data collection

## Diagnosing Data Loss Issues

### Check Data Collection Status

1. Navigate to **QA ZERO > Dashboard**
2. Look for the **Data Collection Status** indicator
3. If it shows "Active," data collection is currently working

### Verify Recent Data

1. Navigate to **QA ZERO > Analytics**
2. Set the date range to "Today" or "Yesterday"
3. Check if recent data is being recorded
4. If recent data exists but historical data is missing, the issue is likely with stored data rather than collection

### Check Database Status

1. Navigate to **QA ZERO > Tools > Database**
2. Run a **Database Integrity Check**
3. Note any errors or warnings

![Database Integrity Check](/img/placeholder-image.png)

### Review System Logs

1. Navigate to **QA ZERO > Tools > Logs**
2. Look for errors related to data processing or storage
3. Note the timestamps of any relevant errors

## Common Causes and Solutions

### Data Retention Settings

QA ZERO automatically removes old data based on your retention settings:

1. Navigate to **QA ZERO > Settings > Data**
2. Check the **Data Retention Period** setting
3. If set to a short period (e.g., 30 days), older data will be automatically deleted
4. Adjust the setting to a longer period if needed
5. Note that changing this setting will not restore already deleted data

### Database Issues

Database corruption can cause data loss:

1. Navigate to **QA ZERO > Tools > Database**
2. Run **Optimize Tables** to repair and optimize the database
3. If issues persist, run **Repair Tables**

For severe database issues:

1. Check your server's error logs for database-related errors
2. Contact your hosting provider for assistance with database repair
3. Restore from a backup if available

### Tracking Script Issues

If the tracking script was temporarily disabled or broken:

1. Navigate to **QA ZERO > Settings > Tracking**
2. Verify that tracking is enabled
3. Check the **Script Status** indicator
4. If it shows "Warning" or "Error," click on the status for more information

### Plugin Conflicts

Other plugins may interfere with QA ZERO's data collection or storage:

1. Navigate to **QA ZERO > Tools > Diagnostics**
2. Run a **Plugin Compatibility Check**
3. Review any conflicts detected
4. Resolve conflicts by updating or reconfiguring the conflicting plugins

### Server Resource Limitations

Limited server resources can prevent data processing:

1. Navigate to **QA ZERO > Tools > System Info**
2. Check the **Server Resources** section
3. If values are below recommended levels, contact your hosting provider about upgrading

## Recovering Lost Data

### From Backup

If you have a backup of your WordPress database:

1. Restore the database from backup
2. Navigate to **QA ZERO > Tools > Database**
3. Run **Sync Data** to ensure consistency

### Using Data Recovery Tool

QA ZERO includes a data recovery tool for some scenarios:

1. Navigate to **QA ZERO > Tools > Recovery**
2. Click **Scan for Recoverable Data**
3. If recoverable data is found, click **Recover Data**
4. Follow the prompts to complete the recovery process

![Data Recovery Tool](/img/placeholder-image.png)

### From Local Storage

In some cases, data may still exist in visitors' browsers:

1. Navigate to **QA ZERO > Settings > Advanced**
2. Enable **Local Storage Recovery**
3. Save changes
4. This will attempt to recover data from returning visitors' browsers

## Preventing Future Data Loss

### Regular Backups

Set up regular backups of your WordPress database:

1. Use a backup plugin like UpdraftPlus or BackupBuddy
2. Schedule daily or weekly backups
3. Store backups in a secure, off-site location

### Optimal Settings

Configure QA ZERO for reliable data collection:

1. Navigate to **QA ZERO > Settings > Performance**
2. Enable **Reliable Data Mode** (may slightly increase server load)
3. Set **Processing Frequency** to "More Frequent"
4. Save changes

### Monitoring

Set up monitoring to detect issues early:

1. Navigate to **QA ZERO > Settings > Notifications**
2. Enable **Data Collection Alerts**
3. Enter your email address
4. Select alert conditions (e.g., "No data collected for 24 hours")
5. Save changes

## Getting Support

If you've tried the troubleshooting steps above and still have issues:

1. Navigate to **QA ZERO > Tools > System Info**
2. Click **Copy System Info**
3. Contact QA ZERO support with:
   - Your system information
   - Description of the data loss
   - Time period affected
   - Steps you've already taken to troubleshoot
