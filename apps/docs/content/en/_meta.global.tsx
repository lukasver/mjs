import type { MetaRecord } from 'nextra';

const meta: MetaRecord = {
  index: {
    title: 'home',
    type: 'page',
    display: 'normal',
    theme: {
      breadcrumb: false,
      toc: false,
    },
  },
  about: {
    // By commenting the title prop here, the frontmatter title will be used
    // title: 'About',
    type: 'doc',
    theme: {
      toc: true,
      typesetting: 'default',
    },
  },
  game: {
    type: 'doc',
    title: 'The Game',
    theme: {
      typesetting: 'article',
    },
  },
  tokenomics: {
    type: 'doc',
    // title: 'Tokenomics',
    theme: {
      typesetting: 'article',
      sidebar: true,
    },
  },
  contact: {
    title: 'Contact',
    type: 'page',
    href: 'https://mahjongstars.com/contact',
  },
  play: {
    type: 'menu',
    title: 'Play',
    items: {
      contributors: {
        href: 'https://github.com/vercel/swr/graphs/contributors',
      },
      now: {
        href: 'https://mahjongstars.com/play',
      },
    },
  },
};

export default meta;
