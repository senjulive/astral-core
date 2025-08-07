import { PublicChatView } from '@/components/dashboard/public-chat-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Public Chat - AstralCore",
    description: "Engage with the AstralCore community in the public chat.",
};

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <PublicChatView />
    </div>
  );
}
