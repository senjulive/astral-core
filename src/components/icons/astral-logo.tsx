import * as React from "react";
import { cn } from "@/lib/utils";

export const AstralLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-14 w-14", className)}
        {...props}
    >
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(180, 80%, 70%)" }} />
                <stop offset="100%" style={{ stopColor: "hsl(195, 100%, 50%)" }} />
            </linearGradient>
        </defs>
        <g fill="url(#logoGradient)">
            {/* Outer Circle */}
            <path d="M50,2.5 A47.5,47.5 0 1,1 49.9,2.5 Z M50,10 A40,40 0 1,0 50,90 A40,40 0 1,0 50,10 Z" />
            
            {/* Main Star Points (Large) */}
            <path d="M50 15 L59 41 L50 50 Z" />
            <path d="M50 15 L41 41 L50 50 Z" />
            <path d="M85 50 L59 59 L50 50 Z" />
            <path d="M85 50 L59 41 L50 50 Z" />
            <path d="M50 85 L41 59 L50 50 Z" />
            <path d="M50 85 L59 59 L50 50 Z" />
            <path d="M15 50 L41 41 L50 50 Z" />
            <path d="M15 50 L41 59 L50 50 Z" />
            
            {/* Inner Star Points (Small) */}
            <path d="M65.5 34.5 L55.7 44.3 L50 50 Z" opacity="0.7" />
            <path d="M65.5 65.5 L55.7 55.7 L50 50 Z" opacity="0.7" />
            <path d="M34.5 65.5 L44.3 55.7 L50 50 Z" opacity="0.7" />
            <path d="M34.5 34.5 L44.3 44.3 L50 50 Z" opacity="0.7" />
        </g>
    </svg>
);