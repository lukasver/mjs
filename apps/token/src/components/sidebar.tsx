'use client';

import * as React from 'react';
import { Globe, LayoutDashboard } from 'lucide-react';

import { NavMain } from '@/components/nav/nav-main';
import { NavUser } from '@/components/nav/nav-user';
import { TeamSwitcher } from '@/components/nav/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@mjs/ui/primitives/sidebar';
import { metadata } from '@/common/config/site';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: metadata.businessName,
      logo: Globe,
      plan: '',
    },
  ],
  navMain: [
    {
      title: 'Overview',
      url: '#',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          isActive: true,
        },
        {
          title: 'Buy',
          url: '/buy',
        },
        {
          title: 'Transactions',
          url: '/transactions',
        },
      ],
    },
    {
      title: 'ICO',
      url: '#',
      icon: Globe,
      items: [
        {
          title: 'Token Info',
          url: '/token',
        },
        {
          title: 'Schedule',
          url: '/schedule',
        },
        {
          title: 'Whitepaper',
          url: '/whitepaper',
        },
      ],
    },
    // {
    //   title: 'Account',
    //   url: '#',
    //   icon: Users,
    //   items: [
    //     {
    //       title: 'Profile',
    //       url: '/profile',
    //     },
    //     {
    //       title: 'Settings',
    //       url: '/settings',
    //     },
    //   ],
    // },
  ],
};

export function DashboardSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  children?: React.ReactNode;
}) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {children}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
