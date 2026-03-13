---
sidebar_position: 5
title: Heatmap
---

# Heatmap

The Heatmap feature visualizes actual user behavior on your pages.  
It helps you quickly understand how visitors interact with a page and identify trends in user activity.

## How to View a Heatmap

Heatmaps can be accessed from the **page reports** under **Behavior** in the left menu.

Open a report for a page and use the **Heatmap** column in each row to display the heatmap.  
The data shown reflects the currently selected period and filter conditions.

---

## Types of Heatmaps

You can switch between heatmap types from the options at the top of the screen.

The colors and intensity represent the **relative concentration of user actions** on the page.

### Scroll Map

The Scroll Map shows how far users scroll on a page.

It indicates what percentage of visitors reached each position on the page.  
The number of users who reached that position is also displayed.

### Attention Map

The Attention Map highlights areas where users tend to focus their attention.

Sections that are viewed more frequently appear in **red**.  
This is calculated based on viewing time and dwell patterns.

### Click Heatmap

The Click Heatmap visualizes where clicks occurred on the page.

Areas with more clicks appear **redder**.  
Clicks on non-link elements are also included.

### Click Count Map

The Click Count Map displays the **number of clicks for each element**.

It shows how many times banners, buttons, or links were clicked.

In this map, the background color of the click count depends on the **CSS positioning of the element**.

* **Blue background**  
  Indicates elements that stay fixed on the screen when scrolling.  
  These are elements whose HTML tag or parent element uses `position: absolute` or `position: fixed`.

* **Black background**  
  Indicates elements positioned within the normal page layout.

---

## Color Scale

In the Scroll Map, Attention Map, and Click Heatmap, colors change gradually to represent the intensity of user activity.

![Color Scale](/img/heatmap/heatmap-4.png)

---

## Screen Controls

The menu bar at the top of the screen allows you to change display conditions and review detailed data.

* **Filter**  
  Filter data by referrer and other conditions.  
  Clicking the button opens the filter window.

* **Period**  
  Change the time range of the data displayed in the heatmap.

* **Device Selection**  
  Switch between **PC, Smartphone, and Tablet** data.

* **Update Heatmap Version**  
  Updates the HTML of the page used to render the heatmap.

### Metrics

* **Valid Data**  
  The number of sessions used to generate the heatmap.

* **Average Stay**  
  The average time users spent viewing the page.  
  This excludes time when the user was not actively viewing the page.

---

## Notes

* **Data Differences**  
  The number of page views and the data used to render the heatmap may differ because they use different aggregation criteria.

* **Impact of Site Changes**  
  If the HTML of the page has changed, the heatmap may not perfectly match the current page content.

  For more details, see [Heatmap Versions](./heatmap-versions).