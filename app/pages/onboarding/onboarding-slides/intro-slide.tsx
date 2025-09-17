import styles from "./intro-slide.module.css";
import Link from "next/link";

type IntroSlideProps = {
  title: string;
  buttonLabel?: string;
  onNext?: () => void;
};

const IntroSlide = ({
  title,
  buttonLabel = "Tap to continue",
  onNext,
}: IntroSlideProps) => {
  return (
    <div className={styles.introSlide}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.continueButton} onClick={onNext}>
          {buttonLabel}
        </button>
        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLink}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default IntroSlide;
