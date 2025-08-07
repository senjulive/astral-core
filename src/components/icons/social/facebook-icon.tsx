
import * as React from "react";
import { cn } from "@/lib/utils";

export const FacebookIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className={cn("h-8 w-8", className)}
        {...props}
    >
        <path d="M12 2.04c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm2.25 10.5h-1.5v4.5h-3v-4.5h-1.5v-2.25h1.5v-1.5c0-1.2.7-2.25 2.25-2.25h1.5v2.25h-.94c-.42 0-.56.2-.56.59v1.16h1.5l-.25 2.25z" />
    </svg>
);
