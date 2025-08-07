"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { withdrawRequestSchema } from "@/lib/validators";
import { 
  Send, 
  Wallet, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  User,
  ShieldCheck,
  Brain,
  Target,
  Award,
  CreditCard,
  History,
  Plus,
  Shield,
  TrendingUp,
  Coins,
  Network,
  ArrowDownLeft,
  Minus
} from "lucide-react";
import { format } from 'date-fns';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import type { SVGProps } from 'react';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Send,
};

type WithdrawFormValues = z.infer<typeof withdrawRequestSchema>;

const cryptoAssets = [
  {
    symbol: "USDT",
    name: "Tether",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    networks: [
      { name: "TRC20 (TRON)", fee: "1 USDT", minWithdraw: 10 },
      { name: "ERC20 (Ethereum)", fee: "5 USDT", minWithdraw: 20 },
      { name: "BEP20 (BSC)", fee: "1 USDT", minWithdraw: 10 }
    ]
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    networks: [
      { name: "Bitcoin Network", fee: "0.0005 BTC", minWithdraw: 0.001 }
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    networks: [
      { name: "ERC20 (Ethereum)", fee: "0.005 ETH", minWithdraw: 0.01 }
    ]
  }
];

const pendingWithdrawals = [
  {
    id: "with_001",
    amount: 500,
    currency: "USDT",
    network: "TRC20 (TRON)",
    walletAddress: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMkx",
    status: "pending",
    timestamp: "2024-01-15T14:30:00Z",
    fee: "1 USDT"
  },
  {
    id: "with_002",
    amount: 0.1,
    currency: "BTC",
    network: "Bitcoin Network",
    walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    status: "completed",
    timestamp: "2024-01-14T09:15:00Z",
    fee: "0.0005 BTC"
  }
];

export function WithdrawView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedAsset, setSelectedAsset] = React.useState(cryptoAssets[0]);
  const [selectedNetwork, setSelectedNetwork] = React.useState(0);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState<"withdraw" | "balance" | "history">("withdraw");

  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawRequestSchema),
    defaultValues: {
      amount: 0,
      currency: "USDT",
      walletAddress: "",
      network: "",
    },
  });

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  const watchedAmount = form.watch("amount");
  const currentNetwork = selectedAsset.networks[selectedNetwork];
  const balances = wallet?.balances as any;
  const availableBalance = balances?.[selectedAsset.symbol.toLowerCase()] || 0;
  const feeAmount = currentNetwork.fee.includes("USDT") ? parseFloat(currentNetwork.fee) : 0;
  const netAmount = Math.max(0, watchedAmount - feeAmount);

  const onSubmit = async (values: WithdrawFormValues) => {
    if (values.amount > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this withdrawal.",
        variant: "destructive"
      });
      return;
    }

    if (values.amount < currentNetwork.minWithdraw) {
      toast({
        title: "Minimum Amount Required",
        description: `Minimum withdrawal amount is ${currentNetwork.minWithdraw} ${selectedAsset.symbol}`,
        variant: "destructive"
      });
      return;
    }

    setIsConfirming(true);
  };

  const confirmWithdrawal = async () => {
    try {
      const withdrawalData = {
        ...form.getValues(),
        currency: selectedAsset.symbol,
        network: currentNetwork.name,
        fee: currentNetwork.fee,
        netAmount
      };
      
      console.log("Withdrawal request:", withdrawalData);
      
      toast({
        title: "AstralCore Withdrawal Initiated",
        description: "Your withdrawal request is being processed by our neural networks. You'll receive confirmation shortly.",
      });

      form.reset();
      setIsConfirming(false);
    } catch (error) {
      toast({
        title: "Neural Network Error",
        description: "Failed to process withdrawal request. Please try again.",
        variant: "destructive"
      });
      setIsConfirming(false);
    }
  };

  const setMaxAmount = () => {
    const maxAmount = Math.max(0, availableBalance - feeAmount);
    form.setValue("amount", maxAmount);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || Send;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Withdrawal Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-red-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-red-500/30 to-orange-500/20 text-red-400 font-bold text-lg backdrop-blur-xl">
                    <Send className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    AstralCore Extraction
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Withdraw your digital assets from the hyperdrive</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-red-400/40 text-red-300 bg-red-400/10">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure Transfer
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentTab(currentTab === "balance" ? "withdraw" : "balance")}
                className="flex-1 sm:flex-none"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Balance
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-red-500 to-orange-600"
                onClick={() => setCurrentTab("withdraw")}
              >
                <Minus className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-red-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-red-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-500/20 to-red-600/10 p-2 rounded-lg border border-red-400/30">
                <Wallet className="h-5 w-5 mx-auto text-red-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-red-400">${totalBalance}</p>
            <p className="text-xs text-gray-400">Available</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-orange-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-orange-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500/20 to-orange-600/10 p-2 rounded-lg border border-orange-400/30">
                <CheckCircle className="h-5 w-5 mx-auto text-orange-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-orange-400">{pendingWithdrawals.filter(d => d.status === "completed").length}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <Clock className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-yellow-400">{pendingWithdrawals.filter(d => d.status === "pending").length}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Network className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">{cryptoAssets.length}</p>
            <p className="text-xs text-gray-400">Assets</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-lg border border-border/40">
        <button
          onClick={() => setCurrentTab("withdraw")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "withdraw"
              ? "bg-gradient-to-r from-red-500/20 to-orange-500/10 border border-red-400/40 text-red-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Minus className="h-4 w-4 inline mr-2" />
          Withdraw
        </button>
        <button
          onClick={() => setCurrentTab("balance")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "balance"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Wallet className="h-4 w-4 inline mr-2" />
          Balance
        </button>
        <button
          onClick={() => setCurrentTab("history")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "history"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <History className="h-4 w-4 inline mr-2" />
          History
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === "withdraw" && (
        <div className="space-y-4">
          {/* Asset and Network Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-blue-400" />
                  Select Crypto Currencies
                </CardTitle>
                <CardDescription>Choose your preferred digital currency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {cryptoAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setSelectedNetwork(0);
                      form.setValue("currency", asset.symbol as any);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg text-left transition-all duration-300 w-full",
                      selectedAsset.symbol === asset.symbol
                        ? "border-blue-400/40 bg-blue-500/10"
                        : "border-border/40 hover:bg-white/5 hover:border-border/60"
                    )}
                  >
                    <Image
                      src={asset.iconUrl}
                      alt={asset.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{asset.name}</p>
                      <p className="text-sm text-gray-400">{asset.symbol}</p>
                    </div>
                    {selectedAsset.symbol === asset.symbol && (
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  Blockchain Network
                </CardTitle>
                <CardDescription>Choose blockchain network pathway</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedAsset.networks.map((network, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedNetwork(index);
                      form.setValue("network", network.name);
                    }}
                    className={cn(
                      "flex items-center justify-between p-3 border rounded-lg text-left transition-all duration-300 w-full",
                      selectedNetwork === index
                        ? "border-purple-400/40 bg-purple-500/10"
                        : "border-border/40 hover:bg-white/5 hover:border-border/60"
                    )}
                  >
                    <div>
                      <p className="font-medium text-white">{network.name}</p>
                      <p className="text-sm text-gray-400">
                        Fee: {network.fee} • Min: {network.minWithdraw} {selectedAsset.symbol}
                      </p>
                    </div>
                    {selectedNetwork === index && (
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Withdrawal Form */}
          <Card className="bg-black/40 backdrop-blur-xl border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Send className="h-5 w-5 text-red-400" />
                Withdrawal Details
              </CardTitle>
              <CardDescription>
                Enter destination wallet and withdrawal amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Destination Wallet Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter ${selectedAsset.symbol} wallet address`}
                            className="bg-black/20 border-border/40 font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Withdrawal Amount</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                step="0.000001"
                                placeholder="0.00"
                                className="bg-black/20 border-border/40"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={setMaxAmount}
                                disabled={availableBalance <= feeAmount}
                                className="border-border/40"
                              >
                                Max
                              </Button>
                            </div>
                            <p className="text-sm text-gray-400">
                              Available: {availableBalance.toFixed(6)} {selectedAsset.symbol}
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fee Breakdown */}
                  {watchedAmount > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-lg backdrop-blur-xl">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                          <span>Withdrawal Amount:</span>
                          <span>{watchedAmount} {selectedAsset.symbol}</span>
                        </div>
                        <div className="flex justify-between text-sm text-red-400">
                          <span>Network Fee:</span>
                          <span>-{currentNetwork.fee}</span>
                        </div>
                        <div className="border-t border-border/40 pt-2 flex justify-between font-medium text-white">
                          <span>You Will Receive:</span>
                          <span>{netAmount.toFixed(6)} {selectedAsset.symbol}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-red-500 to-orange-600"
                        disabled={availableBalance === 0 || watchedAmount <= 0}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Confirm Withdrawal
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-border/40">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Confirm Withdrawal</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                          <div className="space-y-4">
                            <p className="text-gray-300">Please verify your withdrawal details:</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Asset:</span>
                                <span className="font-medium text-white">{selectedAsset.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Network:</span>
                                <span className="font-medium text-white">{currentNetwork.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Address:</span>
                                <span className="font-mono text-xs break-all text-white">
                                  {form.getValues("walletAddress")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Amount:</span>
                                <span className="font-medium text-white">{watchedAmount} {selectedAsset.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Fee:</span>
                                <span className="font-medium text-red-400">{currentNetwork.fee}</span>
                              </div>
                              <div className="flex justify-between border-t border-border/40 pt-2">
                                <span className="text-gray-300">Net Amount:</span>
                                <span className="font-bold text-green-400">{netAmount.toFixed(6)} {selectedAsset.symbol}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 p-3 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                              <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-yellow-200">
                                This action cannot be undone. Please double-check the wallet address.
                              </p>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border/40">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={confirmWithdrawal}
                          className="bg-gradient-to-r from-red-500 to-orange-600"
                        >
                          Confirm Withdrawal
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "balance" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-400" />
              Available Balances
            </CardTitle>
            <CardDescription>
              Your current cryptocurrency balances available for withdrawal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {cryptoAssets.map((asset) => {
                const balance = balances?.[asset.symbol.toLowerCase()] || 0;
                return (
                  <div key={asset.symbol} className="flex items-center justify-between p-4 bg-white/5 border border-border/40 rounded-lg backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <Image
                        src={asset.iconUrl}
                        alt={asset.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium text-white">{asset.name}</p>
                        <p className="text-sm text-gray-400">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        {balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: asset.symbol === 'USDT' ? 2 : 6
                        })}
                      </p>
                      <p className="text-sm text-gray-400">{asset.symbol}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "history" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <History className="h-5 w-5 text-purple-400" />
              Withdrawal History
            </CardTitle>
            <CardDescription>
              Track all your withdrawal transactions and confirmations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-white/5 border border-border/40 rounded-lg backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <Image
                      src={cryptoAssets.find(a => a.symbol === withdrawal.currency)?.iconUrl || ""}
                      alt={withdrawal.currency}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-white">
                        {withdrawal.amount} {withdrawal.currency}
                      </p>
                      <p className="text-sm text-gray-400">
                        {withdrawal.network} • {format(new Date(withdrawal.timestamp), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        To: {withdrawal.walletAddress.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        withdrawal.status === "completed" 
                          ? "border-green-400/40 text-green-300 bg-green-400/10"
                          : "border-yellow-400/40 text-yellow-300 bg-yellow-400/10"
                      )}
                    >
                      {withdrawal.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {withdrawal.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">
                      Fee: {withdrawal.fee}
                    </p>
                  </div>
                </div>
              ))}
              
              {pendingWithdrawals.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No withdrawals yet</p>
                  <p className="text-sm">Your withdrawal history will appear here!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border-yellow-400/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-yellow-300">Security Protocol</p>
              <div className="grid gap-2 md:grid-cols-2 text-sm text-yellow-200">
                <div>
                  <strong>Processing Time:</strong> Withdrawals processed within 24 hours. Large amounts may require additional verification.
                </div>
                <div>
                  <strong>Security Measures:</strong> All withdrawals reviewed by our security team. Email confirmation required for all transactions.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
