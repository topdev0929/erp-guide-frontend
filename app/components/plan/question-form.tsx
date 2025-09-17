"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionOption {
  value: string;
  label: string;
}

interface StepProps {
  id: string;
  type: "text" | "textarea" | "select" | "info" | "example";
  title?: string;
  question?: string;
  content?: string;
  placeholder?: string;
  options?: QuestionOption[];
  note?: string;
}

interface QuestionFormProps {
  step: StepProps;
  value: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
  isLastStep: boolean;
  previousAnswer?: {
    label: string;
    value: string;
  };
}

export default function QuestionForm({
  step,
  value,
  onAnswer,
  onNext,
  onBack,
  showBack,
  isLastStep,
  previousAnswer,
}: QuestionFormProps) {
  const [answer, setAnswer] = useState(value);
  const [isValid, setIsValid] = useState(step.type === "info");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setAnswer(value);
    setIsValid(step.type === "info" || !!value);
  }, [value, step.id, step.type]);

  const handleChange = (val: string) => {
    setAnswer(val);
    setIsValid(!!val);
    onAnswer(val);
  };

  const handleNext = () => {
    if (!isValid && step.type !== "info") return;

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
      }`}
    >
      {step.type === "info" ? (
        <div className="mb-6 mt-4">
          <h2 className="text-xl font-medium text-[#1e543b] mb-4">
            {step.title}
          </h2>
          <div className="text-[#1e543b] whitespace-pre-line mb-6">
            {step.content}
          </div>
          <Button
            onClick={handleNext}
            className="w-full bg-[#349934] hover:bg-[#1e543b] text-white py-6"
          >
            Let's Get Started
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 mt-4">
            {previousAnswer && (
              <div className="mb-3 text-gray-600 italic">
                <span className="font-medium">{previousAnswer.label}:</span>{" "}
                {previousAnswer.value}
              </div>
            )}
            <h2 className="text-lg font-medium text-[#1e543b] mb-2">
              {step.question}
            </h2>
            {step.note && (
              <p className="text-sm text-gray-600 mb-2">{step.note}</p>
            )}
          </div>

          <div className="mb-6">
            {step.type === "text" && (
              <Input
                value={answer}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={step.placeholder}
                className="w-full border-[#349934] focus:ring-[#1e543b]"
              />
            )}

            {step.type === "textarea" && (
              <Textarea
                value={answer}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={step.placeholder}
                className="w-full min-h-[120px] border-[#349934] focus:ring-[#1e543b]"
              />
            )}

            {step.type === "select" && step.options && (
              <Select value={answer} onValueChange={handleChange}>
                <SelectTrigger className="w-full border-[#349934]">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {step.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

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
              disabled={!isValid}
              className="bg-[#349934] hover:bg-[#1e543b] text-white"
            >
              {isLastStep ? "Create Plan" : "Next"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
