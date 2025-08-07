
import * as React from "react";
import { cn } from "@/lib/utils";

export const GoldRankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="gold-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
        </defs>
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" fill="url(#gold-gradient)" />
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 15.5l-2.47 1.29.47-2.75-2-1.94 2.76-.4L12 9l1.24 2.7 2.76.4-2 1.94.47 2.75L12 15.5z" fill="white"/>
        <path d="M2.5 10.5S4 9 5.5 9s2.5 1.5 2.5 1.5M21.5 10.5S20 9 18.5 9s-2.5 1.5-2.5 1.5" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
);
