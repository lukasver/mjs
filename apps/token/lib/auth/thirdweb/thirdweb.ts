import { env } from '@/common/config/env';
import { metadata } from '@/common/config/site';
import { createThirdwebClient } from 'thirdweb';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import MahjongStarsLogo from '@/public/static/logo-wt.webp';

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error('No client ID provided');
}

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

// secretKey for serverside usage, wont be available in client
export const client = createThirdwebClient({
  clientId,
});
