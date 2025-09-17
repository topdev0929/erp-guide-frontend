import styles from "./pricing-slide.module.css";
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
                <p>7 Days Free</p>
                <p className={styles.then}>Then</p>
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
                <p>7 Days Free</p>
                <p className={styles.then}>Then</p>
                <p className={styles.price}>
                  <s>$300</s> $74.99/year
                </p>
                <p className={styles.cancelText}>Cancel Anytime</p>
              </div>
            </div>

            <button
              className={styles.startTrialButton}
              onClick={() => onNext(selectedPlan)}
            >
              Start free trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSlide;
