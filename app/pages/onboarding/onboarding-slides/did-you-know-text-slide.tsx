import styles from "./did-you-know-text-slide.module.css";

type TextSlideProps = {
  title: string;
  text?: React.ReactNode;
  bulletedText?: string[];
  additionalText?: React.ReactNode;
  subtitle?: string;
  footnote?: string;
  buttonLabel?: string;
  onNext?: () => void;
  splitTitle?: {
    main: string;
    bullets: string[];
  };
};

const TextSlide = ({
  title,
  text,
  bulletedText,
  additionalText,
  subtitle,
  footnote,
  buttonLabel = "Tap to continue",
  onNext,
  splitTitle,
}: TextSlideProps) => (
  <div className={styles.slide}>
    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    {splitTitle ? (
      <>
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: splitTitle.main }}
        />
        <div className={styles.bulletPoints}>
          {splitTitle.bullets.map((bullet, index) => (
            <div
              key={index}
              className={styles.bullet}
              style={{ "--index": index } as React.CSSProperties}
            >
              {bullet}
            </div>
          ))}
        </div>
        <div className={styles.tapToContinueContainer} onClick={onNext}>
          <svg className={styles.lockIcon} viewBox="0 0 512 512">
            <path
              d="M364.2,223.8v-71.4c0-59.7-48.5-108.2-108.2-108.2s-108.2,48.5-108.2,108.2v71.4c-19.8,0-35.8,16-35.8,35.8v179.2
              c0,19.8,16,35.8,35.8,35.8h216.4c19.8,0,35.8-16,35.8-35.8V259.6C400,239.8,384,223.8,364.2,223.8z M256,367.2
              c-19.8,0-35.8-16-35.8-35.8s16-35.8,35.8-35.8s35.8,16,35.8,35.8S275.8,367.2,256,367.2z M319.8,223.8H192.2v-71.4
              c0-35.2,28.6-63.8,63.8-63.8s63.8,28.6,63.8,63.8V223.8z"
            />
          </svg>
          <button className={styles.tapToContinue}>{buttonLabel}</button>
        </div>
      </>
    ) : (
      <h1
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: title }}
      />
    )}

    {text && <p className={styles.text}>{text}</p>}

    {bulletedText && (
      <div className={styles.statsContainer}>
        {bulletedText.map((item, index) => (
          <div
            key={index}
            className={styles.statText}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </div>
    )}

    {additionalText && <p className={styles.text}>{additionalText}</p>}
    {footnote && <p className={styles.footnote}>{footnote}</p>}
  </div>
);

export default TextSlide;
