'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { logout } from '@/lib/auth';
import * as React from 'react';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import { NotificationBell } from '@/components/dashboard/notification-bell';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Skeleton } from '@/components/ui/skeleton';

import { HomeIcon } from '@/components/icons/nav/home-icon';
import { MarketIcon } from '@/components/icons/nav/market-icon';
import { DepositIcon } from '@/components/icons/nav/deposit-icon';
import { WithdrawIcon } from '@/components/icons/nav/withdraw-icon';
import { SquadIcon } from '@/components/icons/nav/squad-icon';
import { ProfileIcon } from '@/components/icons/nav/profile-icon';
import { SupportIcon } from '@/components/icons/nav/support-icon';
import { AboutIcon } from '@/components/icons/nav/about-icon';
import { DownloadIcon } from '@/components/icons/nav/download-icon';
import { SettingsIcon } from '@/components/icons/nav/settings-icon';
import { LogoutIcon } from '@/components/icons/nav/logout-icon';
import { InboxIcon } from '@/components/icons/nav/inbox-icon';
import { MessageSquare, UserPlus, Shield, Lock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/contexts/UserContext';
import { getOrCreateWallet, type WalletData } from '@/lib/wallet';
import { getUserRank } from '@/lib/ranks';
import { type TierSetting as TierData, getBotTierSettings, getCurrentTier } from '@/lib/tiers';
import { Badge } from '@/components/ui/badge';
import { countries } from '@/lib/countries';
import { tierIcons, tierClassNames } from '@/lib/settings';
import { PromotionIcon } from '@/components/icons/nav/promotion-icon';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AvatarUploadDialog } from './profile-view';
import { RightSidebar } from '../ui/right-sidebar';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};

// Mock user object
const mockUser = {
  id: 'mock-user-123',
  email: 'user@example.com',
};

