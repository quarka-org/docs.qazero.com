---
sidebar_position: 110
title: Observed Behaviors
toc_max_heading_level: 2
---

# Observed Behaviors

This page summarizes behaviors observed in QA ZERO.  
Some behaviors may be related to specifications or specific environments.

---

## Some traffic may be classified as "Other" in the Acquisition Report

**Status**: Improvement planned

### Overview

Some traffic may be classified as "Other" in the Acquisition Report.

QA ZERO mainly uses the `utm_medium` value in the URL to determine the channel. If the value does not match the predefined rules, the traffic is classified as "Other."

### Notes

The measurement data itself is not lost when traffic is classified as "Other."

You can check traffic sources and `utm_medium` values in the **Source / Medium** section of the Acquisition Report.

We plan to improve this feature so channel classification rules can be configured for each site.

---

## New and returning user counts may be displayed incorrectly

**Status**: Fix planned

### Overview

New and returning user counts may be displayed incorrectly in some reports.

The following issues have been confirmed:

* Returning users are displayed as "0" in the Visit Report.
* New user counts are displayed incorrectly in the channel section of the Acquisition Report.

### Notes

The underlying new and returning user data is not lost.

You can check the correct counts in the **Source / Medium** section of the Acquisition Report.

We plan to fix the aggregation process.

---

## New users may appear as "Returning" in past session replays

**Status**: Fix planned

### Overview

When opening a past session replay, a new user may be displayed as a "Returning" user.

### Notes

This is a display issue. The session data itself is not recorded incorrectly.

Sessions opened from the real-time view are displayed correctly.

We plan to fix the display logic.

---

## Some bot traffic may be included in measurement data

**Status**: Improvement planned

### Overview

Some bot traffic, such as search engine crawlers, may be included in QA ZERO measurement data, including page views.

### Conditions

This may occur when a bot executes JavaScript and reaches the QA ZERO measurement process.

### Notes

We plan to improve bot detection so this traffic can be excluded more accurately.

