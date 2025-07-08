'use client';

import { createThirdwebClient } from 'thirdweb';

// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error('No client ID provided');
}

// secretKey for serverside usage, wont be available in client
export const client = createThirdwebClient({
  clientId,
});
