
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, MessageCircle } from "lucide-react";
import { SupportChatManager } from "./support-chat-manager";
import { PublicChatManager } from "./public-chat-manager";

export function MessageViewer() {
  return (
    <Tabs defaultValue="support">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="support">
          <MessageSquare className="mr-2 h-4 w-4" />
          Support Chat
        </TabsTrigger>
        <TabsTrigger value="public">
          <MessageCircle className="mr-2 h-4 w-4" />
          Public Chat
        </TabsTrigger>
      </TabsList>
      <TabsContent value="support" className="mt-4">
        <SupportChatManager />
      </TabsContent>
      <TabsContent value="public" className="mt-4">
        <PublicChatManager />
      </TabsContent>
    </Tabs>
  );
}
