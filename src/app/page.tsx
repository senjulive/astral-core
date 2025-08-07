import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { LearnMoreModal } from '@/components/ui/learn-more-modal';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import { AuthFooter } from '@/components/ui/auth-footer';
import { ArrowRight, Zap, Brain, TrendingUp, Shield, Cpu, Sparkles, Globe, ChevronDown, Play, Star, CheckCircle, Rocket, Atom, Waves, Wifi, Target, Infinity, Layers, Database, Lock, Eye } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Enhanced Hyperdrive Background */}
      <div className="fixed inset-0 z-0">
        {/* Multi-layer animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/95 via-purple-950/90 to-blue-950/85 animate-pulse" 
             style={{animationDuration: '6s'}} />
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-950/80 via-transparent to-violet-950/70 animate-pulse" 
             style={{animationDuration: '8s', animationDelay: '2s'}} />
        
        {/* Enhanced particle system */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                i % 4 === 0 ? 'bg-blue-400/70' : 
                i % 4 === 1 ? 'bg-purple-400/60' : 
                i % 4 === 2 ? 'bg-cyan-400/50' : 'bg-violet-400/40'
              } ${
                i % 3 === 0 ? 'w-1 h-1' : 
                i % 3 === 1 ? 'w-0.5 h-0.5' : 'w-1.5 h-1.5'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
                animation: i % 2 === 0 ? 'hyperdrive-float 8s ease-in-out infinite' : 'hologram-flicker 6s ease-in-out infinite'
              }}
            />
          ))}
        </div>

        {/* Advanced neural network visualization */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="hyperdriveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity="0.9"/>
              <stop offset="33%" stopColor="rgb(139,92,246)" stopOpacity="0.7"/>
              <stop offset="66%" stopColor="rgb(59,130,246)" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0.6"/>
            </linearGradient>
            <linearGradient id="hyperdriveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(236,72,153)" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="rgb(147,51,234)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="rgb(79,70,229)" stopOpacity="0.7"/>
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Complex neural pathways */}
          <path d="M50,150 Q200,50 400,150 T750,100 Q950,120 1150,180" 
                stroke="url(#hyperdriveGrad1)" strokeWidth="2" className="animate-pulse" fill="none" filter="url(#glow)"/>
          <path d="M100,250 Q300,150 500,250 T850,200 Q1050,220 1100,280" 
                stroke="url(#hyperdriveGrad2)" strokeWidth="1.5" className="animate-pulse" fill="none" filter="url(#glow)" 
                style={{animationDelay: '1s'}}/>
          <path d="M0,350 Q150,280 350,380 T700,320 Q900,340 1200,400" 
                stroke="url(#hyperdriveGrad1)" strokeWidth="2.5" className="animate-pulse" fill="none" filter="url(#glow)" 
                style={{animationDelay: '0.5s'}}/>
          <path d="M80,450 Q280,380 480,450 T820,420 Q1020,440 1120,500" 
                stroke="url(#hyperdriveGrad2)" strokeWidth="1.8" className="animate-pulse" fill="none" filter="url(#glow)" 
                style={{animationDelay: '1.5s'}}/>
          <path d="M30,550 Q230,480 430,550 T780,520 Q980,540 1170,600" 
                stroke="url(#hyperdriveGrad1)" strokeWidth="2.2" className="animate-pulse" fill="none" filter="url(#glow)" 
                style={{animationDelay: '2s'}}/>
          <path d="M120,650 Q320,580 520,650 T880,620 Q1080,640 1150,700" 
                stroke="url(#hyperdriveGrad2)" strokeWidth="1.6" className="animate-pulse" fill="none" filter="url(#glow)" 
                style={{animationDelay: '2.5s'}}/>
          
          {/* Enhanced neural nodes */}
          <circle cx="200" cy="120" r="6" fill="rgb(99,102,241)" className="animate-pulse" opacity="0.9" filter="url(#glow)"/>
          <circle cx="500" cy="200" r="5" fill="rgb(139,92,246)" className="animate-pulse" opacity="0.8" style={{animationDelay: '0.7s'}} filter="url(#glow)"/>
          <circle cx="800" cy="350" r="7" fill="rgb(6,182,212)" className="animate-pulse" opacity="0.9" style={{animationDelay: '1.2s'}} filter="url(#glow)"/>
          <circle cx="350" cy="450" r="4" fill="rgb(236,72,153)" className="animate-pulse" opacity="0.7" style={{animationDelay: '1.8s'}} filter="url(#glow)"/>
          <circle cx="650" cy="580" r="6" fill="rgb(147,51,234)" className="animate-pulse" opacity="0.8" style={{animationDelay: '2.3s'}} filter="url(#glow)"/>
          <circle cx="950" cy="280" r="5" fill="rgb(59,130,246)" className="animate-pulse" opacity="0.9" style={{animationDelay: '0.4s'}} filter="url(#glow)"/>
        </svg>

        {/* Hyperdrive grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 border border-blue-400/30 rotate-45 animate-hyperdrive-spin" style={{animationDelay: '0s'}} />
          <div className="absolute top-3/4 right-1/4 w-16 h-16 border border-purple-400/20 rotate-12 animate-hyperdrive-spin" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-3/4 w-12 h-12 border border-cyan-400/25 -rotate-30 animate-hyperdrive-spin" style={{animationDelay: '4s'}} />
        </div>
      </div>

      {/* Enhanced Navigation Bar */}
      <div className="relative z-50 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Advanced AI Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-3 bg-black/50 backdrop-blur-2xl rounded-2xl border border-indigo-500/40 shadow-lg shadow-indigo-500/20">
              <div className="relative">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                <div className="absolute inset-0 w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
              </div>
              <span className="text-indigo-300 font-bold text-xs sm:text-sm tracking-wider">● HYPERDRIVE ACTIVE</span>
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex border-emerald-400/50 text-emerald-300 bg-emerald-400/10 px-4 py-2 backdrop-blur-xl">
              <Zap className="w-4 h-4 mr-2" />
              99.99% Uptime
            </Badge>
            <Badge variant="outline" className="hidden md:flex border-violet-400/50 text-violet-300 bg-violet-400/10 px-4 py-2 backdrop-blur-xl">
              <Eye className="w-4 h-4 mr-2" />
              Live Monitor
            </Badge>
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Revolutionary Hero Section */}
      <section className="relative z-40 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 text-center">
        
        {/* Hyperdrive Core Logo with Advanced Animation */}
        <div className="relative mb-8 sm:mb-12">
          {/* Multi-layer energy rings */}
          <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48">
            {/* Outer ring with hyperdrive particles */}
            <div className="absolute inset-0 border-2 border-indigo-400/40 rounded-full animate-spin" style={{animationDuration: '12s'}}>
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <div className="absolute top-1/2 -left-1 w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_10px_rgba(139,69,219,0.8)]" />
            </div>
            
            {/* Middle ring */}
            <div className="absolute inset-3 border-2 border-purple-400/50 rounded-full animate-spin" style={{animationDuration: '8s', animationDirection: 'reverse'}}>
              <div className="absolute -top-0.5 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <div className="absolute top-1/2 -right-0.5 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              <div className="absolute -bottom-0.5 left-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <div className="absolute top-1/2 -left-0.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
            </div>
            
            {/* Inner ring */}
            <div className="absolute inset-6 border-2 border-cyan-400/60 rounded-full animate-spin" style={{animationDuration: '5s'}}>
              <div className="absolute -top-0.5 left-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
              <div className="absolute top-1/2 -right-0.5 w-1 h-1 bg-indigo-400 rounded-full" />
              <div className="absolute -bottom-0.5 left-1/2 w-1 h-1 bg-purple-400 rounded-full" />
              <div className="absolute top-1/2 -left-0.5 w-1 h-1 bg-violet-400 rounded-full" />
            </div>
            
            {/* Hyperdrive core energy */}
            <div className="absolute inset-8 bg-gradient-radial from-indigo-500/30 via-purple-500/20 to-transparent rounded-full animate-neural-pulse" />
          </div>
          
          {/* Central logo with enhanced glow */}
          <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
            <div className="absolute inset-0 bg-gradient-radial from-indigo-400/20 to-transparent rounded-full animate-pulse" />
            <AstralLogo className="h-20 w-20 sm:h-24 sm:w-24 text-indigo-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.9)] animate-neural-pulse" />
          </div>
          
          {/* Orbital hyperdrive elements */}
          <div className="absolute top-2 left-1/2 w-3 h-3 bg-indigo-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(99,102,241,0.8)]" style={{animationDelay: '0s'}} />
          <div className="absolute top-1/2 right-2 w-2.5 h-2.5 bg-purple-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(139,92,246,0.8)]" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(6,182,212,0.8)]" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-2 w-2.5 h-2.5 bg-violet-400 rounded-full animate-hyperdrive-float shadow-[0_0_15px_rgba(139,69,219,0.8)]" style={{animationDelay: '3s'}} />
        </div>

        {/* Enhanced Main Heading */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight tracking-tight animate-pulse">
            AstralCore
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Atom className="w-6 h-6 text-indigo-400 animate-hyperdrive-spin" />
            <p className="text-xl sm:text-2xl text-indigo-300 font-medium tracking-[0.3em] uppercase bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Hyperdrive v5.0
            </p>
            <Infinity className="w-6 h-6 text-violet-400 animate-hyperdrive-spin" style={{animationDirection: 'reverse'}} />
          </div>
        </div>

        {/* Revolutionary Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-2xl">
          <Badge variant="outline" className="border-indigo-400/60 text-indigo-200 bg-indigo-400/15 px-4 py-2 text-sm backdrop-blur-xl hover:bg-indigo-400/25 transition-all duration-300">
            <Brain className="w-4 h-4 mr-2" />
            Hyperdrive Neural AI
          </Badge>
          <Badge variant="outline" className="border-purple-400/60 text-purple-200 bg-purple-400/15 px-4 py-2 text-sm backdrop-blur-xl hover:bg-purple-400/25 transition-all duration-300">
            <Target className="w-4 h-4 mr-2" />
            Hyperdrive Trading
          </Badge>
          <Badge variant="outline" className="border-cyan-400/60 text-cyan-200 bg-cyan-400/15 px-4 py-2 text-sm backdrop-blur-xl hover:bg-cyan-400/25 transition-all duration-300">
            <Infinity className="w-4 h-4 mr-2" />
            Infinite Profits
          </Badge>
          <Badge variant="outline" className="border-violet-400/60 text-violet-200 bg-violet-400/15 px-4 py-2 text-sm backdrop-blur-xl hover:bg-violet-400/25 transition-all duration-300">
            <Shield className="w-4 h-4 mr-2" />
            Hyperdrive Security
          </Badge>
        </div>

        {/* Enhanced Description */}
        <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4">
          Experience the <span className="text-indigo-400 font-bold">next evolution</span> in trading technology. Our 
          <span className="text-purple-400 font-bold"> Hyperdrive</span> processes 
          <span className="text-cyan-400 font-bold"> infinite market possibilities</span> to generate 
          <span className="text-violet-400 font-bold"> autonomous wealth</span> through advanced neural algorithms.
        </p>

        {/* Revolutionary CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg">
          <Button asChild size="lg" className="relative group bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-700 hover:from-indigo-600 hover:via-purple-700 hover:to-violet-800 text-white font-bold px-10 py-5 text-lg shadow-[0_25px_50px_rgba(99,102,241,0.4)] hover:shadow-[0_30px_60px_rgba(99,102,241,0.6)] transition-all duration-500 rounded-2xl border border-indigo-400/40 overflow-hidden">
            <Link href="/login">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center">
                <Rocket className="mr-3 h-6 w-6 animate-pulse" />
                Launch Hyperdrive
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          </Button>
          
          <LearnMoreModal>
            <Button variant="outline" size="lg" className="relative group border-2 border-gray-500/50 text-gray-200 hover:bg-gray-800/50 px-10 py-5 text-lg backdrop-blur-2xl hover:border-indigo-400/60 transition-all duration-500 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center">
                <Brain className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                Explore Hyperdrive AI
                <Sparkles className="ml-3 h-6 w-6 group-hover:animate-pulse" />
              </div>
            </Button>
          </LearnMoreModal>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-10 border-2 border-indigo-400/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-indigo-400 rounded-full mt-2 animate-pulse" />
            </div>
            <ChevronDown className="w-5 h-5 text-indigo-400 opacity-70" />
          </div>
        </div>
      </section>

      {/* Revolutionary AI Showcase */}
      <section className="relative z-30 py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-500/10 border border-indigo-400/30 rounded-full mb-6 backdrop-blur-xl">
              <Brain className="w-6 h-6 text-indigo-400" />
              <span className="text-indigo-300 font-semibold">Hyperdrive Intelligence</span>
            </div>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8">
              Meet Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">Hyperdrive AI</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Powered by revolutionary hyperdrive algorithms that analyze infinite market dimensions 
              and execute profitable trades across multiple realities simultaneously.
            </p>
          </div>

          {/* Revolutionary AI Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mb-16 sm:mb-20">
            
            {/* Hyperdrive Neural Core */}
            <Card className="group relative overflow-hidden border-indigo-400/30 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 backdrop-blur-2xl hover:border-indigo-400/60 transition-all duration-700 hover:shadow-[0_25px_50px_rgba(99,102,241,0.3)] hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Faa19381a004d49dabf38b45dce30fd13?format=webp&width=800"
                    alt="Hyperdrive Neural Core"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  
                  {/* Enhanced holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-indigo-500/15 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.3),transparent_70%)] group-hover:opacity-100 opacity-60 transition-opacity duration-700" />
                  
                  {/* Floating hyperdrive indicators */}
                  <div className="absolute top-6 right-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                    <span className="text-indigo-300 text-sm font-bold tracking-wider">HYPERDRIVE</span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center gap-3">
                      <Brain className="w-7 h-7 text-indigo-400" />
                      Hyperdrive Neural Core
                    </h3>
                    <p className="text-indigo-200 leading-relaxed">Advanced pattern recognition with hyperdrive-enhanced prediction algorithms that process infinite market possibilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hyperdrive Engine */}
            <Card className="group relative overflow-hidden border-purple-400/30 bg-gradient-to-br from-purple-900/30 to-violet-900/20 backdrop-blur-2xl hover:border-purple-400/60 transition-all duration-700 hover:shadow-[0_25px_50px_rgba(139,92,246,0.3)] hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fe6907f8837fa4ec59f563ce0222ba35c?format=webp&width=800"
                    alt="Hyperdrive Engine"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-purple-500/15 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_70%)] group-hover:opacity-100 opacity-60 transition-opacity duration-700" />
                  
                  <div className="absolute top-6 right-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.8)]" />
                    <span className="text-purple-300 text-sm font-bold tracking-wider">HYPERDRIVE</span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center gap-3">
                      <Rocket className="w-7 h-7 text-purple-400" />
                      Hyperdrive Engine
                    </h3>
                    <p className="text-purple-200 leading-relaxed">Self-evolving AI that transcends market limitations and optimizes strategies across infinite dimensions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hyperdrive Security Matrix */}
            <Card className="group relative overflow-hidden border-cyan-400/30 bg-gradient-to-br from-cyan-900/30 to-blue-900/20 backdrop-blur-2xl hover:border-cyan-400/60 transition-all duration-700 hover:shadow-[0_25px_50px_rgba(6,182,212,0.3)] hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F52f48e5632374229b8d5254907e7dc34?format=webp&width=800"
                    alt="Hyperdrive Security Matrix"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-cyan-500/15 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.3),transparent_70%)] group-hover:opacity-100 opacity-60 transition-opacity duration-700" />
                  
                  <div className="absolute top-6 right-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                    <span className="text-cyan-300 text-sm font-bold tracking-wider">MATRIX</span>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 flex items-center gap-3">
                      <Lock className="w-7 h-7 text-cyan-400" />
                      Security Matrix
                    </h3>
                    <p className="text-cyan-200 leading-relaxed">Hyperdrive-encrypted portfolio protection with multi-dimensional risk management across all realities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revolutionary Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            <Card className="border-indigo-400/30 bg-indigo-900/15 backdrop-blur-2xl hover:bg-indigo-900/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-xl animate-pulse group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500/30 to-indigo-600/15 rounded-full flex items-center justify-center border-2 border-indigo-400/40">
                    <Database className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Hyperdrive Processing</h3>
                <p className="text-gray-300 text-sm leading-relaxed">100M+ data points per second with hyperdrive-enhanced neural networks</p>
              </CardContent>
            </Card>

            <Card className="border-purple-400/30 bg-purple-900/15 backdrop-blur-2xl hover:bg-purple-900/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-xl animate-pulse group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-purple-500/30 to-purple-600/15 rounded-full flex items-center justify-center border-2 border-purple-400/40">
                    <Layers className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Multi-Dimensional</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Advanced strategies profit from infinite market dimensions simultaneously</p>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/30 bg-cyan-900/15 backdrop-blur-2xl hover:bg-cyan-900/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500/30 to-cyan-600/15 rounded-full flex items-center justify-center border-2 border-cyan-400/40">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Hyperdrive Security</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Military-grade encryption with hyperdrive-resistant portfolio protection</p>
              </CardContent>
            </Card>

            <Card className="border-violet-400/30 bg-violet-900/15 backdrop-blur-2xl hover:bg-violet-900/25 transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-violet-400/30 rounded-full blur-xl animate-pulse group-hover:blur-2xl transition-all duration-500" />
                  <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-violet-500/30 to-violet-600/15 rounded-full flex items-center justify-center border-2 border-violet-400/40">
                    <Infinity className="w-8 h-8 text-violet-400" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Infinite Automation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Never miss opportunities with continuous multi-reality market analysis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revolutionary Performance Metrics */}
      <section className="relative z-30 py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-violet-500/10 border border-violet-400/30 rounded-full mb-6 backdrop-blur-xl">
              <TrendingUp className="w-6 h-6 text-violet-400" />
              <span className="text-violet-300 font-semibold">Hyperdrive Metrics</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Hyperdrive Performance Statistics
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 border-2 border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-500 group-hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl font-black text-indigo-400 mb-3 flex items-center justify-center gap-3">
                    <Zap className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
                    99.99%
                  </div>
                  <div className="text-gray-200 text-lg font-semibold">Hyperdrive Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-violet-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 group-hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl font-black text-purple-400 mb-3 flex items-center justify-center gap-3">
                    <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
                    8.7%
                  </div>
                  <div className="text-gray-200 text-lg font-semibold">Daily Return Avg</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 border-2 border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-500 group-hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl font-black text-cyan-400 mb-3 flex items-center justify-center gap-3">
                    <Rocket className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
                    0.3ms
                  </div>
                  <div className="text-gray-200 text-lg font-semibold">Hyperdrive Speed</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-emerald-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 border-2 border-violet-400/30 hover:border-violet-400/60 transition-all duration-500 group-hover:scale-105">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl font-black text-violet-400 mb-3 flex items-center justify-center gap-3">
                    <Star className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" />
                    ∞
                  </div>
                  <div className="text-gray-200 text-lg font-semibold">Hyperdrive Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <AuthFooter />
    </main>
  );
}
