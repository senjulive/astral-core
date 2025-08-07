
import * as React from "react";
import { cn } from "@/lib/utils";

export const TelegramIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={cn("h-8 w-8", className)}
        {...props}
    >
        <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm4.65 6.54c.29-.29.83.17.65.51l-2.43 11.23c-.15.7-.84.93-1.42.54l-3.32-2.45-1.59 1.53c-.18.18-.42.22-.64.06l.2-3.41 6.33-5.74c.28-.25-.06-.63-.42-.39l-7.75 4.98-3.3.97c-.7.2-1.28-.27-.98-.91l1.89-6.31c.21-.66.86-1.16 1.58-.93l7.4 2.51z" />
    </svg>
);
