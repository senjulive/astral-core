"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { type WalletData } from "@/lib/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BotAnimationPreview } from "./dashboard/bot-animation-preview";
import { AstralLogo } from "./icons/astral-logo";
import { type TierSetting, getCurrentTier } from "@/lib/tiers";
import { GridTradingAnimation } from "./dashboard/grid-trading-animation";

export function TradingBotCard({
  walletData,
  onUpdate,
  totalBalance,
  className,
  tierSettings,
}: {
  walletData: WalletData;
  onUpdate: (data: WalletData) => void;
  totalBalance: number;
  className?: string;
  tierSettings: TierSetting[];
}) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [minGridBalance, setMinGridBalance] = React.useState(100);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchBotSettings() {
      try {
        const response = await fetch('/api/public-settings?key=botSettings');
        if (response.ok) {
          const data = await response.json();
          if (data && data.minGridBalance) {
            setMinGridBalance(data.minGridBalance);
          }
        }
      } catch (error) {
        console.error("Could not fetch bot settings, using default.", error);
      }
    }
    fetchBotSettings();
  }, []);

  const currentTier = getCurrentTier(totalBalance, tierSettings);
  
  const profitPerTrade = currentTier && totalBalance > 0 
    ? (totalBalance * currentTier.dailyProfit) / currentTier.clicks 
    : 0;
  
  const profitPercentagePerTrade = currentTier && totalBalance > 0 
    ? (currentTier.dailyProfit / currentTier.clicks) * 100
    : 0;

  const canStart =
    totalBalance >= minGridBalance && (walletData?.growth?.clicksLeft ?? 0) > 0 && !isAnimating;


  const handleStart = async () => {
    if (!canStart || !currentTier) {
      if (isAnimating) {
        toast({ title: "Bot is already running." });
      } else if (totalBalance < minGridBalance) {
        toast({
          title: "Insufficient Balance",
          description: `You need at least $${minGridBalance} to run the bot.`,
          variant: "destructive"
        });
      } else if ((walletData?.growth?.clicksLeft ?? 0) <= 0) {
        toast({
          title: "Limit Reached",
          description: "You have no grids remaining for today.",
          variant: "destructive"
        });
      }
      return;
    }

    setIsAnimating(true);
    
    setTimeout(() => {
        const usdtEarnings = profitPerTrade;
        
        const newEarning = { amount: usdtEarnings, timestamp: Date.now() };

        const newWalletData: WalletData = {
          ...walletData,
          balances: {
            ...walletData.balances,
            usdt: (walletData.balances?.usdt ?? 0) + usdtEarnings,
          },
          growth: {
            ...walletData.growth,
            clicksLeft: (walletData.growth?.clicksLeft ?? 1) - 1,
            dailyEarnings: (walletData.growth?.dailyEarnings ?? 0) + usdtEarnings,
            earningsHistory: [...(walletData.growth.earningsHistory || []), newEarning],
          },
        };

        onUpdate(newWalletData);

        toast({
          title: "Trade Successful!",
          description: `You've earned $${usdtEarnings.toFixed(2)} USDT.`,
        });

        setIsAnimating(false);
    }, 10000); // Shorter animation for demo
  };

  return (
    <Card
      onClick={handleStart}
      className={cn(
        "transition-all duration-300 overflow-hidden",
        canStart && "cursor-pointer hover:border-primary hover:shadow-lg",
        isAnimating && "border-primary ring-2 ring-primary/50",
        className
      )}
    >
        {isAnimating && currentTier ? (
            <GridTradingAnimation totalBalance={totalBalance} profitPerTrade={profitPerTrade} profitPercentage={profitPercentagePerTrade} />
        ) : (
            <>
                <CardHeader className="flex-row items-start justify-between pb-4">
                    <div className="space-y-1">
                    <CardTitle>Astral Trading</CardTitle>
                    <CardDescription>
                        {(walletData?.growth?.clicksLeft ?? 0) > 0 
                            ? `${walletData.growth.clicksLeft} grid${walletData.growth.clicksLeft > 1 ? 's' : ''} remaining`
                            : 'No grids remaining'
                        }
                    </CardDescription>
                    </div>
                    <div className={cn(
                        "p-2 rounded-lg bg-muted transition-all",
                        isAnimating && "bg-primary/20 animate-bot-pulse"
                    )}>
                        <Bot className={cn(
                            "h-6 w-6 text-foreground/80 transition-colors",
                            isAnimating && "text-primary"
                        )} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center text-center h-[9.25rem] rounded-lg bg-muted/50 p-4 animate-in fade-in-0 duration-300">
                        {canStart ? (
                        <BotAnimationPreview />
                        ) : totalBalance < minGridBalance ? (
                            <Zap className="h-8 w-8 mb-2 text-muted-foreground" />
                        ) : (
                            <AstralLogo className="h-10 w-10 mb-2 text-muted-foreground" />
                        )}
                        <p className="font-semibold text-card-foreground mt-2">
                        {canStart ? 'START GRID' : totalBalance < minGridBalance ? `Minimum $${minGridBalance} balance required` : 'No grids remaining'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {canStart && currentTier ? `Earn up to ${(currentTier.dailyProfit * 100).toFixed(1)}% daily.` : ''}
                        </p>
                    </div>
                </CardContent>
            </>
        )}
    </Card>
  );
}
