import { useState, useEffect } from "react";
import styles from "./program-creation-animation.module.css";
import { ProfileIcon, OrbitDot } from "@/app/components/icons/profile-icon";

interface ProgramCreationAnimationProps {
  onNext: () => void;
}

const ProgramCreationAnimation = ({
  onNext,
}: ProgramCreationAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const highlightedPhrases = [
    "goals...",
    "life priorities...",
    "ERP experience...",
    "OCD patterns...",
  ];

  useEffect(() => {
    let stepInterval: NodeJS.Timeout;

    const runAnimation = async () => {
      stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev === highlightedPhrases.length - 1) {
            clearInterval(stepInterval);
            setTimeout(() => {
              setShowFinalMessage(true);
              setTimeout(() => setShowButton(true), 500);
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    };

    runAnimation();

    return () => {
      if (stepInterval) clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <div className={styles.profileIcon}>
          <ProfileIcon />
        </div>
        <div className={styles.orbitingDot1}>
          <OrbitDot color="#fddf96" />
        </div>
        <div className={styles.orbitingDot2}>
          <OrbitDot color="#eb97ab" />
        </div>
      </div>
      <div className={styles.textContainer}>
        {!showFinalMessage ? (
          <p className={styles.text}>
            Creating program based on your
            <br />
            <span key={currentStep} className={styles.animatedText}>
              {highlightedPhrases[currentStep]}
            </span>
          </p>
        ) : (
          <p className={styles.finalMessage}>
            <span className={styles.highlight}>Your</span> program is ready.
          </p>
        )}
      </div>
      {showButton && (
        <button className={styles.createAccountButton} onClick={onNext}>
          Create an account
        </button>
      )}
    </div>
  );
};

export default ProgramCreationAnimation;
