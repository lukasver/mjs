import { env } from '@/common/config/env';
import { metadata } from '@/common/config/site';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import MahjongStarsLogo from '@/public/static/logo-wt.webp';

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        'google',
        // 'guest',
        'email',
        'passkey',
        'backend',
        'wallet',
      ],
      redirectUrl: `${env.NEXT_PUBLIC_DOMAIN}/onboarding`,
      // passkeyDomain: env.NEXT_PUBLIC_DOMAIN,
      mode: 'popup',
    },
    metadata: {
      name: metadata.businessName,
      image: {
        src: MahjongStarsLogo.src,
        height: MahjongStarsLogo.height,
        width: MahjongStarsLogo.width,
        alt: 'Mahjong Stars Logo',
      },
      icon: 'https://www.mahjongstars.com/static/favicons/favicon-48x48.png',
    },
  }),
  // createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  // createWallet('io.zerion.wallet'),
];
