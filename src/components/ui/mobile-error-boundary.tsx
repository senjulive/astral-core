"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw, Home, Wifi, WifiOff, Brain } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class MobileErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging
    console.error("MobileErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} reset={this.handleReset} />;
      }

      return <DefaultErrorFallback error={this.state.error!} reset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-gradient-to-br from-red-950/90 via-orange-950/80 to-yellow-950/70 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-400/60 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(239,68,68)" stopOpacity="0.6"/>
              <stop offset="50%" stopColor="rgb(251,146,60)" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="rgb(250,204,21)" stopOpacity="0.2"/>
            </linearGradient>
          </defs>
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#errorGrad)" strokeWidth="2" className="animate-pulse" fill="none"/>
          <path d="M100,600 Q300,500 500,600 T900,600" stroke="url(#errorGrad)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '1s'}}/>
        </svg>
      </div>

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-border/40 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-red-400/30 rounded-full blur-lg animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500/20 to-orange-500/10 p-3 rounded-full border border-red-400/30 backdrop-blur-xl">
              <AlertTriangle className="h-10 w-10 text-red-400" />
            </div>
          </div>
          
          <CardTitle className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <Brain className="h-5 w-5 text-red-400" />
            Quantum System Error
          </CardTitle>
          
          <div className="space-y-2">
            <Badge 
              variant="outline" 
              className={`${isOnline 
                ? 'border-green-400/40 text-green-300 bg-green-400/10' 
                : 'border-red-400/40 text-red-300 bg-red-400/10'
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
              {isOnline ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/20">
            <h4 className="text-sm font-semibold text-red-400 mb-2">Neural Network Disruption</h4>
            <p className="text-xs text-gray-300 mb-2">
              {isOnline 
                ? "A quantum fluctuation has occurred in the system. Our AI is working to restore normal operations."
                : "Connection to the quantum grid has been lost. Please check your internet connection."}
            </p>
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-gray-300">Technical Details</summary>
              <pre className="mt-2 text-xs font-mono bg-black/20 p-2 rounded overflow-x-auto">
                {error.message}
              </pre>
            </details>
          </div>

          {!isOnline && (
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
              <p className="text-xs text-yellow-300">
                <WifiOff className="w-3 h-3 inline mr-1" />
                You're currently offline. Some features may not work properly.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Restore Quantum State
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={reloadPage}
                variant="outline"
                className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Reload
              </Button>
              
              <Button
                onClick={goHome}
                variant="outline"
                className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
              >
                <Home className="mr-1 h-3 w-3" />
                Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for using error boundary
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo);
    
    // You can also send error to logging service here
    // logErrorToService(error, errorInfo);
  };
}

// Component wrapper for easier usage
export function withMobileErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
) {
  const WrappedComponent = (props: P) => (
    <MobileErrorBoundary fallback={fallback}>
      <Component {...props} />
    </MobileErrorBoundary>
  );
  
  WrappedComponent.displayName = `withMobileErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
