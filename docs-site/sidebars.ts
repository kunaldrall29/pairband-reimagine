import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Get started',
      collapsed: false,
      items: ['quickstart'],
    },
    {
      type: 'category',
      label: 'Protocol',
      collapsed: false,
      items: ['architecture', 'business-model', 'trading', 'cctp'],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: ['contracts', 'security', 'faq'],
    },
  ],
};

export default sidebars;
