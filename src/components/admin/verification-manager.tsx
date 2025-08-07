
"use client";

import * as React from "react";
import { Loader2, ShieldCheck, User, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
import type { WalletData, ProfileData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

type VerificationData = WalletData & {
    profile: ProfileData
};

export function VerificationManager() {
  const { toast } = useToast();
  const [verifications, setVerifications] = React.useState<VerificationData[]>([]);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);
  const [isFetching, setIsFetching] = React.useState(true);

  const refetchVerifications = React.useCallback(async () => {
    setIsFetching(true);
    try {
        const response = await fetch('/api/admin/verifications', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to fetch verification data');
        const data = await response.json();
        setVerifications(data);
    } catch (error: any) {
        toast({ title: "Error", description: `Could not fetch verifications: ${error.message}`, variant: "destructive" });
        setVerifications([]);
    } finally {
        setIsFetching(false);
    }
  }, [toast]);

  React.useEffect(() => {
    refetchVerifications();
  }, [refetchVerifications]);
  
  const handleManualVerify = async (userId: string, username: string) => {
    setIsUpdating(userId);
    try {
        const response = await fetch('/api/admin/verify-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || 'API request failed');
        
        await refetchVerifications();
        toast({ title: "User Manually Verified", description: `Successfully verified ${username}.` });
    } catch (error: any) {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    }
    setIsUpdating(null);
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Verification Management</CardTitle>
                <CardDescription>Review and manually approve user identity verifications.</CardDescription>
            </div>
            <Button onClick={refetchVerifications} variant="outline" size="icon" disabled={isFetching}>
                <RefreshCw className={isFetching ? "animate-spin" : ""} />
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isFetching ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : verifications.length > 0 ? (
                        verifications.map((v) => (
                            <TableRow key={v.user_id}>
                                <TableCell>
                                    <div className="font-medium">{v.profile.full_name || v.profile.username}</div>
                                    <div className="text-sm text-muted-foreground">{v.user_id}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={v.verification_status === 'verifying' ? 'secondary' : 'outline'}>
                                        {v.verification_status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {v.profile.created_at ? formatDistanceToNow(new Date(v.profile.created_at), { addSuffix: true }) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" disabled={!v.profile.id_card_front_url}>View Docs</Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl">
                                            <DialogHeader>
                                                <DialogTitle>Documents for {v.profile.full_name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <h3 className="font-semibold mb-2">ID Card Front</h3>
                                                    {v.profile.id_card_front_url ? <Image src={v.profile.id_card_front_url} alt="ID Front" width={500} height={300} className="rounded-md border" /> : <p>Not provided.</p>}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-2">ID Card Back</h3>
                                                    {v.profile.id_card_back_url ? <Image src={v.profile.id_card_back_url} alt="ID Back" width={500} height={300} className="rounded-md border" /> : <p>Not provided.</p>}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    <Button size="sm" onClick={() => handleManualVerify(v.user_id, v.profile.username)} disabled={isUpdating === v.user_id}>
                                        {isUpdating === v.user_id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                        Approve
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No pending verifications.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
