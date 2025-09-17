"use client";

import { ChatUI } from "@/app/chat/chat-ui";

export default function ChatPage({
  params,
}: {
  params: { lessonType: string };
}) {
  const { lessonType } = params;

  return (
    <div className="min-h-[100dvh] bg-[#1e543b] relative flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatUI lessonType={lessonType} />
      </div>
    </div>
  );
}
