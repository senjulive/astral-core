import { PromotionsView } from '@/components/dashboard/promotions-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Promotions - AstralCore",
    description: "Check out the latest promotions and special offers.",
};

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <PromotionsView />
    </div>
  );
}
