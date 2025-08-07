
import * as React from "react";
import { cn } from "@/lib/utils";

export const SilverTierIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="silver-tier-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
        </defs>
        <path d="M12 2.5L21.5 8.5L12 21.5L2.5 8.5L12 2.5Z" fill="url(#silver-tier-gradient)" />
        <path d="M12 2.5L21.5 8.5L12 21.5L2.5 8.5L12 2.5Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
