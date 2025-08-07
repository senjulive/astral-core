'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {Shield, Mail, Banknote} from 'lucide-react';
import {VerificationManager} from '@/components/admin/verification-manager';
import {DepositManager} from './deposit-manager';
import {SupportManager} from './support-manager';
import {useModerator} from '@/contexts/ModeratorContext';
import { cn } from '@/lib/utils';

const VerificationIcon = () => <span className="text-xl">🪪</span>;

export function ModeratorPanel() {
  const {permissions} = useModerator();

  const availableTabs = [
    {
      id: 'support',
      label: 'Support',
      icon: Mail,
      condition: permissions?.customer_support,
      component: <SupportManager />,
    },
    {
      id: 'verifications',
      label: 'Verifications',
      icon: VerificationIcon,
      condition: permissions?.user_verification,
      component: <VerificationManager />,
    },
    {
      id: 'deposits',
      label: 'Deposits',
      icon: Banknote,
      condition: permissions?.deposit_approval,
      component: <DepositManager />,
    },
  ].filter(tab => tab.condition);

  if (availableTabs.length === 0) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle>No Permissions</CardTitle>
          <CardDescription>
            You do not have any active moderation permissions. Please contact an
            administrator.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Moderator Panel</CardTitle>
            <CardDescription>Platform moderation tools.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={availableTabs[0].id} className="w-full">
          <TooltipProvider>
            <TabsList
              className={cn("grid w-full gap-2", {
                "grid-cols-1": availableTabs.length === 1,
                "grid-cols-2": availableTabs.length === 2,
                "grid-cols-3": availableTabs.length === 3,
              })}
            >
              {availableTabs.map(tab => (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <TabsTrigger value={tab.id}>
                      <tab.icon className="h-4 w-4 mr-2" />
                      <span>{tab.label}</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tab.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TabsList>
          </TooltipProvider>
          {availableTabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
