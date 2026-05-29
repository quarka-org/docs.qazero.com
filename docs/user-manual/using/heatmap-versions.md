---
sidebar_position: 51
title: About Heatmap Versions
---

# About Heatmap Versions

## What is a Heatmap Version?

QA ZERO stores a copy of each page's HTML and uses it to render heatmaps.

This stored HTML is called a **Heatmap Version**.

---

## Why the page content may look different

Heatmaps are rendered using the latest Heatmap Version stored in QA ZERO.

If the actual page content has changed since the Heatmap Version was created, the page displayed in the heatmap may not match the current page on your website.

To synchronize the heatmap with the current page content, update the Heatmap Version.

---

## Before updating a Heatmap Version

Heatmaps are always rendered using the latest Heatmap Version.

QA ZERO does not provide a feature to switch between previous Heatmap Versions.

Before updating a Heatmap Version, consider saving screenshots of the current heatmap if you need to compare the before and after states later.

---

## Updating a Heatmap Version

When page content changes and you want the heatmap to reflect the latest version, click **Update Heatmap Version** at the top of the Heatmap screen.

QA ZERO will:

1. Retrieve the page HTML for each device type
2. Create a new Heatmap Version
3. Reload the screen automatically

After the update, heatmaps will be displayed using the new Heatmap Version.

---

## Position differences

If the selected period includes data collected before and after a Heatmap Version update, some heatmap positions may appear slightly different from the actual interaction locations.
