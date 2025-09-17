import React, { useEffect, useState, useRef } from "react";
import { Send, Home, CheckCircle, Loader2, Menu, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { streamMessage } from "./stream";
import { MarkdownRenderer } from "./markdown-renderer";
import { connectWebSocket, disconnectWebSocket } from "./websocket";
import { Button } from "@/components/ui/button";
import TimerBubble from "./_components/timer-bubble";
import { tools } from "./_tools";
import { useAppEvent } from "@/hooks/useAppEvent";
import { createMetaModuleUrl } from "../meta/chat-utils";
import { FeedbackRating } from "@/components/ui/feedback-rating";
import { sendUsEmailFeedback } from "../api/send-email/email-utils";

const LoadingDots = () => {
  return (
    <div className="flex space-x-2 p-2">
      <div className="w-2 h-2 rounded-full bg-white/20 animate-[pulse_1.25s_ease-in-out_infinite] [animation-delay:0ms] hover:bg-white/90" />
      <div className="w-2 h-2 rounded-full bg-white/20 animate-[pulse_1.25s_ease-in-out_infinite] [animation-delay:300ms] hover:bg-white/90" />
      <div className="w-2 h-2 rounded-full bg-white/20 animate-[pulse_1.25s_ease-in-out_infinite] [animation-delay:600ms] hover:bg-white/90" />
    </div>
  );
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

export interface ChatUIProps {
  lessonType?: string;
}

export const ChatUI: React.FC<ChatUIProps> = ({ lessonType }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get("returnPath");
  const exposureId = searchParams.get("exposureId");
  const chatId = useRef<number>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [showLessonCompleted, setShowLessonCompleted] = useState(false);
  const [bubbleLessons, setBubbleLessons] = useState<string[]>([]);
  const [showBubbleLessons, setShowBubbleLessons] = useState(false);
  const [dynamicLessonType, setDynamicLessonType] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(null);
  const [warning, setWarning] = useState("");

  const appendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
  };

  useEffect(() => {
    // Detect if user is on a mobile device
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchActiveChatId = async () => {
    try {
      const response = await apiCall(
        lessonType ? `/lessons/active/${lessonType}/` : "/chat/active/",
        ApiMethod.Get,
        "Fetching active chat"
      );

      chatId.current = response?.id;
      if (
        response?.user_lesson?.static_or_dynamic === "dynamic" &&
        !response?.user_lesson?.completed
      ) {
        setDynamicLessonType(response?.user_lesson?.lesson);
      }
    } catch (err) {
      console.error("Error fetching active chat ID", err);
      // throw new Error("Error fetching active chat ID");
    }
  };

  const fetchAvailableActions = async () => {
    // Only fetch available lessons if we're not in a specific lesson type
    if (lessonType || (dynamicLessonType && !isLessonCompleted)) return;

    try {
      const response = await apiCall(
        "/lessons/available/",
        ApiMethod.Get,
        "Fetching available actions"
      );

      if (response.available_actions) {
        setBubbleLessons(response.available_actions);
      }
    } catch (err) {
      console.error("Error fetching available actions", err);
    }
  };

  const fetchSuggestedActions = async () => {
    // Only fetch suggested actions if we're not in a specific lesson type
    if (lessonType || (dynamicLessonType && !isLessonCompleted)) return;
    try {
      const response = await apiCall(
        "/lessons/suggested/",
        ApiMethod.Get,
        "Fetching suggested actions"
      );
      return response.suggested_actions;
    } catch (err) {
      console.error("Error fetching suggested actions", err);
    }
  };

  const stopTimer = async () => {
    try {
      await apiCall("/tools/timer/", ApiMethod.Delete, "Stopping active chat");
    } catch (err) {
      console.error("Error stopping timer", err);
    }
  };

  const createNewChatSession = async () => {
    try {
      const response = await apiCall(
        lessonType ? `/lessons/` : "/chat/",
        ApiMethod.Post,
        "Initializing chat session",
        { lesson_type: lessonType, exposure_id: exposureId }
      );
      chatId.current = response.id;

      if (response.initial_message) {
        setMessages([{ role: "assistant", content: response.initial_message }]);
      }
    } catch (err) {
      console.error("Error creating new chat session", err);
    }
  };

  const fetchMessages = async () => {
    if (!chatId.current) {
      console.error("Chat ID is not set");
      return;
    }

    try {
      const response = await apiCall(
        `/chat/${chatId.current}/messages/`,
        ApiMethod.Get,
        "Fetching messages"
      );

      setMessages(response);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const checkLessonCompletion = async () => {
    if (!chatId.current || !lessonType) return;

    try {
      const response = await apiCall(
        `/lessons/check-completion/${chatId.current}/`,
        ApiMethod.Get,
        "Checking lesson completion status"
      );

      const wasCompleted = isLessonCompleted;
      const isNowCompleted = response.completed || false;

      setIsLessonCompleted(isNowCompleted);

      // Show popup if lesson just became completed (not already completed)
      if (!wasCompleted && isNowCompleted) {
        setShowLessonCompleted(true);
        setTimeout(() => setShowLessonCompleted(false), 2000);
      }
    } catch (err) {
      console.error("Error checking lesson completion", err);
      // If there's an error, assume not completed to show the button
      setIsLessonCompleted(false);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      await fetchActiveChatId();

      if (!chatId.current || lessonType === "erp") {
        await createNewChatSession();
      }

      await fetchMessages();
      //Fetch suggested lessons for display
      await fetchSuggestedActions().then((data) => {
        if (data?.length > 0) {
          setBubbleLessons(data);
        } else {
          // Fetch available actions for display
          fetchAvailableActions();
        }
      });

      // Check completion status after initializing chat
      if (lessonType) {
        await checkLessonCompletion();
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: currentResponse ? "auto" : "smooth",
    });
  }, [messages, currentResponse]);

  useEffect(() => {
    if (showBubbleLessons && bubbleLessons.length > 0) {
      // Use a small delay to ensure the DOM has updated with the lesson bubbles
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [showBubbleLessons, bubbleLessons]);

  useEffect(() => {
    connectWebSocket(appendMessage);
    return () => {
      disconnectWebSocket();
    };
  }, []);

  // Auto-focus textarea on desktop after response completes
  useEffect(() => {
    if (!isResponding && !isMobile && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isResponding, isMobile]);

  // Add event listener for websocket-driven lessons
  useAppEvent<{ actions: string[] }>("actions:available", (event) => {
    const actions = event.detail?.actions || [];
    setBubbleLessons(actions);
    setShowBubbleLessons(true);
  });

  useAppEvent("lesson:completed", () => {
    handleComplete();
  });

  useAppEvent("lesson:started", (event) => {
    const lesson = event.detail?.lesson || "";
    setIsLessonCompleted(false);
    setDynamicLessonType(lesson);
  });

  useAppEvent("actions:suggested", (event) => {
    const actions = event.detail?.actions || [];
    setBubbleLessons(actions);
    setShowBubbleLessons(true);
  });

  useAppEvent("actions:missed", (event) => {
    const actions = event.detail?.actions || [];
    setBubbleLessons(actions);
    setShowBubbleLessons(true);
  });

  useAppEvent("lesson:feedback", () => {
    setShowFeedback(true);
  });

  const handleNewChat = async () => {
    setIsLoading(true);
    await stopTimer();
    await createNewChatSession();
    await fetchMessages();
    setIsLoading(false);
    // Reset lesson completion status when restarting
    if (lessonType) {
      setIsLessonCompleted(false);
    }
    if (dynamicLessonType) {
      setIsLessonCompleted(true);
    }

    tools.timer.stopTimer();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isResponding) return;

    const userMessage = input.trim();
    setInput("");
    // Reset textarea height after submit
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsResponding(true);
    setCurrentResponse("");

    setShowBubbleLessons(false);

    if (chatId.current) {
      let response = "";
      try {
        await streamMessage(chatId.current.toString(), userMessage, (text) => {
          response = text;
          setCurrentResponse(text);
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response },
        ]);
        setCurrentResponse("");

        // Check lesson completion status after each message interaction
        if (lessonType) {
          await checkLessonCompletion();
        }
      } catch (error) {
        console.error("Error calling streamMessage:", error);
      } finally {
        setIsResponding(false);
      }
    }
  };

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
    if (!rating) {
      setWarning("Please select a rating");
      return;
    }
    setFeedbackLoading(true);
    try {
      console.log("Submitting feedback:", rating);
      await sendUsEmailFeedback(rating, chatId.current, comment);
      setFeedbackSubmitted(true);
      setShowFeedback(false);
      setTimeout(() => {
        setFeedbackSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting feedback", err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleLeave = () => {
    router.push(returnPath || "/learn");
  };

  const handleComplete = async () => {
    if (!chatId.current) return;

    try {
      await apiCall(
        "/lessons/complete/",
        ApiMethod.Post,
        "Marking lesson as complete",
        { chat_id: chatId.current }
      );

      // Update the completion status after successful completion
      setIsLessonCompleted(true);

      // Show lesson completed popup
      setShowLessonCompleted(true);
      setTimeout(() => setShowLessonCompleted(false), 1500);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Exited Lesson" },
      ]);

      if (returnPath) {
        setTimeout(() => {
          router.push(returnPath);
        }, 2000);
      } else {
        console.log("dynamic lesson not re-routing");
      }
    } catch (err) {
      console.error("Error marking lesson as complete", err);
    }
  };

  const handleLessonSelect = async (lessonName: string) => {
    if (lessonName === "PLAN") {
      router.push("/plans/initial-questions");
      return;
    } else if (lessonName === "YBOCS") {
      router.push("/assessments/ybocs");
      return;
    } else if (lessonName === "GAD7") {
      router.push("/assessments/gad7");
      return;
    } else if (lessonName === "HIERARCHY") {
      router.push("/me?ocd_tab=exposures");
      return;
    } else {
      console.log(`The '${lessonName}' lesson has started`);
      setShowBubbleLessons(false);
      setIsResponding(true);
      setCurrentResponse("");

      try {
        const response = await apiCall(
          `/lessons/dynamic-lesson/`,
          ApiMethod.Post,
          "Starting dynamic lesson",
          { chat_id: chatId.current, lesson: lessonName }
        );

        setIsLessonCompleted(false);
        setDynamicLessonType(response.dynamic_lesson);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.initial_message },
        ]);
      } catch (err) {
        console.error("Error starting dynamic lesson", err);
      } finally {
        setIsResponding(false);
      }
    }
  };

  const LessonBubbles = ({ lessons }: { lessons: string[] }) => {
    if (lessons.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {lessons.map((lesson, index) => (
          <button
            key={index}
            onClick={() => handleLessonSelect(lesson)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors duration-200 capitalize text-sm border border-white/20 hover:border-white/40"
          >
            {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  const MobileMenu = () => {
    return (
      <>
        {/* Hamburger button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden px-2 py-2.5 bg-white/10 hover:bg-white/20 text-[#1e543b] rounded-lg transition-colors flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </button>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-12 right-2 bg-white rounded-lg shadow-lg z-50 min-w-[210px] py-2">
            {lessonType && !isLessonCompleted && (
              <button
                onClick={() => {
                  handleComplete();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[#1e543b] hover:bg-gray-100 transition-colors"
              >
                Mark as Complete
              </button>
            )}

            {dynamicLessonType && !isLessonCompleted && (
              <button
                onClick={() => {
                  handleComplete();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[#1e543b] hover:bg-gray-100 transition-colors"
              >
                Mark Lesson Complete
              </button>
            )}

            <button
              onClick={() => {
                handleNewChat();
                setIsMobileMenuOpen(false);
              }}
              disabled={isLoading}
              className="w-full text-left px-4 py-2 text-[#1e543b] hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : lessonType ? (
                `Restart ${lessonType}`
              ) : (
                "New chat"
              )}
            </button>

            <button
              onClick={() => {
                handleLeave();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-[#1e543b] hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Exit
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#1e543b] relative">
      {/* Lesson Completed notification */}
      {showLessonCompleted && (
        <div className="fixed top-20 right-4 bg-[#349934] text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <CheckCircle className="h-5 w-5 mr-2" />
          Lesson Completed
        </div>
      )}
      {/* Desktop buttons - HIDDEN ON MOBILE */}
      <div className="absolute top-2 right-2 z-50 hidden lg:flex items-center gap-4">
        {(!lessonType || lessonType === "erp") && <TimerBubble />}

        {lessonType && !isLessonCompleted && (
          <Button
            variant="secondary"
            onClick={handleComplete}
            className="capitalize bg-white/80 hover:bg-white/90"
          >
            Mark as Complete
          </Button>
        )}

        {dynamicLessonType && !isLessonCompleted && (
          <Button
            variant="secondary"
            onClick={handleComplete}
            className="capitalize bg-white/80 hover:bg-white/90"
          >
            Mark Lesson Complete
          </Button>
        )}

        <Button
          variant="secondary"
          onClick={handleNewChat}
          disabled={isLoading}
          className="capitalize bg-white/80 hover:bg-white/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : lessonType ? (
            `Restart ${lessonType}`
          ) : (
            "New chat"
          )}
        </Button>

        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-white text-[#1e543b] rounded-lg hover:bg-white/90 transition-colors font-medium flex items-center gap-2"
          aria-label="Leave session"
        >
          <Home className="h-4 w-4" />
          Exit
        </button>
      </div>

      {/* Mobile TimerBubble - Always visible */}
      <div
        className="absolute top-2 right-2 z-50 lg:hidden"
        style={{ right: "calc(2rem + 30px)" }}
      >
        {(!lessonType || lessonType === "erp") && <TimerBubble />}
      </div>

      {/* Mobile hamburger menu - HIDDEN ON DESKTOP */}
      <div className="absolute top-2 right-4 z-50 lg:hidden">
        <MobileMenu />
      </div>
      {/* Profile circle with logo */}
      <div className="absolute top-2 left-4 z-50">
        <button
          onClick={handleLeave}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Go to insights"
        >
          <img
            src="/icons/icon-logo.svg"
            alt="Assistant Profile"
            className="w-10 h-10 [filter:brightness(0)_saturate(100%)_invert(1)] opacity-80"
          />
        </button>
      </div>

      {/* Messages container */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 mt-14 mb-4">
          {messages.map((message, index) => {
            const isLastAssistantMessage =
              message.role === "assistant" && index === messages.length - 1;

            return (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-[#e0f2e0] text-[#1e543b]"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <>
                      <MarkdownRenderer content={message.content} />
                      {/* Show available lessons after most recent assistant message */}
                      {((isLastAssistantMessage && showBubbleLessons) ||
                        messages.length === 1) &&
                        bubbleLessons.length > 0 && (
                          <LessonBubbles lessons={bubbleLessons} />
                        )}
                    </>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            );
          })}

          {!feedbackSubmitted && showFeedback && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white/10 text-white">
                <div className="text-sm mb-3">
                  How was your experience with this session? Your feedback helps
                  us improve.
                </div>
                {feedbackLoading ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <>
                    <FeedbackRating
                      onSubmit={(rating) => {
                        if (rating) {
                          setRating(rating);
                          setWarning("");
                        }
                      }}
                      className="mb-2"
                    />
                    {warning && (
                      <div className="text-accent text-sm mb-2 text-center">
                        {warning}
                      </div>
                    )}
                    <textarea
                      className="w-full p-2 rounded-md bg-white/20 text-white text-sm mb-2"
                      placeholder="Optional comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      onClick={() => handleFeedbackSubmit(rating, comment)}
                      className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-md block mx-auto transition-colors duration-200"
                    >
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {feedbackSubmitted && (
            <div className="fixed top-20 right-4 bg-[#349934] text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-top-5 duration-300">
              <CheckCircle className="h-5 w-5 mr-2" />
              Feedback submitted
            </div>
          )}
          {isResponding && currentResponse && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white/10 text-white">
                <MarkdownRenderer content={currentResponse} />
              </div>
            </div>
          )}
          {isResponding && !currentResponse && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-white/10 text-white">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input container */}
      <div className="p-4 bg-[#1e543b] border-t border-white/10">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // Auto-resize logic
              const ta = e.target as HTMLTextAreaElement;
              ta.style.height = "auto";
              ta.style.height = ta.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (isMobile) {
                  // On mobile, Enter always creates a new line
                  return;
                } else {
                  // On desktop, Enter submits unless Shift is held
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                  // With Shift key pressed, default behavior (new line) occurs
                }
              }
            }}
            placeholder="Type your message..."
            className="w-full min-h-[48px] max-h-40 py-3 px-4 bg-white/90 text-[#1e543b] rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/50 resize-none overflow-auto pr-10"
            disabled={isResponding}
            rows={1}
            style={{ lineHeight: "1.5", transition: "height 0.2s" }}
          />
          <button
            type="submit"
            disabled={isResponding || !input.trim()}
            className="ml-2 text-[#1e543b] hover:text-[#1e543b]/80 disabled:opacity-50 bg-white/80 rounded-full flex items-center justify-center"
            style={{ height: "48px", width: "48px" }}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
