import { SquadView } from '@/components/dashboard/squad-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Squad - AstralCore",
    description: "Manage your squad and team performance in AstralCore.",
};

export default function SquadPage() {
  return <SquadView />;
}
