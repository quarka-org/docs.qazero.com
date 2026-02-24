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
          label: 'Deployment',
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
        {
          type: 'category',
          label: 'Tracking Setup',
          items: [           
            'user-manual/tracking-setup/tracking-tag-setup',
            'user-manual/tracking-setup/cookie-consent-tool-setup',
          ],
        },
        {
          type: 'category',
          label: '📊 Using QA ZERO',
          items: [
            'user-manual/using/ai-reports-direct',
            'user-manual/using/ai-reports',
            'user-manual/using/heatmap-usage',
            'user-manual/using/heatmap-versions',
            'user-manual/using/goal-settings',
          ],
        },
        {
          type: 'category',
          label: 'Support & FAQ',
          items: [
            'user-manual/support/faq',
            'user-manual/support/faq-heatmap-data',
            'user-manual/support/faq-tsv-report-fields',
            'user-manual/support/troubleshooting',
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
