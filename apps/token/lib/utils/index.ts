import { ROLES } from '@/common/config/constants';

export const GET_UNHANDLED_ERROR = 'Oops something went wrong';

export const convertCapitalizedCase = (value: string) => {
  return value
    .split(' ')
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
    .join(' ');
};

export function convertToSlug(inputString: string) {
  return inputString?.toLowerCase().replace(/\s+/g, '-');
}

export const generateRandomKey = () => {
  return Date.now() + Math.random().toFixed(0);
};

export const getShortAddress = (str: string) => {
  if (!str) return '';
  return str.substring(0, 5) + '...' + str.slice(-4);
};

export const hasRole = (roles: Record<string, string>, role: string) => {
  return roles[role] !== undefined;
};
/**
 * Checks if the provided roles include admin privileges
 * @param roles - Object containing role key-value pairs
 * @returns {boolean} True if roles include ADMIN or SUPER_ADMIN, false otherwise
 */
export const isAdmin = (roles?: Record<string, string>) => {
  if (!roles) return false;
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].some((role) => hasRole(roles, role));
};
