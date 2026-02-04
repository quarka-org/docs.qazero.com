import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * QA ZERO Documentation Sidebars Configuration
 * 
 * This file defines the sidebar navigation structure for the documentation.
 * Each section (user manual, developer manual, etc.) has its own sidebar.
 */
const sidebars: SidebarsConfig = {
  userManualSidebar: [
    {
      type: 'category',
      label: 'User Manual',
      link: {
        type: 'doc',
        id: 'user-manual/introduction',
      },
      items: [
        'user-manual/introduction',
        {
          type: 'category',
          label: '🧭 Start Guide',
          items: [
            'user-manual/start-guide/installation',
            'user-manual/start-guide/initial-setup',
            'user-manual/start-guide/faq',
            'user-manual/start-guide/tracking-tag-setup',
            'user-manual/start-guide/cookie-consent-tool-setup',
          ],
        },
        {
          type: 'category',
          label: '🔍 Using QA ZERO',
          items: [
            'user-manual/screens-operations/overview',
            'user-manual/screens-operations/ai-reports-direct',
            'user-manual/screens-operations/ai-reports',
            'user-manual/screens-operations/article-data',
            'user-manual/screens-operations/heatmap-usage',
            'user-manual/screens-operations/heatmap-versions',
          ],
        },
        {
          type: 'category',
          label: '⚙ Site Environment Adjustments',
          items: [
            'user-manual/site-environment/plugin-compatibility',
            'user-manual/site-environment/theme-layout',
            'user-manual/site-environment/site-performance',
          ],
        },
        {
          type: 'category',
          label: '🛠 Troubleshooting',
          items: [
            'user-manual/troubleshooting/recording-issues',
            'user-manual/troubleshooting/data-loss',
            'user-manual/troubleshooting/license-errors',
          ],
        },
        {
          type: 'category',
          label: '🔐 Premium Version and License',
          items: [
            'user-manual/premium-license/free-vs-premium',
            'user-manual/premium-license/activation',
            'user-manual/premium-license/subscription',
          ],
        },
        {
          type: 'category',
          label: '🚀 Deployment',
          items: [
            'user-manual/deployment/server-overview',
            'user-manual/deployment/infrastructure-requirements',
            'user-manual/deployment/server-specs',
            'user-manual/deployment/middleware-and-os',
            'user-manual/deployment/security-and-access',
            'user-manual/deployment/customer-web-server-settings',
            'user-manual/deployment/installation-flow',
            'user-manual/deployment/data-and-backup',
            'user-manual/deployment/operational-notes',
          ],
        },
      ],
    },
  ],

  developerManualSidebar: [
    {
      type: 'category',
      label: 'Developer Manual',
      link: {
        type: 'doc',
        id: 'developer-manual/introduction',
      },
      items: [
        'developer-manual/introduction',
        'developer-manual/architecture',
        {
          type: 'category',
          label: 'API Reference',
          link: {
            type: 'doc',
            id: 'developer-manual/api/api-overview',
          },
          items: [
            'developer-manual/api/api-overview',
            {
              type: 'category',
              label: 'Version 2025-10-20',
              items: [
                'developer-manual/api/2025-10-20/getting-started-2025-10-20',
                'developer-manual/api/2025-10-20/endpoints-2025-10-20',
                'developer-manual/api/2025-10-20/qal-2025-10-20',
                'developer-manual/api/2025-10-20/qal-validation-2025-10-20',
                'developer-manual/api/2025-10-20/materials-2025-10-20',
              ],
            },
            'developer-manual/api/api-compatibility',
            'developer-manual/api/VERSION_MANAGEMENT',
            'developer-manual/api/RELEASE_UPDATE_GUIDE',
          ],
        },
      ],
    },
  ],

  releaseNotesSidebar: [
    {
      type: 'category',
      label: 'Release Notes',
      link: {
        type: 'doc',
        id: 'release-notes/v3x',
      },
      items: [
        'release-notes/v3x',
        'release-notes/v2x',
      ],
    },
  ],

  faqSidebar: [
    {
      type: 'category',
      label: 'FAQ',
      link: {
        type: 'doc',
        id: 'faq/general',
      },
      items: [
        'faq/general',
      ],
    },
  ],
};

export default sidebars;
