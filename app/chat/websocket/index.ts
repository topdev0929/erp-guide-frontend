import { TokenService } from "@/app/api/auth";
import {
  ToolOutputPayload,
  setStartTimer,
  setTimer,
  startTimer,
  stopTimer,
  restartTimer,
  completeLesson,
  startLesson,
  setAvailableActions,
  setSuggestedActions,
  setMissedActions,
  sendFeedbackRating,
} from "@/app/chat/websocket/tool-outputs";

let socket: WebSocket | null = null;

function getWebSocketBaseUrl(token: string): string {
  // Use the same env var as API_URL, but strip trailing /api if present
  let url = process.env.NEXT_PUBLIC_API_URL || "";
  // Remove protocol (http/https)
  url = url.replace(/^https?:\/\//, "");
  // Remove trailing /api if present
  url = url.replace(/\/api\/?$/, "");
  // Determine ws or wss based on current page protocol
  const protocol =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "wss"
      : "ws";
  // Return the full WebSocket URL
  return `${protocol}://${url}/ws/outputs/?token=${token}`;
}

// Page rendering time slowed a lot when the append handler was added
export type AppendMessageHandler = (message: string) => void;

export function connectWebSocket(appendMessage: AppendMessageHandler) {
  const token = TokenService.getToken();
  const wsUrl = getWebSocketBaseUrl(token);
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onmessage = (event: MessageEvent) => {
    let data: ToolOutputPayload;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error("Invalid JSON from WebSocket:", event.data);
      return;
    }

    switch (data.type) {
      case "tool_completed_message":
        appendMessage(data.message);
        break;
      case "tool_error_message":
        console.error("Tool error:", data.message);
        appendMessage(data.message);
        break;
      case "set_timer":
        setTimer(data.duration);
        break;
      case "start_timer":
        startTimer();
        break;
      case "stop_timer":
        stopTimer();
        break;
      case "set_start_timer":
        setStartTimer(data.duration);
        break;
      case "restart_timer":
        restartTimer(data.duration);
        break;
      case "available_actions":
        setAvailableActions(data.actions);
        break;
      case "complete_lesson":
        completeLesson(data.static_or_dynamic, data.lesson);
        break;
      case "start_lesson":
        startLesson(data.lesson);
        break;
      case "suggested_actions":
        setSuggestedActions(data.actions);
        break;
      case "missed_actions":
        setMissedActions(data.actions);
        break;
      case "send_feedback_rating":
        sendFeedbackRating();
        break;
      default:
        console.error("Unknown tool output type:", (data as any).type);
    }
  };
}

export function disconnectWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}
