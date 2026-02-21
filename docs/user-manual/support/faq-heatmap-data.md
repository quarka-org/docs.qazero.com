---
id: faq-heatmap-data
title: Heatmap Data Aggregation
sidebar_position: 2
---

# Heatmap Data Aggregation

This page explains why the numbers shown on the Goal screen and the Heatmap screen may differ.

---

## Q. Why does the “Sessions” count on the Goal screen not match the “Data Count” on the Heatmap screen?

Example:  
The Goal screen shows **400 sessions**, while the Heatmap shows **1200 data entries**.

### A. Because the counting units are different.

---

### What “Sessions” on the Goal screen actually represents

The “Sessions” value displayed in the Goal table actually represents:

> The total number of page views (PV) for which heatmap data was recorded.

Although the label says “Sessions,” the internal logic aggregates **valid heatmap-related page views (PV)**.

---

### What “Data Count” on the Heatmap screen represents

The “Data Count” displayed on the Heatmap screen also counts data in **page view (PV) units**.

However, it may appear larger than the Goal screen value for the following reasons:

- **Multiple views within a single session**  
  If one user (one session) views the target page three times (3 PV),  
  the session count is “1,” but the heatmap data is recorded as “3.”

- **Label definition differences**  
  The Goal table uses the label “Sessions” for convenience,  
  but internally aggregates PV counts per device.  
  Therefore, the value tends to be closer to PV totals rather than actual session counts.

---

## Q. Even if the numbers differ, is the heatmap drawn only from sessions that achieved the goal?

### A. Yes. The data is correctly filtered.

The heatmap rendering process extracts:

> Only data associated with sessions that achieved the goal.

The numerical difference occurs because:

- Actions after goal completion
- Repeated views within the same session

are all counted in PV units.

Data from users who did not achieve the goal is **not included** in the heatmap.

---

## How to Interpret the Numbers (Summary)

| Screen | Field Name | What the Number Represents |
|--------|------------|----------------------------|
| Goal screen table | Sessions | Total valid PV count for heatmap data (labelled as Sessions) |
| Heatmap display | Data Count | Total valid log entries used for rendering (PV-based) |

---

> 💡 Key Point  
> A difference such as 400 (Goal screen) and 1200 (Heatmap) indicates that users who achieved the goal repeatedly viewed or navigated the page.  
> This behavior is correctly reflected in the heatmap data.