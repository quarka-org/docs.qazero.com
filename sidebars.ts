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
        'user-manual/getting-started',
        {
          type: 'category',
          label: 'Features',
          items: [
            'user-manual/features/analytics',
            'user-manual/features/heatmaps',
            'user-manual/features/session-recording',
            'user-manual/features/goals',
          ],
        },
        'user-manual/configuration',
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
