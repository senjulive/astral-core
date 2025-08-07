import * as React from "react";
import { cn } from "@/lib/utils";

export const EthLogoIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-5 w-5", className)}
        {...props}
    >
        <circle cx="20" cy="20" r="18" fill="#627EEA" stroke="none" />
        <path d="M20 5 L12 20 L20 27 L28 20 Z" fill="white" opacity="0.7"/>
        <path d="M20 29 L12 22 L20 27 L28 22 Z" fill="white"/>
    </svg>
);
