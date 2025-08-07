import * as React from "react";
import { cn } from "@/lib/utils";

export const BtcLogoIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-5 w-5", className)}
        {...props}
    >
        <circle cx="20" cy="20" r="18" fill="#F7931A" stroke="none" />
        <path
            fill="white"
            transform="translate(4, 3) scale(0.8)"
            d="M25.46,29.33H20.72V24.5h4.24c2.5,0,3.82-1.2,3.82-3.11,0-2-1.32-3.15-3.82-3.15H20.72V13.3h5.08c2.58,0,3.95-1.24,3.95-3.15S28.08,7,25.46,7H14.54V33H25.8c2.8,0,4.24-1.32,4.24-3.33S28.28,29.33,25.46,29.33Zm-4.74-13.9h4.15c1.6,0,2.37.75,2.37,2s-.77,2-2.37,2H20.72Z M20.72,27.2V22.37h4.55c1.6,0,2.42.8,2.42,2.2s-.83,2.2-2.42,2.2Z"
        />
    </svg>
);
