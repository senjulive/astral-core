import * as React from "react";
import { cn } from "@/lib/utils";

export const UsdtLogoIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg" 
        className={cn("h-5 w-5", className)}
        {...props}
    >
        <circle cx="20" cy="20" r="18" fill="#26A17B" stroke="none" />
        {/* T shape */}
        <path d="M15,12 h10 v4 h-3 v10 h-4 v-10 h-3 z" fill="white" />
        {/* Ring */}
        <ellipse cx="20" cy="21" rx="9" ry="3.5" stroke="white" strokeWidth="2" fill="none" />
    </svg>
);
