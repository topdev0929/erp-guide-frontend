import styles from "./personalized-text-multi-selection-slide.module.css";

type StatItem = {
  text: string;
  correspondingGoalIndex: number;
  icon: React.ReactNode;
};

type PersonalizedTextMultiSelectionSlideProps = {
  title: string;
  stats: StatItem[];
  selectedGoals: number[];
  footnote?: string;
  buttonLabel?: string;
  onNext?: () => void;
};

const PersonalizedTextMultiSelectionSlide = ({
  title,
  stats,
  selectedGoals,
  footnote,
  buttonLabel = "Tap to continue",
  onNext,
}: PersonalizedTextMultiSelectionSlideProps) => {
  const relevantStats = stats.filter((stat) =>
    selectedGoals.includes(stat.correspondingGoalIndex)
  );

  return (
    <div className={styles.personalizedTextSlide}>
      <h1
        className={styles.personalizedTextTitle}
        dangerouslySetInnerHTML={{ __html: title }}
      />
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
      {footnote && <p className={styles.footnote}>{footnote}</p>}
      <button
        className={styles.personalizedTextSlideTapToContinue}
        onClick={onNext}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default PersonalizedTextMultiSelectionSlide;
