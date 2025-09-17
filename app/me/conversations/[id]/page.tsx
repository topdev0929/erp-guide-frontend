"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

interface Chat {
  id: number;
  created_at: string;
  start_time: string;
  end_time: string | null;
  title: string | null;
}


export default function ConversationTranscriptPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState<string>("");

  const fetchMessages = async () => {
    try {
      const messages = await apiCall(
        `/chat/${params.id}/messages/`,
        ApiMethod.Get,
        "fetch conversation",
      )
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  const fetchChatInfo = async () => {
    try {
      const chatInfo = await apiCall(
        `/chat/${params.id}/`,
        ApiMethod.Get,
        "fetch conversation info",
      )
      setChatInfo(chatInfo);
    } catch (error) {
      console.error("Error fetching chat info:", error);
    }
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        await Promise.all([fetchMessages(), fetchChatInfo()]);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setIsLoading(false)
      }
    })()
  }, [params.id]);

  useEffect(() => {
    if (chatInfo?.title) {
      setTitle(chatInfo.title);
    }
  }, [chatInfo?.title]);

  const updateTitle = async (newTitle: string) => {
    try {
      const response = await apiCall(
        `/chat/${params.id}/title/`,
        ApiMethod.Patch,
        "update conversation title",
        {
          title: newTitle,
        }
      );
      if (response) {
        setChatInfo(response)
      }
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleTitleSubmit = () => {
    updateTitle(title);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSubmit();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setTitle(chatInfo?.title || "");
    }
  };

  // Handle back button click - navigate to the conversation tab
  const handleBackClick = () => {
    // Navigate back to the Me page with conversations tab active
    router.push("/me?tab=conversations");
  };

  if (!chatInfo) return null;

  return (
    <div className="min-h-screen bg-[#1e543b] p-4">
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-start">
          <button
            onClick={handleBackClick}
            className="text-white hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-white text-xl border-b border-white/20 focus:border-white/40 outline-none px-1 py-0.5 w-full"
                  placeholder="Edit title"
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-left"
                  >
                    <span
                      className={`text-xl ${!chatInfo?.title
                        ? "text-white/60 italic"
                        : "text-white"
                        }`}
                    >
                      {chatInfo?.title || "Untitled conversation"}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="text-white/60 hover:text-white/80 transition-colors text-sm ml-2"
                  >
                    Edit title
                  </button>
                </div>
              )}
            </div>
            <div className="mt-1">
              <span className="text-sm text-white/60">
                {format(
                  new Date(chatInfo.created_at),
                  "MMM d, yyyy"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`p-4 rounded-2xl max-w-[80%] ${message.role === "user"
                ? "bg-[#349934] text-white"
                : "bg-[#2a6246] text-white"
                }`}
            >
              <p className="text-base leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
