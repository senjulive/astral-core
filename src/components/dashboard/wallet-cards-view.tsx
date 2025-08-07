"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Copy, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar,
  DollarSign,
  Plus,
  Settings,
  Lock,
  Zap,
  Brain,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { VirtualCard } from "./virtual-card";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'trading' | 'transfer';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  timestamp: string;
  txHash?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000,
    currency: 'USDT',
    status: 'completed',
    description: 'Deposit via Bank Transfer',
    timestamp: '2024-01-15T10:30:00Z',
    txHash: '0xabcd...1234'
  },
  {
    id: '2',
    type: 'reward',
    amount: 50,
    currency: 'USDT',
    status: 'completed',
    description: 'Daily Login Bonus',
    timestamp: '2024-01-14T08:00:00Z'
  },
  {
    id: '3',
    type: 'trading',
    amount: -25.50,
    currency: 'USDT',
    status: 'completed',
    description: 'AstralCore Hyperdrive Trading Fee',
    timestamp: '2024-01-14T15:45:00Z'
  },
  {
    id: '4',
    type: 'withdrawal',
    amount: -500,
    currency: 'USDT',
    status: 'pending',
    description: 'Withdrawal to External Wallet',
    timestamp: '2024-01-13T14:20:00Z',
    txHash: '0xefgh...5678'
  },
  {
    id: '5',
    type: 'transfer',
    amount: 200,
    currency: 'USDT',
    status: 'completed',
    description: 'Squad Reward Distribution',
    timestamp: '2024-01-12T12:00:00Z'
  }
];

export function WalletCardsView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showCardDetails, setShowCardDetails] = React.useState(false);
  const [cardDetails, setCardDetails] = React.useState<{
    cardNumber: string;
    cvv: string;
    expiryDate: string;
  } | null>(null);

  const { user } = useUser();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
        
        // Generate card details
        const lastFour = walletData.addresses.usdt.slice(-4) || '....';
        const cardNumber = `4000 1234 5678 ${lastFour}`;
        
        const seed = user.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const cvv = ((seed * 13) % 900) + 100;
        
        const expiryYear = (new Date().getFullYear() + 5).toString().slice(-2);
        const expiryMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const expiryDate = `${expiryMonth}/${expiryYear}`;

        setCardDetails({
          cardNumber,
          cvv: cvv.toString(),
          expiryDate
        });
      });
    }
  }, [user]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`
    });
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case 'reward': return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'trading': return <Brain className="h-4 w-4 text-blue-400" />;
      case 'transfer': return <ArrowUpRight className="h-4 w-4 text-purple-400" />;
      default: return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-lg border border-blue-400/20">
            <CreditCard className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AstralCore Cards</h1>
            <p className="text-sm text-gray-400">Manage your virtual cards and transaction history</p>
          </div>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Request Card
        </Button>
      </div>

      {/* Virtual Card Section */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
            AstralCore Virtual Card
          </CardTitle>
          <CardDescription>Your quantum-powered virtual payment card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Virtual Card Display */}
            <div className="relative">
              <VirtualCard 
                walletData={wallet} 
                userEmail={user?.email || null}
                className="mx-auto"
              />
              
              {/* Card Actions */}
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCardDetails(!showCardDetails)}
                >
                  {showCardDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showCardDetails ? 'Hide' : 'Show'} Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-400" />
                  Card Information
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-black/20 rounded-lg border border-border/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Card Number</p>
                        <p className="font-mono text-sm text-white">
                          {showCardDetails ? cardDetails?.cardNumber : '**** **** **** ' + cardDetails?.cardNumber?.slice(-4)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(cardDetails?.cardNumber || '', 'Card number')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/20 rounded-lg border border-border/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400">CVV</p>
                          <p className="font-mono text-sm text-white">
                            {showCardDetails ? cardDetails?.cvv : '***'}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(cardDetails?.cvv || '', 'CVV')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-black/20 rounded-lg border border-border/20">
                      <p className="text-xs text-gray-400">Expiry Date</p>
                      <p className="font-mono text-sm text-white">{cardDetails?.expiryDate}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-black/20 rounded-lg border border-border/20">
                    <p className="text-xs text-gray-400">Cardholder Name</p>
                    <p className="text-sm text-white">{wallet?.profile?.username || user?.email || 'User'}</p>
                  </div>
                </div>
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-400/20">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <p className="text-xs text-gray-400">Available Balance</p>
                  </div>
                  <p className="text-lg font-bold text-green-400">${wallet?.balances?.usdt?.toFixed(2) || '0.00'}</p>
                </div>
                
                <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-400/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <p className="text-xs text-gray-400">Card Status</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-400/20">Active</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="h-5 w-5 text-purple-400" />
                Transaction History
              </CardTitle>
              <CardDescription>Your recent AstralCore wallet activity</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-white/5">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black/20 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{transaction.description}</p>
                        <p className="text-xs text-gray-400 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">
                      <span className={cn(
                        "font-semibold",
                        transaction.amount > 0 ? "text-green-400" : "text-red-400"
                      )}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                      </span>
                      <span className="text-gray-400 ml-1">{transaction.currency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "flex items-center gap-1 w-fit",
                        transaction.status === 'completed' && "border-green-400/40 text-green-300 bg-green-400/10",
                        transaction.status === 'pending' && "border-yellow-400/40 text-yellow-300 bg-yellow-400/10",
                        transaction.status === 'failed' && "border-red-400/40 text-red-300 bg-red-400/10"
                      )}
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-white">
                        {format(new Date(transaction.timestamp), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(transaction.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {transaction.txHash && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(transaction.txHash!, 'Transaction hash')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
