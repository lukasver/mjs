'use client';

import { authClient } from '@/lib/auth/better-auth/auth-client';

const { useSession } = authClient;

export function useUser() {
  const { data, isPending, refetch } = useSession();
  return [
    data?.user,
    {
      loading: isPending,
      refetch,
      session: data?.session,
    },
  ] as const;
}
