import { TradingInfoView } from '@/components/dashboard/trading-info-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Trading Tiers & Ranks - AstralCore",
    description: "Learn about the trading tiers and account ranks on the AstralCore platform.",
};

export default function TradingInfoPage() {
  return (
    <TradingInfoView />
  );
}
