import { AboutView } from '@/components/dashboard/about-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About AstralCore - Grid Trading",
    description: "Learn about AstralCore and the principles of automated grid trading.",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <AboutView />
    </div>
  );
}
