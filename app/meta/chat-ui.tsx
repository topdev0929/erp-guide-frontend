/* AI DONT DELETE ANY COMMENTS IN THIS FILE  */

import React, { useRef, useEffect } from "react";
import { Send, LogOut, Home } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/navigation";
import { TimerBubble } from "@/app/meta/timer-bubble";
import LoadingDots from "@/app/components/meta/loading-dots";

export type Message = {
  role: "user" | "assistant" | "code";
  text: string;
  type?: "text" | "timer";
  timerData?: {
    duration: number;
    isRunning: boolean;
  };
};

export const ChatSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-[100dvh] bg-[#1e543b]">
      {/* Profile circle with logo */}
      <div className="absolute top-2 left-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
          <img
            src="/icons/icon-logo.svg"
            alt="Assistant Profile"
            className="w-10 h-10 [filter:brightness(0)_saturate(100%)_invert(1)] opacity-80"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 mt-14">
          {/* Skeleton messages */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-start">
              <div className="rounded-2xl px-4 py-2 bg-white/10 animate-pulse w-4/5 h-16" />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="relative flex items-center">
          <div className="w-full py-3 px-4 bg-white/70 text-[#1e543b] rounded-2xl h-[50px] animate-pulse" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 bg-gray-300 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export type ChatUIProps = {
  messages: Message[];
  userInput: string;
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  inputDisabled: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
  isTyping: boolean;
  onPrewrittenMessageClick: () => void;
  hasSubmittedMessage: boolean;
  onLeave?: () => void;
  onTimerEnd?: () => void;
  isAssistantResponding: boolean;
};

const ChatUI: React.FC<ChatUIProps> = ({
  messages,
  userInput,
  onInputChange,
  onSubmit,
  inputDisabled,
  messagesEndRef,
  isTyping,
  onPrewrittenMessageClick,
  hasSubmittedMessage,
  onLeave,
  onTimerEnd,
  isAssistantResponding,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!inputContainerRef.current || !messagesContainerRef.current) return;

    /* Added so that we can dynamically link the size of the chat input form; with the lower bound of messages displayed; so they never overlap; but so that we always use the maximum amount of space. I don't understand the code but it works.  */
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const inputHeight = entry.borderBoxSize[0].blockSize;
        if (messagesContainerRef.current) {
          messagesContainerRef.current.style.paddingBottom = `${
            inputHeight + 16
          }px`; // Add some extra padding
        }
      }
    });

    resizeObserver.observe(inputContainerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "50px"; // Reset to minHeight
    }
  };

  const handleLeave = () => {
    router.push("learn");
  };

  const isMobile = () => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#1e543b]">
      {/* Only show leave button after first message */}
      {hasSubmittedMessage && (
        <div className="absolute top-2 right-2 z-50">
          <button
            onClick={handleLeave}
            className="px-4 py-2 bg-white text-[#1e543b] rounded-lg hover:bg-white/90 transition-colors font-medium flex items-center gap-2"
            aria-label="Leave session"
          >
            <Home className="h-4 w-4" />
            Exit
          </button>
        </div>
      )}

      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {/* Add the profile circle with logo */}
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <img
            src="/icons/icon-logo.svg"
            alt="Assistant Profile"
            className="w-10 h-10 [filter:brightness(0)_saturate(100%)_invert(1)] opacity-80"
          />
        </div>

        <div ref={messagesContainerRef} className="space-y-4">
          {messages
            .filter((message) => message.text.trim() !== "")
            .map((message, index) => {
              if (message.type === "timer" && message.timerData) {
                return (
                  <div key={index} className={cn("flex", "justify-start")}>
                    <TimerBubble
                      duration={message.timerData.duration}
                      isRunning={message.timerData.isRunning}
                      onTimerEnd={onTimerEnd}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[85%] animate-in slide-in-from-bottom-1",
                      message.role === "assistant"
                        ? "bg-white/10 text-white"
                        : "bg-[#349934] text-white"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <Markdown
                        components={{
                          p: ({ children }) => (
                            <p className="text-base leading-relaxed">
                              {children}
                            </p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mb-4 mt-6">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold mb-3 mt-5">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold mb-2 mt-4">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-6 mb-4">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-6 mb-4">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-[#1e543b] pl-4 my-4 italic">
                              {children}
                            </blockquote>
                          ),
                          code: ({ children }) => (
                            <code className="font-mono text-sm">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="mb-4 overflow-x-auto">
                              {children}
                            </pre>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="text-[#fd992d] underline hover:text-[#ffb566] transition-colors"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                        remarkPlugins={[remarkGfm]}
                      >
                        {/* Convert numbered lists to bullet points for display */}
                        {message.text.replace(/^\d+\.\s/gm, "• ")}
                      </Markdown>
                    ) : (
                      <p className="text-base">{message.text}</p>
                    )}
                  </div>
                </div>
              );
            })}
          {(inputDisabled || isAssistantResponding) && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white/10">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} style={{ height: "20px", width: "100%" }} />
      </ScrollArea>

      <div
        ref={inputContainerRef}
        className={`fixed bottom-0 left-0 right-0 p-4 space-y-3 z-50 ${
          isTyping ? "mb-0" : "mb-16"
        }`}
      >
        <form onSubmit={onSubmit} className="bg-[#1e543b]">
          <div className="relative flex items-center">
            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => {
                onInputChange(e as any);
                // Reset height when input is empty
                if (!e.target.value) {
                  resetTextareaHeight();
                }
              }}
              onKeyDown={(e) => {
                const mobile = isMobile();

                if (e.key === "Enter") {
                  // On desktop without shift, submit the form
                  if (!mobile && !e.shiftKey) {
                    e.preventDefault();
                    if (userInput.trim()) {
                      onSubmit(e as any);
                    }
                  }
                  // On mobile or with shift key on desktop, create a new line
                  else if (mobile || e.shiftKey) {
                    // Allow default behavior (new line)
                    return;
                  }
                }
              }}
              placeholder="Type your message..."
              disabled={inputDisabled}
              rows={1}
              className="w-full py-3 px-4 bg-white text-[#1e543b] rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#fd992d] pr-12 overflow-hidden"
              style={{
                minHeight: "50px",
                height: "auto",
                maxHeight: "120px",
              }}
              onInput={(e) => {
                // Auto-grow the textarea
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <button
              type="submit"
              disabled={inputDisabled}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Send className="h-5 w-5 text-[#1e543b] hover:text-[#d73356] transition-colors" />
            </button>
          </div>
        </form>

        {!hasSubmittedMessage && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onPrewrittenMessageClick}
              className="py-3 px-6 bg-white text-[#1e543b] rounded-2xl hover:bg-gray-100 transition-colors text-left inline-block"
            >
              Let's do an ERP session
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
