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
}
from '@/components/ui/sidebar';
import { logout } from '@/lib/auth-client';
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
import { MessageSquare, UserPlus, Shield, Lock, Trophy, Cpu, Users, User, Globe, Waves, Atom, Zap, Brain } from 'lucide-react';
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
import { AvatarUploadDialog } from '@/components/dashboard/profile-view';
import { RightSidebar } from '@/components/ui/right-sidebar';
import { SideNavigation } from '@/components/ui/side-navigation';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

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
    <div className="purple relative min-h-dvh overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Enhanced Neural Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-purple-950/80 to-cyan-950/70 animate-pulse" 
             style={{animationDuration: '3s'}} />
        
        {/* Hyperdrive particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/80 rounded-full animate-hyperdrive-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              filter: 'drop-shadow(0 0 3px rgba(59,130,246,0.8))'
            }}
          />
        ))}
      </div>

      {/* Neural Network Animation */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <defs>
            <linearGradient id="neuralFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="rgb(147,51,234)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#neuralFlow)" strokeWidth="2" className="animate-pulse" />
          <path d="M100,400 Q300,300 500,400 T900,400" stroke="url(#neuralFlow)" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          <path d="M100,600 Q300,500 500,600 T900,600" stroke="url(#neuralFlow)" strokeWidth="2" className="animate-pulse" style={{animationDelay: '1s'}} />
          <path d="M100,800 Q300,700 500,800 T900,800" stroke="url(#neuralFlow)" strokeWidth="2" className="animate-pulse" style={{animationDelay: '1.5s'}} />
        </svg>
      </div>

      {/* Enhanced Loading Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in-50 duration-1000">
        
        {/* Hyperdrive Core with Enhanced Rings */}
        <div className="relative">
          {/* Multi-layer rotating energy rings */}
          <div className="absolute inset-0 w-56 h-56">
            <div className="absolute inset-0 border-2 border-blue-400/40 rounded-full animate-hyperdrive-spin"></div>
            <div className="absolute inset-3 border-2 border-purple-400/50 rounded-full animate-hyperdrive-spin" style={{animationDirection: 'reverse', animationDuration: '5s'}}></div>
            <div className="absolute inset-6 border-2 border-cyan-400/60 rounded-full animate-hyperdrive-spin" style={{animationDuration: '3s'}}></div>
            <div className="absolute inset-9 border border-pink-400/40 rounded-full animate-hyperdrive-spin" style={{animationDirection: 'reverse', animationDuration: '7s'}}></div>
          </div>

          {/* Pulsing energy core */}
          <div className="relative flex items-center justify-center w-56 h-56">
            <div className="absolute inset-12 bg-gradient-radial from-blue-500/30 to-transparent rounded-full animate-neural-pulse"></div>
            <AstralLogo className="h-20 w-20 text-blue-400 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-hologram-flicker" />
          </div>

          {/* Orbiting hyperdrive particles */}
          <div className="absolute top-6 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          <div className="absolute top-1/2 right-6 w-3 h-3 bg-purple-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(147,51,234,0.8)]" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-6 left-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(6,182,212,0.8)]" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-6 w-3 h-3 bg-pink-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(236,72,153,0.8)]" style={{animationDelay: '1.5s'}} />
        </div>

        {/* Enhanced Loading Text */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-hologram-flicker">
            Initializing AstralCore
          </h1>
          <div className="space-y-3">
            <p className="text-2xl text-gray-300 font-medium flex items-center justify-center gap-3">
              <Brain className="w-6 h-6 text-blue-400 animate-pulse" />
              Hyperdrive Neural Networks
              <Atom className="w-6 h-6 text-purple-400 animate-spin" />
            </p>
            <p className="text-gray-400 text-lg">Synchronizing market algorithms...</p>
          </div>
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="flex space-x-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full animate-neural-pulse"
              style={{
                background: `linear-gradient(45deg, ${
                  i % 2 === 0 ? 'rgb(59,130,246)' : 'rgb(147,51,234)'
                }, ${i % 2 === 0 ? 'rgb(6,182,212)' : 'rgb(236,72,153)'})`,
                animationDelay: `${i * 0.3}s`,
                boxShadow: `0 0 20px ${
                  i % 2 === 0 ? 'rgba(59,130,246,0.6)' : 'rgba(147,51,234,0.6)'
                }`
              }}
            />
          ))}
        </div>

        {/* Enhanced System Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm max-w-4xl">
          <div className="flex items-center space-x-3 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-400/30">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            <span className="text-blue-300 font-medium">Neural Grid: Active</span>
          </div>
          <div className="flex items-center space-x-3 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-400/30">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.8)]" style={{animationDelay: '0.5s'}} />
            <span className="text-purple-300 font-medium">Market Analysis: Online</span>
          </div>
          <div className="flex items-center space-x-3 px-6 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-400/30">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{animationDelay: '1s'}} />
            <span className="text-cyan-300 font-medium">Hyperdrive Core: Syncing</span>
          </div>
        </div>

        {/* Enhanced Loading Bar */}
        <div className="w-96 max-w-[90vw] h-3 bg-black/40 rounded-full overflow-hidden border border-blue-400/30 backdrop-blur-xl">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-data-stream shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
        </div>
      </div>

      {/* Enhanced Bottom Branding */}
      <div className="absolute bottom-8 text-center">
        <p className="text-gray-500 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" />
          AstralCore Hype Drive
          <Waves className="w-4 h-4" />
        </p>
      </div>
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
          { href: '/dashboard/trading-info', label: 'Hyperdrive Status', icon: Trophy },
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

  if (isInitializing) {
    return <DashboardLoading />;
  }
  
  return (
    <UserProvider value={{ user: user as any, wallet, rank, tier, tierSettings }}>
      <SidebarProvider>
        <Sidebar className="border-r-0 shadow-xl bg-black/40 backdrop-blur-xl">
          <SidebarHeader className="border-b border-sidebar-border/30 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 p-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/30 rounded-xl blur-md animate-neural-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-500/30 to-purple-500/20 p-3 rounded-xl border border-blue-400/40 backdrop-blur-xl">
                  <AstralLogo className="h-8 w-8 text-blue-400 animate-hologram-flicker" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AstralCore
                </span>
                <span className="text-xs text-sidebar-foreground/60 font-medium flex items-center gap-1">
                  <Atom className="w-3 h-3 animate-spin" />
                  Hype Drive
                </span>
              </div>
            </div>
          </SidebarHeader>

          <div className="p-4 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-lg"></div>
              <div className="relative p-4 rounded-xl border border-sidebar-border/40 bg-black/30 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-3">
                  <AvatarUploadDialog
                    onUploadSuccess={() => fetchWalletAndTiers(user.id)}
                    wallet={wallet}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400/40 rounded-full blur-lg animate-neural-pulse"></div>
                      <Avatar className="h-14 w-14 cursor-pointer relative border-2 border-blue-400/40 backdrop-blur-xl">
                        <AvatarImage
                          src={wallet?.profile?.avatarUrl}
                          alt={wallet?.profile?.username || 'User'}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-blue-400 font-bold text-lg backdrop-blur-xl">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </AvatarUploadDialog>

                  <div className="flex-1 overflow-hidden">
                     <p className="font-bold text-sidebar-foreground truncate flex items-center gap-2 text-sm">
                        {wallet?.profile?.username || 'User'}
                        {userCountry && <span className="text-lg drop-shadow-lg">{userCountry.flag}</span>}
                     </p>
                     <p className="text-xs text-sidebar-foreground/60 truncate font-medium">{userEmail}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("text-xs py-1.5 px-3 flex items-center gap-1.5 border-opacity-60 bg-opacity-20 backdrop-blur-xl", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    <span className="font-medium">{rank.name}</span>
                  </Badge>
                  {tier && TierIcon && tierClassName && (
                    <Badge variant="outline" className={cn("text-xs py-1.5 px-3 flex items-center gap-1.5 border-opacity-60 bg-opacity-20 backdrop-blur-xl", tierClassName)}>
                      <TierIcon className="h-3 w-3" />
                      <span className="font-medium">{tier.name}</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <SidebarContent className="px-2">
            <SidebarMenu className="space-y-1">
              {menuConfig.map((group, index) => (
                <React.Fragment key={group.title}>
                  {index > 0 && (
                    <div className="my-4">
                      <Separator className="bg-sidebar-border/20" />
                    </div>
                  )}
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                      {group.title === 'Overview' && <Cpu className="h-3 w-3 text-blue-400" />}
                      {group.title === 'Community' && <Users className="h-3 w-3 text-purple-400" />}
                      {group.title === 'Manage' && <Shield className="h-3 w-3 text-cyan-400" />}
                      {group.title === 'Account' && <User className="h-3 w-3 text-green-400" />}
                      {group.title === 'Platform' && <Globe className="h-3 w-3 text-pink-400" />}
                      {group.title === 'Admin Tools' && <Lock className="h-3 w-3 text-orange-400" />}
                      {group.title}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = isClient ? (pathname.endsWith(item.href) && !item.download) : false;
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                "h-11 px-3 rounded-xl transition-all duration-300 group hover:shadow-lg backdrop-blur-xl",
                                isActive
                                  ? "bg-gradient-to-r from-blue-500/30 to-purple-500/20 border border-blue-400/40 text-blue-400 shadow-lg shadow-blue-500/20"
                                  : "hover:bg-white/5 hover:text-sidebar-accent-foreground hover:border-white/10 border border-transparent"
                              )}
                            >
                              <Link href={item.href} download={item.download} className="flex items-center gap-3 w-full">
                                {item.label === 'CORE' ? (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-blue-400/40 rounded-lg blur-lg animate-neural-pulse"></div>
                                    <div className="relative bg-gradient-to-br from-blue-500/30 to-purple-500/20 p-1.5 rounded-lg border border-blue-400/40 backdrop-blur-xl">
                                      <item.icon className="h-4 w-4 text-blue-400" />
                                    </div>
                                  </div>
                                ) : (
                                  <item.icon className={cn(
                                    "h-4 w-4 transition-colors drop-shadow-sm",
                                    isActive ? "text-blue-400" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                                  )} />
                                )}
                                <span className={cn(
                                  "font-medium text-sm transition-colors",
                                  isActive ? "text-blue-400 font-semibold" : "text-sidebar-foreground group-hover:text-sidebar-foreground"
                                )}>
                                  {item.label}
                                </span>
                                {isActive && (
                                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-sidebar-border/30 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-xl">
            <div className="p-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground h-auto p-3 rounded-xl border border-sidebar-border/40 bg-black/30 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 hover:shadow-lg hover:border-blue-400/30"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm"></div>
                        <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/10 p-1.5 rounded-lg border border-blue-400/30">
                          <SettingsIcon className="h-4 w-4 text-blue-400" />
                        </div>
                      </div>
                      <div className="flex flex-col items-start flex-1">
                        <span className="font-semibold text-sm">Settings</span>
                        <span className="text-xs text-sidebar-foreground/60">Manage account</span>
                      </div>
                      <Lock className="h-3 w-3 text-sidebar-foreground/40" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-black/90 backdrop-blur-xl border-border/40" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-blue-400/30">
                        <AvatarImage
                          src={wallet?.profile?.avatarUrl}
                          alt={wallet?.profile?.username || 'User'}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-blue-400 text-xs font-bold backdrop-blur-xl">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-foreground">
                          {wallet?.profile?.username || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userEmail || '...'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="p-3 cursor-pointer">
                    <Link href="/dashboard/profile" className="flex items-center gap-3">
                      <ProfileIcon className="h-4 w-4 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">Profile</span>
                        <span className="text-xs text-muted-foreground">Manage your profile</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="p-3 cursor-pointer">
                    <Link href="/dashboard/security" className="flex items-center gap-3">
                      <SettingsIcon className="h-4 w-4 text-blue-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">Settings</span>
                        <span className="text-xs text-muted-foreground">Security & preferences</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="p-3 cursor-pointer text-destructive hover:text-destructive">
                    <LogoutIcon className="mr-3 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">Log out</span>
                      <span className="text-xs text-muted-foreground">Sign out of your account</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex flex-1">
          <main className="flex-1 bg-gradient-to-br from-black via-gray-900/50 to-black p-4 md:p-6 pb-20 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.05),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(6,182,212,0.05),transparent_50%)]"></div>
            </div>
            
            <header className="flex h-16 items-center gap-4 border-b border-border/20 bg-black/40 backdrop-blur-xl px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30 -ml-4 -mr-4 md:-ml-6 md:-mr-6 rounded-b-xl">
              <SidebarTrigger />
              <div className="w-full flex-1">
                <h1 className="flex items-center gap-3 text-lg font-semibold md:text-2xl capitalize">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm animate-pulse"></div>
                    <AstralLogo className="h-6 w-6 relative text-blue-400" />
                  </div>
                  {isClient ? (
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {getPageTitle()}
                    </span>
                  ) : (
                    <Skeleton className="h-6 w-24" />
                  )}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5 backdrop-blur-xl border-opacity-60 bg-opacity-20", rank.className)}>
                          <RankIcon className="h-4 w-4" />
                          <span>{rank.name}</span>
                       </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hyperdrive Rank</p>
                    </TooltipContent>
                  </Tooltip>
                   {tier && TierIcon && tierClassName && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                          <Badge variant="outline" className={cn("hidden sm:flex items-center gap-1.5 backdrop-blur-xl border-opacity-60 bg-opacity-20", tierClassName)}>
                            <TierIcon className="h-4 w-4" />
                            <span>{tier.name}</span>
                          </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Hyperdrive CORE Tier</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>

                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-white/5 backdrop-blur-xl" asChild>
                  <Link href="/dashboard/inbox">
                    <InboxIcon className="h-5 w-5" />
                    <span className="sr-only">Inbox</span>
                  </Link>
                </Button>
                <NotificationBell />
                <ThemeSwitcher />
              </div>
            </header>
            <div className="relative z-20">
              {children}
            </div>
          </main>
          
          <div className="hidden lg:block border-l border-border/20">
            <RightSidebar />
          </div>
        </div>
        
        {/* Enhanced Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-border/30 flex items-center justify-around z-50 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/40"></div>
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-xs w-full h-full transition-all duration-300',
                isClient && pathname.endsWith(item.href)
                  ? 'text-blue-400 font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label === 'CORE' ? (
                <div className="absolute -top-8 flex items-center justify-center">
                   <div className="relative h-16 w-16 rounded-full bg-transparent flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/20 rounded-full blur-lg animate-neural-pulse"></div>
                      <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center p-1 border-2 border-blue-400/40 backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                         <item.icon className="h-full w-full" />
                      </div>
                   </div>
                </div>
              ) : (
                <item.icon className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isClient && pathname.endsWith(item.href) && "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                )} />
              )}
              
              <span className={cn(
                "transition-all duration-300",
                item.label === 'CORE' && 'mt-8',
                isClient && pathname.endsWith(item.href) && "text-blue-400 font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Enhanced Side Navigation */}
        <SideNavigation />
      </SidebarProvider>
    </UserProvider>
  );
}
