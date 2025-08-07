import { env } from './env';

// Performance monitoring types
export interface PerformanceMetrics {
  name: string;
  value: number;
  delta?: number;
  id: string;
  navigationType?: string;
}

// Web Vitals thresholds
export const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
} as const;

// Performance observer for monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private observers: PerformanceObserver[] = [];
  private metrics: Map<string, PerformanceMetrics> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    try {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('TTFB', navEntry.responseStart - navEntry.requestStart);
            this.recordMetric('DOMContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.navigationStart);
            this.recordMetric('Load', navEntry.loadEventEnd - navEntry.navigationStart);
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any;
            this.recordMetric('FID', fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.recordMetric('CLS', clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

    } catch (error) {
      console.error('Error initializing performance observers:', error);
    }
  }

  private recordMetric(name: string, value: number) {
    const metric: PerformanceMetrics = {
      name,
      value,
      id: `${name}-${Date.now()}`,
    };

    this.metrics.set(name, metric);
    this.sendMetric(metric);
  }

  private sendMetric(metric: PerformanceMetrics) {
    if (env.NEXT_PUBLIC_PERFORMANCE_MONITORING && process.env.NODE_ENV === 'production') {
      // Send to analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: metric.name,
          value: Math.round(metric.value),
          non_interaction: true,
        });
      }

      // Send to custom analytics endpoint
      this.sendToAnalytics(metric);
    }

    // Log in development
    if (env.NODE_ENV === 'development') {
      const threshold = THRESHOLDS[metric.name as keyof typeof THRESHOLDS];
      const status = threshold
        ? metric.value <= threshold.good
          ? 'good'
          : metric.value <= threshold.poor
          ? 'needs improvement'
          : 'poor'
        : 'unknown';

      console.log(`Performance: ${metric.name} = ${metric.value.toFixed(2)}ms (${status})`);
    }
  }

  private async sendToAnalytics(metric: PerformanceMetrics) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      // Silently fail in production
      if (env.NODE_ENV === 'development') {
        console.error('Failed to send performance metric:', error);
      }
    }
  }

  public getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  public getMetric(name: string): PerformanceMetrics | undefined {
    return this.metrics.get(name);
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  return {
    getMetrics: () => monitor.getMetrics(),
    getMetric: (name: string) => monitor.getMetric(name),
  };
}

// Utility functions
export function measureComponentRender<T extends (...args: any[]) => any>(
  fn: T,
  componentName: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (env.NODE_ENV === 'development') {
      console.log(`Component ${componentName} render time: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Image optimization utilities
export function getOptimizedImageProps(
  src: string,
  width: number,
  height: number,
  priority = false
) {
  return {
    src,
    width,
    height,
    priority,
    sizes: `(max-width: 768px) ${width}px, (max-width: 1200px) ${width * 1.5}px, ${width * 2}px`,
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Initialize on page load
  window.addEventListener('load', () => {
    PerformanceMonitor.getInstance();
  });

  // Report when page is hidden (for session duration)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      const monitor = PerformanceMonitor.getInstance();
      const metrics = monitor.getMetrics();
      
      // Send final metrics
      if (navigator.sendBeacon && metrics.length > 0) {
        navigator.sendBeacon(
          '/api/analytics/performance',
          JSON.stringify({ metrics, sessionEnd: Date.now() })
        );
      }
    }
  });
}
