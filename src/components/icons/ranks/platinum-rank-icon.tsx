
import * as React from "react";
import { cn } from "@/lib/utils";

export const PlatinumRankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="platinum-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#67E8F9" />
            </linearGradient>
            <filter id="platinum-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#platinum-glow)">
            <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" fill="url(#platinum-gradient)" />
            <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6l1.41 2.59L16 10l-2.59 1.41L12 14l-1.41-2.59L8 10l2.59-1.41L12 6z" fill="white" />
            <path d="M10 16l2 3 2-3" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);
