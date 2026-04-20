---
sidebar_position: 90
title: Goal (Conversion) Settings
---

# How to Set Goals (Conversions)

In QA ZERO, you can define important actions on your website—such as form submissions or button clicks—as **Goals**.

By setting goals, you can analyze the behavior of users who completed these actions.

---

## Required permissions

You need **QA ZERO Admin** permissions to create or edit goals.

- **Admin (QA ZERO Admin)**  
  The **Settings** menu appears in the left sidebar. You can create and edit goals.

- **Viewer (QA ZERO View)**  
  The **Settings** menu is not available. Goals cannot be created or modified.

---

## Retroactive calculation

QA ZERO automatically applies goal settings to past data.

- You can add goals at any time  
- Data is recalculated from the start of tracking  
- Changes are reflected immediately  

This means you can start analysis even if goals were not set earlier.

---

## Steps to set a goal

Open the **Settings** page from the left menu.

---

### Step 1: Basic settings

1. **Goal name**  
   Enter a name (e.g., Contact Form Submission, Download Button)

2. **Monthly target (optional)**  
   Set a monthly goal count.  
   This will be shown in the Goals report as a progress chart.

3. **Goal value (optional)**  
   Set a value per conversion (e.g., revenue per action).  
   This enables value-based reporting.

4. **Goal type**  
   Select one of the following:

   - **Destination**: Triggered when a specific page is viewed  
   - **Click**: Triggered when a specific element is clicked  

---

### Step 2: Detailed conditions

#### A. Destination

- **Match type**
  - **Prefix match**: Matches URLs that start with the specified value  
  - **Exact match**: Matches only the exact URL  

- **Target URL**
  Enter the URL of the goal page

---

#### B. Click

1. Enter the page URL where the element exists  
2. Click **Load Page**  
3. Select the target button or link in the preview  

The selector is automatically set.

---

### Step 3: Save

Click **Save Goal** to complete setup.

After saving, data is recalculated including past sessions.

---

## Where to view results

You can view goal data in the **Goals** report from the left menu.
