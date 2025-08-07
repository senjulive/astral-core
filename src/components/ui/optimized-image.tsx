'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  skeletonClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  className,
  skeletonClassName,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    
    onError?.();
  };

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            skeletonClassName
          )}
        />
      )}
      
      <Image
        {...props}
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyzyKCiygDiVkwCl7JUL7J0aPSBPTF1TXr2wOWNLwjQ6wlSjaxsOJl0pDrMOvhyeM5BYdPFnG6RFruwf0O6QrFCULDdKpF6y5zzONHTQKjjSk0v5Fc6n0m49SdQvFN3Z3SeEGDaQKNSdKh7LrR5cDtnyA==" 
      />
      
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              Failed to load image
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility for generating optimized image props
export function getImageProps(
  src: string,
  width?: number,
  height?: number,
  priority = false
): Partial<ImageProps> {
  return {
    src,
    width,
    height,
    priority,
    sizes: width 
      ? `(max-width: 768px) ${Math.min(width, 768)}px, (max-width: 1200px) ${Math.min(width * 1.5, 1200)}px, ${width * 2}px`
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    style: {
      maxWidth: '100%',
      height: 'auto',
    },
  };
}

// Hook for preloading images
export function useImagePreload(src: string) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const preload = () => {
    const img = new window.Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = src;
  };

  return { isLoaded, hasError, preload };
}
