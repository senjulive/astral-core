
"use client";

import * as React from "react";
import Image from "next/image";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CryptoData = {
  id: string;
  name: string;
  ticker: string;
  iconUrl?: string;
  price: number;
  change24h: number;
  priceHistory: { value: number }[];
};

type LiveTradingChartProps = {
  coin: CryptoData | null;
};

export function LiveTradingChart({ coin }: LiveTradingChartProps) {
  if (!coin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Chart</CardTitle>
          <CardDescription>Select a cryptocurrency from the table below to view its live chart.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">No coin selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number, decimals = 2) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;

  const chartData = coin.priceHistory.map((p, i) => ({ ...p, name: i }));
  const chartColor = coin.change24h >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {coin.iconUrl && (
            <Image
              src={coin.iconUrl}
              alt={`${coin.name} logo`}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <CardTitle className="flex items-center gap-2">
              {coin.name}
              <span className="text-base font-normal text-muted-foreground">{coin.ticker}</span>
            </CardTitle>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl font-bold">
                    {formatCurrency(coin.price, coin.price < 1 ? 4 : 2)}
                </p>
                <p className={cn(
                    "font-semibold",
                    coin.change24h >= 0 ? "text-green-600" : "text-red-600"
                )}>
                    {coin.change24h >= 0 ? "+" : ""}
                    {coin.change24h.toFixed(2)}%
                </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id={`color-${coin.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="name" hide />
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ fontWeight: "bold" }}
                formatter={(value: number) => [formatCurrency(value, 4), "Price"]}
                labelFormatter={() => ''}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${coin.id})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
