export const getFooterLinks = (
  t: (k: string) => string
): Array<{
  href: string;
  title: string;
}> => {
  return [
    { href: '#home', title: t('Footer.links.home') },
    { href: '/about', title: t('Footer.links.whoWeAre') },
    { href: '/terms', title: t('Footer.links.termsAndConditions') },
    { href: '/privacy', title: t('Footer.links.privacyPolicy') },
    { href: '/contact', title: t('Footer.links.contact') },
  ];
};
