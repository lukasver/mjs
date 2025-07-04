'use client';

import { getCurrentUser } from '@/lib/actions';
import { User } from '@prisma/client';
import { useEffect, useState } from 'react';

export function useUser() {
  const [user, setUser] = useState<{
    data: User | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        setUser((p) => ({ ...p, loading: true }));
        const res = await getCurrentUser();
        if (res?.data) {
          setUser((p) => ({ ...p, data: res?.data, loading: false }));
        } else {
          setUser((p) => ({ ...p, data: null, loading: false }));
        }
      } catch (e) {
        setUser((p) => ({
          ...p,
          data: null,
          loading: false,
          error: e instanceof Error ? e.message : 'Unknown error',
        }));
      }
    })();
  }, []);

  // const { data, isPending, refetch } = useSession();
  return [
    user?.data || null,
    {
      loading: user.loading,
      // refetch,
    },
  ] as const;
}
