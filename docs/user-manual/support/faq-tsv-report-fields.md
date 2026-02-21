---
id: faq-tsv-report-fields
title: TSV Report Fields
sidebar_position: 3
---

# TSV Report Fields

This page explains the meaning of each field included in the TSV report that can be downloaded from QA ZERO.

---

## Field Definitions

### ■ pv

Indicates the page view order within a session.

- Increments as 1, 2, 3, ...
- Resets to 1 when a new session begins

---

### ■ speed_msec

Page load time in milliseconds.

It represents the time required for the page to fully load in the browser.

---

### ■ browse_sec

Time spent on the page (in seconds).

It represents the duration from when the page was opened until the user navigates to the next page.

---

### ■ is_last

Indicates whether the page is the exit page of the session.

- 1 = The last page viewed in the session  
- 0 = Otherwise  

---

### ■ is_newuser

Indicates whether the user is a new user.

- 1 = New user  
- 0 = Returning user  

This value is determined **per session**,  
so all rows within the same session will have the same value.

---

### ■ session_no

Indicates the visit number of the user for that day.

In QA ZERO:

> A session ends if there is no activity for 30 minutes.

If more than 30 minutes pass between interactions,  
a new session is created and `session_no` increases.

---

## When reader_id Is the Same but session_no Is Different

Example: `reader_id = 4313`

For this user:

- session_no = 1 (05:07) → Visited only the top page and exited  
- session_no = 2 (08:05) → Revisited approximately 3 hours later  
- session_no = 3 (19:09) → Revisited approximately 11 hours later  

Although the `reader_id` is the same,  
each visit is recorded as a separate session because the interval between visits exceeded 30 minutes.

---

## Session Boundary Rules

QA ZERO applies the following session rule:

> If there is no activity for 30 minutes, the session is considered ended.

This is a commonly used rule in web analytics tools.

---

## Summary

- `pv` indicates the page order within a session  
- `session_no` indicates the visit count  
- Sessions are separated by 30 minutes of inactivity  
- `is_last` marks the exit page  
- `is_newuser` is determined per session  