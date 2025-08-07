import { SupportChat } from "@/components/dashboard/support-chat";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Support - AstralCore",
    description: "Contact customer support.",
};

export default function SupportPage() {
    return (
        <SupportChat />
    );
}
