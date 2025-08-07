
import * as React from "react";
import { cn } from "@/lib/utils";

export const DiamondRankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="diamond-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#D8B4FE" />
            </linearGradient>
            <filter id="diamond-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#diamond-glow)">
            <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" fill="url(#diamond-gradient)" />
            <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" stroke="#7E22CE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 9.5h8L12 14 8 9.5z" fill="white" fillOpacity="0.8" />
            <path d="M10.5 9.5L12 7l1.5 2.5" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 14v4" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);
