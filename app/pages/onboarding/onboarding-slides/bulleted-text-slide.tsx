import styles from "@/app/pages/onboarding/page.module.css";

type BulletedTextSlideProps = {
  title: string;
  text?: React.ReactNode;
  bulletedText: React.ReactNode[];
  additionalText?: React.ReactNode;
  buttonLabel?: string;
  onNext?: () => void;
};

const BulletedTextSlide = ({
  title,
  text,
  bulletedText,
  additionalText,
  buttonLabel = "Tap to continue",
  onNext,
}: BulletedTextSlideProps) => (
  <div className={styles.introSlide}>
    <h1
      className={styles.introTitle}
      dangerouslySetInnerHTML={{ __html: title }}
    />

    {text && <p className={styles.text}>{text}</p>}

    <div className={styles.statsContainer}>
      {bulletedText.map((item, index) => (
        <div key={index} className={styles.statItem}>
          <div className={styles.bulletPoint}>•</div>
          <div className={styles.statText}>{item}</div>
        </div>
      ))}
    </div>

    {additionalText && <p className={styles.text}>{additionalText}</p>}

    <button className={styles.tapToContinue} onClick={onNext}>
      {buttonLabel}
    </button>
  </div>
);

export default BulletedTextSlide;
