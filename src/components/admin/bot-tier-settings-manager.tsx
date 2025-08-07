
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TierSetting } from "@/lib/tiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, PlusCircle, Trash2, Lock, Unlock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "../ui/switch";

const tierSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tier name is required."),
  balanceThreshold: z.coerce.number().min(0, "Balance must be a positive number."),
  dailyProfit: z.coerce.number().min(0, "Profit rate must be positive.").max(1, "Profit rate cannot exceed 100%."),
  clicks: z.coerce.number().int().min(1, "Must have at least 1 click."),
  locked: z.boolean(),
});

const formSchema = z.object({
  tiers: z.array(tierSchema),
});

type SettingsFormValues = z.infer<typeof formSchema>;
const BOT_TIER_SETTINGS_KEY = 'botTierSettings';

export function BotTierSettingsManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tiers: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  React.useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/public-settings?key=${BOT_TIER_SETTINGS_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch bot tier settings');
        const data = await response.json();
        if (data && Array.isArray(data)) {
            form.reset({ tiers: data.sort((a,b) => a.balanceThreshold - b.balanceThreshold) });
        }
      } catch (error: any) {
        console.error("Could not fetch bot settings:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, [form]);
  
  const handleAddTier = () => {
    const newTierId = `tier-${fields.length + 1}`;
    append({
        id: newTierId,
        name: `VIP CORE ${fields.length + 1}`,
        balanceThreshold: 0,
        dailyProfit: 0.01,
        clicks: 1,
        locked: false,
    });
  }

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
        const sortedTiers = [...values.tiers].sort((a, b) => a.balanceThreshold - b.balanceThreshold);
        
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: BOT_TIER_SETTINGS_KEY, value: sortedTiers })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to save settings.');
        
        toast({
            title: "Settings Saved",
            description: "The bot tier settings have been updated.",
        });
        
        form.reset({ tiers: sortedTiers });

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
        <CardContent className="space-y-4"><Skeleton className="h-48 w-full" /><div className="flex justify-end"><Skeleton className="h-10 w-32" /></div></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Tier (Grid) Settings</CardTitle>
        <CardDescription>Configure parameters for each VIP CORE tier. Tiers should be ordered by minimum balance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="overflow-x-auto">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Tier Name</TableHead>
                          <TableHead className="text-right">Min. Balance ($)</TableHead>
                          <TableHead className="text-right">Daily Grids</TableHead>
                          <TableHead className="text-right">Daily Profit (%)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {fields.map((field, index) => (
                          <TableRow key={field.id}>
                              <TableCell className="min-w-[150px]"><FormField control={form.control} name={`tiers.${index}.name`} render={({ field }) => (<FormItem><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/></TableCell>
                              <TableCell className="min-w-[150px]"><FormField control={form.control} name={`tiers.${index}.balanceThreshold`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} className="text-right" /></FormControl><FormMessage /></FormItem>)}/></TableCell>
                              <TableCell className="min-w-[120px]"><FormField control={form.control} name={`tiers.${index}.clicks`} render={({ field }) => (<FormItem><FormControl><Input type="number" {...field} className="text-right" /></FormControl><FormMessage /></FormItem>)}/></TableCell>
                              <TableCell className="min-w-[150px]"><FormField control={form.control} name={`tiers.${index}.dailyProfit`} render={({ field }) => (<FormItem><FormControl><Input type="number" step="0.1" className="text-right" value={field.value * 100} onChange={e => { const val = parseFloat(e.target.value); field.onChange(isNaN(val) ? 0 : val / 100); }}/></FormControl><FormMessage /></FormItem>)}/></TableCell>
                              <TableCell className="min-w-[120px]"><FormField control={form.control} name={`tiers.${index}.locked`} render={({ field }) => (<FormItem className="flex flex-col items-center"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><span className="text-xs text-muted-foreground">{field.value ? <Lock className="h-3 w-3 inline-block mr-1"/> : <Unlock className="h-3 w-3 inline-block mr-1"/>}{field.value ? 'Locked' : 'Active'}</span></FormItem>)}/></TableCell>
                              <TableCell className="text-right"><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </div>
            <div className="flex justify-between items-center">
                <Button type="button" variant="outline" onClick={handleAddTier}><PlusCircle className="mr-2 h-4 w-4" /> Add Tier</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save All Tier Settings</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
