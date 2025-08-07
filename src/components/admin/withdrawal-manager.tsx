
"use client";

import * as React from "react";
import { Loader2, CheckCircle, RefreshCw, Copy, Wallet } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { type WalletData } from "@/lib/wallet";

type WithdrawalRequest = {
  id: string;
  userId: string;
  username: string;
  amount: number;
  asset: string;
  address: string;
  timestamp: string;
};

export function WithdrawalManager() {
  const { toast } = useToast();
  const [requests, setRequests] = React.useState<WithdrawalRequest[]>([]);
  const [isCompleting, setIsCompleting] = React.useState<string | null>(null);
  const [isFetching, setIsFetching] = React.useState(true);

  const refetchRequests = React.useCallback(async () => {
    setIsFetching(true);
    try {
        const response = await fetch('/api/admin/pending-withdrawals', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to fetch withdrawal requests');
        const data = await response.json();
        setRequests(data);
    } catch (error: any) {
        toast({ title: "Error", description: `Could not fetch requests: ${error.message}`, variant: "destructive" });
        setRequests([]);
    } finally {
        setIsFetching(false);
    }
  }, [toast]);

  React.useEffect(() => {
    refetchRequests();
  }, [refetchRequests]);
  
  const handleComplete = async (req: WithdrawalRequest) => {
    setIsCompleting(req.id);
    try {
        const response = await fetch('/api/admin/complete-withdrawal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: req.userId, withdrawalId: req.id }),
        });
        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || 'API request failed');
        
        await refetchRequests();
        toast({ title: "Withdrawal Completed", description: `Successfully processed withdrawal for ${req.username}.` });
    } catch (error: any) {
        toast({ title: "Completion Failed", description: error.message, variant: "destructive" });
    }
    setIsCompleting(null);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Address copied to clipboard!" });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Withdrawal Approval</CardTitle>
                <CardDescription>Review and approve pending user withdrawal requests.</CardDescription>
            </div>
            <Button onClick={refetchRequests} variant="outline" size="icon" disabled={isFetching}>
                <RefreshCw className={isFetching ? "animate-spin" : ""} />
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Withdrawal Address</TableHead>
                        <TableHead>Requested On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isFetching ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : requests.length > 0 ? (
                        requests.map((req) => (
                            <TableRow key={req.id}>
                                <TableCell>
                                    <div className="font-medium">{req.username}</div>
                                    <div className="text-xs text-muted-foreground">{req.userId}</div>
                                </TableCell>
                                <TableCell className="font-mono">${req.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs truncate max-w-[150px]">{req.address}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(req.address)}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>{format(new Date(req.timestamp), "PPp")}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => handleComplete(req)} disabled={isCompleting === req.id}>
                                        {isCompleting === req.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                        Mark as Complete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Wallet className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                No pending withdrawal requests.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
