
"use client";

import * as React from "react";
import { Loader2, CheckCircle, RefreshCw, Banknote } from "lucide-react";
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

type DepositRequest = {
  id: string;
  userId: string;
  username: string;
  amount: number;
  asset: string;
  timestamp: string;
};

const assetIcons: { [key: string]: string } = {
  usdt: "https://assets.coincap.io/assets/icons/usdt@2x.png",
  eth: "https://assets.coincap.io/assets/icons/eth@2x.png",
  btc: "https://assets.coincap.io/assets/icons/btc@2x.png",
};

export function DepositApprovalManager() {
  const { toast } = useToast();
  const [requests, setRequests] = React.useState<DepositRequest[]>([]);
  const [isApproving, setIsApproving] = React.useState<string | null>(null);
  const [isFetching, setIsFetching] = React.useState(true);

  const refetchRequests = React.useCallback(async () => {
    setIsFetching(true);
    try {
        const response = await fetch('/api/admin/pending-deposits', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to fetch deposit requests');
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
  
  const handleApprove = async (req: DepositRequest) => {
    setIsApproving(req.id);
    try {
        const response = await fetch('/api/admin/approve-deposit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: req.userId, depositId: req.id, amount: req.amount, asset: req.asset }),
        });
        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || 'API request failed');
        
        await refetchRequests();
        toast({ title: "Deposit Approved", description: `Successfully credited ${req.amount} ${req.asset.toUpperCase()} to ${req.username}.` });
    } catch (error: any) {
        toast({ title: "Approval Failed", description: error.message, variant: "destructive" });
    }
    setIsApproving(null);
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Deposit Approval</CardTitle>
                <CardDescription>Review and approve pending user deposit requests.</CardDescription>
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
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Requested On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isFetching ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-6 w-24 ml-auto" /></TableCell>
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
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Image src={assetIcons[req.asset.toLowerCase()]} alt={req.asset} width={20} height={20} className="rounded-full" />
                                        <span className="font-medium">{req.asset.toUpperCase()}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">{req.amount.toFixed(2)}</TableCell>
                                <TableCell>{format(new Date(req.timestamp), "PPp")}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => handleApprove(req)} disabled={isApproving === req.id}>
                                        {isApproving === req.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <Banknote className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                No pending deposit requests.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
