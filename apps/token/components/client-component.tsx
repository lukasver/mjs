'use client';

import { getCurrentUser, getCurrentUserEmail } from '@/lib/actions';
import { useEffect, useState } from 'react';
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
  useEffect(() => {
    (async () => {
      const email = await getCurrentUserEmail();

      console.debug('🚀 ~ client-component.tsx:23 ~ email:', email);

      if (email?.data) {
        setEmail(email?.data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (activeAccount?.address) {
        const user = await getCurrentUser({
          address: activeAccount?.address,
        });

        console.debug('🚀 ~ client-component.tsx:31 ~ user:', user);
      }
    })();
  }, [activeAccount?.address]);

  return <div>ClientComponent: ${email}</div>;
}
