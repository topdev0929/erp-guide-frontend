"use client";

import { ChatUI } from "@/app/chat/chat-ui";

export default function ChatPage() {
  return (
    <div className="min-h-[100dvh] bg-[#1e543b] relative flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatUI />
      </div>
    </div>
  );
}
