import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Welcome to the Official QA ZERO Documentation',
  tagline: 'Everything you need to master QA ZERO – from setup to advanced analytics.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.qazero.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'quarka-org', // GitHub org/user name.
  projectName: 'docs.qazero.com', // Repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    localeConfigs: {
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
      ja: {
        label: '日本語',
        htmlLang: 'ja-JP',
      },
    },
  },

  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en', 'ja'] // English and Japanese support
      }
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          path: 'docs',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Latest',
            },
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  scripts: [
    {
      src: 'https://www.googletagmanager.com/gtm.js?id=GTM-TSMMZM4X',
      async: true,
    },
  ],
  
  customFields: {
    gtmScript: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TSMMZM4X');
    `,
  },

  headTags: [
    {
      tagName: 'noscript',
      attributes: {
        class: 'gtm-noscript',
      },
      innerHTML: `
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TSMMZM4X"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `,
    },
  ],

  themeConfig: {
    metadata: [
      {name: 'keywords', content: 'QA ZERO, WordPress, analytics, heatmap, documentation'},
      {name: 'description', content: 'User and Developer Documentation for QA ZERO WordPress Analytics'},
    ],
    // Social card
    image: 'img/qazero-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'QA ZERO Documentation',
      logo: {
        alt: 'QA ZERO Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'userManualSidebar',
          position: 'left',
          label: 'User Manual',
        },
        {
          type: 'docSidebar',
          sidebarId: 'developerManualSidebar',
          position: 'left',
          label: 'Developer Manual',
        },
        {
          type: 'docSidebar',
          sidebarId: 'releaseNotesSidebar',
          position: 'left',
          label: 'Release Notes',
        },
        {
          type: 'docSidebar',
          sidebarId: 'faqSidebar',
          position: 'left',
          label: 'FAQ',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        // GitHub link
        {
          href: 'https://github.com/quarka-org/docs.qazero.com',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'User Manual',
              to: '/docs/user-manual/introduction',
            },
            {
              label: 'Developer Manual',
              to: '/docs/developer-manual/introduction',
            },
            {
              label: 'Release Notes',
              to: '/docs/release-notes/v3x',
            },
            {
              label: 'FAQ',
              to: '/docs/faq/general',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/quarka-org/docs.qazero.com/issues',
            },
            {
              label: 'WordPress.org',
              href: 'https://wordpress.org/plugins/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/quarka-org/docs.qazero.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} QA ZERO. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php', 'bash', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
