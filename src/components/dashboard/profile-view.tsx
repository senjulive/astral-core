"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData, updateWallet } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, BadgeInfo, Phone, MapPin, Users, CheckCircle, Clock, ShieldCheck, AlertCircle, Home, Calendar, Lock, Image as ImageIcon, Loader2, Save, Link as LinkIcon, Edit, Plus, CreditCard, History, Star, Trophy, Brain } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from 'date-fns';
import type { SVGProps } from 'react';
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { countries } from "@/lib/countries";

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};

interface AvatarUploadDialogProps {
    onUploadSuccess: () => void;
    wallet: WalletData | null;
    children: React.ReactNode;
}

export function AvatarUploadDialog({ onUploadSuccess, wallet, children }: AvatarUploadDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string>('');
    const { toast } = useToast();

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please select an image under 5MB.",
                    variant: "destructive"
                });
                return;
            }

            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !wallet) return;

        setIsLoading(true);
        try {
            // Simulate upload delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const updatedWallet = {
                ...wallet,
                profile: {
                    ...wallet.profile,
                    avatarUrl: previewUrl
                }
            };

            await updateWallet(wallet.id, updatedWallet);
            
            toast({
                title: "Success",
                description: "Profile picture updated successfully."
            });
            
            onUploadSuccess();
            setIsOpen(false);
            setSelectedFile(null);
            setPreviewUrl('');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile picture.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-black/90 backdrop-blur-xl border-border/40">
                <DialogHeader>
                    <DialogTitle className="text-white">Update Profile Picture</DialogTitle>
                    <DialogDescription>
                        Upload a new avatar for your AstralCore profile
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-2 border-blue-400/40">
                                <AvatarImage src={previewUrl || wallet?.profile?.avatarUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-blue-400 text-2xl">
                                    {wallet?.profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <div className="w-full">
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="flex items-center justify-center w-full h-20 border-2 border-dashed border-border/40 rounded-lg hover:border-blue-400/40 transition-colors">
                                    <div className="text-center">
                                        <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                                        <p className="text-sm text-gray-400 mt-1">Click to select image</p>
                                    </div>
                                </div>
                            </Label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {isLoading ? 'Uploading...' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function ProfileView() {
    const [wallet, setWallet] = React.useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        username: '',
        country: '',
        phone: ''
    });

    const { user } = useUser();
    const { toast } = useToast();

    React.useEffect(() => {
        if (user?.id) {
            getOrCreateWallet(user.id).then((walletData) => {
                setWallet(walletData);
                setEditForm({
                    username: walletData.profile?.username || '',
                    country: walletData.profile?.country || '',
                    phone: walletData.profile?.phone || ''
                });
                setIsLoading(false);
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!wallet) return;

        try {
            const updatedWallet = {
                ...wallet,
                profile: {
                    ...wallet.profile,
                    username: editForm.username,
                    country: editForm.country,
                    phone: editForm.phone
                }
            };

            await updateWallet(wallet.id, updatedWallet);
            setWallet(updatedWallet);
            setIsEditing(false);
            
            toast({
                title: "Success",
                description: "Profile updated successfully."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive"
            });
        }
    };

    const fetchWalletData = React.useCallback(async () => {
        if (user?.id) {
            const walletData = await getOrCreateWallet(user.id);
            setWallet(walletData);
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="space-y-6">
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
    const RankIcon = rankIcons[rank.Icon] || Lock;
    const userCountry = countries.find(c => c.name === wallet?.profile?.country);

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            {/* Profile Header - Mobile Optimized */}
            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
                            <AvatarUploadDialog onUploadSuccess={fetchWalletData} wallet={wallet}>
                                <div className="relative group cursor-pointer">
                                    <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-blue-400/40 backdrop-blur-xl">
                                        <AvatarImage
                                            src={wallet?.profile?.avatarUrl}
                                            alt={wallet?.profile?.username || 'User'}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-blue-400 font-bold text-lg backdrop-blur-xl">
                                            {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Edit className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </AvatarUploadDialog>
                            
                            <div className="text-center sm:text-left flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                                        {wallet?.profile?.username || 'User'}
                                    </h1>
                                    {userCountry && (
                                        <span className="text-2xl">{userCountry.flag}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-400 mb-3">{user?.email}</p>
                                
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                                        <RankIcon className="h-3 w-3" />
                                        Hyperdrive {rank.name}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs border-green-400/40 text-green-300 bg-green-400/10">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex-1 sm:flex-none"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                asChild
                                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-purple-600"
                            >
                                <Link href="/dashboard/profile/verify">
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    KYC
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions - Mobile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/dashboard/cards">
                    <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 text-center">
                            <div className="relative mb-2">
                                <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                                    <CreditCard className="h-5 w-5 mx-auto text-blue-400" />
                                </div>
                            </div>
                            <p className="text-xs font-medium text-white">Wallet Cards</p>
                        </CardContent>
                    </Card>
                </Link>
                
                <Link href="/dashboard/rewards">
                    <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 text-center">
                            <div className="relative mb-2">
                                <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                                    <Trophy className="h-5 w-5 mx-auto text-purple-400" />
                                </div>
                            </div>
                            <p className="text-xs font-medium text-white">Rewards</p>
                        </CardContent>
                    </Card>
                </Link>
                
                <Link href="/dashboard/trading-info">
                    <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 text-center">
                            <div className="relative mb-2">
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 p-2 rounded-lg border border-cyan-400/30">
                                    <Brain className="h-5 w-5 mx-auto text-cyan-400" />
                                </div>
                            </div>
                            <p className="text-xs font-medium text-white">Hyperdrive</p>
                        </CardContent>
                    </Card>
                </Link>
                
                <Link href="/dashboard/security">
                    <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4 text-center">
                            <div className="relative mb-2">
                                <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                                    <ShieldCheck className="h-5 w-5 mx-auto text-green-400" />
                                </div>
                            </div>
                            <p className="text-xs font-medium text-white">Security</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Personal Information */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-400" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isEditing ? (
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="username" className="text-sm text-gray-400">Username</Label>
                                    <Input
                                        id="username"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                        className="bg-black/20 border-border/40"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country" className="text-sm text-gray-400">Country</Label>
                                    <Input
                                        id="country"
                                        value={editForm.country}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, country: e.target.value }))}
                                        className="bg-black/20 border-border/40"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-sm text-gray-400">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="bg-black/20 border-border/40"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSaveProfile} className="bg-gradient-to-r from-green-500 to-green-600">
                                        <Save className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <User className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Username</p>
                                        <p className="text-sm text-white">{wallet?.profile?.username || 'Not set'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <MapPin className="h-4 w-4 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Country</p>
                                        <p className="text-sm text-white flex items-center gap-2">
                                            {wallet?.profile?.country || 'Not set'}
                                            {userCountry && <span>{userCountry.flag}</span>}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <Phone className="h-4 w-4 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Phone</p>
                                        <p className="text-sm text-white">{wallet?.profile?.phone || 'Not set'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Account Status */}
                <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-green-400" />
                            Account Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email Verification</p>
                                    <p className="text-sm text-green-400 font-medium">Verified</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">KYC Verification</p>
                                    <p className="text-sm text-yellow-400 font-medium">Pending</p>
                                </div>
                            </div>
                            <Button size="sm" asChild variant="outline">
                                <Link href="/dashboard/profile/verify">
                                    Complete
                                </Link>
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Calendar className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Member Since</p>
                                <p className="text-sm text-white">
                                    {wallet?.createdAt ? format(new Date(wallet.createdAt), 'MMM yyyy') : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hyperdrive Status */}
            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-400" />
                        AstralCore Hyperdrive Status
                    </CardTitle>
                    <CardDescription>Your quantum trading performance level</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-xl border border-purple-400/30">
                                <RankIcon className="h-8 w-8 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Current Hyperdrive Level</p>
                                <p className="text-xl font-bold text-purple-400">{rank.name}</p>
                                <p className="text-xs text-gray-500">Balance: ${totalBalance.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Progress to Next Level</span>
                                <span className="text-gray-400">75%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                        </div>
                        
                        <Button size="sm" asChild className="bg-gradient-to-r from-purple-500 to-blue-600">
                            <Link href="/dashboard/trading-info">
                                View Details
                                <Brain className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
