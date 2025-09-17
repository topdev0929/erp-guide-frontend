import { emitAppEvent } from "@/hooks/useAppEvent";

export const actions = {
  availableActions: [] as string[],
  suggestedActions: [] as string[],
  missedActions: [] as string[],
  setAvailableActions(actionsList: string[]) {
    this.availableActions = actionsList;
    emitAppEvent("actions:available", { actions: actionsList });
  },

  getAvailableActions() {
    return this.availableActions;
  },

  completeLesson(static_or_dynamic: string, lesson: string) {
    emitAppEvent("lesson:completed", {
      static_or_dynamic,
      lesson,
    });
  },

  startLesson(lesson: string) {
    emitAppEvent("lesson:started", {
      lesson,
    });
  },

  setSuggestedActions(actionsList: string[]) {
    this.suggestedActions = actionsList;
    emitAppEvent("actions:suggested", { actions: actionsList });
  },

  setMissedActions(actionsList: string[]) {
    this.missedActions = actionsList;
    emitAppEvent("actions:missed", { actions: actionsList });
  },

  submitFeedback() {
    emitAppEvent("lesson:feedback");
  },
};