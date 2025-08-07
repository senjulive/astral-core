
"use client";

import * as React from "react";
import { Users, UserCheck, Lock } from "lucide-react";
import type { SVGProps } from 'react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';

// Import tier icons
import { tierIcons, tierClassNames } from '@/lib/settings';


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

type SquadMember = {
    id: string;
    username: string;
    rank: { name: string; Icon: string; className: string }; // Icon is a string name
    tier: { name: string; Icon: string; className: string }; // Icon is a string name
    team: SquadMember[];
};


const flattenSquad = (members: SquadMember[]): Omit<SquadMember, 'team'>[] => {
    let flatList: Omit<SquadMember, 'team'>[] = [];
    members.forEach(member => {
        const { team, ...memberWithoutTeam } = member;
        flatList.push(memberWithoutTeam);
        if (team && team.length > 0) {
            flatList = flatList.concat(flattenSquad(team));
        }
    });
    return flatList;
};

export function SquadSystem() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const { user } = useUser();
  const [squadList, setSquadList] = React.useState<Omit<SquadMember, 'team'>[]>([]);
  const [isSquadLoading, setIsSquadLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.id) {
      async function fetchWallet() {
        const data = await getOrCreateWallet();
        setWalletData(data);
      }
      fetchWallet();
    }
  }, [user]);

  React.useEffect(() => {
      if (user) {
          const fetchSquad = async () => {
              setIsSquadLoading(true);
              try {
                  const response = await fetch('/api/squad');
                  if (!response.ok) {
                      const err = await response.json();
                      throw new Error(err.error || 'Failed to fetch squad data');
                  }
                  const data = await response.json();
                  if (data.error) throw new Error(data.error);
                  setSquadList(flattenSquad(data));
              } catch (error: any) {
                  console.error(error);
                  toast({ title: "Could not load squad", description: error.message, variant: "destructive" });
              } finally {
                  setIsSquadLoading(false);
              }
          };
          fetchSquad();
      }
  }, [user, toast]);
  
  const squadLeader = walletData?.squad?.squad_leader;
  const totalMembers = squadList.length;
  const totalEarnings = totalMembers * 5;

  if (!walletData) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
       {squadLeader && (
        <Alert>
            <UserCheck className="h-4 w-4" />
            <AlertTitle>You're in a Squad!</AlertTitle>
            <AlertDescription>
                Your squad leader is <span className="font-semibold text-foreground">{squadLeader.username}</span>. Keep growing your assets together.
            </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-6">
        <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Squad Earnings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From {totalMembers} squad member{totalMembers !== 1 ? 's' : ''}
              </p>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Squad Members</CardTitle>
               <CardDescription>
                Your squad hierarchy and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSquadLoading ? (
                  <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </div>
              ) : squadList.length > 0 ? (
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Username</TableHead>
                              <TableHead>Rank</TableHead>
                              <TableHead>Tier</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {squadList.map(member => {
                              const RankIcon = rankIcons[member.rank.Icon] || RecruitRankIcon;
                              const TierIcon = tierIcons[member.tier.Icon] || tierIcons['tier-1'];
                              const tierClassName = tierClassNames[member.tier.Icon] || tierClassNames['tier-1'];
                              return (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.username}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5 w-fit", member.rank.className)}>
                                            <RankIcon className="h-5 w-5" />
                                            <span>{member.rank.name}</span>
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5 w-fit", tierClassName)}>
                                            <TierIcon className="h-5 w-5" />
                                            <span>{member.tier.name}</span>
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                              )
                          })}
                      </TableBody>
                  </Table>
              ) : (
                  <div className="h-24 text-center flex flex-col items-center justify-center text-muted-foreground border-dashed border rounded-md p-4">
                    <p className="font-medium">Your squad is empty.</p>
                    <p className="text-sm">Start inviting new members to earn rewards!</p>
                  </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
