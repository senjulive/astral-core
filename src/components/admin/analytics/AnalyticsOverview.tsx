
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowDown, ArrowUp, DollarSign, Clock, GitCompareArrows } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from 'recharts';
import type { AnalyticsData } from './AnalyticsManager';

const StatCard = ({ title, value, icon: Icon, change }: { title: string; value: string; icon: React.ElementType; change?: number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <p className="text-xs text-muted-foreground">{change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`} from last month</p>
      )}
    </CardContent>
  </Card>
);

export function AnalyticsOverview({ data }: { data: AnalyticsData }) {
    const { totals, rankChartData } = data;

    const financialChartData = [
        { name: 'Deposits', value: totals.totalDeposits, fill: 'var(--chart-2)' },
        { name: 'Withdrawals', value: totals.totalWithdrawals, fill: 'var(--chart-5)' },
        { name: 'Grid Earnings', value: totals.totalGridEarnings, fill: 'var(--chart-1)' },
    ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Users" value={totals.totalUsers.toLocaleString()} icon={Users} />
        <StatCard title="Net Inflow" value={`$${totals.netInflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={GitCompareArrows} />
        <StatCard title="Pending Withdrawals" value={`$${totals.totalPendingWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={Clock} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={financialChartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>User Rank Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={rankChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {rankChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
