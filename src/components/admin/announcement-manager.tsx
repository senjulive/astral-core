
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, Megaphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";

const announcementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  content: z.string().min(10, "Content must be at least 10 characters long."),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;
const ANNOUNCEMENTS_KEY = 'announcements';

export function AnnouncementManager() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const fetchAnnouncements = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/public-settings?key=${ANNOUNCEMENTS_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch announcements.');
      
      const data = await response.json();
      
      const initialData = getAnnouncements();

      const currentAnnouncements = data || initialData;
      setAnnouncements(currentAnnouncements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const saveAnnouncements = async (newAnnouncements: Announcement[]) => {
      try {
          const response = await fetch('/api/admin/settings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ key: ANNOUNCEMENTS_KEY, value: newAnnouncements })
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Failed to save announcements.');
          return true;
      } catch (error: any) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
          return false;
      }
  };

  const onSubmit = async (values: AnnouncementFormValues) => {
    setIsSubmitting(true);
    const newAnnouncement: Announcement = {
        id: crypto.randomUUID(),
        title: values.title,
        content: values.content,
        date: new Date().toISOString().split('T')[0],
    };
    const updatedAnnouncements = [newAnnouncement, ...announcements];
    
    const success = await saveAnnouncements(updatedAnnouncements);

    if (success) {
        toast({ title: "Alert Published", description: "The new alert is now visible to all users." });
        form.reset();
        await fetchAnnouncements();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
    const success = await saveAnnouncements(updatedAnnouncements);

    if (success) {
        toast({ title: "Alert Deleted", description: "The alert has been removed." });
        await fetchAnnouncements();
    }
    setIsDeleting(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>New Alert</CardTitle>
            <CardDescription>
              Create and publish a new alert for all users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., System Maintenance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the alert..." {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Publish Alert
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Published Alerts</CardTitle>
            <CardDescription>
              A list of all active alerts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                ) : announcements.length > 0 ? (
                  announcements.map((ann) => (
                    <Card key={ann.id} className="relative bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{ann.title}</CardTitle>
                        <CardDescription>{format(new Date(ann.date), "PPP")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{ann.content}</p>
                      </CardContent>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7"
                        onClick={() => handleDelete(ann.id)}
                        disabled={!!isDeleting}
                      >
                        {isDeleting === ann.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </Card>
                  ))
                ) : (
                  <div className="flex h-48 flex-col items-center justify-center rounded-md border border-dashed text-center">
                    <Megaphone className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium text-muted-foreground">No alerts published yet.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
