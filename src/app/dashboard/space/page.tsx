import { SpaceView } from '@/components/dashboard/space-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "AstralCore Space - Community & Blog",
    description: "Connect with the AstralCore community, share posts, and engage in discussions.",
};

export default function SpacePage() {
  return (
    <SpaceView />
  );
}
