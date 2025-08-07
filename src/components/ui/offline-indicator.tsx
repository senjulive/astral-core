"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, RefreshCw, AlertTriangle, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfflineIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function OfflineIndicator({ className, showDetails = false }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = React.useState(true);
  const [lastOnline, setLastOnline] = React.useState<Date | null>(null);
  const [showDetailedView, setShowDetailedView] = React.useState(false);

  React.useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online && isOnline) {
        setLastOnline(new Date());
      }
    };

    // Set initial status
    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (isOnline && !showDetails) {
    return null;
  }

  if (!isOnline && !showDetailedView) {
    return (
      <div className={cn("fixed top-4 left-4 right-4 z-50 flex justify-center", className)}>
        <Badge 
          variant="outline" 
          className="bg-red-500/10 text-red-300 border-red-400/30 backdrop-blur-xl cursor-pointer hover:bg-red-500/20 transition-all duration-300"
          onClick={() => setShowDetailedView(true)}
        >
          <WifiOff className="w-3 h-3 mr-2" />
          You're offline - Tap for details
        </Badge>
      </div>
    );
  }

  if (!isOnline && showDetailedView) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-sm bg-black/80 backdrop-blur-xl border-border/40">
          <CardContent className="p-6 text-center space-y-4">
            <div className="relative mx-auto w-12 h-12 mb-4">
              <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-500/20 to-orange-500/10 p-2 rounded-full border border-red-400/30">
                <WifiOff className="h-8 w-8 text-red-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Connection Lost</h3>
              <p className="text-sm text-gray-300 mb-4">
                AstralCore Quantum Grid is unreachable. Some features may not work properly.
              </p>
              
              {lastOnline && (
                <p className="text-xs text-gray-400">
                  Last connected: {lastOnline.toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div className="text-left">
                    <p className="text-xs text-yellow-300 font-medium">Limited Functionality</p>
                    <p className="text-xs text-gray-300">
                      Some features like real-time trading and live chat will be disabled until connection is restored.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleRetry}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              
              <Button
                onClick={() => setShowDetailedView(false)}
                variant="outline"
                className="border-gray-600/50 text-gray-300"
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Online status (when showDetails is true)
  if (isOnline && showDetails) {
    return (
      <div className={cn("fixed top-4 left-4 right-4 z-50 flex justify-center", className)}>
        <Badge 
          variant="outline" 
          className="bg-green-500/10 text-green-300 border-green-400/30 backdrop-blur-xl"
        >
          <Wifi className="w-3 h-3 mr-2" />
          Quantum Grid Online
        </Badge>
      </div>
    );
  }

  return null;
}

// Hook for getting online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}

// Component that conditionally renders based on online status
export function OnlineOnly({ children, fallback }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode; 
}) {
  const isOnline = useOnlineStatus();
  
  if (!isOnline) {
    return fallback ? <>{fallback}</> : (
      <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/20 text-center">
        <WifiOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-300 text-sm">This feature requires an internet connection</p>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Component that only renders when offline
export function OfflineOnly({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  
  if (isOnline) {
    return null;
  }
  
  return <>{children}</>;
}
