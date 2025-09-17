// This is very similar to the onboarding pricing slide (REFACTOR - maybe just rename this slide). However, it's slightly different; so I like splitting them out.

import styles from "./resubscribe-pricing-slide.module.css";
import { useState } from "react";

type PlanType = "monthly" | "yearly";

type PricingSlideProps = {
  title: string;
  onNext: (selectedPlan: PlanType) => void;
};

const PricingSlide = ({ title, onNext }: PricingSlideProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("yearly");

  return (
    <div className={styles.slide}>
      <div className={styles.pricingContainer}>
        <div className={styles.fadeInContent}>
          <h1 className={styles.pricingTitle}>{title}</h1>

          <div className={styles.traditionalPrice}>
            Traditional OCD Therapy: $250/hour
          </div>

          <div className={styles.aiTherapySection}>
            <h3>Mango AI Guide</h3>

            <div className={styles.planOptions}>
              {/* Monthly Plan */}
              <div
                className={`${styles.planCard} ${
                  selectedPlan === "monthly" ? styles.selected : ""
                }`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <p className={styles.price}>$24.99/month</p>
                <p className={styles.cancelText}>Cancel Anytime</p>
              </div>

              {/* Yearly Plan */}
              <div
                className={`${styles.planCard} ${
                  selectedPlan === "yearly" ? styles.selected : ""
                }`}
                onClick={() => setSelectedPlan("yearly")}
              >
                <div className={styles.saveTag}>Save 75%</div>
                <p className={styles.price}>
                  <s>$300</s> 74.99/year
                </p>
                <p className={styles.cancelText}>Cancel Anytime</p>
              </div>
            </div>

            <button
              className={styles.startTrialButton}
              onClick={() => onNext(selectedPlan)}
            >
              Start Now
            </button>

            <p className={styles.supportText}>
              If you think this page is in error, please email
              support@themangohealth.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSlide;
