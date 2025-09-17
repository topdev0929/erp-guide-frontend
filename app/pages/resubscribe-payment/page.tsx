// TODO improvements: https://docs.google.com/document/d/1rZzR961a5JgwnRliU6NFRwiITFYCQr27QfgBLzQIIvg/edit?tab=t.0

"use client";

import React, { useState } from "react";
import StripeCheckout from "@/app/components/stripe/stripe-checkout";
import BenefitsSlide from "@/app/components/resubscribe-payment/resubscribe-benefits-slide";
import PricingSlide from "@/app/components/resubscribe-payment/resubscribe-pricing-slide";
import BrainIcon from "@/app/components/icons/brain-icon";
import BookIcon from "@/app/components/icons/book-icon";
import HappyGroupIcon from "@/app/components/icons/happy-group-icon";
import styles from "@/app/pages/resubscribe-payment/page.module.css";
import NavHeader from "@/app/components/resubscribe-payment/resubscribe-nav-header";

const Page = () => {
  const [currentStep, setCurrentStep] = useState<
    "benefits" | "pricing" | "checkout"
  >("benefits");
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly"
  );

  // Note: Adding meaningless onboarding slide number to URL params because the generated redirect url needs a url param there. This is because it appends the next url param with a & at the beginning; which causes an error (first url param must start with a '?', hence us adding this one in now).
  if (currentStep === "checkout") {
    return (
      <>
        <NavHeader />
        <div className={styles.pageContent}>
          <StripeCheckout
            free_one_week_trial={false}
            redirect_url="/pages/resubscribe-payment/payment-complete?currentOnboardingSlide=100"
            planType={selectedPlan}
          />
        </div>
      </>
    );
  }

  if (currentStep === "pricing") {
    return (
      <>
        <NavHeader />
        <div className={styles.pageContent}>
          <div className={styles.container}>
            <div className={styles.fadeIn}>
              <PricingSlide
                title="Choose your plan"
                onNext={(plan) => {
                  setSelectedPlan(plan);
                  setCurrentStep("checkout");
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavHeader />
      <div className={styles.pageContent}>
        <BenefitsSlide
          title="Renew Your Access to Mango"
          stats={[
            {
              text: "Unlimited ERP-based sessions; customized to your subtype",
              icon: <BrainIcon />,
            },
            {
              text: "Created by Princeton and Cornell researchers",
              icon: <BookIcon />,
            },
            {
              text: "Has helped <strong>thousands</strong> of people break free from OCD",
              icon: <HappyGroupIcon />,
            },
          ]}
          onNext={() => setCurrentStep("pricing")}
        />
      </div>
    </>
  );
};

export default Page;
