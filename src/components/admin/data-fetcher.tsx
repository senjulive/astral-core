'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Search, Download, RefreshCw, Users, Wallet, MessageSquare, Settings } from 'lucide-react';

interface AggregatedData {
  users: {
    totalUsers: number;
    wallets: Record<string, any>;
    profiles: any[];
    analytics: {
      totalDeposits: number;
      totalWithdrawals: number;
      totalGridEarnings: number;
      totalPendingWithdrawals: number;
      netInflow: number;
      rankDistribution: Record<string, number>;
      leaderboard: any[];
    };
  };
  settings: any;
  communications: any;
  metadata: {
    fetchedAt: string;
    dataVersion: string;
  };
}

export function DataFetcher() {
  const [data, setData] = useState<AggregatedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/fetch-all-data');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch('/api/admin/fetch-all-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'export' }),
      });
      const result = await response.json();
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `astralcore-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredUsers = data?.users.profiles.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Fetching all data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Data Management</h2>
          <p className="text-muted-foreground">
            Comprehensive view of all system data
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchAllData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportData} variant="default">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.users.totalUsers}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.users.analytics.totalDeposits}</div>
                <p className="text-xs text-muted-foreground">
                  Net: ${data.users.analytics.netInflow}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Public Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.communications.publicChat.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bot Tiers</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.settings.botTierSettings.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(data.metadata.fetchedAt).toLocaleString()}
          </div>

          {/* Detailed Data Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="communications">Communications</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <div className="grid gap-4">
                {filteredUsers.map((user) => {
                  const walletData = data.users.wallets[user.userId];
                  const analyticsData = data.users.analytics.leaderboard.find(u => u.userId === user.userId);
                  
                  return (
                    <Card key={user.userId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{user.username || user.userId}</CardTitle>
                          <Badge variant={user.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                            {user.verificationStatus}
                          </Badge>
                        </div>
                        <CardDescription>{user.fullName} - {user.country}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Balance</p>
                            <p>${analyticsData?.balance?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div>
                            <p className="font-medium">Rank</p>
                            <p>{analyticsData?.rank || 'Recruit'}</p>
                          </div>
                          <div>
                            <p className="font-medium">USDT</p>
                            <p>{walletData?.balances?.usdt || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium">Clicks Left</p>
                            <p>{walletData?.growth?.clicksLeft || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Deposits:</span>
                      <span className="font-mono">${data.users.analytics.totalDeposits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Withdrawals:</span>
                      <span className="font-mono">${data.users.analytics.totalWithdrawals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grid Earnings:</span>
                      <span className="font-mono">${data.users.analytics.totalGridEarnings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Withdrawals:</span>
                      <span className="font-mono">${data.users.analytics.totalPendingWithdrawals}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Net Inflow:</span>
                      <span className="font-mono font-semibold">${data.users.analytics.netInflow}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rank Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(data.users.analytics.rankDistribution).map(([rank, count]) => (
                        <div key={rank} className="flex justify-between">
                          <span>{rank}:</span>
                          <span className="font-mono">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.users.analytics.leaderboard.slice(0, 10).map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span>{user.username}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-mono">${user.balance.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{user.rank}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Public Chat</CardTitle>
                    <CardDescription>{data.communications.publicChat.length} messages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {data.communications.publicChat.map((message: any) => (
                          <div key={message.id} className="p-2 border rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{message.displayName}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1">{message.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(data.communications.notifications).map(([userId, notifications]: [string, any]) => (
                        <div key={userId} className="flex justify-between">
                          <span>{userId}:</span>
                          <span className="font-mono">{notifications.length} notifications</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                    {JSON.stringify(data.settings.botSettings, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bot Tier Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                    {JSON.stringify(data.settings.botTierSettings, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data Dump</CardTitle>
                  <CardDescription>Complete data structure for debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <pre className="text-xs bg-muted p-4 rounded">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
