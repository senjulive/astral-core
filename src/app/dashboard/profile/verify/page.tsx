import { VerifyIdentityView } from "@/components/dashboard/verify-identity-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "KYC / UPDATE - AstralCore",
    description: "Complete your KYC verification and update your profile information.",
};

export default function VerifyPage() {
    return (
        <VerifyIdentityView />
    );
}
