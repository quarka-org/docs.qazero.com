# QA ZERO Documentation

This repository contains the documentation website for QA ZERO, a WordPress plugin for analytics and heatmap functionality. The documentation is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

## Local Development

To set up the documentation site locally:

```bash
# Clone the repository
git clone https://github.com/quarka-org/docs.qazero.com.git
cd docs.qazero.com

# Install dependencies
npm install

# Start the development server
npm start
```

This will start a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

## Build

To build the static site:

```bash
npm run build
```

This command generates static content into the `build` directory that can be served using any static hosting service.

## Directory Structure

```
docs.qazero.com/
├── blog/                 # Blog posts
├── docs/                 # Documentation files
│   ├── user-manual/      # User manual documentation
│   ├── developer-manual/ # Developer documentation
│   ├── release-notes/    # Release notes
│   └── faq/              # Frequently asked questions
├── src/                  # React components and pages
├── static/               # Static files (images, etc.)
├── i18n/                 # Internationalization files
│   └── ja/               # Japanese translations
├── docusaurus.config.ts  # Docusaurus configuration
└── sidebars.ts           # Sidebar configuration
```

## Adding Content

### Documentation

Add new documentation pages to the appropriate directory under `docs/`. For example, to add a new page to the user manual:

1. Create a new Markdown file in `docs/user-manual/`
2. Add front matter with title and sidebar position
3. Write your content in Markdown

Example:

```md
---
sidebar_position: 3
title: My New Page
---

# My New Page

Content goes here...
```

### Blog Posts

Add new blog posts to the `blog/` directory with the filename format `YYYY-MM-DD-title.md`.

Example:

```md
---
slug: my-blog-post
title: My Blog Post
authors: [author_name]
tags: [tag1, tag2]
---

Blog content goes here...
```

## Internationalization

The documentation supports English (default) and Japanese. To add translations:

1. Create the corresponding file in the `i18n/ja/docusaurus-plugin-content-docs/current/` directory
2. Translate the content while maintaining the same structure

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch using GitHub Actions.

## Search Implementation

This documentation uses `docusaurus-lunr-search` for search functionality, which provides:

- Client-side search with no external dependencies
- Support for both English and Japanese languages
- No tracking or external API calls
- Secure implementation with no data leakage

For more details on the security review of the search implementation, see [Search Implementation Security Review](docs/search-implementation-security.md).

## DNS Configuration

For instructions on setting up the custom domain (docs.qazero.com), see [DNS Setup Instructions](docs/dns-setup-instructions.md).

## License

This documentation is licensed under the MIT License.
