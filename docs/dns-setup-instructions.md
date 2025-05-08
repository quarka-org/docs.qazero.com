---
title: DNS Setup Instructions for Custom Domain
---

# DNS Setup Instructions for docs.qazero.com

This document provides instructions for setting up the custom domain (docs.qazero.com) for the QA ZERO documentation site.

## Prerequisites

- Access to your domain's DNS settings (typically through your domain registrar)
- GitHub Pages site already deployed

## Setup Steps

### 1. Configure GitHub Pages

The repository is already configured to use the custom domain through:

- A CNAME file in the repository with `docs.qazero.com`
- GitHub Pages settings in the repository settings

### 2. DNS Configuration

To point your domain to GitHub Pages, you need to add the following DNS records:

#### Option 1: Apex Domain Configuration (Recommended)

If you're using the apex domain (docs.qazero.com), add these A records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 3600 |
| A | @ | 185.199.109.153 | 3600 |
| A | @ | 185.199.110.153 | 3600 |
| A | @ | 185.199.111.153 | 3600 |

#### Option 2: Subdomain Configuration

If docs.qazero.com is a subdomain, add a CNAME record:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME | docs | quarka-org.github.io | 3600 |

### 3. Verify DNS Configuration

After configuring your DNS records:

1. Wait for DNS propagation (can take up to 48 hours, but often completes within a few hours)
2. Verify the configuration using:
   ```
   dig docs.qazero.com +noall +answer
   ```
3. Check that the site is accessible at https://docs.qazero.com

### 4. Enforce HTTPS

Once the DNS is properly configured:

1. Go to the GitHub repository settings
2. Navigate to Pages settings
3. Check the "Enforce HTTPS" option

## Troubleshooting

If the domain is not working correctly:

1. Verify DNS records are correctly configured
2. Check that the CNAME file exists in the repository
3. Ensure GitHub Pages is enabled in repository settings
4. Check for any error messages in the GitHub Pages section of repository settings

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
