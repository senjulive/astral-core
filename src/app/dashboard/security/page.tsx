import { SecurityView } from "@/components/dashboard/security-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Security - AstralCore",
    description: "Manage your account security settings, including your withdrawal password.",
};

export default function SecurityPage() {
    return (
        <SecurityView />
    );
}
