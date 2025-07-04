'use client';

import { useState } from 'react';
import useActiveAccount from './hooks/use-active-account';
// const { useSession } = authClient;

export function ClientComponent() {
  // const { data, error, isPending } = useSession();
  const { activeAccount } = useActiveAccount();
  // const { data: profiles } = useSocialProfiles({
  //   client,
  //   address: activeAccount?.address,
  // });

  const [email, setEmail] = useState<string | null>(null);

  return <div>ClientComponent: ${email}</div>;
}