function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background text-foreground animate-in fade-in-50">
      <AstralLogo className="h-40 w-40 animate-pulse" />
      <p className="mt-4 text-lg font-semibold">Loading Your Dashboard</p>
      <p className="text-muted-foreground">Please wait a moment...</p>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<any | null>(null);
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [tierSettings, setTierSettings] = React.useState<TierData[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isModerator, setIsModerator] = React.useState(false);
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [downloadHref, setDownloadHref] = React.useState('');

  const fetchWalletAndTiers = React.useCallback(async (userId: string) => {
    try {
        const [walletData, tiers] = await Promise.all([
            getOrCreateWallet(userId),
            Promise.resolve(getBotTierSettings())
        ]);
        setWallet(walletData);
        setTierSettings(tiers);
    } catch (error) {
        console.error("Failed to fetch initial data:", error);
    }
  }, []);

  React.useEffect(() => {
    const initializeUser = async () => {
      const loggedInEmail = sessionStorage.getItem('loggedInEmail') || mockUser.email;
      const currentUser = { ...mockUser, email: loggedInEmail };

      setUser(currentUser);
      setIsAdmin(loggedInEmail === 'admin@astralcore.io');
      setIsModerator(loggedInEmail === 'moderator@astralcore.io');

      if (currentUser.id) {
        await fetchWalletAndTiers(currentUser.id);
      }
      setIsInitializing(false);
    };
    initializeUser();
  }, [fetchWalletAndTiers]);


  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const fileContent = `[InternetShortcut]
URL=${window.location.origin}`;
      const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(
        fileContent
      )}`;
      setDownloadHref(dataUri);
    }
  }, []);

  const menuConfig = React.useMemo(() => {
    const baseConfig = [
      {
        title: 'Overview',
        items: [
          { href: '/dashboard', label: 'Home', icon: HomeIcon },
          { href: '/dashboard/market', label: 'Market', icon: MarketIcon },
          { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
        ],
      },
      {
        title: 'Community',
        items: [
          { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
          { href: '/dashboard/squad', label: 'Squad', icon: SquadIcon },
          { href: '/dashboard/invite', label: 'Invite', icon: UserPlus },
          { href: '/dashboard/rewards', label: 'Rewards', icon: Trophy },
        ],
      },
      {
        title: 'Manage',
        items: [
          { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
          { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
        ],
      },
      {
        title: 'Account',
        items: [
          { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
          { href: '/dashboard/security', label: 'Security', icon: SettingsIcon },
          { href: '/dashboard/inbox', label: 'Inbox', icon: InboxIcon },
        ],
      },
      {
        title: 'Platform',
        items: [
          { href: '/dashboard/promotions', label: 'Promotions', icon: PromotionIcon },
          { href: '/dashboard/trading-info', label: 'Tiers & Ranks', icon: Trophy },
          { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
          { href: '/dashboard/about', label: 'About', icon: AboutIcon },
          { href: downloadHref, label: 'Download App', icon: DownloadIcon, download: 'AstralCore.url'},
        ],
      },
    ];

    if (isAdmin || isModerator) {
      const adminItems = [];
      if (isAdmin) {
        adminItems.push({ href: '/admin', label: 'Admin Panel', icon: Shield });
      }
      if (isModerator) {
        adminItems.push({ href: '/moderator', label: 'Moderator Panel', icon: Shield });
      }
      baseConfig.push({
        title: 'Admin Tools',
        items: adminItems,
      });
    }

    return baseConfig;
  }, [isAdmin, isModerator, downloadHref]);


  const handleLogout = async () => {
    sessionStorage.removeItem('loggedInEmail');
    await logout();
    router.push('/');
  };

  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const bottomNavItems = [
    { href: '/dashboard', label: 'Home', icon: HomeIcon },
    { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
    { href: '/dashboard/trading', label: 'CORE', icon: AstralLogo },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
    { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
  ];

  const getPageTitle = () => {
    const currentPath = pathname;
    const simplePath = currentPath.startsWith('/dashboard') ? currentPath : `/dashboard${currentPath}`;

    if (simplePath === '/dashboard/trading') return 'Astral Core Trading';
    const currentItem = menuConfig.flatMap(g => g.items).find((item) => {
        return simplePath.startsWith(item.href) && item.href !== '/dashboard' || simplePath === item.href;
    });
     if (simplePath === '/dashboard') return 'Home';
    return currentItem
      ? currentItem.label
      : simplePath.split('/').pop()?.replace('-', ' ') || 'Home';
  };

  const isClient = typeof window !== 'undefined';
  
  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || Lock;
  const tier = getCurrentTier(totalBalance, tierSettings);
  const TierIcon = tier ? tierIcons[tier.id] : null;
  const tierClassName = tier ? tierClassNames[tier.id] : null;
  const userCountry = countries.find(c => c.name === wallet?.profile?.country);

  const quickAccessItems = [
    { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon },
    { href: '/dashboard/deposit', label: 'Deposit', icon: DepositIcon },
    { href: '/dashboard/withdraw', label: 'Withdraw', icon: WithdrawIcon },
    { href: '/dashboard/support', label: 'Support', icon: SupportIcon },
    { href: '/dashboard/security', label: 'Settings', icon: SettingsIcon },
  ];

  if (isInitializing) {
    return <DashboardLoading />;
  }
  
  return (
    <UserProvider value={{ user: user as any, wallet, rank, tier, tierSettings }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <AstralLogo className="h-10 w-10" />
              <span className="text-lg font-semibold text-sidebar-foreground">
                AstralCore
              </span>
            </div>
          </SidebarHeader>

          <div className="mt-12 mb-4 px-4 space-y-4">
             <div className="flex items-center gap-3">
                  <AvatarUploadDialog 
                    onUploadSuccess={() => fetchWalletAndTiers(user.id)}
                    wallet={wallet}
                  >
                    <Avatar className="h-12 w-12 cursor-pointer">
                      <AvatarImage
                        src={wallet?.profile?.avatarUrl}
                        alt={wallet?.profile?.username || 'User'}
                      />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </AvatarUploadDialog>

                  <div className="overflow-hidden">
                     <p className="font-semibold text-sidebar-foreground truncate flex items-center gap-2">
                        {wallet?.profile?.username || 'User'}
                        {userCountry && <span className="text-lg">{userCountry.flag}</span>}
                     </p>
                     <p className="text-xs text-sidebar-foreground/70 truncate">{userEmail}</p>
                  </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                 <Badge variant="outline" className={cn("text-sm py-1 px-2 flex items-center gap-1.5", rank.className)}>
                    <RankIcon className="h-4 w-4" />
                    <span>{rank.name}</span>
                 </Badge>
                 {tier && TierIcon && tierClassName && (
                  <Badge variant="outline" className={cn("text-sm py-1 px-2 flex items-center gap-1.5", tierClassName)}>
                    <TierIcon className="h-4 w-4" />
                    <span>{tier.name}</span>
                  </Badge>
                )}
              </div>
          </div>
          <Separator className="bg-sidebar-border" />

          <SidebarContent>
            <SidebarMenu>
              {menuConfig.map((group, index) => (
                  <React.Fragment key={group.title}>
                    {index > 0 && <Separator className="my-2 bg-sidebar-border/50" />}
                    <p className="px-4 pt-2 pb-1 text-xs font-semibold text-sidebar-foreground/50">{group.title}</p>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={
                            isClient ? (pathname.endsWith(item.href) && !item.download) : false
                          }
                        >
                          <Link href={item.href} download={item.download}>
                            <item.icon className={cn(item.label === 'CORE' && 'h-6 w-6 p-0.5')} />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </React.Fragment>
                ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground h-auto p-2">
                   <SettingsIcon className="mr-2 h-4 w-4" />
                   Settings & Logout
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">
                      {wallet?.profile?.username || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail || '...'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <ProfileIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/security">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogoutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <h1 className="flex items-center gap-2 text-lg font-semibold md:text-2xl capitalize">
                <AstralLogo className="h-6 w-6" />
                {isClient ? (
                  <span>{getPageTitle()}</span>
                ) : (
                  <Skeleton className="h-6 w-24" />
                )}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5", rank.className)}>
                        <RankIcon className="h-4 w-4" />
                        <span>{rank.name}</span>
                     </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Account Rank</p>
                  </TooltipContent>
                </Tooltip>
                 {tier && TierIcon && tierClassName && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5", tierClassName)}>
                          <TierIcon className="h-4 w-4" />
                          <span>{tier.name}</span>
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>VIP CORE Tier</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>

              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/inbox">
                  <InboxIcon className="h-5 w-5" />
                  <span className="sr-only">Inbox</span>
                </Link>
              </Button>
              <NotificationBell />
            </div>
          </header>
          <main className="flex-1 bg-secondary p-4 md:p-6 pb-20">
            {children}
          </main>
          <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center justify-around z-10 md:hidden">
            {bottomNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-colors relative',
                  isClient && pathname.endsWith(item.href)
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label === 'CORE' ? (
                  <div className="absolute -top-7 flex items-center justify-center">
                     <div className="h-16 w-16 rounded-full bg-transparent flex items-center justify-center">
                        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center p-1">
                           <item.icon className="h-full w-full" />
                        </div>
                     </div>
                  </div>
                ) : (
                  <item.icon className="h-6 w-6" />
                )}
                
                <span className={cn(item.label === 'CORE' && 'mt-8')}>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SidebarInset>
        <RightSidebar>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
          <div className="space-y-2">
            {quickAccessItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center p-2 rounded-lg text-foreground/80 hover:bg-muted/50 hover:text-foreground transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </RightSidebar>
      </SidebarProvider>
    </UserProvider>
  );
}
