import { AchievementsView } from '@/components/dashboard/achievements-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Achievements & Milestones - AstralCore",
    description: "Track your progress and unlock badges in the AstralCore hyperdrive system.",
};

export default function AchievementsPage() {
  return (
    <AchievementsView />
  );
}
