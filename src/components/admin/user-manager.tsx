
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function UserManager() {
  const { toast } = useToast();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupUser = async () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'Please enter a User ID.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/setup-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: result.message,
        });
        setUserId('');
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Setup</CardTitle>
        <CardDescription>
          Manually trigger the setup process for a new user by providing their ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="userId" className="text-sm font-medium">User ID</label>
          <Input
            id="userId"
            placeholder="Enter the user's ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <Button onClick={handleSetupUser} disabled={isLoading}>
          {isLoading ? 'Setting up...' : 'Setup User'}
        </Button>
      </CardContent>
    </Card>
  );
}
