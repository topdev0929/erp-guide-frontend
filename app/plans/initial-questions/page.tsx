"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/app/components/plan/progress-bar";
import QuestionForm from "@/app/components/plan/question-form";
import ExamplePlan from "@/app/components/plan/example-plan";
import LoadingAnimation from "@/app/components/plan/loading-animation";
import WelcomeSection from "@/app/components/plan/welcome-section";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

interface QuestionOption {
  value: string;
  label: string;
}

type StepType = "text" | "textarea" | "select" | "info" | "example";

interface Step {
  id: string;
  type: StepType;
  title?: string;
  question?: string;
  content?: string;
  placeholder?: string;
  options?: QuestionOption[];
  note?: string;
  confirmText?: string;
  shouldShow?: (params: {
    answers: Record<string, string>;
    urlParams: URLSearchParams;
    apiData?: any;
  }) => boolean;
}

const steps: Step[] = [
  {
    id: "introduction",
    type: "info",
    title: "Congratulations on Taking This Step",
    content: `You're taking an important step toward making serious progress on your OCD. 
    
    Exposure plans are the science-based method for seeing clear improvement. Our clients who make the most progress are the ones who commit to doing the work.
    `,
  },
  {
    id: "obsession",
    type: "textarea",
    question:
      "What is the intrusive thought, fear, or obsession you want to address this week?",
    placeholder: "e.g., Contamination from germs, fear of harming others, etc.",
    shouldShow: ({ urlParams }) => !urlParams.has("obsession"),
  },
  {
    id: "example-plan",
    type: "example",
    title: "Example Exposure Plan",
    content:
      "So you get a sense of what we'll be making, here's an example plan for a client with contamination OCD.",
    confirmText:
      "Are you ready to move on to creating your own exposure plan? I have a list of questions that will help us create a plan that is right for you.",
    shouldShow: ({ apiData }) => !apiData?.hasCompletedPlansBefore,
  },
  {
    id: "compulsions",
    type: "textarea",
    question: "What compulsions are tied to this obsession?",
    placeholder:
      "e.g., Excessive handwashing, checking, seeking reassurance, etc.",
  },
  {
    id: "underlying-fear",
    type: "textarea",
    question:
      "Is this the underlying fear at hand? Or is there something deeper?",
    placeholder:
      "e.g., Maybe you're scared of germs from handshakes; but your underlying fear is dying from getting sick.",
    note: "It's ok if you're not sure. Just write whatever feels right.",
  },
  {
    id: "exposure-length",
    type: "select",
    question: "How much time can you commit to an exposure per day?",
    options: [
      { value: "5min", label: "5 minutes" },
      { value: "10min", label: "10 minutes" },
      { value: "15min", label: "15 minutes" },
      { value: "30min", label: "30 minutes" },
    ],
    note: "Aim for at least 5 minutes. We'll gradually increase this over time, but any amount is beneficial.",
  },
  {
    id: "exposure-frequency",
    type: "select",
    question: "How often can you commit to exposure sessions this week?",
    options: [
      { value: "5-7", label: "5-7 times per week" },
      { value: "3-4", label: "3-4 times per week" },
      { value: "1-2", label: "1-2 times per week" },
    ],
    note: "Daily exposure is ideal, but it should be intentional and in a controlled setting — not constant or overwhelming.",
  },
  {
    id: "exposure-ideas",
    type: "textarea",
    question: "Do you have ideas on ways to expose or trigger yourself?",
    placeholder:
      "Share any specific exposure exercises that feel challenging but achievable this week.",
    note: "Either way, I'll present you with some options on the next screen.",
    shouldShow: ({ urlParams }) => !urlParams.has("selectedExposure"),
  },
];

const checkUserHasPlan = async (): Promise<boolean> => {
  try {
    const response = await apiCall(
      "/plan/exposure-plan-week/has-created-plan/",
      ApiMethod.Get,
      "check if user has created plan"
    );

    return response?.has_plan || false;
  } catch (error) {
    console.error("Error checking if user has created plan:", error);
    return false;
  }
};

