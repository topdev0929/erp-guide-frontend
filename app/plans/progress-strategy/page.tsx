"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Clock, TrendingUp, ArrowRight, Heart } from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

// Define strategy content to avoid duplication
const STRATEGIES = {
  "more-time": {
    title: "Increase Duration",
    subtitle:
      "Start with shorter periods and gradually increase the duration of each exposure session.",
    icon: Clock,
  },
  "increase-intensity": {
    title: "Increase Intensity",
    subtitle:
      "Begin with selected exposure, then progressively make it more challenging.",
    icon: TrendingUp,
  },
};

// Define self-care options
const SELF_CARE_OPTIONS = [
  {
    id: "sleep",
    description: "Get 8 hours of sleep each night",
  },
  {
    id: "breathing",
    description:
      "Practice deep breathing for 5 minutes before exposure exercises",
  },
  {
    id: "walk",
    description: "Take a 15-minute walk outside daily",
  },
  {
    id: "journal",
    description: "Write in a journal about your feelings after each exposure",
  },
  {
    id: "meditation",
    description: "Do a 10-minute meditation after completing exposures",
  },
  {
    id: "gratitude",
    description: "List three things you're grateful for each day",
  },
  {
    id: "music",
    description: "Listen to calming music for 15 minutes",
  },
  {
    id: "bath",
    description: "Take a warm bath or shower to relax",
  },
];

export default function ProgressStrategyPage() {
  const router = useRouter();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(
    "more-time"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for strategy selection, 2 for self-care
  const [selectedSelfCare, setSelectedSelfCare] = useState<string[]>([]);

  const handleStrategySelect = (strategy: string) => {
    setSelectedStrategy(strategy);
  };

  const handleSelfCareToggle = (id: string) => {
    setSelectedSelfCare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleNextStep = () => {
    if (step === 1 && selectedStrategy) {
      setStep(2);
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleContinue = async () => {
    if (selectedStrategy) {
      try {
        setIsLoading(true);

        // Get the user answers from localStorage
        const savedAnswers = localStorage.getItem("userAnswers");
        const userAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};

        // Get the selected exposure from localStorage
        const savedExposure = localStorage.getItem("selectedExposure");
        const selectedExposure = savedExposure
          ? JSON.parse(savedExposure)
          : null;

        if (!selectedExposure) {
          alert("No exposure selected. Please go back and select an exposure.");
          setIsLoading(false);
          return;
        }

        // Save the selected strategy to localStorage
        localStorage.removeItem("progressStrategy");
        localStorage.setItem("progressStrategy", selectedStrategy);

        // Get the full strategy text using our predefined content
        const strategy =
          STRATEGIES[selectedStrategy as keyof typeof STRATEGIES];
        const progressStrategyText = `${strategy.title} - ${strategy.subtitle}`;

        // Create self_care_items array from selected options
        const selfCareItems = selectedSelfCare.map((id) => {
          const option = SELF_CARE_OPTIONS.find((option) => option.id === id);
          return {
            description: option?.description || "",
          };
        });

        // Prepare the payload with user answers, selected exposure, strategy, and self-care items
        const payload = {
          summary: selectedExposure.description,
          target_obsession: userAnswers.obsession || "",
          target_compulsion: userAnswers.compulsions || "",
          underlying_fear: userAnswers["underlying-fear"] || "",
          progress_strategy: progressStrategyText,
          "exposure-length": userAnswers["exposure-length"] || "10min",
          "exposure-frequency": userAnswers["exposure-frequency"] || "daily",
          format_version: 2,
          self_care_items: selfCareItems,
        };

        // Make API call to create the final plan
        const response = await apiCall(
          "/plan/exposure-plan-week/generate-plan/",
          ApiMethod.Post,
          "create exposure plan",
          payload
        );

        if (response && response.success) {
          // Store the entire response directly in localStorage
          localStorage.removeItem("cleanedPlan");
          localStorage.setItem("cleanedPlan", JSON.stringify(response));

          // Store the plan ID for future updates
          if (response.id) {
            localStorage.removeItem("planId");
            localStorage.setItem("planId", response.id.toString());
          }

          // Navigate to the viewing-plan page
          router.push("/plans/viewing-plan");
        } else {
          // Handle error
          console.error("Failed to create exposure plan");
          alert("There was an error creating your plan. Please try again.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error creating exposure plan:", error);
        alert("There was an error creating your plan. Please try again.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-[#1e543b] mb-3">
              How do you want to improve over the course of the week?
            </h1>
            <div className="space-y-4 mb-8">
              {/* Map through our predefined strategies */}
              {Object.entries(STRATEGIES).map(([key, strategy]) => {
                const StrategyIcon = strategy.icon;
                return (
                  <Card
                    key={key}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedStrategy === key
                        ? "ring-2 ring-[#349934] bg-[#349934] bg-opacity-5"
                        : "border border-gray-200"
                    }`}
                    onClick={() => handleStrategySelect(key)}
                  >
                    <div className="flex items-start">
                      <div
                        className={`p-3 rounded-full ${
                          selectedStrategy === key
                            ? "bg-[#349934] text-white"
                            : "bg-[#349934] bg-opacity-10 text-[#1e543b]"
                        }`}
                      >
                        <StrategyIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-[#1e543b] mb-1">
                          {strategy.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {strategy.subtitle}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              onClick={handleNextStep}
              disabled={!selectedStrategy}
              className="w-full bg-[#349934] hover:bg-[#1e543b] h-12 font-medium"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-[#1e543b] mb-3">
              Select self-care activities
            </h1>
            <p className="text-gray-600 mb-4">
              It's important to be gentle with yourself after doing exposure
              work. Select a few self-care activities you'd like to incorporate:
            </p>

            <div className="space-y-3 mb-8">
              {SELF_CARE_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 border rounded-md flex items-start space-x-3 cursor-pointer transition-all ${
                    selectedSelfCare.includes(option.id)
                      ? "border-[#349934] bg-[#349934] bg-opacity-5"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelfCareToggle(option.id)}
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedSelfCare.includes(option.id)}
                    onCheckedChange={() => handleSelfCareToggle(option.id)}
                    className="mt-0.5 data-[state=checked]:bg-[#349934] data-[state=checked]:border-[#349934]"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={option.id}
                      className="text-[#1e543b] cursor-pointer"
                    >
                      {option.description}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleBackStep}
                className="flex-1 border-gray-300"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isLoading}
                className="flex-1 bg-[#349934] hover:bg-[#1e543b] h-12 font-medium"
              >
                {isLoading ? (
                  "Creating your plan..."
                ) : (
                  <>
                    Create Plan
                    <Heart className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
