---
sidebar_position: 120
title: Prompt Examples for AI Integration (MCP)
---

# Prompt Examples for AI Integration (MCP)

With MCP, AI translates your questions into queries using QA ZERO's data fields. Ambiguous wording can affect which fields and pages it selects.

This page explains available data, key terms, and ways to ask clear questions. For connection instructions, see [AI Integration (MCP)](./ai-mcp.md).

## Available data and example questions

QA ZERO records pageviews, traffic sources, and behavior within pages. You can ask AI about:

| Data | What you can explore |
| --- | --- |
| Pageviews and visits | Popular pages, landing pages, bounces, exits, and navigation between pages |
| Scrolling and reading | Scroll depth, engaged reading, and time on page |
| Signs of confusion or frustration | Rage clicks, searching for clickable elements, and skipping content |
| Clicks | Button and link clicks, including outbound links |
| Traffic sources | Search, social media, ads, email, and UTM parameters |
| Devices | Differences between desktop, mobile, and tablet |
| Google Search Console | Search query impressions, clicks, and positions; requires [Google Search Console Integration](./google-search-console.md) |
| Goals | Visits that achieved a configured goal, such as completing an inquiry |

See [Materials Explorer (data catalog)](pathname:///tools/materials-explorer/index.html) for the full list of data fields.

## Key terms

QA ZERO uses the following definitions. Clarifying these meanings can help AI answer as intended.

| Term | Meaning in QA ZERO |
| --- | --- |
| Pageview | One display of a page |
| Visit | A continuous browsing session by the same person |
| Landing page | The first page viewed in a visit |
| Bounce | A visit that ends after viewing only the landing page |
| Exit page | The last page viewed in a visit |
| Scroll depth | How far down a page the visitor scrolled, from 0% to 100% |
| Engaged reading | A pageview with pauses of at least three seconds at five or more locations. The engaged reading rate is the percentage of pageviews meeting this condition. |
| Time on page | Time spent viewing a page, in seconds |
| Rage click | Five or more rapid clicks within three seconds |

QA ZERO has no predefined “reading completion rate.” Define your own measure, such as “the percentage of pageviews reaching at least 80% scroll depth.”

Engaged reading and reading completion measure different things. A page can rank highly for one and poorly for the other.

## Tips for clear questions

Include these five details when relevant:

1. **Target pages**  
   Specify URL patterns, such as “individual articles under /blog/.” State whether to exclude listing pages.

2. **Period**  
   Always specify a period. Use exact dates when you need a precise range.

3. **Definitions**  
   Explain ambiguous terms, such as “reading completion,” “exit,” or “external site.”

4. **Counting rules**  
   Specify pageviews or visits, minimum traffic thresholds, and whether to group URLs that differ only by query parameters.

5. **Site-specific rules**  
   Identify important pages by URL, such as service pages and inquiry confirmation pages.


### Make sure AI understands your request

Adding the following to your question lets you check the data and conditions AI plans to use before querying:

> Before querying, explain in plain language which data you will use and how you will define the period and target pages. Ask me about anything unclear.

If the result seems unexpected, this follow-up question can help you check the data and counting method used:

> Which data did you use, and how did you count it? Please explain in plain language.


## Prompt examples

These examples turn broad questions into more specific requests.

<div className="prompt-examples-table">

| Broad question | More specific prompt |
| --- | --- |
| Which five blog articles have the highest engaged reading rate? | For September 1–30, 2026, show the five individual articles under /blog/ with the highest engaged reading rate. Exclude blog home, category, tag, author, and pagination listings. Include only articles with at least 10 pageviews. Group URLs that differ only by query parameters. |
| Do mobile and desktop visitors read differently? | For September 1–30, 2026, compare average and median scroll depth and time on page between desktop and mobile. Use individual articles under /blog/, excluding blog home, category, tag, author, and pagination listings. Exclude tablets. |
| Which pages were viewed most last week? | For October 12–18, 2026, show the five pages with the most pageviews. Group URLs that differ only by query parameters. Exclude admin preview views. |
| Is the blog getting more traffic than last month? | Compare September 1–30 with October 1–31, 2026. Show total pageviews for individual articles under /blog/ and the number of visits that viewed at least one article. Exclude blog home, category, tag, author, and pagination listings. |
| Which pages have the highest bounce rate? | For September 1–30, 2026, show the five pages with the highest bounce rate among pages with at least 10 landing visits. Break ties by the number of landing visits, highest first. |
| Rank articles by reading completion rate. | For September 1–30, 2026, define reading completion rate as the percentage of pageviews reaching at least 80% scroll depth. Rank individual articles under /blog/ by this rate. Exclude blog home, category, tag, author, and pagination listings. Require at least 10 pageviews per article. Group URLs that differ only by query parameters. |
| Where did visitors go after clicking out of the site? | For September 1–30, 2026, count link clicks to destinations outside example.com and its subdomains, including docs.example.com. Group by destination URL and sort by click count, highest first. Exclude social sharing buttons. |
| Which search keywords bring visitors? | Using Google Search Console data for September 1–30, 2026, show the 10 web search queries with the most impressions. Include clicks for each query. |
| Which pages lead to inquiries? | For July 1–September 30, 2026, find visits that reached /contact/thanks/. List pages viewed before that page, ranked by the number of visits. Exclude /contact/ and /contact/confirm/. |
| Do blog readers also view service pages? | For September 1–30, 2026, find visits that viewed individual articles under /blog/. Exclude blog home, category, tag, author, and pagination listings. What percentage also viewed a page under /service/ during the same visit, in any order? |
| Where did visitors from ads exit? | For September 1–30, 2026, find visits with utm_campaign set to autumn_sale. Rank their exit pages by the number of visits. Group URLs that differ only by query parameters. |

</div>

URLs and parameter values are examples. Replace them with values for your site.


