
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LayoutDashboard, BarChart } from 'lucide-react';
import { AnalyticsOverview } from './AnalyticsOverview';
import { UserLeaderboard } from './UserLeaderboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type AnalyticsData = {
  totals: {
    totalUsers: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalGridEarnings: number;
    totalPendingWithdrawals: number;
    netInflow: number;
  };
  leaderboard: any[];
  rankChartData: any[];
};

export function AnalyticsManager() {
  const { toast } = useToast();
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/admin/analytics', { method: 'POST' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch analytics data.');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: 'Error Fetching Analytics',
          description: err.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load data</AlertTitle>
        <AlertDescription>{error || 'An unknown error occurred.'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="overview">
        <TabsList>
            <TabsTrigger value="overview"><LayoutDashboard className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
            <TabsTrigger value="leaderboard"><BarChart className="mr-2 h-4 w-4"/>Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
            <AnalyticsOverview data={data} />
        </TabsContent>
        <TabsContent value="leaderboard" className="mt-4">
            <UserLeaderboard data={data} />
        </TabsContent>
    </Tabs>
  );
}
