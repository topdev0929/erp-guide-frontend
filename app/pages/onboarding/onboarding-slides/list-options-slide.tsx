import styles from "./list-options-slide.module.css";

type ListOption = {
  text: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
};

type ListOptionsSlideProps = {
  title: string;
  text?: string;
  options: ListOption[];
  onSelect: (index: number) => void;
  backgroundColors?: string[];
};

const ListOptionsSlide = ({
  title,
  text,
  options,
  onSelect,
  backgroundColors = [],
}: ListOptionsSlideProps) => {
  const getBackgroundColor = (index: number): string | undefined => {
    if (backgroundColors.length === 0) {
      return options[index].backgroundColor;
    }
    return backgroundColors[index % backgroundColors.length];
  };

  return (
    <div className={styles.listOptionsSlide}>
      <h1 className={styles.title}>{title}</h1>
      {text && <p className={styles.subText}>{text}</p>}
      <div className={styles.optionsList}>
        {options.map((option, index) => (
          <button
            key={index}
            className={styles.optionListItem}
            onClick={() => onSelect(index)}
            style={{ backgroundColor: getBackgroundColor(index) }}
          >
            <span className={styles.optionListText}>{option.text}</span>
            {option.icon && (
              <span className={styles.optionListIcon}>{option.icon}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListOptionsSlide;
