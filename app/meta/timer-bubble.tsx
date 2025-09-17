import React, { useEffect, useState } from "react";

interface TimerBubbleProps {
  duration: number; // in seconds
  isRunning: boolean;
  onTimerEnd?: () => void; // new callback prop
}

export const TimerBubble: React.FC<TimerBubbleProps> = ({
  duration,
  isRunning,
  onTimerEnd,
}) => {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, remainingTime]);

  // When the timer reaches zero, trigger the callback (only once)
  useEffect(() => {
    if (!hasEnded && remainingTime === 0) {
      setHasEnded(true);
      if (onTimerEnd) {
        onTimerEnd();
      }
    }
  }, [remainingTime, hasEnded, onTimerEnd]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="bg-white/10 text-white rounded-2xl px-4 py-2 inline-block">
      <div className="text-lg font-medium">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default TimerBubble;
