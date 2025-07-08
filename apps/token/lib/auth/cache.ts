import { ONE_MINUTE } from '@/common/config/constants';
import { Cacheable } from 'cacheable';
import 'server-only';

const cacheTTL = ONE_MINUTE * 2;

export const authCache = new Cacheable({
  namespace: 'auth::action:',
  // 2 minutes
  ttl: cacheTTL,
});

export const adminCache = new Cacheable({
  namespace: 'admin::action:',
  // 2 minutes
  ttl: cacheTTL,
});
