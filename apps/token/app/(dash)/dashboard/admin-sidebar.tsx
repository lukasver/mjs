'use client';

import { NavAdmin } from '../../../components/nav/nav-admin';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@mjs/ui/primitives/sidebar';
import { isAdmin } from '@/lib/utils';
import { useUser } from '@/lib/services/api';

const items = [
  {
    title: 'Sales',
    url: '/admin/sales',
    icon: 'sale',
    items: [
      {
        title: 'Sale list',
        url: '/admin/sales',
      },
      {
        title: 'New sale',
        url: '/admin/sales/details',
      },
    ],
  },
  {
    title: 'Transactions',
    url: '/admin/transactions',
    icon: 'transaction',
    items: [
      {
        title: 'Transaction list',
        url: '/admin/transactions',
      },
    ],
  },
];
export default async function AdminSidebar() {
  const { data } = useUser();

  const isAllowed = isAdmin(data?.roles);
  if (!isAllowed) return null;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
      <SidebarMenu>
        <NavAdmin items={items} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
