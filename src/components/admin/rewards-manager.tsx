'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Users, 
  Trophy, 
  Star,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'achievement' | 'referral' | 'trading';
  amount: number;
  currency: 'USDT' | 'points' | 'credits';
  isActive: boolean;
  requirements?: string;
  maxClaims?: number;
  currentClaims: number;
  validFrom: string;
  validTo: string;
  targetUsers?: 'all' | 'vip' | 'new' | 'active';
  minRank?: string;
  createdAt: string;
}

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Daily Login Bonus',
    description: 'Claim your daily reward for logging into AstralCore',
    type: 'daily',
    amount: 10,
    currency: 'USDT',
    isActive: true,
    requirements: 'Login daily',
    currentClaims: 1250,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    targetUsers: 'all',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Trading Champion',
    description: 'Complete 100 successful trades to earn this achievement reward',
    type: 'achievement',
    amount: 500,
    currency: 'USDT',
    isActive: true,
    requirements: '100 successful trades',
    maxClaims: 1,
    currentClaims: 45,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    targetUsers: 'active',
    minRank: 'Silver',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    title: 'Hyperdrive Weekly Bonus',
    description: 'Weekly bonus for AstralCore Hyperdrive tier users',
    type: 'weekly',
    amount: 100,
    currency: 'USDT',
    isActive: true,
    requirements: 'Hyperdrive tier membership',
    currentClaims: 320,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    targetUsers: 'vip',
    minRank: 'Gold',
    createdAt: '2024-01-01'
  }
];

export function RewardsManager() {
  const [rewards, setRewards] = React.useState<Reward[]>(mockRewards);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingReward, setEditingReward] = React.useState<Reward | null>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    type: 'daily' as Reward['type'],
    amount: 0,
    currency: 'USDT' as Reward['currency'],
    isActive: true,
    requirements: '',
    maxClaims: undefined as number | undefined,
    validFrom: '',
    validTo: '',
    targetUsers: 'all' as Reward['targetUsers'],
    minRank: ''
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      amount: 0,
      currency: 'USDT',
      isActive: true,
      requirements: '',
      maxClaims: undefined,
      validFrom: '',
      validTo: '',
      targetUsers: 'all',
      minRank: ''
    });
    setEditingReward(null);
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      type: reward.type,
      amount: reward.amount,
      currency: reward.currency,
      isActive: reward.isActive,
      requirements: reward.requirements || '',
      maxClaims: reward.maxClaims,
      validFrom: reward.validFrom,
      validTo: reward.validTo,
      targetUsers: reward.targetUsers || 'all',
      minRank: reward.minRank || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newReward: Reward = {
      id: editingReward?.id || Date.now().toString(),
      ...formData,
      currentClaims: editingReward?.currentClaims || 0,
      createdAt: editingReward?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingReward) {
      setRewards(prev => prev.map(r => r.id === editingReward.id ? newReward : r));
      toast({
        title: "Success",
        description: "Reward updated successfully."
      });
    } else {
      setRewards(prev => [...prev, newReward]);
      toast({
        title: "Success",
        description: "New reward created successfully."
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Success",
      description: "Reward deleted successfully."
    });
  };

  const toggleRewardStatus = (id: string) => {
    setRewards(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const getTypeIcon = (type: Reward['type']) => {
    switch (type) {
      case 'daily': return <Calendar className="h-4 w-4" />;
      case 'weekly': return <Calendar className="h-4 w-4" />;
      case 'monthly': return <Calendar className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'referral': return <Users className="h-4 w-4" />;
      case 'trading': return <Brain className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Reward['type']) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'weekly': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'monthly': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'achievement': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'referral': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'trading': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const stats = {
    totalRewards: rewards.length,
    activeRewards: rewards.filter(r => r.isActive).length,
    totalClaims: rewards.reduce((sum, r) => sum + r.currentClaims, 0),
    totalValue: rewards.filter(r => r.currency === 'USDT').reduce((sum, r) => sum + (r.amount * r.currentClaims), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-lg border border-yellow-500/20">
            <Gift className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Rewards Management</h2>
            <p className="text-sm text-gray-400">Manage AstralCore Hyperdrive reward system</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reward
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-xl border-border/40">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingReward ? 'Edit Reward' : 'Create New Reward'}
              </DialogTitle>
              <DialogDescription>
                Configure reward settings for AstralCore Hyperdrive users
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Reward Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter reward title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Reward Type</Label>
                <Select value={formData.type} onValueChange={(value: Reward['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter reward description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Reward Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value: Reward['currency']) => setFormData(prev => ({ ...prev, currency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                    <SelectItem value="credits">Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Input
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Enter requirements"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxClaims">Max Claims (Optional)</Label>
                <Input
                  id="maxClaims"
                  type="number"
                  value={formData.maxClaims || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxClaims: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="Unlimited"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validTo">Valid To</Label>
                <Input
                  id="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetUsers">Target Users</Label>
                <Select value={formData.targetUsers} onValueChange={(value: Reward['targetUsers']) => setFormData(prev => ({ ...prev, targetUsers: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="vip">VIP Users</SelectItem>
                    <SelectItem value="new">New Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minRank">Minimum Hyperdrive Rank</Label>
                <Select value={formData.minRank} onValueChange={(value) => setFormData(prev => ({ ...prev, minRank: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="No requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No requirement</SelectItem>
                    <SelectItem value="Recruit">Recruit</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Diamond">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active Reward</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-yellow-500 to-orange-600">
                <Save className="h-4 w-4 mr-2" />
                {editingReward ? 'Update' : 'Create'} Reward
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Rewards</p>
                <p className="text-2xl font-bold text-white">{stats.totalRewards}</p>
              </div>
              <Gift className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Rewards</p>
                <p className="text-2xl font-bold text-green-400">{stats.activeRewards}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Claims</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalClaims.toLocaleString()}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-purple-400">${stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Table */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardHeader>
          <CardTitle className="text-white">AstralCore Hyperdrive Rewards</CardTitle>
          <CardDescription>Manage all rewards for the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reward</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Claims</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{reward.title}</p>
                      <p className="text-sm text-gray-400">{reward.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("flex items-center gap-1 w-fit", getTypeColor(reward.type))}>
                      {getTypeIcon(reward.type)}
                      {reward.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-white">{reward.amount}</span>
                      <span className="text-sm text-gray-400">{reward.currency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{reward.currentClaims.toLocaleString()}</p>
                      {reward.maxClaims && (
                        <p className="text-xs text-gray-400">/ {reward.maxClaims.toLocaleString()}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={reward.isActive ? "default" : "secondary"}>
                      {reward.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-white">{reward.targetUsers}</p>
                      {reward.minRank && (
                        <p className="text-xs text-gray-400">Min: {reward.minRank}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleRewardStatus(reward.id)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(reward)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(reward.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
