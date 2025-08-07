import { MarketView } from '@/components/dashboard/market-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Global Markets - AstralCore",
    description: "Real-time data for Crypto, Stocks, Commodities, and Forex markets.",
};

export default function MarketPage() {
  return (
    <MarketView />
  );
}
