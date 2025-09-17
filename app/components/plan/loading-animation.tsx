"use client";

import { useEffect, useState } from "react";

export default function LoadingAnimation() {
  const [loadingText, setLoadingText] = useState("Analyzing your responses");

  useEffect(() => {
    const messages = [
      "Analyzing your responses",
      "Creating personalized exposures",
      "Designing your weekly plan",
      "Optimizing for your goals",
      "Almost ready",
    ];

    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingText(messages[currentIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#349934] border-opacity-20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#349934] rounded-full animate-spin"></div>
          </div>
        </div>

        <h2 className="text-lg font-medium text-[#1e543b] mb-2 animate-pulse">
          {loadingText}
        </h2>

        <p className="text-sm text-gray-600 max-w-xs mx-auto">
          We're creating a personalized exposure plan based on your specific OCD
          triggers and goals
        </p>
      </div>
    </div>
  );
}
