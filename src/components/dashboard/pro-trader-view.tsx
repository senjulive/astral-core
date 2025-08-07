'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Play, Pause, Activity, TrendingUp, BarChart3, Settings, Zap } from "lucide-react";
import { GridTradingAnimation } from "./grid-trading-animation";
import { useToast } from "@/hooks/use-toast";
import { TradingBotCard } from "../trading-bot-card";

export function ProTraderView() {
  const { wallet, tier, rank } = useUser();
  const { toast } = useToast();
  const [isTrading, setIsTrading] = React.useState(false);
  const [dailyClicks, setDailyClicks] = React.useState(0);

  const dailyEarnings = (wallet?.growth as any)?.dailyEarnings ?? 0;
  const clicksLeft = (wallet?.growth as any)?.clicksLeft ?? (tier?.clicks || 5);
  const maxClicks = tier?.clicks || 5;
  const earningsRate = tier?.earningsRate || 0.05;

  const handleTradingToggle = () => {
    if (!tier) {
      toast({
        title: "VIP CORE Required",
        description: "You need to deposit funds to unlock trading features.",
        variant: "destructive"
      });
      return;
    }

    setIsTrading(!isTrading);
    toast({
      title: isTrading ? "Trading Stopped" : "Trading Started",
      description: isTrading 
        ? "CORE Grid Trading has been paused." 
        : "CORE Grid Trading is now active and generating profits.",
    });
  };

  const handleManualClick = () => {
    if (clicksLeft <= 0) {
      toast({
        title: "Daily Limit Reached",
        description: "You've used all your manual earnings for today. Wait 24 hours for reset.",
        variant: "destructive"
      });
      return;
    }

    const earnAmount = Math.random() * earningsRate + 0.01;
    setDailyClicks(prev => prev + 1);
    
    toast({
      title: "Manual Earnings Generated!",
      description: `+$${earnAmount.toFixed(2)} added to your balance`,
    });
  };

  const tradingPairs = [
    { pair: "BTC/USDT", profit: "+2.45%", volume: "$45.2M", status: "active" },
    { pair: "ETH/USDT", profit: "+1.87%", volume: "$32.1M", status: "active" },
    { pair: "SOL/USDT", profit: "+3.21%", volume: "$18.7M", status: "paused" },
    { pair: "ADA/USDT", profit: "+0.94%", volume: "$12.3M", status: "active" },
  ];

  const recentTrades = [
    { time: "2 min ago", pair: "BTC/USDT", type: "BUY", amount: "$125.50", profit: "+$2.45" },
    { time: "5 min ago", pair: "ETH/USDT", type: "SELL", amount: "$89.20", profit: "+$1.87" },
    { time: "8 min ago", pair: "SOL/USDT", type: "BUY", amount: "$67.80", profit: "+$1.23" },
    { time: "12 min ago", pair: "BTC/USDT", type: "SELL", amount: "$156.70", profit: "+$3.21" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Trading Controls */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              CORE Grid Trading
            </CardTitle>
            <CardDescription>
              Automated high-frequency trading with advanced grid algorithms
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    isTrading ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  )} />
                  <span className="font-medium">
                    {isTrading ? "Active" : "Paused"}
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleTradingToggle}
                variant={isTrading ? "destructive" : "default"}
                size="sm"
              >
                {isTrading ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isTrading ? "Stop" : "Start"}
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Today's Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                +${dailyEarnings.toFixed(2)}
              </p>
            </div>

            {tier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>VIP CORE Tier</span>
                  <Badge variant="outline" className="text-xs">
                    {tier.name}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Earnings Rate</span>
                  <span className="font-medium">{(earningsRate * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Manual Earnings
            </CardTitle>
            <CardDescription>
              Click to generate instant profits (Limited daily uses)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clicks Used Today</span>
                <span>{dailyClicks} / {maxClicks}</span>
              </div>
              <Progress value={(dailyClicks / maxClicks) * 100} />
            </div>

            <Button 
              onClick={handleManualClick}
              disabled={clicksLeft <= 0}
              className="w-full"
              size="lg"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Earnings
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Resets daily at 00:00 UTC
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trading Animation */}
      <Card>
        <CardHeader>
          <CardTitle>Live Trading Visualization</CardTitle>
          <CardDescription>
            Real-time view of your automated trading activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GridTradingAnimation isActive={isTrading} />
        </CardContent>
      </Card>

      <Tabs defaultValue="pairs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pairs">Trading Pairs</TabsTrigger>
          <TabsTrigger value="history">Recent Trades</TabsTrigger>
          <TabsTrigger value="bot">Bot Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pairs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Pairs</CardTitle>
              <CardDescription>
                Cryptocurrency pairs currently being traded by your bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {tradingPairs.map((pair) => (
                  <div key={pair.pair} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        pair.status === "active" ? "bg-green-500" : "bg-yellow-500"
                      )} />
                      <div>
                        <p className="font-medium">{pair.pair}</p>
                        <p className="text-sm text-muted-foreground">24h Volume: {pair.volume}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{pair.profit}</p>
                      <p className="text-sm text-muted-foreground capitalize">{pair.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>
                Your latest automated trading activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrades.map((trade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{trade.pair}</p>
                      <p className="text-sm text-muted-foreground">{trade.time}</p>
                    </div>
                    <div className="text-center">
                      <Badge variant={trade.type === "BUY" ? "default" : "secondary"}>
                        {trade.type}
                      </Badge>
                      <p className="text-sm mt-1">{trade.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{trade.profit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bot" className="space-y-4">
          <TradingBotCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
