"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Joyride, { Callback } from "react-joyride";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { LoaderCircle } from "lucide-react";

const steps = [
  {
    target: "body",
    content:
      "Talk to me about anything here—especially if your OCD is spiking.",
    disableBeacon: true,
    page: "/chat",
    placement: "center" as const,
  },
  {
    target: ".nav-btn-learn",
    content:
      "New to treatment? Start here. I’ll help you understand your mind and tackle OCD together.",
    page: "/learn",
  },
  {
    target: ".nav-btn-erp-plan",
    content:
      "Already experienced? Here's where we can map out an exposure plan to make progress.",
    page: "/plans/viewing-plan",
  },
  {
    target: ".nav-btn-me",
    content: "I'll add what I learn about you here as we chat :)",
    page: "/me",
  },
];

function OnboardingTourLogic({
  onOnboardingCompleted,
}: {
  onOnboardingCompleted: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setStepIndex(steps.findIndex((step) => step.page === pathname));
    if (pathname === steps[0].page) {
      setStarted(true);
    }
  }, [pathname]);

  const handleJoyride: Callback = (props) => {
    console.log("DEBUG handleJoyride:", {
      action: props.action,
      lifecycle: props.lifecycle,
      currentIndex: props.index,
      nextStep: steps[props.index + 1],
      pathname,
    });

    if (props.action === "next" && props.lifecycle === "complete") {
      if (
        steps[props.index + 1]?.page &&
        pathname !== steps[props.index + 1].page
      ) {
        router.push(steps[props.index + 1].page);
        setLoading(true);
      } else {
        setStepIndex(props.index + 1);
      }

      if (props.index + 1 === steps.length) {
        onOnboardingCompleted();
      }
    }
  };

  // Add this check - if current page is not in step pages, don't show tour
  const stepPages = steps.map((step) => step.page);
  const isOnValidTourPage = stepPages.includes(pathname);

  return (
    <>
      {loading && (
        <div className="fixed left-0 top-0 w-screen h-screen bg-black/50 flex justify-center items-center">
          <div className="animate-spin">
            <LoaderCircle size={64} className="text-white" />
          </div>
        </div>
      )}
      <Joyride
        steps={steps}
        showProgress
        continuous
        disableCloseOnEsc
        disableOverlayClose
        disableScrolling
        hideCloseButton
        hideBackButton
        stepIndex={stepIndex}
        run={started && !loading && isOnValidTourPage}
        callback={handleJoyride}
      />
    </>
  );
}

export function OnboardingTour() {
  const router = useRouter();
  const pathname = usePathname();

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>();

  useEffect(() => {
    if (onboardingCompleted !== undefined) {
      return;
    }
    // Only run tour on pages that are actually in the steps
    const stepPages = steps.map((step) => step.page);
    if (!stepPages.includes(pathname)) {
      return;
    }

    const fetchOnboardingStatus = async () => {
      try {
        const response = await apiCall(
          "/onboarding/complete/",
          ApiMethod.Get,
          "get onboarding status"
        );
        setOnboardingCompleted(response.onboarding_completed);

        if (!response.onboarding_completed) {
          console.log("DEBUG ONBOARDING TOUR: NOT COMPLETED"); // Temp
          if (location.pathname !== steps[0].page) {
            console.log("DEBUG ONBOARDING TOUR- ROUTER PUSHED STEP 0"); // Temp
            router.push(steps[0].page);
          }
        }
      } catch (error) {
        console.error(`Error fetching onboarding status`, error);
      }
    };

    fetchOnboardingStatus();
  }, [pathname, onboardingCompleted]);

  const handleOnboardingCompleted = async () => {
    setOnboardingCompleted(true);

    try {
      const response = await apiCall(
        "/onboarding/complete/",
        ApiMethod.Post,
        "complete onboarding"
      );

      if (response.onboarding_completed) {
        // Redirect to /chat after tour completion
        router.push("/chat");
      }
    } catch (error) {
      console.error(`Error completing onboarding`, error);
    }
  };

  if (onboardingCompleted !== false) {
    return null;
  }

  return (
    <OnboardingTourLogic onOnboardingCompleted={handleOnboardingCompleted} />
  );
}
