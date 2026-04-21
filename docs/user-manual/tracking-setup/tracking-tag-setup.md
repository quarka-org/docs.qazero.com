---
id: tracking-tag-setup
title: Tracking Tag Setup
sidebar_position: 4
---

# Tracking Tag Setup

## About This Page

This page explains how to install the **tracking tag** on your website.

Installing the tracking tag is required to start data collection in QA ZERO.

---

## What is the Tracking Tag?

The tracking tag is a **script issued by QA ZERO**.  
It enables tracking of access and user behavior on your site.

- A tracking tag is issued **for each domain**
- Do not modify the tag content
- If you track multiple domains, install the **corresponding tag for each domain**

---

## Where to Install the Tag

Place the tracking tag inside the `<head>` section of each page.

Make sure:

- It loads on **all pages you want to track**
- It is not installed on only some pages

---

## Using Google Tag Manager (Recommended)

You can install the tag directly in HTML, but using **Google Tag Manager (GTM)** is recommended.

Benefits of using GTM:

- Easier tag management
- More stable execution order
- Flexible for future changes

If you already use another tag management method, you can follow that approach.

---

## Important Notes

- After installation, clear your browser cache before testing
- Tracking will not start if the tag is not loaded correctly
- Check the admin reports to confirm data is being collected

---

## If You Use a Cookie Consent Tool

If your site uses a **cookie consent tool (cookie banner, etc.)**,  
you also need to install a **cookie consent integration tag**.

See:
[Cookie Consent Integration (Script Tag Setup)](./cookie-consent-tool-setup.md)

---

## After Installation

- Make sure the tracking tag is loaded on all target pages
