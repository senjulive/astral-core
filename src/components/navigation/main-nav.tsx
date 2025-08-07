'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Zap, Shield, TrendingUp, Users, HelpCircle, Mail } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About', icon: <Users className="w-4 h-4" /> },
  { href: '/help', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
  { href: '/contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> },
  { href: '/faq', label: 'FAQ' },
];

const authItems: NavItem[] = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Get Started', badge: 'New' },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-white">AstralCore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <Badge variant="outline" className="text-xs border-blue-400/50 text-blue-300">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {authItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.href === '/register' ? (
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ) : (
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    {item.label}
                  </Button>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="bg-black/95 backdrop-blur-xl border-l border-white/10 w-80"
            >
              <div className="flex flex-col h-full">
                
                {/* Mobile Header */}
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg"></div>
                    <span className="text-lg font-bold text-white">AstralCore</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={closeSheet}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 py-6">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSheet}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          pathname === item.href
                            ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto text-xs border-blue-400/50 text-blue-300">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Feature Highlights */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
                    <h4 className="text-white font-semibold mb-3">Why Choose AstralCore?</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">Quantum AI Trading</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">Bank-Level Security</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Proven Returns</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="space-y-3 py-4 border-t border-white/10">
                  {authItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeSheet}>
                      {item.href === '/register' ? (
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                          {item.label}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                          {item.label}
                        </Button>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Mobile Footer */}
                <div className="text-center py-4 border-t border-white/10">
                  <p className="text-xs text-gray-400">
                    © 2024 AstralCore. All rights reserved.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
