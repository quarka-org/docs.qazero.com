---
sidebar_position: 25
title: Acquisition
---

# Acquisition

The **Acquisition** report shows how users arrived at your website.  
You can change the reporting period using the date selector at the top.

---

## Channels

This section shows traffic grouped by channel.

### Channel types

Channels group traffic sources into categories for easier analysis.  
QA ZERO uses the following classifications:

| Channel | Description |
| :------ | :---------- |
| **Organic Search** | Traffic from unpaid search results (e.g., Google, Yahoo!) |
| **Paid Search** | Traffic from paid search ads |
| **Social** | Traffic from social media (e.g., Facebook, X, Instagram) |
| **Email** | Traffic from email links |
| **Affiliates** | Traffic from affiliate sites |
| **Display** | Traffic from display or banner ads |
| **Other Advertising** | Traffic from other ads with tracking parameters |
| **Referral** | Traffic from links on other websites |
| **Direct** | Direct visits or unknown sources |
| **Other** | Traffic that does not match any category |

---

## Source / Medium

This section shows detailed traffic by **Source / Medium**.

### What is Source?

**Source** indicates the website URL where the visitor came from.

In some cases, it is labeled as **direct**:

- The user entered the URL manually  
- The referrer cannot be identified  

---

### What is Medium?

**Medium** shows the type of traffic source.

It is determined by the `utm_medium` parameter if available.  
If not set, it is classified automatically.

---

#### When `utm_medium` is set

If a URL includes `utm_medium`, the specified value is used.

Examples:

- `utm_medium=email` → displayed as **email**  
- `utm_medium=press` → displayed as **press**

---

#### When `utm_medium` is not set

If `utm_medium` is not set, QA ZERO classifies traffic as follows:

| Medium | Condition |
| :----- | :-------- |
| **organic** | Search engine traffic |
| **cpc** | URL contains `gclid` (Google Ads) |
| **facebook** | URL contains `fbclid` |
| **twitter** | URL contains `twclid` |
| **referral** | Traffic from identifiable external links |
| **(none)** | Direct traffic |

---

## Graph display

You can select specific channels or source/medium items to display in the graph.

- Check the **Graph** column in the table  
- Click **Draw Graph**
