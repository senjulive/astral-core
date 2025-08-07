
import * as React from "react";
import { cn } from "@/lib/utils";

export const PlatinumTierIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="platinum-tier-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#67E8F9" />
            </linearGradient>
            <filter id="platinum-tier-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#platinum-tier-glow)">
            <path d="M12 2.5L21.5 8.5L12 21.5L2.5 8.5L12 2.5Z" fill="url(#platinum-tier-gradient)" />
            <path d="M12 2.5L21.5 8.5L12 21.5L2.5 8.5L12 2.5Z" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    </svg>
);
