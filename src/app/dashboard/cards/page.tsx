import { WalletCardsView } from "@/components/dashboard/wallet-cards-view";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore Cards - AstralCore",
    description: "Manage your AstralCore virtual credit cards and wallet history.",
};

export default function WalletCardsPage() {
    return (
        <WalletCardsView />
    );
}
