'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Copy, Share2, Users, Gift, Trophy, ExternalLink, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const socialPlatforms = [
  {
    name: "WhatsApp",
    icon: "🟢",
    color: "bg-green-600",
    getUrl: (link: string, message: string) => 
      `https://wa.me/?text=${encodeURIComponent(message + " " + link)}`
  },
  {
    name: "Telegram",
    icon: "🔵", 
    color: "bg-blue-600",
    getUrl: (link: string, message: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`
  },
  {
    name: "Facebook",
    icon: "🔵",
    color: "bg-blue-800", 
    getUrl: (link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`
  },
  {
    name: "Twitter",
    icon: "⚫",
    color: "bg-black",
    getUrl: (link: string, message: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`
  }
];

const inviteRewards = [
  { milestone: 1, reward: "$5 USDT", description: "First successful referral" },
  { milestone: 5, reward: "$30 USDT", description: "5 active squad members" },
  { milestone: 10, reward: "$75 USDT", description: "10 active squad members" },
  { milestone: 25, reward: "$200 USDT", description: "25 active squad members" },
  { milestone: 50, reward: "$500 USDT", description: "50 active squad members" },
  { milestone: 100, reward: "$1,200 USDT", description: "100 active squad members" },
];

export function InviteView() {
  const { user, wallet } = useUser();
  const { toast } = useToast();
  const [squadCode, setSquadCode] = React.useState("");
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLink = `${baseUrl}/register?ref=${squadCode}`;
  const inviteMessage = "Join me on AstralCore and start earning with AI-powered crypto trading! Use my squad code to get started with a bonus.";

  React.useEffect(() => {
    if (wallet?.squad?.squadCode) {
      setSquadCode(wallet.squad.squadCode);
    } else if (user?.id) {
      // Generate a squad code based on user ID
      const code = `SQUAD${user.id.slice(-6).toUpperCase()}`;
      setSquadCode(code);
    }
  }, [wallet, user]);

  const squadMembers = wallet?.squad?.members || [];
  const totalEarnings = squadMembers.length * 5; // $5 per referral
  const completedMilestones = inviteRewards.filter(reward => squadMembers.length >= reward.milestone);
  const nextMilestone = inviteRewards.find(reward => squadMembers.length < reward.milestone);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const shareOnPlatform = (platform: typeof socialPlatforms[0]) => {
    const url = platform.getUrl(referralLink, inviteMessage);
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite Friends & Earn Rewards
          </CardTitle>
          <CardDescription>
            Build your squad and earn bonuses for every successful referral
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="invite" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invite">Share Invite</TabsTrigger>
          <TabsTrigger value="squad">My Squad</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="space-y-6">
          {/* Current Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Squad Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{squadMembers.length}</div>
                <p className="text-sm text-muted-foreground">Active referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">${totalEarnings}</div>
                <p className="text-sm text-muted-foreground">From referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Milestone</CardTitle>
              </CardHeader>
              <CardContent>
                {nextMilestone ? (
                  <>
                    <div className="text-3xl font-bold text-orange-600">
                      {nextMilestone.milestone - squadMembers.length}
                    </div>
                    <p className="text-sm text-muted-foreground">more referrals</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-gold-600">🏆</div>
                    <p className="text-sm text-muted-foreground">All unlocked!</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Referral Tools */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Squad Code</CardTitle>
                <CardDescription>
                  Share this code for people to join your squad during registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={squadCode} readOnly className="font-mono text-lg" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(squadCode, "Squad code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        Show QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Squad Code QR</DialogTitle>
                        <DialogDescription>
                          Scan this QR code to copy your squad code
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center p-6">
                        <div className="bg-white p-4 rounded-lg">
                          <QRCodeSVG value={squadCode} size={200} />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Link</CardTitle>
                <CardDescription>
                  Direct link that automatically applies your squad code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly className="text-sm" />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => copyToClipboard(referralLink, "Referral link")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <QrCode className="h-4 w-4 mr-2" />
                        Show QR Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Referral Link QR</DialogTitle>
                        <DialogDescription>
                          Scan this QR code to visit your referral link
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center p-6">
                        <div className="bg-white p-4 rounded-lg">
                          <QRCodeSVG value={referralLink} size={200} />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Share on Social Media</CardTitle>
              <CardDescription>
                Spread the word on your favorite social platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    onClick={() => shareOnPlatform(platform)}
                    className="flex items-center gap-2 justify-start"
                  >
                    <span className="text-lg">{platform.icon}</span>
                    <span>Share on {platform.name}</span>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="squad" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Squad Members ({squadMembers.length})</CardTitle>
              <CardDescription>
                People who joined using your referral code
              </CardDescription>
            </CardHeader>
            <CardContent>
              {squadMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No squad members yet</p>
                  <p className="text-sm">Share your invite code to start building your squad!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {squadMembers.map((member: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {member.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.username || `User ${index + 1}`}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(member.joinedAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="default">
                          <Gift className="h-3 w-3 mr-1" />
                          $5 USDT
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Milestones</CardTitle>
              <CardDescription>
                Unlock bigger rewards as your squad grows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inviteRewards.map((reward) => {
                  const isCompleted = squadMembers.length >= reward.milestone;
                  const isCurrent = nextMilestone?.milestone === reward.milestone;
                  
                  return (
                    <div
                      key={reward.milestone}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        isCompleted 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                          : isCurrent
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-600 text-white' 
                            : isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <span className="font-bold">{reward.milestone}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{reward.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {reward.milestone} squad member{reward.milestone !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{reward.reward}</div>
                        {isCompleted && (
                          <Badge variant="default" className="mt-1">
                            Completed
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="secondary" className="mt-1">
                            {reward.milestone - squadMembers.length} more needed
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Referrals Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Share Your Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Send your squad code or referral link to friends and family
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">They Register</h4>
                    <p className="text-sm text-muted-foreground">
                      When they sign up using your code, they join your squad
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Earn Rewards</h4>
                    <p className="text-sm text-muted-foreground">
                      Get $5 USDT for each successful referral plus milestone bonuses
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
