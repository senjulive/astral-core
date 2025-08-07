
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function RightSidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside className={cn('h-full w-full max-w-sm border-l bg-background', className)}>
      <div className="flex h-full flex-col">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground">Activity Feed</h2>
          <p className="text-sm text-muted-foreground">Recent updates and notifications.</p>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <Button className="w-full">View All Activity</Button>
        </div>
      </div>
    </aside>
  );
}

export { RightSidebar };
