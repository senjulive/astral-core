'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AstralLogo } from "../icons/astral-logo";
import { Zap, Shield, TrendingUp, Users, Globe, Award, ExternalLink, Bot } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Trading",
    description: "Advanced grid trading algorithms that automatically buy low and sell high, capturing profits from market volatility 24/7.",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Military-grade encryption, cold storage, and multi-factor authentication to keep your assets safe and secure.",
  },
  {
    icon: TrendingUp,
    title: "Consistent Returns",
    description: "Generate steady profits regardless of market direction through our proven grid trading strategies.",
  },
  {
    icon: Users,
    title: "Squad System",
    description: "Build your team, earn referral bonuses, and compete in leaderboards with our innovative squad recruitment system.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Trade from anywhere in the world with our web-based platform supporting multiple languages and currencies.",
  },
  {
    icon: Award,
    title: "VIP Tiers",
    description: "Unlock premium features, higher earnings rates, and exclusive benefits as you level up through our tier system.",
  },
];

const stats = [
  { label: "Active Traders", value: "15,000+" },
  { label: "Total Volume", value: "$2.1B" },
  { label: "Average Daily Profit", value: "2.5%" },
  { label: "Supported Assets", value: "50+" },
];

const teamMembers = [
  {
    name: "Alex Thompson",
    role: "CEO & Founder",
    bio: "Former Goldman Sachs quantitative trader with 15+ years in algorithmic trading systems.",
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "Ex-Google engineer specializing in high-frequency trading infrastructure and blockchain technology.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Head of Strategy",
    bio: "Institutional trading strategist with expertise in grid trading and market microstructure.",
  },
];

export function AboutView() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <CardHeader className="relative text-center py-12">
          <div className="flex justify-center mb-6">
            <AstralLogo className="h-20 w-20" />
          </div>
          <CardTitle className="text-4xl font-bold mb-4">
            AstralCore AI Trading Platform
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            The future of automated cryptocurrency trading is here. Our advanced AI-powered grid trading bot 
            generates consistent profits while you sleep, regardless of market conditions.
          </CardDescription>
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Zap className="h-4 w-4 mr-2" />
              Advanced Grid Trading
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Shield className="h-4 w-4 mr-2" />
              Bank-Level Security
            </Badge>
            <Badge variant="outline" className="text-sm py-2 px-4">
              <Users className="h-4 w-4 mr-2" />
              Global Community
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
          <CardDescription>
            Real-time metrics showcasing our platform's performance and growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Grid Trading Works</CardTitle>
          <CardDescription>
            Understanding the science behind consistent crypto profits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold">Market Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes market patterns and volatility to identify optimal trading ranges and grid parameters.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="font-semibold">Grid Placement</h3>
              <p className="text-sm text-muted-foreground">
                Automated placement of buy and sell orders in a grid pattern across multiple price levels.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="font-semibold">Profit Capture</h3>
              <p className="text-sm text-muted-foreground">
                As prices fluctuate, the bot automatically captures profits from each completed buy-sell cycle.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Why Grid Trading Works</h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Cryptocurrency markets are highly volatile, with prices constantly moving up and down. 
              Traditional traders try to time the market, but our grid trading strategy profits from 
              volatility itself. By placing orders at multiple price levels, we capture profits 
              regardless of market direction, turning volatility into consistent returns.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <CardDescription>
            Everything you need for successful automated trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card>
        <CardHeader>
          <CardTitle>Meet Our Team</CardTitle>
          <CardDescription>
            Industry experts dedicated to your trading success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center space-y-3">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Compliance</CardTitle>
          <CardDescription>
            Your safety and security are our top priorities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Security Measures</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  256-bit SSL encryption for all data transmission
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Cold storage for 95% of user funds
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Two-factor authentication (2FA) required
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Regular third-party security audits
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Multi-signature wallet protection
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Compliance</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  KYC/AML compliance program
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  GDPR compliant data protection
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  Licensed and regulated operations
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  Regular compliance audits
                </li>
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  Transparent operational practices
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Support</CardTitle>
          <CardDescription>
            Get help and stay connected with our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/support">
                  <Users className="h-4 w-4 mr-2" />
                  24/7 Support
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Live chat and ticket support
              </p>
            </div>
            <div className="text-center space-y-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/trading-info">
                  <Award className="h-4 w-4 mr-2" />
                  Trading Guide
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Learn about tiers and ranks
              </p>
            </div>
            <div className="text-center space-y-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/chat">
                  <Users className="h-4 w-4 mr-2" />
                  Community
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Join the public chat
              </p>
            </div>
            <div className="text-center space-y-3">
              <Button variant="outline" asChild className="w-full">
                <a href="https://docs.astralcore.ai" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentation
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                API docs and tutorials
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>AstralCore AI Trading Platform v3.76</p>
            <p>© 2024 AstralCore Technologies. All rights reserved.</p>
            <p>Licensed and regulated financial services provider.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
