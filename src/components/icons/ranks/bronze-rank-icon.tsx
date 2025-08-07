
import * as React from "react";
import { cn } from "@/lib/utils";

export const BronzeRankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <defs>
            <linearGradient id="bronze-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
        </defs>
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" fill="url(#bronze-gradient)" />
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" stroke="#a15c07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
