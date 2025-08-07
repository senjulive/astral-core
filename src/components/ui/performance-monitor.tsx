'use client';

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Wifi, Clock, Activity } from "lucide-react";

interface PerformanceMetrics {
  loadTime: number;
  connectionType: string;
  latency: number;
  isOnline: boolean;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    loadTime: 0,
    connectionType: 'unknown',
    latency: 0,
    isOnline: true
  });

  React.useEffect(() => {
    // Measure initial load time
    const loadTime = performance.now();
    
    // Get connection info
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Measure latency with a simple ping
    const measureLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/ping', { method: 'HEAD' });
        return performance.now() - start;
      } catch {
        return 999; // High latency if fetch fails
      }
    };

    const updateMetrics = async () => {
      const latency = await measureLatency();
      
      setMetrics({
        loadTime: Math.round(loadTime),
        connectionType: connection ? connection.effectiveType || 'unknown' : 'unknown',
        latency: Math.round(latency),
        isOnline: navigator.onLine
      });
    };

    updateMetrics();

    // Listen for online/offline events
    const handleOnline = () => setMetrics(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic latency checks
    const interval = setInterval(async () => {
      const latency = await measureLatency();
      setMetrics(prev => ({ ...prev, latency: Math.round(latency) }));
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return "text-green-400";
    if (latency < 300) return "text-yellow-400";
    return "text-red-400";
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case '4g':
        return <Zap className="h-3 w-3" />;
      case '3g':
      case '2g':
        return <Wifi className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  if (!metrics.isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Badge variant="destructive" className="animate-pulse">
          <Activity className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden sm:block">
      <Card className="bg-black/80 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-2">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="h-3 w-3" />
              <span>{metrics.loadTime}ms</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-400">
              {getConnectionIcon(metrics.connectionType)}
              <span className="uppercase">{metrics.connectionType}</span>
            </div>
            
            <div className={`flex items-center gap-1 ${getLatencyColor(metrics.latency)}`}>
              <Activity className="h-3 w-3" />
              <span>{metrics.latency}ms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simple ping API route helper
export function createPingRoute() {
  return {
    GET: () => new Response('pong', { status: 200 }),
    HEAD: () => new Response(null, { status: 200 })
  };
}
