"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ExamplePlanProps {
  title: string;
  content: string;
  confirmText: string;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
}

export default function ExamplePlan({
  title,
  content,
  confirmText,
  onNext,
  onBack,
  showBack,
}: ExamplePlanProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onNext();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div
      className={`transition-opacity duration-300 ${
        isAnimating ? "opacity-0" : "opacity-100"
      } pb-[60px]`}
    >
      <div className="mb-4 mt-4">
        <h2 className="text-lg font-medium text-[#1e543b] mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{content}</p>
      </div>

      <Card className="border-[#349934] border-opacity-30 mb-6">
        <CardContent className="p-4">
          <div className="space-y-6 text-sm">
            <div className="border-b border-gray-100 pb-4">
              <p className="font-medium text-gray-500 uppercase text-xs mb-2">
                Obsession
              </p>
              <p className="text-[#1e543b]">Contamination from handshakes</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <p className="font-medium text-gray-500 uppercase text-xs mb-2">
                Underlying Fear
              </p>
              <p className="text-[#1e543b]">Fear of dying from germs</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <p className="font-medium text-gray-500 uppercase text-xs mb-2">
                Compulsions to Resist
              </p>
              <p className="text-[#1e543b]">Excessive hand sanitizing</p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <p className="font-medium text-gray-500 uppercase text-xs mb-2">
                Exposure Exercise
              </p>
              <p className="text-[#1e543b]">
                Pick up a pen your coworker used and hold it for 10 minutes
                without cleaning your hands, doing this 3-4 times throughout the
                week.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <p className="font-medium text-gray-500 uppercase text-xs mb-2">
                Improvement Strategy
              </p>
              <p className="text-[#1e543b]">
                After holding the pen for 10 minutes without cleaning your
                hands, progress by using the pen to write or touch your face
                later in the week, maintaining the same no-cleaning protocol.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-500 uppercase text-xs mb-2">
                Frequency
              </p>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#349934]">4</span>
                <span className="ml-2 text-[#1e543b]">times per week</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-[#1e543b] mb-6">{confirmText}</p>

      <div className="flex justify-between">
        {showBack ? (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-[#349934] text-[#349934] hover:bg-[#349934] hover:text-white"
          >
            Back
          </Button>
        ) : (
          <div></div>
        )}
        <Button
          onClick={handleNext}
          className="bg-[#349934] hover:bg-[#1e543b] text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
