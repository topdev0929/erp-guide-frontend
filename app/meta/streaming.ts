import { AssistantStream, AssistantStreamEvent } from "@/app/types/types";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

export interface StreamHandlers {
  handleTextCreated: () => void;
  handleTextDelta: (delta: any) => void;
  handleRequiresAction: (event: AssistantStreamEvent.ThreadRunRequiresAction) => void;
  handleRunCompleted: () => void;
  setInputDisabled: (disabled: boolean) => void;
  currentAssistantMessage: { current: string };
}

export const setupStreamListeners = (
  stream: AssistantStream,
  handlers: StreamHandlers
) => {
  return new Promise((resolve, reject) => {
    stream.on("textCreated", () => {
      console.log("textCreated event fired");
      handlers.handleTextCreated();
    });

    stream.on("textDelta", (delta) => {
      handlers.handleTextDelta(delta);
    });

    stream.on("toolCallCreated", (toolCall) => {
      console.log("toolCallCreated event fired with toolCall:", toolCall);
    });

    stream.on("error", async (err) => {
      console.error("Stream error:", err);
      handlers.setInputDisabled(false);

      // Check if error indicates an invalid thread
      if (err.message?.includes("thread") || err.message?.includes("Thread")) {
        console.log("Thread-related error detected, attempting to recreate thread");
        try {
          const data = await apiCall(
            '/deprecate/openai_old/thread',
            ApiMethod.Post,
            'recreate thread'
          );
          console.log("Thread recreated with ID:", data.thread_id);
          reject({ type: "THREAD_ERROR", error: err, newThreadId: data.thread_id });
        } catch (createError) {
          console.error("Failed to recreate thread:", createError);
          reject({ type: "FATAL_ERROR", error: createError });
        }
      } else if (
        err.message?.includes("network") ||
        err.message?.includes("timeout")
      ) {
        reject({ type: "TRANSIENT_ERROR", error: err });
      } else {
        reject({ type: "FATAL_ERROR", error: err });
      }
    });

    stream.on("end", async () => {
      console.log("Stream closed");
      handlers.setInputDisabled(false);
      resolve(true);
    });

    stream.on("event", (event) => {
      console.log("Received stream event:", event.event);

      if (event.event === "thread.run.requires_action") {
        console.log("thread.run.requires_action event fired");
        handlers.handleRequiresAction(event);
      }

      if (event.event === "thread.run.completed") {
        console.log("thread.run.completed event fired");
        handlers.handleRunCompleted();
      }

      if (event.event === "thread.run.failed") {
        console.error("Thread run failed:", event.data);
        alert(
          "We ran into an issue with this message, sorry about that! Please try again, or refresh the page if the issue persists. You can also reach out to us at Support@TheMangoHealth.com and we'll fix the issue right away!"
        );
      }
    });
  });
}; 