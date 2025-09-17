// TODO: Rename shorter lol; or just build functionality and enable mode into the original slide

import styles from "./personalized-text-one-selection-slide.module.css";

type StatItem = {
  text: string;
  correspondingGoalIndex: number;
  icon: React.ReactNode;
};

type PersonalizedTextOneSelectionSlideProps = {
  title: string;
  stats: StatItem[];
  selectedGoals: number[];
  buttonLabel?: string;
  onNext?: () => void;
};

const PersonalizedTextOneSelectionSlide = ({
  title,
  stats,
  selectedGoals,
  buttonLabel = "Tap to continue",
  onNext,
}: PersonalizedTextOneSelectionSlideProps) => {
  const relevantStats = stats.filter((stat) =>
    selectedGoals.includes(stat.correspondingGoalIndex)
  );

  const shouldConcatenateTitle = selectedGoals.length === 1;
  const displayTitle =
    shouldConcatenateTitle && relevantStats.length > 0
      ? `${title} ${relevantStats[0].text}`
      : title;

  return (
    <div className={styles.slide}>
      <h1
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: displayTitle }}
      />
      {!shouldConcatenateTitle && (
        <div className={styles.statsContainer}>
          {relevantStats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div
                className={styles.statText}
                dangerouslySetInnerHTML={{ __html: stat.text }}
              />
            </div>
          ))}
        </div>
      )}
      <button className={styles.tapToContinue} onClick={onNext}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default PersonalizedTextOneSelectionSlide;
