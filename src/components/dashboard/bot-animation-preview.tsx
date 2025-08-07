"use client";

import { cn } from "@/lib/utils";

export function BotAnimationPreview() {
  return (
    <div className="w-full h-16 flex justify-center items-end gap-1.5" aria-hidden="true">
      <div
        className={cn(
          "w-2.5 bg-primary/30 rounded-t-sm animate-bar-pulse origin-bottom transform-gpu"
        )}
        style={{ height: '60%', animationDelay: '0s' }}
      />
      <div
        className={cn(
          "w-2.5 bg-primary/50 rounded-t-sm animate-bar-pulse origin-bottom transform-gpu"
        )}
        style={{ height: '80%', animationDelay: '0.2s' }}
      />
      <div
        className={cn(
          "w-2.5 bg-primary/70 rounded-t-sm animate-bar-pulse origin-bottom transform-gpu"
        )}
        style={{ height: '50%', animationDelay: '0.4s' }}
      />
      <div
        className={cn(
          "w-2.5 bg-primary/50 rounded-t-sm animate-bar-pulse origin-bottom transform-gpu"
        )}
        style={{ height: '90%', animationDelay: '0.6s' }}
      />
       <div
        className={cn(
          "w-2.5 bg-primary/30 rounded-t-sm animate-bar-pulse origin-bottom transform-gpu"
        )}
        style={{ height: '70%', animationDelay: '0.8s' }}
      />
    </div>
  );
}
