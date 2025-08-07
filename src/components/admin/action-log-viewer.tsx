'use client';

import * as React from 'react';
import {formatDistanceToNow} from 'date-fns';
import {useToast} from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Activity, RefreshCw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '../ui/scroll-area';
import {type ActionLog} from '@/lib/moderator';

export function ActionLogViewer() {
  const {toast} = useToast();
  const [logs, setLogs] = React.useState<ActionLog[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchLogs = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/moderator/actions', {method: 'POST'});
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch action logs.');
      }
      const data = await response.json();
      setLogs(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Could not fetch logs: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Moderator Action Log</CardTitle>
          <CardDescription>
            A detailed audit trail of all actions performed by moderators.
          </CardDescription>
        </div>
        <Button
          onClick={fetchLogs}
          variant="outline"
          size="icon"
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4 pr-4">
            {isLoading ? (
              Array.from({length: 5}).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : logs.length > 0 ? (
              logs.map(log => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      <span className="font-bold">
                        {log.user?.username || 'System'}
                      </span>{' '}
                      performed an action:
                    </p>
                    <p className="text-sm text-muted-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-48 border-dashed border rounded-lg">
                <Activity className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">No actions logged yet</p>
                <p className="text-sm text-muted-foreground">
                  Moderator activities will appear here.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
