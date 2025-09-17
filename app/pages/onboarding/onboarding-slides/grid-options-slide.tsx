import styles from "./grid-options-slide.module.css";
import { useState } from "react";

type Option = {
  text: string;
  icon: string;
};

type GridOptionsSlideProps = {
  title: string;
  text?: React.ReactNode;
  options: Option[];
  footer?: React.ReactNode[];
  onSubmit: (selectedIndices: number[]) => void;
  multiSelect?: boolean;
  backgroundColors?: string[];
};

const GridOptionsSlide = ({
  title,
  text,
  options,
  footer,
  onSubmit,
  multiSelect = false,
  backgroundColors = [],
}: GridOptionsSlideProps) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const getBackgroundColor = (index: number): string | undefined => {
    if (backgroundColors.length === 0) return undefined;
    return backgroundColors[index % backgroundColors.length];
  };

  const handleSelect = (index: number) => {
    if (multiSelect) {
      setSelectedIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedIndices([index]);
    }
  };

  return (
    <div className={styles.gridOptionSlide}>
      <div className={styles.gridOptionsContent}>
        <h1 className={styles.gridOptionsTitle}>{title}</h1>
        {text && <p className={styles.text}>{text}</p>}
        <div className={styles.gridOptionsGrid}>
          {options.map((option, index) => (
            <button
              key={index}
              className={`${styles.gridOptionsCard} ${
                selectedIndices.includes(index) ? styles.selected : ""
              }`}
              onClick={() => handleSelect(index)}
              style={{ backgroundColor: getBackgroundColor(index) }}
            >
              <div className={styles.gridOptionsIcon}>{option.icon}</div>
              <span className={styles.gridOptionsText}>{option.text}</span>
            </button>
          ))}
        </div>
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
      <button
        className={styles.tapToContinue}
        onClick={() => selectedIndices.length > 0 && onSubmit(selectedIndices)}
      >
        Tap to continue
      </button>
    </div>
  );
};

export default GridOptionsSlide;