export default function WeeklyPlanPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const selectedExposureParam = searchParams.get("selectedExposure");
  const selectedObsessionParam = searchParams.get("obsession");

  // Filtered steps based on visibility conditions
  const visibleSteps = useMemo(() => {
    return steps.filter((step) => {
      if (!step.shouldShow) return true;
      return step.shouldShow({
        answers,
        urlParams: new URLSearchParams(searchParams.toString()),
        apiData,
      });
    });
  }, [answers, searchParams, apiData]);

  // Calculate progress based on visible steps
  const progress = (currentStep / visibleSteps.length) * 100;
  const isLastStep = currentStep === visibleSteps.length - 1;

  // Effect to fetch API data if needed and clear previous plan data
  useEffect(() => {
    // Clear ALL existing plan-related data from localStorage
    const planKeys = [
      "generatedExposures",
      "userAnswers",
      "selectedExposure",
      "progressStrategy",
      "cleanedPlan",
      "planId",
      "exposureAdjustment",
    ];

    planKeys.forEach((key) => localStorage.removeItem(key));

    const fetchData = async () => {
      try {
        // Check if user has created plans before
        const hasPlan = await checkUserHasPlan();
        setApiData((prev) => ({
          ...prev,
          hasCompletedPlansBefore: hasPlan,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Check if obsession parameter exists
    const obsessionParam = searchParams.get("obsession");
    if (obsessionParam) {
      // Pre-fill the obsession answer
      setAnswers((prev) => ({
        ...prev,
        obsession: obsessionParam,
      }));
    }

    // Pre-select default values
    setAnswers((prev) => ({
      ...prev,
      "exposure-length": "10min",
      "exposure-frequency": "3-4",
    }));
  }, []);

  const handleAnswer = (stepId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: answer,
    }));
  };

  const handleNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare the payload with user answers
      const payload = {
        user_answers: answers,
      };

      // Save the user answers to localStorage for later use
      localStorage.removeItem("userAnswers");
      localStorage.setItem("userAnswers", JSON.stringify(answers));

      // Make API call to generate exposures
      const response = await apiCall(
        "/exposures/exposure-generator/",
        ApiMethod.Post,
        "generate exposure options",
        payload
      );

      if (response && response.success) {
        // Store the generated exposures in localStorage for the next page
        localStorage.removeItem("generatedExposures");

        // Create array of exposures, starting with selected exposure if it exists
        const exposuresToStore = [];

        // Add selected exposure first if it exists
        if (selectedExposureParam) {
          exposuresToStore.push({
            description: decodeURIComponent(selectedExposureParam),
          });
        }

        // Add generated exposures
        if (response.exposures && response.exposures.length > 0) {
          exposuresToStore.push(...response.exposures);
        }

        localStorage.setItem(
          "generatedExposures",
          JSON.stringify(exposuresToStore)
        );

        // Navigate to exposure options page
        router.push("/plans/exposure-options");
      } else {
        // Handle error
        console.error("Failed to generate exposures");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error generating exposures:", error);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col">
        <h1 className="text-xl font-bold text-[#1e543b] mb-4">
          Create Your Weekly Exposure Plan
        </h1>

        <WelcomeSection
          selectedExposure={selectedExposureParam}
          selectedObsession={selectedObsessionParam}
        />

        <ProgressBar progress={progress} />

        <div className="mt-6 flex-1 flex flex-col">
          {currentStep < visibleSteps.length && (
            <>
              {visibleSteps[currentStep].type === "example" ? (
                <ExamplePlan
                  title={visibleSteps[currentStep].title}
                  content={visibleSteps[currentStep].content}
                  confirmText={visibleSteps[currentStep].confirmText}
                  onNext={handleNext}
                  onBack={handleBack}
                  showBack={currentStep > 0}
                />
              ) : (
                <QuestionForm
                  step={visibleSteps[currentStep]}
                  value={answers[visibleSteps[currentStep].id] || ""}
                  onAnswer={(answer) =>
                    handleAnswer(visibleSteps[currentStep].id, answer)
                  }
                  onNext={handleNext}
                  onBack={handleBack}
                  showBack={currentStep > 0}
                  isLastStep={isLastStep}
                  previousAnswer={
                    visibleSteps[currentStep].id === "underlying-fear"
                      ? answers.obsession
                        ? {
                            label: "Your obsession",
                            value: answers.obsession,
                          }
                        : undefined
                      : undefined
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
