'use client';

import { client } from '@/lib/auth/thirdweb-client';
import { metadata } from '../../common/config/site';
import { AutoConnect as AutoConnectThirdweb } from 'thirdweb/react';
import { wallets } from '@/lib/auth/wallets';

function AutoConnect() {
  return (
    <AutoConnectThirdweb
      client={client}
      timeout={10000}
      wallets={wallets}
      appMetadata={{
        name: metadata.businessName,
        url: metadata.siteUrl,
      }}
    />
  );
}

export default AutoConnect;
