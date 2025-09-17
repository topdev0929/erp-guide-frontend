"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Conversation {
  id: number;
  created_at: string;
  created_at_formatted: string;
  first_message: string;
  title: string | null;
}

// Component for skeleton loader
const ConversationSkeleton = () => (
  <div className="p-4 border-b">
    <Skeleton className="h-4 w-32 mb-2" />
    <div className="flex">
      <Skeleton className="h-4 w-24 mr-2" />
      <Skeleton className="h-4 flex-1" />
    </div>
    <Skeleton className="h-4 w-3/4 mt-1" />
  </div>
);

export default function ConversationsTab({
  userTimezone,
}: {
  userTimezone: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    apiCall("/chat/", ApiMethod.Get, "fetch conversations", {
      timezone: userTimezone,
    })
      .then((data) => {
        if (data) {
          setConversations(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
        setIsLoading(false);
      });
  }, [userTimezone]);

  return (
    <>
      {isLoading ? (
        // Show skeleton loaders while loading
        <>
          <ConversationSkeleton />
          <ConversationSkeleton />
          <ConversationSkeleton />
        </>
      ) : conversations.length > 0 ? (
        // Show actual conversations if available
        <div className="divide-y">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="relative border-b">
              <Link
                href={`/me/conversations/${conversation.id}`}
                className="flex flex-col p-4 hover:bg-muted/50"
              >
                <p className={conversation.title ? "text-black mb-1" : "text-muted-foreground italic mb-1"}>
                  {conversation.title || "Untitled conversation"}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  <span className="text-sm text-muted-foreground mr-2">
                    {format(new Date(conversation.created_at), "MMM d, yyyy")}
                  </span>
                  {conversation.first_message}
                </p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        // Show empty state if no conversations
        <div className="p-8 text-center text-muted-foreground">
          <p>Start a new conversation to see it here</p>
        </div>
      )}
    </>
  );
}
