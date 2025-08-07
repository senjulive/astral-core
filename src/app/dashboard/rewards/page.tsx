import { RewardsView } from '@/components/dashboard/rewards-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Rewards - AstralCore",
    description: "Claim rewards for your achievements and squad referrals.",
};

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <RewardsView />
    </div>
  );
}
