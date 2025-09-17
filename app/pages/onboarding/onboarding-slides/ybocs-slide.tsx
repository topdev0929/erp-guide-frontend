// YbocsSlide.tsx

import { useState } from "react";
import Ybocs from "@/app/components/ybocs/ybocs";
import styles from "@/app/components/ybocs/ybocs.module.css";

const YbocsSlide = ({
  onNext,
  buttonLabel,
  onSaveYbocs,
}: {
  onNext: () => void;
  buttonLabel?: string;
  onSaveYbocs: (ybocs: {
    obsessive_score: number;
    compulsive_score: number;
    total_score: number;
  }) => void;
}) => {
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);

  // Enable the Continue button once the score is calculated
  const handleScoreCalculated = () => {
    setIsContinueEnabled(true);
  };

  return (
    <div className={styles.container}>
      <Ybocs
        onScoreCalculated={(obsessiveScore, compulsiveScore, totalScore) => {
          onSaveYbocs({
            obsessive_score: obsessiveScore,
            compulsive_score: compulsiveScore,
            total_score: totalScore,
          });
          handleScoreCalculated(); // Enable the "Continue" button
        }}
        onNext={onNext}
        buttonLabel={buttonLabel}
        skipApiSubmit={true}
        hideHeader={true}
      />
    </div>
  );
};

export default YbocsSlide;
