'use client';

import { metadata } from '../../common/config/site';
import { client, wallets } from '../../lib/auth/thirdweb/thirdweb';
import { AutoConnect as AutoConnectThirdweb } from 'thirdweb/react';

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
