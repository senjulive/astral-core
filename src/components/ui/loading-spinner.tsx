'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { AstralLogo } from "@/components/icons/astral-logo";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "quantum" | "minimal" | "dots";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "default", 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  if (variant === "quantum") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <div className="relative">
          <AstralLogo className={cn("text-blue-400 animate-pulse", sizeClasses[size])} />
          <div className={cn(
            "absolute inset-0 border-2 border-transparent border-t-blue-400 border-r-purple-400 rounded-full animate-spin",
            sizeClasses[size]
          )} />
          <div className={cn(
            "absolute inset-1 border border-transparent border-b-cyan-400 border-l-green-400 rounded-full animate-spin",
            "animation-delay-150"
          )} style={{ animationDirection: "reverse", animationDuration: "2s" }} />
        </div>
        {text && (
          <div className="text-center">
            <p className="text-sm font-medium text-white animate-pulse">{text}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce animation-delay-100" />
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce animation-delay-200" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1">
          <div className={cn("bg-blue-400 rounded-full animate-bounce", 
            size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3"
          )} />
          <div className={cn("bg-purple-400 rounded-full animate-bounce animation-delay-100",
            size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3"
          )} />
          <div className={cn("bg-cyan-400 rounded-full animate-bounce animation-delay-200",
            size === "sm" ? "w-2 h-2" : size === "lg" ? "w-4 h-4" : "w-3 h-3"
          )} />
        </div>
        {text && <span className="text-sm text-muted-foreground ml-2">{text}</span>}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn(
        "border-2 border-transparent border-t-current rounded-full animate-spin",
        sizeClasses[size],
        className
      )} />
    );
  }

  // Default variant
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "border-2 border-blue-200 border-t-blue-400 rounded-full animate-spin",
        sizeClasses[size]
      )} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

// Quantum loading screen component
export function QuantumLoadingScreen({ text = "Initializing Quantum AI..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Main loading content */}
        <div className="relative z-10 text-center p-8">
          <LoadingSpinner variant="quantum" size="xl" text={text} />
          
          {/* Progress indicators */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">Neural networks synchronizing...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
