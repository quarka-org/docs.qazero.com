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
          ],
        },
        {
          type: 'category',
          label: '🔍 Screens and Operations',
          items: [
            'user-manual/screens-operations/overview',
            'user-manual/screens-operations/heatmap-usage',
            'user-manual/screens-operations/article-data',
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
        'developer-manual/api',
        'developer-manual/extending',
        'developer-manual/contributing',
      ],
    },
  ],

  releaseNotesSidebar: [
    {
      type: 'category',
      label: 'Release Notes',
      link: {
        type: 'doc',
        id: 'release-notes/latest',
      },
      items: [
        'release-notes/latest',
        'release-notes/archive',
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
        'faq/installation',
        'faq/usage',
        'faq/troubleshooting',
      ],
    },
  ],
};

export default sidebars;
