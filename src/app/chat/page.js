"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Ensure these components are available via shadcn/ui
import LocalChatRoom from "@/components/LocalChatRoom";
import AssistantChat from "@/components/AssistantChat";

export default function ChatPage() {
  return (
    <div className="container relative bottom-0 mx-auto pt-20 p-4 h-[calc(100vh-5rem)] flex flex-col">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">
        Chat & Communication
      </h1> */}
      <Tabs defaultValue="local" className="flex-1 flex flex-col">
        <TabsList className="flex justify-center mb-4">
          <TabsTrigger value="local" className="px-4 py-2">
            Community Chat
          </TabsTrigger>
          <TabsTrigger value="assistant" className="px-4 py-2">
            Disaster Assistant
          </TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="flex-1">
          <LocalChatRoom />
        </TabsContent>
        <TabsContent value="assistant" className="flex-1">
          <AssistantChat />
        </TabsContent>
      </Tabs>
    </div>
  );
}
