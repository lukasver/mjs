'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@mjs/ui/primitives/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mjs/ui/primitives/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@mjs/ui/primitives/sidebar';
import { useUser } from '../hooks/use-user';
import MahjongStarsIcon from '@/public/static/favicons/favicon-48x48.png';
import { AccountAddress, AccountAvatar } from 'thirdweb/react';
import { shortenAddress } from 'thirdweb/utils';

export function NavUser() {
  const { isMobile } = useSidebar();
  const [user, { loading }] = useUser();

  console.debug('🚀 ~ nav-user.tsx:37 ~ user:', user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.name}</span>
                <EmailIndicator
                  isSiwe={!!user?.isAnonymous}
                  email={user?.email}
                />
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <AvatarIndicator
                  image={user?.image || undefined}
                  name={user?.name || undefined}
                  isSiwe={!!user?.isAnonymous}
                />
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {user?.name || 'Anonymous'}
                  </span>
                  {user?.email && (
                    <span className='truncate text-xs'>{user.email}</span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

type EmailIndicatorProps = {
  email?: string;
  isSiwe?: boolean;
};

const EmailIndicator = (props: EmailIndicatorProps) => {
  const { isSiwe = false, email } = props;

  if (isSiwe) {
    return <AccountAddress formatFn={shortenAddress} />;
  }

  if (!email) {
    return null;
  }
  return <span className='truncate text-xs'>{email}</span>;
};

type AvatarIndicatorProps = {
  isSiwe?: boolean;
  image?: string;
  name?: string;
};
const AvatarIndicator = (props: AvatarIndicatorProps) => {
  const { isSiwe = false, image, name } = props;
  if (isSiwe) {
    return <AccountAvatar />;
  }

  return (
    <Avatar className='h-8 w-8 rounded-lg'>
      <AvatarImage src={image || MahjongStarsIcon.src} alt={name || 'Avatar'} />
      <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
    </Avatar>
  );
};
