"use client";
import { useState, useEffect } from "react";
import styles from "../page.module.css";
import StripeCheckout from "@/app/components/stripe/stripe-checkout";
import BenefitsSlide from "@/app/pages/onboarding/onboarding-slides/benefits-slide";
import PricingSlide from "@/app/pages/onboarding/onboarding-slides/pricing-slide";
import BrainIcon from "@/app/components/icons/brain-icon";
import BookIcon from "@/app/components/icons/book-icon";
import HappyGroupIcon from "@/app/components/icons/happy-group-icon";
import { usePostHog } from "posthog-js/react";
import { useRouter } from "next/navigation";
import { TokenService } from "@/app/api/auth";
import TestAccountPopup from "@/app/components/test-account-popup";
import { useProtectSubscriptionRoute } from "@/hooks/useAuthHooks";

const PaymentOnboardingPage = () => {
  // useProtectSubscriptionRoute();

  const posthog = usePostHog();
  const router = useRouter();
  const [slide, setSlide] = useState(11); // It's just easier to hardcode this (ex. the middelware becomes dependent on it if we put it in the URL param)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [iconClicks, setIconClicks] = useState<Set<string>>(new Set());
  const [showTestPopup, setShowTestPopup] = useState(false);

  useEffect(() => {
    logSlide(slide);
  }, [slide]);

  const nextSlide = () => {
    window.scrollTo(0, 0);
    setSlide((prevSlide) => prevSlide + 1);
  };

  const logSlide = (slideNumber: number) => {
    console.log("Logging Posthog event: onboarding_slide_viewed", {
      slide: slideNumber,
    });
    posthog.capture("onboarding_slide_viewed", { slide: slideNumber });
  };

  const handleLogout = () => {
    posthog.reset();
    TokenService.removeToken();
    router.push("/login");
  };

  const handleIconClick = (iconType: string) => {
    const newClicks = new Set(iconClicks);
    newClicks.add(iconType);
    setIconClicks(newClicks);

    if (newClicks.size === 3) {
      setShowTestPopup(true);
    }
  };

  return (
    <div className={styles.container}>
      <div key={slide} className={styles.fadeIn}>
        {slide === 11 && (
          <>
            <BenefitsSlide
              title="World's Leading AI Guide for OCD"
              stats={[
                {
                  text: "Unlimited ERP-based sessions; customized to your subtype",
                  icon: (
                    <div onClick={() => handleIconClick("brain")}>
                      <BrainIcon />
                    </div>
                  ),
                },
                {
                  text: "Created by Princeton and Cornell researchers",
                  icon: (
                    <div onClick={() => handleIconClick("book")}>
                      <BookIcon />
                    </div>
                  ),
                },
                {
                  text: "Has helped <strong>thousands</strong> of people break free from OCD",
                  icon: (
                    <div onClick={() => handleIconClick("happy")}>
                      <HappyGroupIcon />
                    </div>
                  ),
                },
              ]}
              onNext={nextSlide}
            />
            <button
              onClick={handleLogout}
              style={{
                opacity: 0,
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100px",
                height: "20px",
                cursor: "default",
                background: "transparent",
                border: "none",
              }}
              aria-hidden="true"
            />
          </>
        )}

        {slide === 12 && (
          <PricingSlide
            title="Try Mango free for 7 days"
            onNext={(selectedPlan) => {
              setSelectedPlan(selectedPlan);
              nextSlide();
            }}
          />
        )}

        {slide === 13 && (
          <StripeCheckout
            free_one_week_trial={true}
            redirect_url={`/pages/onboarding/payment-complete?currentOnboardingSlide=${slide}`}
            planType={selectedPlan}
          />
        )}
      </div>

      <TestAccountPopup
        open={showTestPopup}
        onClose={() => {
          setShowTestPopup(false);
          setIconClicks(new Set());
        }}
      />
    </div>
  );
};

export default PaymentOnboardingPage;
