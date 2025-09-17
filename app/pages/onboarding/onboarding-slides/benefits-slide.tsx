import styles from "./benefits-slide.module.css";

type StatItem = {
  text: string;
  icon: React.ReactNode;
};

type BenefitsSlideProps = {
  title: string;
  stats: StatItem[];
  buttonLabel?: string;
  onNext?: () => void;
};

const BenefitsSlide = ({
  title,
  stats,
  buttonLabel = "Continue",
  onNext,
}: BenefitsSlideProps) => {
  return (
    <div className={styles.introSlide}>
      <h1
        className={styles.introTitle}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className={styles.subtitle}>Explore what Mango Health has to offer!</p>
      <div>
        <div className={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <div className={styles.iconCircle}>{stat.icon}</div>
              <div
                className={styles.statText}
                dangerouslySetInnerHTML={{ __html: stat.text }}
              />
            </div>
          ))}
          <button className={styles.tapToContinue} onClick={onNext}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSlide;
