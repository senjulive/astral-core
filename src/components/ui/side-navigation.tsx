"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  Star,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Waves,
  Atom,
  Sparkles,
  CreditCard,
  Trophy,
  Rocket,
  Wallet,
  Activity,
  DollarSign,
  Grid3x3,
  Play,
  Pause
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { getOrCreateWallet } from "@/lib/wallet";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color: string;
}

const quickNavItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home, color: "text-blue-400" },
  { href: "/dashboard/trading", label: "CORE", icon: Brain, badge: "AI", color: "text-purple-400" },
  { href: "/dashboard/market", label: "Market", icon: TrendingUp, color: "text-green-400" },
  { href: "/dashboard/cards", label: "Cards", icon: CreditCard, color: "text-cyan-400" },
  { href: "/dashboard/rewards", label: "Rewards", icon: Trophy, badge: "NEW", color: "text-yellow-400" },
  { href: "/dashboard/space", label: "Space", icon: MessageSquare, color: "text-pink-400" },
  { href: "/dashboard/squad", label: "Squad", icon: Users, color: "text-green-400" },
  { href: "/dashboard/security", label: "Security", icon: Shield, color: "text-red-400" }
];

// Quick Actions will be dynamic based on user data

export function SideNavigation() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [userWallet, setUserWallet] = React.useState<any>(null);
  const pathname = usePathname();
  const { user } = useUser();
  
  const sideNavRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  // Fetch user wallet data
  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then(setUserWallet);
    }
  }, [user]);

  // Auto-hide functionality
  React.useEffect(() => {
    if (isVisible && !isHovered && !isDragging) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Hide after 5 seconds
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, isHovered, isDragging]);

  // Touch/Mouse event handlers for swipe
  const handleStart = (clientX: number) => {
    if (clientX > window.innerWidth - 50) { // Only if near right edge
      setStartX(clientX);
      setIsDragging(true);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = startX - clientX;
    if (deltaX > 50) { // Swipe left threshold
      setIsVisible(true);
      setIsDragging(false);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Touch events
  React.useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX);
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    // Mouse events for desktop
    const handleMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX]);

  // Click outside to close
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <>
      {/* Trigger Area - Invisible right edge */}
      <div 
        className="fixed top-0 right-0 w-8 h-full z-40 bg-transparent cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onClick={() => setIsVisible(true)}
      />

      {/* Swipe Indicator */}
      {isDragging && (
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 animate-pulse">
          <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-blue-400/30">
            <ChevronLeft className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-xs font-medium">Swipe to open</span>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsVisible(false)}
        />
      )}

      {/* Side Navigation */}
      <div
        ref={sideNavRef}
        className={cn(
          "fixed top-0 right-0 h-full w-80 z-50 transition-transform duration-500 ease-out",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Glassmorphic Container */}
        <Card className="h-full bg-black/40 backdrop-blur-2xl border-l border-border/40 shadow-2xl relative overflow-hidden">
          {/* Holographic Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_50%)]" />
          
          {/* Moving particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-lg blur-md animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/10 p-2 rounded-lg border border-blue-400/30">
                    <Waves className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Quick Nav</h3>
                  <p className="text-xs text-gray-400">AstralCore Hyperdrive</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 border border-white/10"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </div>

            {/* User Status Dashboard */}
            <div className="mb-6">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Hyperdrive Status
              </div>
              <div className="grid grid-cols-1 gap-2">
                {/* User Balance */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/10 p-3 rounded-lg border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-gray-300">Balance</span>
                    </div>
                    <span className="text-sm font-bold text-blue-400">
                      ${userWallet?.balances?.usdt?.toLocaleString() || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Daily Earnings */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 p-3 rounded-lg border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-gray-300">Daily Earnings</span>
                    </div>
                    <span className="text-sm font-bold text-green-400">
                      +${userWallet?.dailyEarnings || '0.00'}
                    </span>
                  </div>
                </div>

                {/* Remaining Grid */}
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/10 p-3 rounded-lg border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="h-4 w-4 text-yellow-400" />
                      <span className="text-xs text-gray-300">Grid Trades</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400">
                      {userWallet?.remainingGrids || '0'}/24
                    </span>
                  </div>
                </div>

                {/* Bot Status */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/10 p-3 rounded-lg border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-300">Neural Bot</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {userWallet?.botStatus === 'active' ? (
                        <Play className="h-3 w-3 text-green-400" />
                      ) : (
                        <Pause className="h-3 w-3 text-red-400" />
                      )}
                      <span className="text-sm font-bold text-purple-400">
                        {userWallet?.botStatus === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Atom className="w-3 h-3 animate-spin" />
                Navigation
              </div>
              <div className="space-y-1">
                {quickNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsVisible(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group relative",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400"
                          : "hover:bg-white/5 hover:border-white/10 border border-transparent text-gray-300 hover:text-white"
                      )}
                    >
                      <IconComponent className={cn("h-5 w-5 transition-colors", isActive ? "text-blue-400" : item.color)} />
                      <span className="font-medium">{item.label}</span>
                      
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className="ml-auto text-xs px-2 py-0 border-blue-400/40 text-blue-300 bg-blue-400/10"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      
                      {isActive && (
                        <div className="absolute right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* System Status */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-3 h-3" />
                System Status
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Neural Networks</span>
                  <Badge className="bg-green-500/10 text-green-400 border-green-400/20 text-xs">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Trading Engine</span>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-400/20 text-xs">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Security Matrix</span>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-400/20 text-xs">
                    Protected
                  </Badge>
                </div>
              </div>
            </div>

            {/* Version Info */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Atom className="w-3 h-3" />
                AstralCore Hype Drive
                <Waves className="w-3 h-3" />
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating indicator when hidden */}
      {!isVisible && (
        <div className="fixed top-1/2 right-2 transform -translate-y-1/2 z-30 opacity-60 hover:opacity-100 transition-opacity">
          <div 
            className="w-1 h-16 bg-gradient-to-b from-blue-400/50 to-purple-400/50 rounded-full backdrop-blur-xl border border-white/10 cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => setIsVisible(true)}
          />
        </div>
      )}

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-5px) translateX(2px); }
          50% { transform: translateY(0px) translateX(-2px); }
          75% { transform: translateY(5px) translateX(1px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
