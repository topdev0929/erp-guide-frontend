import React from "react";
import styles from "./disclaimer.module.css";

const disclaimer =
  "Important: This tool is intended as a mental health aid for individuals with a diagnosis of OCD. It is not a substitute for therapy, clinical judgement, or professional medical advice. Please consult a licensed healthcare provider before use. Do not use this tool if you have other mental health conditions such as borderline personality disorder, suicidal thoughts, or any condition requiring immediate medical attention. If you are in crisis or experiencing an emergency, please call 911 or go to the nearest emergency room.";

type PopupProps = {
  onClose: () => void;
};

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <p>{disclaimer}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default Popup;
