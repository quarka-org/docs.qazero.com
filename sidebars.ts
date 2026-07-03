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
      label: 'User Guide',
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
            'user-manual/using/assistants',
            'user-manual/using/realtime',
            'user-manual/using/audience',
            'user-manual/using/acquisition',
            'user-manual/using/behavior',
            'user-manual/using/goals',
            'user-manual/using/heatmap-usage',
            'user-manual/using/heatmap-versions',
            'user-manual/using/session-recording',
            'user-manual/using/convenient-features',
            'user-manual/using/pageview-data-export',
            'user-manual/using/goal-settings',
            'user-manual/using/google-search-console',
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
            'user-manual/support/observed-behaviors',
          ],
        },
        {
          type: 'category',
          label: 'Terms & Usage',
          items: [
            'user-manual/terms/plans-contracts',
            'user-manual/terms/terms-privacy',
            'user-manual/terms/support-update-policy',
            'user-manual/terms/cancellation',
          ],
        },

      ],
    },
  ],

  developerManualSidebar: [
    {
      type: 'category',
      label: 'Developer Guide',
      link: {
        type: 'doc',
        id: 'developer-manual/introduction',
      },
      items: [
        'developer-manual/introduction',
        'developer-manual/what-is-qa',
        'developer-manual/get-started-with-ai',
        {
          type: 'category',
          label: 'Concepts',
          link: {
            type: 'doc',
            id: 'developer-manual/concepts/concepts-index',
          },
          items: [
            'developer-manual/concepts/what-is-qal',
            'developer-manual/concepts/why-qal',
            'developer-manual/concepts/materials-views-result',
            'developer-manual/concepts/versioning',
          ],
        },
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
              label: 'Materials',
              link: {
                type: 'doc',
                id: 'developer-manual/api/materials/materials-index',
              },
              items: [
                'developer-manual/api/materials/material-allpv',
                'developer-manual/api/materials/material-click-event',
                'developer-manual/api/materials/material-gsc',
                'developer-manual/api/materials/material-goal-n',
                'developer-manual/api/materials/material-page-version',
                'developer-manual/api/materials/material-summary',
              ],
            },
            {
              type: 'category',
              label: 'Version 2026-05-11 (Current)',
              link: {
                type: 'doc',
                id: 'developer-manual/api/2026-05-11/version-2026-05-11',
              },
              items: [
                {
                  type: 'category',
                  label: 'API Reference',
                  link: {
                    type: 'doc',
                    id: 'developer-manual/api/2026-05-11/reference/reference-index-2026-05-11',
                  },
                  items: [
                    'developer-manual/api/2026-05-11/reference/reference-authentication-2026-05-11',
                    'developer-manual/api/2026-05-11/reference/reference-guide-2026-05-11',
                    'developer-manual/api/2026-05-11/reference/reference-query-2026-05-11',
                    'developer-manual/api/2026-05-11/reference/reference-errors-2026-05-11',
                    'developer-manual/api/2026-05-11/reference/reference-examples-2026-05-11',
                  ],
                },
                'developer-manual/api/2026-05-11/changelog-2026-05-11',
              ],
            },
            {
              type: 'category',
              label: 'Version 2025-10-20 (Previous)',
              link: {
                type: 'doc',
                id: 'developer-manual/api/2025-10-20/version-2025-10-20',
              },
              items: [
                {
                  type: 'category',
                  label: 'API Reference',
                  link: {
                    type: 'doc',
                    id: 'developer-manual/api/2025-10-20/reference/reference-index-2025-10-20',
                  },
                  items: [
                    'developer-manual/api/2025-10-20/reference/reference-authentication-2025-10-20',
                    'developer-manual/api/2025-10-20/reference/reference-guide-2025-10-20',
                    'developer-manual/api/2025-10-20/reference/reference-query-2025-10-20',
                    'developer-manual/api/2025-10-20/reference/reference-errors-2025-10-20',
                    'developer-manual/api/2025-10-20/reference/reference-examples-2025-10-20',
                  ],
                },
                'developer-manual/api/2025-10-20/changelog-2025-10-20',
              ],
            },
            'developer-manual/api/api-compatibility',
          ],
        },
        'developer-manual/for-ai/for-ai-index',
        'developer-manual/integrations/integrations-index',
        'developer-manual/extending/extending-index',
      ],
    },
  ],

  releaseNotesSidebar: [
    {
      type: 'category',
      label: 'Release Notes',
      items: [
        'release-notes/v3x',
        'release-notes/v2x',
      ],
    },
  ],
};

export default sidebars;
