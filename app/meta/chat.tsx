/* DO NOT DELETE THESE COMMENTS 

Refactor - move more code over to the utils file. Will require testing. 
*/

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AssistantStream } from "openai/lib/AssistantStream";
// @ts-expect-error - no types for this yet
import { AssistantStreamEvent } from "openai/resources/beta/assistants/assistants";
import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { initialMessagesMeta } from "@/app/meta/assistant";
import ChatUI, { ChatSkeleton } from "@/app/meta/chat-ui";
import {
  retryWithExponentialBackoff,
  getRandomInitialMessage,
  metaFunctionCallHandler,
} from "@/app/meta/chat-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCall, apiStreamedCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { setupStreamListeners } from "@/app/meta/streaming";

type ChatProps = {
  functionCallHandler?: (
    toolCall: RequiredActionFunctionToolCall
  ) => Promise<string>;
  timerEnded?: boolean;
  resetTimerEnded?: () => void;
  onLeave?: () => void;
};

type Message = {
  role: "user" | "assistant";
  type: "text" | "timer";
  text: string;
  timerData?: {
    duration: number;
    isRunning: boolean;
  };
};

const MetaChat = ({
  functionCallHandler = () => Promise.resolve(""),
  timerEnded,
  resetTimerEnded,
  onLeave,
}: ChatProps) => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const hasCreatedThread = useRef(false);

  const [responseTimeout, setResponseTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = useCallback(() => {
    // Find the ScrollArea viewport in the DOM
    const scrollViewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );

    if (scrollViewport) {
      const scrollHeight = scrollViewport.scrollHeight;
      scrollViewport.scrollTop = scrollHeight;
    }

    // Also try the traditional approach as backup
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Add this near the top of the Chat component with other state/refs
  const currentAssistantMessage = useRef("");

  const [hasSubmittedMessage, setHasSubmittedMessage] = useState(false);

  const router = useRouter();

  // Add URL parameter handling
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message");

  // Store threadId in ref for immediate access
  const threadIdRef = useRef("");

  // Store sessionId in ref for immediate access, like threadId
  const sessionIdRef = useRef("");

  // Add this with other state declarations
  const [isAssistantResponding, setIsAssistantResponding] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Handler to call when the timer has ended.
  const handleTimerEnd = () => {
    console.log("Timer ended callback triggered");
    // Append a message to the conversation stating the timer has ended.
    appendMessage("assistant", "The timer has ended!");

    // Pass a message to the assistant, just like before, so it can check in with the user.
    sendMessage(
      "The timer has ended. Continue the conversation with the user."
    );
  };

  useEffect(() => {
    const createThread = async () => {
      if (hasCreatedThread.current) return;
      hasCreatedThread.current = true;

      const data = await apiCall(
        "/deprecate/openai_old/thread",
        ApiMethod.Post,
        "create thread"
      );
      console.log("Thread created with response:", data);

      const newThreadId = data.thread_id;
      setThreadId(newThreadId);

      // Save the session_id from the response
      const newSessionId = data.session_id;
      setSessionId(newSessionId);

      // Store IDs in refs for immediate access
      threadIdRef.current = newThreadId;
      sessionIdRef.current = newSessionId;

      let initialMessages = getRandomInitialMessage(initialMessagesMeta);
      setMessages(
        initialMessages.map((message) => ({
          role: "assistant",
          type: "text",
          text: message,
        }))
      );

      // Set loading to false after initial messages are set
      setIsLoading(false);

      // If we have an initial message from URL, automatically inject it
      if (initialMessage) {
        // Add user message to UI
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            type: "text",
            text: initialMessage,
          },
        ]);

        setHasSubmittedMessage(true);

        // Actually send message to assistant
        await sendMessage(initialMessage, newThreadId);

        // Add loading message after 2 seconds
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              type: "text",
              text: "Sounds good. Please wait a few seconds for me to pull up that lesson info.",
            },
          ]);
        }, 2000);
      }
    };

    createThread();
  }, [initialMessage]);

  const handleStreamResponse = (responseBody: ReadableStream) => {
    const stream = AssistantStream.fromReadableStream(responseBody);
    handleReadableStream(stream);
  };

  // If the global threadId state is set, it will be used, But if it
  // is undefined, then the currentThreadId will be used
  const sendMessage = async (text, currentThreadId = threadId, attempt = 1) => {
    if (!currentThreadId) {
      console.error("ERROR: Cannot send message: threadId is undefined.");
      return;
    }

    const currentSessionId = sessionIdRef.current || sessionId;

    console.log("Sending message with:", {
      thread_id: currentThreadId,
      message: text,
      role: "user",
      session_id: currentSessionId,
    });

    setIsAssistantResponding(true);

    try {
      await apiStreamedCall(
        "/deprecate/openai_old/message",
        ApiMethod.Post,
        "send message",
        {
          thread_id: currentThreadId,
          message: text,
          role: "user",
          session_id: currentSessionId,
        },
        handleStreamResponse
      );
    } catch (error) {
      console.error("Error in sendMessage:", error);
      setInputDisabled(false);
      setIsAssistantResponding(false);

      if (attempt < 3) {
        console.log(`Retrying sendMessage... Attempt ${attempt + 1}`);
        setTimeout(() => {
          sendMessage(text, currentThreadId, attempt + 1);
        }, 2000); // Retry after 2 seconds
      } else {
        alert(
          "We ran into an issue with this conversation, sorry about that! Please try again, or refresh the page if the issue persists.  You can also reach out to us at Support@TheMangoHealth.com and we'll fix the issue right away!"
        );
      }
    }
  };

  useEffect(() => {
    if (timerEnded) {
      const timerMessage = "The timer has ended!";
      appendMessage("assistant", timerMessage);
      resetTimerEnded?.();
      sendMessage(
        "The timer has ended. Continue the conversation with the user."
      );
    }
  }, [timerEnded, resetTimerEnded, sendMessage]);

  // TODO this required assistant type before
  const submitActionResult = async (runId, toolCallOutputs) => {
    try {
      await apiStreamedCall(
        "/deprecate/openai_old/tools",
        ApiMethod.Post,
        "submit action result",
        {
          thread_id: threadIdRef.current,
          run_id: runId,
          tool_outputs: toolCallOutputs,
        },
        handleStreamResponse
      );
      console.log("submitActionResult stream returned");
    } catch (error) {
      console.error("Error in submitActionResult:", error);
      setInputDisabled(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Reset the textarea height - this is because after you send a multiline message; the chat bubble gets bigger; and we need it to return to it's orginal size.
    const textarea = (e.target as HTMLFormElement).querySelector("textarea");
    if (textarea) {
      textarea.style.height = "50px";
    }

    // Set that user has submitted their first message
    if (!hasSubmittedMessage) {
      setHasSubmittedMessage(true);
    }

    // Add the user's message to the chat
    sendMessage(userInput);
    console.log("sendMessage called");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", type: "text", text: userInput },
    ]);
    setUserInput("");
    setInputDisabled(true);

    // Set a timeout to re-enable input if no response is received
    const timeout = setTimeout(() => {
      setInputDisabled(false);
    }, 10000); // 10 second timeout
    setResponseTimeout(timeout);

    console.log("handleSubmit completed");
  };

  /* Stream Event Handlers */

  // textCreated - create new assistant message
  const handleTextCreated = () => {
    console.log("handleTextCreated called");
    currentAssistantMessage.current = ""; // Reset the ref
    setIsAssistantResponding(true);
    appendMessage("assistant", "");
  };

  // textDelta - append text to last assistant message
  const handleTextDelta = (delta) => {
    if (delta.value != null) {
      const newText = delta.value;

      // Add debug logging to see what's coming in
      console.log("Received text chunk:", JSON.stringify(newText));

      // Check for numbered list patterns in the combined text
      const combinedText = currentAssistantMessage.current + newText;

      // Look for a pattern like "\n1. " or "\n2. " in the combined text
      const listItemRegex = /\n\s*(\d+\.\s|\*\s|-\s)/;
      const match = combinedText.match(listItemRegex);

      if (match && match.index !== undefined) {
        console.log(
          "Found list item at position:",
          match.index,
          "Match:",
          match[0]
        );

        // Get the text before the list item
        const textBeforeListItem = combinedText.substring(0, match.index);
        // Get the text including and after the list item
        const textFromListItem = combinedText.substring(match.index + 1); // +1 to remove the newline

        console.log("Splitting into two messages:");
        console.log("1. Before:", textBeforeListItem);
        console.log("2. After:", textFromListItem);

        // Update the current message with text before the list item
        setMessages((prevMessages) => {
          const lastIndex = prevMessages.length - 1;
          if (lastIndex < 0) return prevMessages;

          // Update the last message with text before the list item
          const updatedMessages = [...prevMessages];
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            text: textBeforeListItem,
          };

          // Add a new message with the list item and text after it
          updatedMessages.push({
            role: "assistant",
            type: "text",
            text: textFromListItem,
          });

          // Use our scrollToBottom function instead
          scrollToBottom();

          return updatedMessages;
        });

        // Update the current message text reference
        currentAssistantMessage.current = textFromListItem;
        return;
      }

      // Regular handling for non-list chunks
      currentAssistantMessage.current += newText;
      appendToLastMessage(newText);
    }
  };

  // handleRequiresAction - handle function call
  const handleRequiresAction = async (
    event: AssistantStreamEvent.ThreadRunRequiresAction
  ) => {
    console.log("Received action event:", event);
    const runId = event.data.id;
    const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;

    console.log("Tool calls received:", toolCalls);

    // loop over tool calls and call function handler
    const toolCallOutputs = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const result = await metaFunctionCallHandler(toolCall, sessionId);
        const output = JSON.parse(result);

        if (output.action === "appendTimerMessage") {
          appendMessage("assistant", {
            type: "timer",
            duration: output.timer.duration,
          });
        } else if (output.action === "updateTimer") {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.type === "timer" && msg.timerData) {
                return {
                  ...msg,
                  timerData: {
                    ...msg.timerData,
                    isRunning: output.timer.isRunning,
                  },
                };
              }
              return msg;
            })
          );
        } else if (output.action === "navigate") {
          router.push(output.path);
        } else if (output.action === "completeSession") {
          // Handle complete session if needed
        }

        return { output: result, tool_call_id: toolCall.id };
      })
    );
    console.log("handleRequiresAction tool calls processed");
    setInputDisabled(true);
    submitActionResult(runId, toolCallOutputs);
  };

  // handleRunCompleted - re-enable the input form and save completed message
  const handleRunCompleted = () => {
    console.log("handleRunCompleted called");
    setInputDisabled(false);
    setIsAssistantResponding(false);

    if (responseTimeout) {
      console.log("Clearing response timeout");
      clearTimeout(responseTimeout);
      setResponseTimeout(null);
    }
  };

  const handleReadableStream = async (stream: AssistantStream) => {
    console.log("Stream created, starting to listen for events...");

    try {
      await retryWithExponentialBackoff(async () => {
        try {
          await setupStreamListeners(stream, {
            handleTextCreated,
            handleTextDelta,
            handleRequiresAction,
            handleRunCompleted,
            setInputDisabled,
            currentAssistantMessage,
          });
        } catch (error) {
          if (error.type === "FATAL_ERROR") {
            alert(
              "We encountered an unexpected error. Please try again or contact Support@TheMangoHealth.com if the issue persists."
            );
            throw error; // Don't retry fatal errors
          } else if (error.type === "THREAD_ERROR") {
            // Thread was recreated, allow retry
            console.log("Thread recreated, retrying stream setup");
            if (error.newThreadId) {
              console.log("Using new thread ID:", error.newThreadId);
            }
            throw error; // Throw to trigger retry
          } else {
            // Transient error, retry
            throw error;
          }
        }
      });
    } catch (finalError) {
      console.error("All retry attempts failed:", finalError);
      alert(
        "We ran into an issue with this conversation, sorry about that! Please try again, or refresh the page if the issue persists. You can also reach out to us at Support@TheMangoHealth.com and we'll fix the issue right away!"
      );
      setInputDisabled(false);
    }

    console.log("Stream listeners set up successfully");
  };

  const appendToLastMessage = (text) => {
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedLastMessage = {
        ...lastMessage,
        text: lastMessage.text + text,
      };
      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendMessage = (
    role: "user" | "assistant",
    content: string | { type: "timer"; duration: number }
  ) => {
    if (typeof content === "string") {
      setMessages((prev) => [...prev, { role, type: "text", text: content }]);
    } else if (content.type === "timer") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "timer",
          text: "",
          timerData: { duration: content.duration, isRunning: false },
        },
      ]);
    }
  };

  const handlePrewrittenMessage = () => {
    const messageText = hasSubmittedMessage
      ? "I'm done. Thanks"
      : "Let's do an ERP session - pull up the erp module";

    // Add the message to the UI
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", type: "text", text: messageText },
    ]);

    // Send to the thread
    sendMessage(messageText);

    // Set hasSubmittedMessage if this is the first message
    if (!hasSubmittedMessage) {
      setHasSubmittedMessage(true);

      // Add loading message after 2 seconds
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            text: "Sounds good. Please just give me a few seconds to pull up that guidance.",
          },
        ]);
      }, 2000);
    }
  };

  // Also add this useEffect outside of any function
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Add an additional effect to handle initial loading and resize events
  useEffect(() => {
    scrollToBottom();
    window.addEventListener("resize", scrollToBottom);
    return () => window.removeEventListener("resize", scrollToBottom);
  }, [scrollToBottom]);

  return isLoading ? (
    <ChatSkeleton />
  ) : (
    <ChatUI
      messages={messages}
      userInput={userInput}
      onInputChange={(e) => setUserInput(e.target.value)}
      onSubmit={handleSubmit}
      inputDisabled={inputDisabled}
      messagesEndRef={messagesEndRef}
      isTyping={hasSubmittedMessage}
      onPrewrittenMessageClick={handlePrewrittenMessage}
      hasSubmittedMessage={hasSubmittedMessage}
      onLeave={onLeave}
      onTimerEnd={handleTimerEnd}
      isAssistantResponding={isAssistantResponding}
    />
  );
};

export default MetaChat;
