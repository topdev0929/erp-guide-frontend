import { useEffect } from "react";

type EventName =
  | "timer:start"
  | "timer:set"
  | "timer:tick"
  | "actions:available"
  | "lesson:completed"
  | "lesson:started"
  | "actions:suggested"
  | "actions:missed"
  | "lesson:feedback";
type EventHandler = (event: CustomEvent<any>) => void;

export function emitAppEvent<T>(eventName: EventName, data?: T) {
  const event = new CustomEvent<T>(eventName, { detail: data });
  window.dispatchEvent(event);
}

export function useAppEvent<T>(eventName: EventName, handler?: EventHandler) {
  useEffect(() => {
    const wrappedHandler = (event: Event) => {
      if (event instanceof CustomEvent) {
        handler?.(event);
      }
    };

    window.addEventListener(eventName, wrappedHandler);
    return () => window.removeEventListener(eventName, wrappedHandler);
  }, [eventName, handler]);

  const emit = (data?: T) => {
    emitAppEvent(eventName, data);
  };

  return emit;
}
