import { useAppEvent } from "@/hooks/useAppEvent";
import React, { useCallback, useEffect, useState } from "react";
import { tools } from "../_tools";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

const TimerBubble: React.FC = () => {
  const [duration, setDuration] = useState(0);

  useAppEvent(
    "timer:set",
    useCallback((event: CustomEvent<{ duration: number }>) => {
      setDuration(event.detail.duration);
    }, [])
  );

  useAppEvent(
    "timer:tick",
    useCallback(() => {
      setDuration(tools.timer.duration);
    }, [])
  );

  useEffect(() => {
    const fetchTimer = async () => {
      const response = await apiCall(
        "/tools/timer/",
        ApiMethod.Get,
        "Fetching active timer"
      );
      if (response && response.duration) {
        if (response.start_time) {
          const startTime = new Date(response.start_time).getTime();
          const currentTime = new Date().getTime();
          const elapsedTime = Math.floor((currentTime - startTime) / 1000);
          tools.timer.duration = response.duration * 60 - elapsedTime;
          if (tools.timer.duration <= 0) {
            tools.timer.setTimer(0);
          } else {
            tools.timer.startTimer();
          }
        } else {
          tools.timer.setTimer(response.duration);
        }
      }
    };
    fetchTimer();
  }, []);

  if (duration <= 0) {
    return null;
  }

  return (
    <div className="top-3 right-20 bg-gray-800 text-white p-2 rounded-lg z-50 opacity-70">
      Timer {Math.floor(duration / 60)}:
      {(duration % 60).toString().padStart(2, "0")}{" "}
    </div>
  );
};

export default TimerBubble;
