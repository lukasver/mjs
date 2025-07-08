import { applyUTM } from '@/lib/utm';
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
    },
  },
  '#': {
    type: 'separator',
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
  },
  '10-faq': {
    type: 'doc',
  },
  tokenomics: {
    type: 'doc',
    display: 'hidden',
  },
  '###': {
    type: 'separator',
  },
  contact: {
    title: '문의하기',
    href: applyUTM('/web/contact', {
      source: 'docs',
      medium: 'sidebar',
      campaign: 'contact_inquiry',
      content: 'sidebar_nav',
    }),
  },
  subscribe: {
    title: '구독하기',
    href: applyUTM('/web/#newsletter', {
      source: 'docs',
      medium: 'sidebar',
      campaign: 'newsletter_signup',
      content: 'sidebar_nav',
    }),
  },
};

export default meta;
