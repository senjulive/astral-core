
import * as React from "react";
import { cn } from "@/lib/utils";

export const SilverRankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="silver-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9CA3AF" />
                <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>
        </defs>
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" fill="url(#silver-gradient)" />
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 15.5l-2.47 1.29.47-2.75-2-1.94 2.76-.4L12 9l1.24 2.7 2.76.4-2 1.94.47 2.75L12 15.5z" fill="white"/>
    </svg>
);
