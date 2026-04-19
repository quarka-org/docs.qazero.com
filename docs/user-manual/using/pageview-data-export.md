---
sidebar_position: 85
title: Pageview-Level Data Export
---

# Pageview-Level Data Export

The **Advanced Export** section lets you download pageview-level data as a TSV file.

This report contains raw data stored in QA ZERO.  
This page explains each field and how to read the data.

---

## Download location

Go to the **Audience** page and click:

**Download Detailed Pageview Data (TSV)** at the bottom.

---

## TSV fields

| # | Field | Type | Description |
| :- | :---- | :---- | :---------- |
| 1 | **reader_id** | Integer | Unique user ID assigned by QA ZERO |
| 2 | **UAos** | String | OS information (e.g., Windows, iPhone) |
| 3 | **UAbrowser** | String | Browser information |
| 4 | **url** | String | Page URL |
| 5 | **title** | String | Page title |
| 6 | **device_id** | String | Device type (pc / tab / smp) |
| 7 | **utm_source** | String | Traffic source |
| 8 | **source_domain** | String | Referrer domain |
| 9 | **utm_medium** | String | Traffic medium |
| 10 | **utm_campaign** | String | Campaign name |
| 11 | **session_no** | Integer | Session number per day |
| 12 | **access_time** | Datetime | Access timestamp |
| 13 | **pv** | Integer | Pageview order within a session |
| 14 | **speed_msec** | Integer | Page load time (ms) |
| 15 | **browse_sec** | Float | Time spent on page (seconds) |
| 16 | **is_last** | 0 or 1 | Exit flag |
| 17 | **is_newuser** | 0 or 1 | New user flag |

---

## Key fields explained

### pv

- Sequential number within a session (1, 2, 3, ...)
- Resets to 1 when a new session starts

---

### speed_msec

- Time to fully load the page  
- Unit: milliseconds  

---

### browse_sec

- Time spent on the page  
- Measured until the next pageview or session end  

---

### is_last

- Indicates the last page in a session  
- Only one row per session has value `1`  

---

### is_newuser

- Determined at session start  
- All rows in the same session share the same value  
- May change depending on cookie state  

---

### session_no

- Session count per user per day  
- Resets when the date changes  

Session rules:

- 30+ minutes inactivity → new session  
- Within 30 minutes → same session  

---

### reader_id

- Unique user identifier assigned by QA ZERO  
- Cookie-based, so it may differ across devices or browsers  

---

## Examples

### Single page visit

| reader_id | session_no | pv | is_last | browse_sec |
| :-------- | :--------- | :-- | :------ | :---------- |
| 4313 | 1 | 1 | 1 | 0 |

User visited one page and left immediately.

---

### Multiple page session

| reader_id | session_no | pv | is_last | browse_sec |
| :-------- | :--------- | :-- | :------ | :---------- |
| 5000 | 1 | 1 | 0 | 30 |
| 5000 | 1 | 2 | 0 | 45 |
| 5000 | 1 | 3 | 1 | 10 |

User viewed 3 pages and exited on the last page.

---

### Multiple sessions in a day

| reader_id | session_no | access_time | pv | is_last |
| :-------- | :--------- | :----------- | :-- | :------ |
| 4313 | 1 | 05:07:35 | 1 | 1 |
| 4313 | 2 | 08:05:49 | 1 | 1 |

User visited twice with a gap, creating separate sessions.
