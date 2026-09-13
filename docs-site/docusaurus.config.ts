import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Pairband',
  tagline: 'Launch in USDC. Any chain in. Settlement on Arc.',
  favicon: 'img/logo.svg',

  url: 'https://docs.pairband.com',
  baseUrl: '/',

  organizationName: 'pairband',
  projectName: 'pairband-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Pairband',
      logo: {
        alt: 'Pairband logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://pairband.com',
          label: 'App',
          position: 'right',
        },
        {
          href: 'https://github.com/pairband/pairband',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/'},
            {label: 'Quickstart', to: '/quickstart'},
            {label: 'Architecture', to: '/architecture'},
          ],
        },
        {
          title: 'Protocol',
          items: [
            {label: 'Trading', to: '/trading'},
            {label: 'CCTP', to: '/cctp'},
            {label: 'Contracts', to: '/contracts'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Security', to: '/security'},
            {label: 'FAQ', to: '/faq'},
            {label: 'Arc Testnet Explorer', href: 'https://testnet.arcscan.app'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pairband. Testnet only — no audit.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
