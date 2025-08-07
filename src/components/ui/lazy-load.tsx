'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  onIntersect?: () => void;
  className?: string;
}

export function LazyLoad({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  onIntersect,
  className,
}: LazyLoadProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsIntersecting(true);
          setHasIntersected(true);
          onIntersect?.();
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [rootMargin, threshold, onIntersect, hasIntersected]);

  return (
    <div ref={ref} className={className}>
      {isIntersecting || hasIntersected ? (
        children
      ) : (
        fallback || (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )
      )}
    </div>
  );
}

// HOC version for components
export function withLazyLoad<P extends object>(
  Component: React.ComponentType<P>,
  lazyLoadProps?: Omit<LazyLoadProps, 'children'>
) {
  const LazyComponent = (props: P) => (
    <LazyLoad {...lazyLoadProps}>
      <Component {...props} />
    </LazyLoad>
  );

  LazyComponent.displayName = `withLazyLoad(${Component.displayName || Component.name})`;
  
  return LazyComponent;
}

// Hook for lazy loading data
export function useLazyLoad<T>(
  loadFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  const trigger = async () => {
    if (hasTriggered || loading) return;
    
    setHasTriggered(true);
    setLoading(true);
    setError(null);

    try {
      const result = await loadFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasTriggered) {
      trigger();
    }
  }, deps);

  return {
    data,
    loading,
    error,
    trigger,
    hasTriggered,
  };
}
