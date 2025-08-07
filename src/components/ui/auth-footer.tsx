'use client';

import Link from 'next/link';
import { AstralLogo } from '@/components/icons/astral-logo';
import { Shield, Globe, Zap, Brain, Star, CheckCircle } from 'lucide-react';

export function AuthFooter() {
  return (
    <footer className="relative z-30 mt-16 border-t border-gray-800/50 bg-black/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Trust Section */}
        <div className="text-center mb-8">
          <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">
            Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">75,000+ Traders</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Our quantum AI technology powers profitable trading strategies worldwide
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl blur-lg" />
            <div className="relative text-center p-4 bg-black/40 backdrop-blur-xl rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-400/30">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Quantum Security</h4>
              <p className="text-gray-400 text-xs">Military-grade encryption protocols</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl blur-lg" />
            <div className="relative text-center p-4 bg-black/40 backdrop-blur-xl rounded-xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-400/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Proven Results</h4>
              <p className="text-gray-400 text-xs">$5.2B+ trading volume processed</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl blur-lg" />
            <div className="relative text-center p-4 bg-black/40 backdrop-blur-xl rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-purple-400/30">
                <Globe className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">Global Network</h4>
              <p className="text-gray-400 text-xs">Active across 180+ countries</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/30">
            <div className="text-lg sm:text-xl font-bold text-blue-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4" />
              99.9%
            </div>
            <div className="text-xs text-gray-400">Uptime</div>
          </div>
          
          <div className="text-center p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/30">
            <div className="text-lg sm:text-xl font-bold text-purple-400 flex items-center justify-center gap-1">
              <Brain className="w-4 h-4" />
              3.2%
            </div>
            <div className="text-xs text-gray-400">Daily Avg</div>
          </div>
          
          <div className="text-center p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/30">
            <div className="text-lg sm:text-xl font-bold text-cyan-400">75ms</div>
            <div className="text-xs text-gray-400">Speed</div>
          </div>
          
          <div className="text-center p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/30">
            <div className="text-lg sm:text-xl font-bold text-green-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4" />
              75K+
            </div>
            <div className="text-xs text-gray-400">Users</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                  <AstralLogo className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div>
                <span className="text-white font-bold text-sm">AstralCore</span>
                <div className="text-gray-500 text-xs">Hype Drive</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/forgot-password" className="text-gray-400 hover:text-white transition-colors">
                Recovery
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-xs mt-4 pt-4 border-t border-gray-800/30">
            © 2024 AstralCore Technologies. All rights reserved. | Quantum Trading Platform
          </div>
        </div>
      </div>
    </footer>
  );
}
