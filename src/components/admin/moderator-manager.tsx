
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useToast} from '@/hooks/use-toast';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Loader2,
  Users,
  UserCog,
  Power,
  PowerOff,
  Trash2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Label} from '../ui/label';
import {Switch} from '../ui/switch';
import {Separator} from '../ui/separator';

type Moderator = {
  userId: string;
  username: string;
  status: 'active' | 'inactive';
  permissions: {
    customer_support: boolean;
    user_verification: boolean;
    deposit_approval: boolean;
  };
};

// Mock User type, simplified
type User = {
    id: string;
    email: string;
    user_metadata: {
        username?: string;
    }
}

export function ModeratorManager() {
  const {toast} = useToast();
  const [moderators, setModerators] = React.useState<Moderator[]>([]);
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Since Supabase is removed, we'll use mock data.
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
        setModerators([]); // No moderators by default
        setAllUsers([
            { id: 'mock-user-123', email: 'user@example.com', user_metadata: { username: 'DefaultUser'}},
            { id: 'mock-user-456', email: 'another@example.com', user_metadata: { username: 'AnotherUser'}},
        ]);
        setIsLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: 'Action Disabled',
      description: 'Managing moderators is disabled in this mock environment.',
    });
    setIsSaving(false);
  };

  const handleAddModerator = (userId: string) => {
    if (moderators.length >= 2) {
      toast({
        title: 'Limit Reached',
        description: 'You can only have a maximum of 2 moderators.',
        variant: 'destructive',
      });
      return;
    }
    const user = allUsers.find(u => u.id === userId);
    if (user && !moderators.some(m => m.userId === userId)) {
      setModerators([
        ...moderators,
        {
          userId: user.id,
          username: user.user_metadata.username || user.email!,
          status: 'inactive',
          permissions: {
            customer_support: true,
            user_verification: false,
            deposit_approval: false,
          },
        },
      ]);
    }
  };

  const handleRemoveModerator = (userId: string) => {
    setModerators(moderators.filter(m => m.userId !== userId));
  };

  const handlePermissionChange = (
    userId: string,
    permission: keyof Moderator['permissions'],
    value: boolean
  ) => {
    setModerators(
      moderators.map(m =>
        m.userId === userId
          ? {...m, permissions: {...m.permissions, [permission]: value}}
          : m
      )
    );
  };

  const handleStatusChange = (userId: string, status: 'active' | 'inactive') => {
    setModerators(
      moderators.map(m => (m.userId === userId ? {...m, status} : m))
    );
  };

  const availableUsers = allUsers.filter(u => !moderators.some(m => m.userId === u.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Moderator Management</CardTitle>
        <CardDescription>
          Assign up to two moderators and configure their permissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          moderators.map(mod => (
            <Card key={mod.userId} className="p-4 bg-muted/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <UserCog className="h-5 w-5 text-primary" />
                    {mod.username}
                  </h3>
                  <p className="text-xs text-muted-foreground">{mod.userId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() =>
                      handleStatusChange(
                        mod.userId,
                        mod.status === 'active' ? 'inactive' : 'active'
                      )
                    }
                    size="sm"
                    variant={mod.status === 'active' ? 'default' : 'secondary'}
                  >
                    {mod.status === 'active' ? (
                      <Power className="mr-2" />
                    ) : (
                      <PowerOff className="mr-2" />
                    )}
                    {mod.status === 'active' ? 'Active' : 'Inactive'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveModerator(mod.userId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 p-3 rounded-md border bg-background">
                    <Switch
                      id={`support-${mod.userId}`}
                      checked={mod.permissions.customer_support}
                      onCheckedChange={c =>
                        handlePermissionChange(mod.userId, 'customer_support', c)
                      }
                    />
                    <Label htmlFor={`support-${mod.userId}`}>
                      Customer Support
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md border bg-background">
                    <Switch
                      id={`verify-${mod.userId}`}
                      checked={mod.permissions.user_verification}
                      onCheckedChange={c =>
                        handlePermissionChange(mod.userId, 'user_verification', c)
                      }
                    />
                    <Label htmlFor={`verify-${mod.userId}`}>User Verification</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md border bg-background">
                    <Switch
                      id={`deposit-${mod.userId}`}
                      checked={mod.permissions.deposit_approval}
                      onCheckedChange={c =>
                        handlePermissionChange(mod.userId, 'deposit_approval', c)
                      }
                    />
                    <Label htmlFor={`deposit-${mod.userId}`}>
                      Deposit Approval
                    </Label>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}

        {moderators.length < 2 && !isLoading && (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="add-moderator">Add Moderator</Label>
              <Select
                onValueChange={handleAddModerator}
                disabled={availableUsers.length === 0}
              >
                <SelectTrigger id="add-moderator">
                  <SelectValue placeholder="Select a user to promote" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.user_metadata.username || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {moderators.length === 0 && !isLoading && (
          <div className="flex h-24 flex-col items-center justify-center rounded-md border border-dashed text-center">
            <Users className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No moderators assigned.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
