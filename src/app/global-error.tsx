'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error monitoring service (e.g., Sentry)
      // Sentry.captureException(error);
    }
  }, [error]);

  const handleReload = () => {
    window.location.href = '/';
  };

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center p-6">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Application Error
              </h1>
              <p className="text-muted-foreground mb-4">
                A critical error occurred. Please try reloading the application or contact support if the problem persists.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <pre className="text-sm text-destructive overflow-auto max-h-32">
                  {error.toString()}
                </pre>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={handleReload}>
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                If this error persists, please contact{' '}
                <a href="mailto:support@astralcore.io" className="text-primary hover:underline">
                  support@astralcore.io
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
