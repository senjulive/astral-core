
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "../ui/separator";

const settingsSchema = z.object({
  minClanCreateBalance: z.coerce.number().min(0, "Balance must be positive."),
  rankAchievementBonus: z.coerce.number().min(0, "Bonus must be positive."),
  tierAchievementBonus: z.coerce.number().min(0, "Bonus must be positive."),
  referralBonusTier1: z.coerce.number().min(0, "Bonus must be positive."),
  referralBonusTier2: z.coerce.number().min(0, "Bonus must be positive."),
  newUserBonus: z.coerce.number().min(0, "Bonus must be positive."),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;
const REWARD_SETTINGS_KEY = 'rewardSettings';

export function SquadRewardSettingsManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      minClanCreateBalance: 100,
      rankAchievementBonus: 10,
      tierAchievementBonus: 5,
      referralBonusTier1: 5,
      referralBonusTier2: 1,
      newUserBonus: 5,
    },
  });

  React.useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/public-settings?key=${REWARD_SETTINGS_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch reward settings');
        const data = await response.json();
        if (data) {
            form.reset(data);
        }
      } catch (error: any) {
        console.error("Could not fetch reward settings:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: REWARD_SETTINGS_KEY, value: values })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save settings.');
        toast({
            title: "Settings Saved",
            description: "Squad and reward settings have been updated.",
        });
    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
        setIsSaving(false);
    }
  };


  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-full" /></CardHeader>
        <CardContent className="space-y-4"><Skeleton className="h-64 w-full" /><div className="flex justify-end"><Skeleton className="h-10 w-32" /></div></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Squad, Clan & Reward Settings</CardTitle>
        <CardDescription>Configure parameters for squad clans and user reward bonuses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-medium">Squad Clan Settings</h3>
            <FormField
              control={form.control}
              name="minClanCreateBalance"
              render={({ field }) => (
                <FormItem><FormLabel>Minimum Member Balance for Clan Creation ($)</FormLabel><FormControl><Input type="number" placeholder="100" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <Separator />
            <h3 className="text-lg font-medium">Achievement Bonus Settings ($)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="rankAchievementBonus" render={({ field }) => (<FormItem><FormLabel>Rank Up Bonus</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="tierAchievementBonus" render={({ field }) => (<FormItem><FormLabel>Tier Unlock Bonus</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <Separator />
            <h3 className="text-lg font-medium">Referral Bonus Settings ($)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <FormField control={form.control} name="newUserBonus" render={({ field }) => (<FormItem><FormLabel>New Member Bonus (for Invitee)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="referralBonusTier1" render={({ field }) => (<FormItem><FormLabel>Inviter Bonus (First 3)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
               <FormField control={form.control} name="referralBonusTier2" render={({ field }) => (<FormItem><FormLabel>Inviter Bonus (After 3)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
             <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save All Settings
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
