'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Award,
  Bot,
  BarChart3,
  Lock,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
  Star
} from "lucide-react";
import { AstralLogo } from "@/components/icons/astral-logo";
import Link from "next/link";

interface LearnMoreModalProps {
  children: React.ReactNode;
}

export function LearnMoreModal({ children }: LearnMoreModalProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  const features = [
    {
      icon: Brain,
      title: "Quantum AI Engine",
      description: "Advanced neural networks that learn and adapt to market conditions in real-time",
      details: "Our proprietary quantum AI processes over 10 million data points per second, using machine learning algorithms to identify profitable trading opportunities across multiple cryptocurrency markets.",
      color: "text-blue-400"
    },
    {
      icon: TrendingUp,
      title: "Grid Trading Strategy",
      description: "Automated grid trading that profits from market volatility in any direction",
      details: "The bot places buy and sell orders at predetermined intervals above and below the current market price, capturing profits from price fluctuations regardless of market direction.",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Multi-layer security and intelligent position sizing to protect your capital",
      details: "Advanced risk management algorithms automatically adjust position sizes, implement stop-losses, and diversify across multiple trading pairs to minimize risk and maximize returns.",
      color: "text-cyan-400"
    },
    {
      icon: Zap,
      title: "24/7 Automation",
      description: "Never miss an opportunity with continuous market monitoring and execution",
      details: "The trading bot operates around the clock, monitoring markets and executing trades even while you sleep, ensuring you never miss profitable opportunities.",
      color: "text-yellow-400"
    }
  ];

  const stats = [
    { label: "Success Rate", value: "99.7%", icon: CheckCircle, color: "text-green-400" },
    { label: "Average Daily Return", value: "2.8%", icon: TrendingUp, color: "text-blue-400" },
    { label: "Active Users", value: "50,000+", icon: Users, color: "text-purple-400" },
    { label: "Total Volume Traded", value: "$2.1B", icon: BarChart3, color: "text-cyan-400" },
    { label: "Supported Cryptocurrencies", value: "50+", icon: Globe, color: "text-orange-400" },
    { label: "Average Response Time", value: "150ms", icon: Zap, color: "text-yellow-400" }
  ];

  const tiers = [
    {
      name: "Bronze",
      balance: "$100 - $499",
      earnings: "2.0% daily",
      features: ["Enhanced grid trading", "4 manual earnings/day", "Priority support"],
      color: "border-amber-600/50 text-amber-400"
    },
    {
      name: "Silver",
      balance: "$500 - $999",
      earnings: "3.0% daily",
      features: ["Advanced algorithms", "5 manual earnings/day", "Squad bonuses"],
      color: "border-slate-400/50 text-slate-300"
    },
    {
      name: "Gold",
      balance: "$1,000 - $4,999",
      earnings: "4.0% daily",
      features: ["Premium strategies", "6 manual earnings/day", "VIP access"],
      color: "border-yellow-400/50 text-yellow-400"
    },
    {
      name: "Platinum",
      balance: "$5,000 - $14,999",
      earnings: "5.5% daily",
      features: ["Elite algorithms", "7 manual earnings/day", "Personal advisor"],
      color: "border-blue-400/50 text-blue-400"
    },
    {
      name: "Diamond",
      balance: "$15,000+",
      earnings: "8.5% daily",
      features: ["Quantum AI access", "10+ manual earnings/day", "Exclusive features"],
      color: "border-purple-400/50 text-purple-400"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Create Account & Deposit",
      description: "Sign up and make your first deposit to activate your trading bot",
      icon: Users
    },
    {
      step: 2, 
      title: "AI Analyzes Markets",
      description: "Our quantum AI analyzes market patterns and identifies opportunities",
      icon: Brain
    },
    {
      step: 3,
      title: "Automated Trading",
      description: "The bot executes trades automatically using advanced grid strategies", 
      icon: Bot
    },
    {
      step: 4,
      title: "Earn Profits Daily",
      description: "Watch your balance grow with consistent daily returns",
      icon: TrendingUp
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50 border-blue-400/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <AstralLogo className="h-8 w-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AstralCore Quantum AI
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg">
            The future of automated cryptocurrency trading powered by advanced quantum AI technology
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tiers">VIP Tiers</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] w-full pr-4">
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-400" />
                    What is AstralCore?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    AstralCore is a revolutionary cryptocurrency trading platform powered by quantum artificial intelligence. 
                    Our advanced neural networks analyze millions of market data points in real-time to execute profitable 
                    trades automatically, 24 hours a day, 7 days a week.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Using sophisticated grid trading strategies, our AI bot generates consistent profits from market 
                    volatility regardless of whether prices are going up or down. With over 50,000 active users and 
                    $2.1 billion in total trading volume, AstralCore has proven itself as the leading AI trading platform.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-green-900/20 border border-green-400/20 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2">Why Choose AstralCore?</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Proven 99.7% success rate</li>
                        <li>• No trading experience required</li>
                        <li>• Passive income generation</li>
                        <li>• Bank-level security</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-900/20 border border-blue-400/20 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">Getting Started</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Sign up in 2 minutes</li>
                        <li>• Deposit minimum $100</li>
                        <li>• Activate your AI bot</li>
                        <li>• Start earning immediately</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1">
                  <Link href="/register">
                    <Zap className="mr-2 h-5 w-5" />
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-gray-800 flex-1" onClick={() => setActiveTab("how-it-works")}>
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="border-blue-400/20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                        {feature.title}
                      </CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm leading-relaxed">{feature.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tiers" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">VIP Tier System</h3>
                <p className="text-gray-300">Higher account balances unlock better earning rates and exclusive features</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tiers.map((tier, index) => (
                  <Card key={index} className={`border ${tier.color} bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm`}>
                    <CardHeader className="text-center">
                      <CardTitle className={tier.color}>{tier.name}</CardTitle>
                      <CardDescription>{tier.balance}</CardDescription>
                      <Badge variant="outline" className={`${tier.color} mt-2`}>
                        {tier.earnings}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-2">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-300">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="how-it-works" className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">How AstralCore Works</h3>
                <p className="text-gray-300">Simple steps to start earning with quantum AI trading</p>
              </div>

              <div className="space-y-6">
                {howItWorks.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <Card className="flex-1 border-blue-400/20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <step.icon className="h-5 w-5 text-blue-400" />
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <Card className="border-green-400/20 bg-gradient-to-br from-green-900/20 to-blue-900/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Ready to Start?</h4>
                    <p className="text-gray-300 mb-4">Join 50,000+ traders earning passive income with AstralCore</p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                      <Link href="/register">
                        <Star className="mr-2 h-5 w-5" />
                        Create Free Account
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Platform Statistics</h3>
                <p className="text-gray-300">Real-time performance metrics and achievements</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                  <Card key={index} className="border-blue-400/20 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm text-center">
                    <CardContent className="p-6">
                      <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                      <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-purple-400/20 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-400" />
                    Why These Numbers Matter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-gray-300 text-sm">
                  <p>• <strong>99.7% Success Rate:</strong> Our AI makes profitable decisions 997 out of 1000 times</p>
                  <p>• <strong>2.8% Daily Return:</strong> Average daily profit across all user accounts</p>
                  <p>• <strong>150ms Response:</strong> Lightning-fast trade execution beats market movements</p>
                  <p>• <strong>$2.1B Volume:</strong> Proven platform handling institutional-level trading</p>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
