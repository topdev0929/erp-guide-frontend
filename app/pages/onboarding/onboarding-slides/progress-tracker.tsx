"use client";

import styles from "./progress-tracker.module.css";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressTracker({
  currentStep,
  totalSteps,
}: ProgressTrackerProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
