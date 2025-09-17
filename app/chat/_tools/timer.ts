import { emitAppEvent } from "@/hooks/useAppEvent";

export const timer = {
  duration: 0,
  intervalId: null,

  setTimer(minutes: number) {
    this.duration = minutes * 60;
    emitAppEvent("timer:set", { duration: this.duration });
  },

  stopTimer() {
    this.duration = 0;
    emitAppEvent("timer:set", { duration: 0 });
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  startTimer() {
    if (this.intervalId) {
      console.error("Timer is already running");
      return;
    }
    if (this.duration <= 0) {
      console.error("Timer duration is not set");
      return;
    }

    emitAppEvent("timer:start");
    this.intervalId = setInterval(() => {
      this.duration -= 1;

      emitAppEvent("timer:tick");

      if (this.duration <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }, 1000);
  },
};
