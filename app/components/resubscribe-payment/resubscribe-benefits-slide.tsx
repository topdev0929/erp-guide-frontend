// This is very similar to the onboarding benefits slide (REFACTOR - maybe just rename this slide). However, it's slightly different; so I like splitting them out. MOVE ALL RESUBSCRIBE LOGIC OUT OF COMPONENTS AND TO THE PAGES FOLDER SINCE IT ISN'T BEING USED MORE THAN ONCE
import styles from "./resubscribe-benefits-slide.module.css";

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
