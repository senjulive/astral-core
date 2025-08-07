'use client';

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

type MarketData = {
  id: string;
  name: string;
  symbol: string;
  iconUrl: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  totalSupply: number;
  rank: number;
};

const initialMarketData: MarketData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
    currentPrice: 67842.50,
    priceChange24h: 1687.25,
    priceChangePercentage24h: 2.55,
    marketCap: 1340000000000,
    volume24h: 35000000000,
    circulatingSupply: 19745000,
    totalSupply: 21000000,
    rank: 1
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
    currentPrice: 3487.90,
    priceChange24h: -42.10,
    priceChangePercentage24h: -1.19,
    marketCap: 420000000000,
    volume24h: 18000000000,
    circulatingSupply: 120400000,
    totalSupply: 120400000,
    rank: 2
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
    currentPrice: 1.0005,
    priceChange24h: 0.0003,
    priceChangePercentage24h: 0.03,
    marketCap: 119000000000,
    volume24h: 85000000000,
    circulatingSupply: 119000000000,
    totalSupply: 119000000000,
    rank: 3
  },
  {
    id: "binancecoin",
    name: "BNB",
    symbol: "BNB",
    iconUrl: "https://assets.coincap.io/assets/icons/bnb@2x.png",
    currentPrice: 621.45,
    priceChange24h: 15.87,
    priceChangePercentage24h: 2.62,
    marketCap: 90000000000,
    volume24h: 2800000000,
    circulatingSupply: 145000000,
    totalSupply: 145000000,
    rank: 4
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    iconUrl: "https://assets.coincap.io/assets/icons/sol@2x.png",
    currentPrice: 154.32,
    priceChange24h: 8.94,
    priceChangePercentage24h: 6.15,
    marketCap: 73000000000,
    volume24h: 5200000000,
    circulatingSupply: 473000000,
    totalSupply: 588000000,
    rank: 5
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    iconUrl: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    currentPrice: 0.518,
    priceChange24h: -0.012,
    priceChangePercentage24h: -2.26,
    marketCap: 29000000000,
    volume24h: 1600000000,
    circulatingSupply: 56000000000,
    totalSupply: 100000000000,
    rank: 6
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    iconUrl: "https://assets.coincap.io/assets/icons/doge@2x.png",
    currentPrice: 0.087,
    priceChange24h: 0.003,
    priceChangePercentage24h: 3.57,
    marketCap: 12800000000,
    volume24h: 980000000,
    circulatingSupply: 147000000000,
    totalSupply: 147000000000,
    rank: 7
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    iconUrl: "https://assets.coincap.io/assets/icons/ada@2x.png",
    currentPrice: 0.365,
    priceChange24h: -0.008,
    priceChangePercentage24h: -2.14,
    marketCap: 12700000000,
    volume24h: 420000000,
    circulatingSupply: 35000000000,
    totalSupply: 45000000000,
    rank: 8
  }
];

const formatCurrency = (amount: number) => {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
  return `$${amount.toFixed(2)}`;
};

const formatSupply = (amount: number) => {
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
  return amount.toLocaleString();
};

export function MarketView() {
  const [marketData, setMarketData] = React.useState<MarketData[]>(initialMarketData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"rank" | "price" | "change" | "volume">("rank");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData =>
        prevData.map(coin => {
          const changeFactor = (Math.random() - 0.5) * 0.02; // ±1% change
          const newPrice = coin.currentPrice * (1 + changeFactor);
          const priceChange = newPrice - coin.currentPrice;
          const priceChangePercentage = (priceChange / coin.currentPrice) * 100;
          
          return {
            ...coin,
            currentPrice: newPrice,
            priceChange24h: priceChange,
            priceChangePercentage24h: priceChangePercentage,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredData = React.useMemo(() => {
    let filtered = marketData.filter(coin =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case "price":
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "change":
        filtered.sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h);
        break;
      case "volume":
        filtered.sort((a, b) => b.volume24h - a.volume24h);
        break;
      default:
        filtered.sort((a, b) => a.rank - b.rank);
    }

    return filtered;
  }, [marketData, searchQuery, sortBy]);

  const totalMarketCap = React.useMemo(() => 
    marketData.reduce((sum, coin) => sum + coin.marketCap, 0), [marketData]
  );

  const totalVolume = React.useMemo(() => 
    marketData.reduce((sum, coin) => sum + coin.volume24h, 0), [marketData]
  );

  const gainers = React.useMemo(() => 
    [...marketData].sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h).slice(0, 3),
    [marketData]
  );

  const losers = React.useMemo(() => 
    [...marketData].sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h).slice(0, 3),
    [marketData]
  );

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMarketCap)}</div>
            <p className="text-xs text-muted-foreground">
              Global cryptocurrency market capitalization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Trading Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
            <p className="text-xs text-muted-foreground">
              Total trading volume across all markets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54.8%</div>
            <p className="text-xs text-muted-foreground">
              Bitcoin's share of total market cap
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Gainers & Losers */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Gainers (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gainers.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={coin.iconUrl} alt={coin.symbol} width={24} height={24} className="rounded-full" />
                    <div>
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-sm text-muted-foreground">{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${coin.currentPrice.toFixed(2)}</p>
                    <p className="text-sm text-green-600">
                      +{coin.priceChangePercentage24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Top Losers (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {losers.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={coin.iconUrl} alt={coin.symbol} width={24} height={24} className="rounded-full" />
                    <div>
                      <p className="font-medium">{coin.symbol}</p>
                      <p className="text-sm text-muted-foreground">{coin.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${coin.currentPrice.toFixed(2)}</p>
                    <p className="text-sm text-red-600">
                      {coin.priceChangePercentage24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Data Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Cryptocurrency Prices</CardTitle>
              <CardDescription>Real-time cryptocurrency market data</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === "rank" ? "change" : "rank")}
              >
                Sort by {sortBy === "rank" ? "Change" : "Rank"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">24h Change</div>
              <div className="col-span-2 text-right">Market Cap</div>
              <div className="col-span-2 text-right">Volume (24h)</div>
            </div>

            {/* Data Rows */}
            <div className="space-y-2">
              {filteredData.map((coin) => (
                <div key={coin.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b border-border/50 hover:bg-muted/50 rounded-lg px-2">
                  <div className="col-span-1">
                    <span className="text-sm font-medium">{coin.rank}</span>
                  </div>
                  
                  <div className="col-span-3 flex items-center gap-3">
                    <Image 
                      src={coin.iconUrl} 
                      alt={coin.symbol} 
                      width={32} 
                      height={32} 
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <p className="font-medium">
                      ${coin.currentPrice < 1 
                        ? coin.currentPrice.toFixed(6) 
                        : coin.currentPrice.toFixed(2)
                      }
                    </p>
                  </div>

                  <div className="col-span-2 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium",
                      coin.priceChangePercentage24h >= 0 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    )}>
                      {coin.priceChangePercentage24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {coin.priceChangePercentage24h.toFixed(2)}%
                    </div>
                  </div>

                  <div className="col-span-2 text-right">
                    <p className="font-medium">{formatCurrency(coin.marketCap)}</p>
                  </div>

                  <div className="col-span-2 text-right">
                    <p className="font-medium">{formatCurrency(coin.volume24h)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
