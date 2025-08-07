
import * as React from "react";
import { cn } from "@/lib/utils";

export const RecruitRankIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...props}>
        <path d="M12 2L4 5v6.09c0 4.95 3.58 9.75 8 10.91c4.42-1.16 8-6.04 8-10.91V5L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
    </svg>
);
