import { tools } from "../_tools";

// Define the possible message types and their payloads
export type ToolOutputPayload =
  | { type: "tool_completed_message"; message: string }
  | { type: "tool_error_message"; message: string }
  | { type: "set_timer"; duration: number }
  | { type: "start_timer" }
  | { type: "stop_timer" }
  | { type: "set_start_timer"; duration: number }
  | { type: "restart_timer"; duration: number }
  | { type: "available_actions"; actions: string[] }
  | { type: "complete_lesson"; static_or_dynamic: string; lesson: string }
  | { type: "start_lesson"; lesson: string }
  | { type: "suggested_actions"; actions: string[] }
  | { type: "missed_actions"; actions: string[] }
  | { type: "send_feedback_rating" };
// Add more types as needed

// Example handler functions
export function setTimer(duration: number) {
  console.log(`Set timer for ${duration} minutes`);
  tools.timer.setTimer(duration);
}

export function setStartTimer(duration: number) {
  console.log(`Set timer for ${duration} minutes and start immediately`);
  tools.timer.setTimer(duration);
  tools.timer.startTimer();
}

export function startTimer() {
  console.log("Start timer");
  tools.timer.startTimer();
}

export function stopTimer() {
  console.log("Stop timer");
  tools.timer.stopTimer();
}

export function restartTimer(duration: number) {
  console.log(`Restart timer for ${duration} minutes`);
  tools.timer.setTimer(duration);
}

export function setAvailableActions(actions: string[]) {
  console.log(`Setting available actions: ${actions}`);
  tools.actions.setAvailableActions(actions);
}

export function completeLesson(static_or_dynamic: string, lesson: string) {
  console.log(`Lesson completed: ${static_or_dynamic} ${lesson}`);
  tools.actions.completeLesson(static_or_dynamic, lesson);
}

export function startLesson(lesson: string) {
  console.log(`Starting lesson: ${lesson}`);
  tools.actions.startLesson(lesson);
}

export function setSuggestedActions(actions: string[]) {
  console.log(`Setting suggested actions: ${actions}`);
  tools.actions.setSuggestedActions(actions);
}

export function setMissedActions(actions: string[]) {
  console.log(`Missed actions: ${actions}`);
  tools.actions.setMissedActions(actions);
}

export function sendFeedbackRating() {
  tools.actions.submitFeedback();
}