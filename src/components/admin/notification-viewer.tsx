
'use client';

import * as React from 'react';
import {formatDistanceToNow} from 'date-fns';
import {useToast} from '@/hooks/use-toast';
import {type Notification} from '@/lib/notifications';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Bell, RefreshCw, User} from 'lucide-react';
import {Button} from '@/components/ui/button';

// Mock data, as we removed the dedicated API endpoint
const mockAdminNotifications = [
    { id: '1', title: 'New User Registered', content: 'user@example.com has created an account.', created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: '2', title: 'New Deposit Request', content: 'User \'DefaultUser\' (user@example.com) has initiated a deposit request for 500.00 USDT.', created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: '3', title: 'New Support Message', content: 'New message from mock-user-123: "Hello, I need help with..."', created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

export function NotificationViewer() {
  const {toast} = useToast();
  const [notifications, setNotifications] = React.useState<any[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchNotifications = React.useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setNotifications(mockAdminNotifications);
        setIsLoading(false);
    }, 1000);
  }, []);

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Platform Notifications</CardTitle>
          <CardDescription>
            A log of important events from across the platform.
          </CardDescription>
        </div>
        <Button
          onClick={fetchNotifications}
          variant="outline"
          size="icon"
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? 'animate-spin' : ''} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))
        ) : notifications.length > 0 ? (
          notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{notif.title}</p>
                <p className="text-sm text-muted-foreground">{notif.content}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">
                  {formatDistanceToNow(new Date(notif.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-48 border-dashed border rounded-lg">
            <Bell className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">No notifications yet</p>
            <p className="text-sm text-muted-foreground">
              Important system events will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
