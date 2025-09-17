/* DO NOT DELETE THESE COMMENTS:

This file starts the meta session
Passes in the TOOL function call handler (I feel like perhaps this could be refactored into the chat component directly)

*/
"use client";

import React, { useState, useEffect } from "react";
import { metaFunctionCallHandler } from "@/app/meta/chat-utils";
import MetaChat from "@/app/meta/chat";
import { ChatSkeleton } from "@/app/meta/chat-ui";

const SESSION_TIMEOUT_MS = 2000; // 2 seconds timeout for initial loading

const MetaPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simple loading state with timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, SESSION_TIMEOUT_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#1e543b] relative flex flex-col">
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <ChatSkeleton />
        ) : (
          <MetaChat
            functionCallHandler={(call) => {
              // We can't access sessionId here, so we'll need to modify MetaChat
              // to handle this internally
              return metaFunctionCallHandler(call, "");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MetaPage;
