import type { MetaRecord } from 'nextra';

const meta: MetaRecord = {
  _structure: {
    display: 'hidden',
  },
  index: {
    type: 'doc',
    display: 'normal',
    theme: {
      breadcrumb: false,
      // toc: false,
    },
  },
  '#': {
    type: 'separator',
    // title: 'My Items' // Title is optional
  },
  '02-getting-started': {
    type: 'doc',
  },
  '03-gameplay-features': {
    type: 'doc',
  },
  '04-tokenomics': {
    type: 'doc',
  },
  '05-revenue-model': {
    type: 'doc',
  },
  '06-roadmap': {
    type: 'doc',
  },
  '07-team-advisors': {
    type: 'doc',
  },
  '08-security': {
    type: 'doc',
  },
  '09-market-opportunity': {
    type: 'doc',
  },
  '##': {
    type: 'separator',
    // title: 'My Items' // Title is optional
  },
  '10-faq': {
    type: 'doc',
  },
  tokenomics: {
    type: 'doc',
    // title: 'Tokenomics',
    display: 'hidden',
  },
  '###': {
    type: 'separator',
    // title: 'My Items' // Title is optional
  },
  contact: {
    title: 'Contactez-nous',
    href: '/web/contact',
  },
  subscribe: {
    title: 'Abonnez-vous',
    href: '/web/#newsletter',
  },

  // play: {
  //   type: 'menu',
  //   title: 'Play',
  //   items: {
  //     contributors: {
  //       href: 'https://github.com/vercel/swr/graphs/contributors',
  //     },
  //     now: {
  //       href: 'https://mahjongstars.com/play',
  //     },
  //   },
  // },
};

export default meta;
