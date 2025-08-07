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
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";
import { depositRequestSchema } from "@/lib/validators";
import { 
  Wallet, 
  Copy, 
  Upload, 
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
  Zap,
  Shield,
  TrendingUp,
  Coins,
  Network,
  QrCode
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
    Wallet,
};

type DepositFormValues = z.infer<typeof depositRequestSchema>;

const cryptoAssets = [
  {
    symbol: "USDT",
    name: "Tether",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    networks: [
      { name: "TRC20 (TRON)", address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMkx", fee: "1 USDT" },
      { name: "ERC20 (Ethereum)", address: "0x742d35Cc6544A8E5D7C5B6E4b7b3f3", fee: "5 USDT" },
      { name: "BEP20 (BSC)", address: "0x742d35Cc6544A8E5D7C5B6E4b7b3f3", fee: "1 USDT" }
    ]
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    networks: [
      { name: "Bitcoin Network", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", fee: "0.0005 BTC" }
    ]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    networks: [
      { name: "ERC20 (Ethereum)", address: "0x742d35Cc6544A8E5D7C5B6E4b7b3f3", fee: "0.005 ETH" }
    ]
  }
];

const pendingDeposits = [
  {
    id: "dep_001",
    amount: 100,
    currency: "USDT",
    network: "TRC20 (TRON)",
    transactionId: "a1b2c3d4e5f6g7h8i9j0",
    status: "pending",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "dep_002",
    amount: 0.05,
    currency: "BTC",
    network: "Bitcoin Network",
    transactionId: "z9y8x7w6v5u4t3s2r1q0",
    status: "confirmed",
    timestamp: "2024-01-14T15:45:00Z"
  }
];

export function DepositView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedAsset, setSelectedAsset] = React.useState(cryptoAssets[0]);
  const [selectedNetwork, setSelectedNetwork] = React.useState(0);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [currentTab, setCurrentTab] = React.useState<"deposit" | "address" | "history">("deposit");

  const { user } = useUser();
  const { toast } = useToast();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositRequestSchema),
    defaultValues: {
      amount: 0,
      currency: "USDT",
      transactionId: "",
      proofOfPayment: "",
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

  const onSubmit = async (values: DepositFormValues) => {
    try {
      console.log("Deposit request:", values);
      
      toast({
        title: "Quantum Deposit Initiated",
        description: "Your deposit request is being processed by our neural networks. You'll receive confirmation shortly.",
      });

      form.reset();
      setUploadedFile(null);
    } catch (error) {
      toast({
        title: "Neural Network Error",
        description: "Failed to process deposit request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Quantum Address Copied!",
      description: "Wallet address copied to your system clipboard",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      form.setValue("proofOfPayment", file.name);
    }
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
  const RankIcon = rankIcons[rank.Icon] || Wallet;
  const currentNetwork = selectedAsset.networks[selectedNetwork];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Deposit Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-green-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-green-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-500/30 to-blue-500/20 text-green-400 font-bold text-lg backdrop-blur-xl">
                    <Wallet className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    AstralCore Funds
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Fuel your AstralCore hyperdrive with digital assets</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-400/40 text-green-300 bg-green-400/10">
                    <Shield className="h-3 w-3 mr-1" />
                    Secured Network
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentTab(currentTab === "address" ? "deposit" : "address")}
                className="flex-1 sm:flex-none"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Address
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-blue-600"
                onClick={() => setCurrentTab("deposit")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Deposit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <Wallet className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-green-400">${totalBalance}</p>
            <p className="text-xs text-gray-400">Balance</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <CheckCircle className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-400">{pendingDeposits.filter(d => d.status === "confirmed").length}</p>
            <p className="text-xs text-gray-400">Confirmed</p>
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
            <p className="text-lg font-bold text-yellow-400">{pendingDeposits.filter(d => d.status === "pending").length}</p>
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
          onClick={() => setCurrentTab("deposit")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "deposit"
              ? "bg-gradient-to-r from-green-500/20 to-blue-500/10 border border-green-400/40 text-green-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Plus className="h-4 w-4 inline mr-2" />
          Deposit
        </button>
        <button
          onClick={() => setCurrentTab("address")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "address"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <QrCode className="h-4 w-4 inline mr-2" />
          Address
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
      {currentTab === "deposit" && (
        <div className="space-y-4">
          {/* Asset Selection */}
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
                    onClick={() => setSelectedNetwork(index)}
                    className={cn(
                      "flex items-center justify-between p-3 border rounded-lg text-left transition-all duration-300 w-full",
                      selectedNetwork === index
                        ? "border-purple-400/40 bg-purple-500/10"
                        : "border-border/40 hover:bg-white/5 hover:border-border/60"
                    )}
                  >
                    <div>
                      <p className="font-medium text-white">{network.name}</p>
                      <p className="text-sm text-gray-400">Fee: {network.fee}</p>
                    </div>
                    {selectedNetwork === index && (
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Deposit Form */}
          <Card className="bg-black/40 backdrop-blur-xl border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-400" />
                Quantum Transaction Details
              </CardTitle>
              <CardDescription>
                Submit your deposit information for neural processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Deposit Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              placeholder="0.00"
                              className="bg-black/20 border-border/40"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Currency</FormLabel>
                          <FormControl>
                            <Input 
                              value={selectedAsset.symbol} 
                              readOnly 
                              className="bg-black/20 border-border/40"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="transactionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Transaction Hash</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the transaction hash from your wallet"
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
                    name="proofOfPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Proof Upload (Optional)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="bg-black/20 border-border/40 cursor-pointer"
                            />
                            {uploadedFile && (
                              <p className="text-sm text-green-400">
                                File uploaded: {uploadedFile.name}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Confirm Deposit
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "address" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-400" />
              Quantum Deposit Address
            </CardTitle>
            <CardDescription>
              Send {selectedAsset.symbol} to this secure neural address using {currentNetwork.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Quantum Address</label>
                  <div className="flex gap-2">
                    <Input
                      value={currentNetwork.address}
                      readOnly
                      className="font-mono text-sm bg-black/20 border-border/40"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(currentNetwork.address)}
                      className="border-border/40"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Neural Network</label>
                  <Input 
                    value={currentNetwork.name} 
                    readOnly 
                    className="bg-black/20 border-border/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Network Fee</label>
                  <Input 
                    value={currentNetwork.fee} 
                    readOnly 
                    className="bg-black/20 border-border/40"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-white rounded-lg">
                  <QRCodeSVG value={currentNetwork.address} size={150} />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Scan quantum code to copy address
                </p>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg backdrop-blur-xl">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-yellow-300">
                    Neural Network Protocol
                  </p>
                  <ul className="text-sm text-yellow-200 space-y-1">
                    <li>• Only send {selectedAsset.symbol} to this quantum address</li>
                    <li>• Minimum deposit: $100 USD equivalent</li>
                    <li>• Processed after 1-3 network confirmations</li>
                    <li>• Wrong network deposits result in permanent loss</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "history" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <History className="h-5 w-5 text-purple-400" />
              Quantum Transaction History
            </CardTitle>
            <CardDescription>
              Track all your deposit transactions and confirmations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDeposits.map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between p-4 bg-white/5 border border-border/40 rounded-lg backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <Image
                      src={cryptoAssets.find(a => a.symbol === deposit.currency)?.iconUrl || ""}
                      alt={deposit.currency}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-white">
                        {deposit.amount} {deposit.currency}
                      </p>
                      <p className="text-sm text-gray-400">
                        {deposit.network} • {format(new Date(deposit.timestamp), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        {deposit.transactionId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        deposit.status === "confirmed" 
                          ? "border-green-400/40 text-green-300 bg-green-400/10"
                          : "border-yellow-400/40 text-yellow-300 bg-yellow-400/10"
                      )}
                    >
                      {deposit.status === "confirmed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {deposit.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                      {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {pendingDeposits.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No deposits yet</p>
                  <p className="text-sm">Start by making your first quantum deposit!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
