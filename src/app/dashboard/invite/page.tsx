import { InviteView } from '@/components/dashboard/invite-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Invite - AstralCore",
    description: "Invite new members to your squad and earn rewards.",
};

export default function InvitePage() {
  return (
    <div className="space-y-6">
      <InviteView />
    </div>
  );
}
