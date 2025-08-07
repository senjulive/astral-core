"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Brain, Atom, Zap, Waves } from "lucide-react";

interface MobileLoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "quantum" | "neural" | "minimal";
  text?: string;
  className?: string;
}

export function MobileLoading({ 
  size = "md", 
  variant = "default", 
  text = "Loading...", 
  className 
}: MobileLoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  if (variant === "quantum") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        {/* Quantum Core */}
        <div className="relative">
          {/* Rotating rings */}
          <div className={cn("absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin", sizeClasses[size])} 
               style={{animationDuration: '3s'}} />
          <div className={cn("absolute inset-1 border-2 border-purple-400/40 rounded-full animate-spin", sizeClasses[size])} 
               style={{animationDuration: '2s', animationDirection: 'reverse'}} />
          
          {/* Central core */}
          <div className={cn("relative rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-400/30 flex items-center justify-center", sizeClasses[size])}>
            <Brain className={cn("text-blue-400 animate-pulse", size === "sm" ? "w-2 h-2" : size === "md" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-8 h-8")} />
          </div>
          
          {/* Orbiting particles */}
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
          <div className="absolute right-0 top-1/2 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '1s'}} />
          <div className="absolute left-0 top-1/2 w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}} />
        </div>

        {text && (
          <p className={cn("text-gray-300 font-medium animate-pulse", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "neural") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        {/* Neural Network Animation */}
        <div className="relative">
          <svg className={cn("animate-pulse", sizeClasses[size])} viewBox="0 0 50 50" fill="none">
            <defs>
              <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="rgb(147,51,234)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            
            {/* Neural connections */}
            <path d="M10,15 Q25,10 40,15" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none"/>
            <path d="M10,25 Q25,20 40,25" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '0.5s'}}/>
            <path d="M10,35 Q25,30 40,35" stroke="url(#neuralGrad)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '1s'}}/>
            
            {/* Neural nodes */}
            <circle cx="10" cy="15" r="2" fill="rgb(59,130,246)" className="animate-pulse" />
            <circle cx="25" cy="25" r="2" fill="rgb(147,51,234)" className="animate-pulse" style={{animationDelay: '0.3s'}} />
            <circle cx="40" cy="35" r="2" fill="rgb(6,182,212)" className="animate-pulse" style={{animationDelay: '0.6s'}} />
          </svg>
        </div>

        {text && (
          <p className={cn("text-gray-300 font-medium", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={cn("bg-blue-400 rounded-full animate-pulse", size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4")}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn("text-gray-300", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <div className="relative">
        <div className={cn("border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin", sizeClasses[size])} />
      </div>
      {text && (
        <p className={cn("text-gray-300 font-medium", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full-screen loading overlay
export function MobileLoadingScreen({ 
  variant = "quantum",
  text = "Initializing AstralCore...",
  subtitle = "Quantum systems coming online"
}: {
  variant?: "quantum" | "neural" | "default";
  text?: string;
  subtitle?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-purple-950/80 to-cyan-950/70 animate-pulse" 
             style={{animationDuration: '3s'}} />
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center space-y-6">
        <MobileLoading variant={variant} size="xl" />
        
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {text}
          </h2>
          {subtitle && (
            <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">Neural Grid</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
            <span className="text-blue-400">Quantum Core</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
            <span className="text-purple-400">AI Systems</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page transition loading
export function PageTransitionLoading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-gray-800">
      <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-pulse" 
           style={{ 
             animation: 'slide 1.5s ease-in-out infinite',
             background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)'
           }} 
      />
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Button loading state
export function ButtonLoading({ children, isLoading, ...props }: any) {
  return (
    <button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <MobileLoading variant="minimal" size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
