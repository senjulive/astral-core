import { InboxView } from '@/components/dashboard/inbox-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Inbox - AstralCore",
    description: "View your notifications, announcements, and active promotions.",
};

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <InboxView />
    </div>
  );
}
