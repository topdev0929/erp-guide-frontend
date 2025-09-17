"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ybocs.module.css";
import { API_URL, TokenService } from "@/app/api/auth";
import Link from "next/link";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";

const questionsObsessions = [
  {
    text: "1. How much of your time is occupied by obsessive thoughts?",
    options: [
      "0 hrs/day",
      "Less than 1 hr/day",
      "1 to 3 hrs/day",
      "3 to 8 hrs/day)",
      "More than 8 hrs/day",
    ],
  },
  {
    text: "2. How much do your obsessive thoughts interfere with functioning in your social, work, or other roles? Is there anything that you don’t do because of them?",
    options: [
      "None",
      "Slight interference with social or other activities, but overall performance not impaired ",
      "Definite interference with social or occupational performance but still manageable",
      "Causes substantial impairment in social or occupational performance",
      "Incapacitating",
    ],
  },
  {
    text: "3. How much distress do your obsessive thoughts cause you?",
    options: [
      "None",
      "Not too disturbing",
      "Disturbing, but still manageable",
      "Very disturbing",
      "Near constant and disabling distress",
    ],
  },
  {
    text: "4. How much of an effort do you make to resist (not engage with) the obsessive thoughts? How often do you try to disregard or turn your attention away from these thoughts as they enter your mind?",
    options: [
      "Try to resist (disregard) all the time",
      "Try to resist (disregard) most of the time",
      "Make some effort to resist (disregard)",
      "Yield to all obsessions without attempting to control them, but with some reluctance",
      "Completely and willingly yield to all obsessions",
    ],
  },
  {
    text: "5. How much control do you have over your obsessive thoughts? Can you dismiss them?",
    options: [
      "Complete control",
      "Usually able to stop or divert obsessions with some effort and concentration",
      "Sometimes able to stop or divert obsessions",
      "Rarely successful in stopping or dismissing obsessions, can only divert attention with difficulty",
      "Obsessions are completely involuntary, rarely able to even momentarily alter obsessive thinking",
    ],
  },
];

const questionsCompulsions = [
  {
    text: "6. How much time do you spend performing compulsive behaviors? How much longer than most people does it take to complete routine activities because of your rituals? How frequently do you do rituals?",
    options: [
      "None",
      "Less than 1 hr/day",
      "1 to 3 hrs/day",
      "3 to 8 hrs/day",
      "More than 8 hrs/day",
    ],
  },
  {
    text: "7. How much do your compulsive behaviors interfere with your work, school, social, or other important role functioning? Is there anything that you don’t do because of the compulsions?",
    options: [
      "None",
      "Slight interference with social or other activities, but overall performance not impaired",
      "Definite interference with social or occupational performance, but stillmanageable",
      "Causes substantial impairment in social or occupational performance",
      "Incapacitating",
    ],
  },
  {
    text: "8. How would you feel if prevented from performing your compulsion(s)? How anxious would you become?",
    options: [
      "None",
      "Only slightly anxious if compulsions prevented",
      "Anxiety would mount but remain manageable if compulsions prevented",
      "Prominent and very disturbing increase in anxiety if compulsions interrupted",
      "Incapacitating anxiety from any intervention aimed at modifying activity",
    ],
  },
  {
    text: "9. How much of an effort do you make to resist the compulsions?",
    options: [
      "Always try to resist",
      "Try to resist most of the time",
      "Make some effort to resist",
      "Yield to compulsions without attempting to control them, but with some reluctance",
      "Completely and willingly yield to compulsions",
    ],
  },
  {
    text: "10. How strong is the drive to perform the compulsive behavior? How much control do you have over the compulsions?",
    options: [
      "Complete control",
      "Pressure to perform the behavior but usually able to exercise voluntary control over it",
      "Strong pressure to perform behavior, can control it only with difficulty",
      "Very strong drive to perform behavior, must be carried to completion, can only delay with difficulty",
      "Drive to perform behavior experienced as completely involuntary and over-powering, rarely able to even momentarily delay activity",
    ],
  },
];

const getScoreDescription = (score: number) => {
  if (score >= 0 && score <= 7) {
    return "Subclinical OCD symptoms";
  } else if (score >= 8 && score <= 15) {
    return "Mild OCD";
  } else if (score >= 16 && score <= 23) {
    return "Moderate OCD";
  } else if (score >= 24 && score <= 31) {
    return "Severe OCD";
  } else if (score >= 32 && score <= 40) {
    return "Extreme OCD";
  }
  return "Invalid score";
};

const scoreInterpretations = [
  { range: "0-7", description: "Subclinical OCD symptoms" },
  { range: "8-15", description: "Mild OCD" },
  { range: "16-23", description: "Moderate OCD" },
  { range: "24-31", description: "Severe OCD" },
  { range: "32-40", description: "Extreme OCD" },
];

const Ybocs = ({
  onScoreCalculated,
  onNext,
  buttonLabel,
  skipApiSubmit = false,
  hideHeader = false,
}: {
  onScoreCalculated?: (
    obsessiveScore: number,
    compulsiveScore: number,
    totalScore: number
  ) => void;

  onNext?: () => void;
  buttonLabel?: string;
  skipApiSubmit?: boolean;
  hideHeader?: boolean;
}) => {
  const [answers, setAnswers] = useState(
    Array(questionsObsessions.length + questionsCompulsions.length).fill(null)
  );
  const [obsessionScore, setObsessionScore] = useState<number | null>(null);
  const [compulsionScore, setCompulsionScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [scoreDescription, setScoreDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  const posthog = usePostHog();

  useEffect(() => {
    console.log(
      "Component mounted, initial isSubmitDisabled:",
      isSubmitDisabled
    );
  }, []);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    setError(null);
  };

  const calculateScore = async () => {
    console.log("calculateScore called");

    if (answers.some((answer) => answer === null)) {
      setError("Please answer all questions before submitting.");
      setObsessionScore(null);
      setCompulsionScore(null);
      setTotalScore(null);
      setScoreDescription(null);
    } else {
      const obsessionTotal = answers
        .slice(0, questionsObsessions.length)
        .reduce((sum, value) => sum + (value || 0), 0);
      const compulsionTotal = answers
        .slice(questionsObsessions.length)
        .reduce((sum, value) => sum + (value || 0), 0);
      const total = obsessionTotal + compulsionTotal;

      // Save results to API
      if (!skipApiSubmit) {
        try {
          const response = await fetch(`${API_URL}/assessments/ybocs/`, {
            method: "POST",
            headers: {
              Authorization: `Token ${TokenService.getToken()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              obsessive_score: obsessionTotal,
              compulsive_score: compulsionTotal,
              total_score: total,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save YBOCS results");
          }
        } catch (error) {
          console.error("Error saving YBOCS results:", error);
        }
      }

      setObsessionScore(obsessionTotal);
      setCompulsionScore(compulsionTotal);
      setTotalScore(total);
      setScoreDescription(getScoreDescription(total));
      setError(null);
      setIsSubmitDisabled(true);
      console.log("isSubmitDisabled set to true");
      if (onScoreCalculated)
        onScoreCalculated(obsessionTotal, compulsionTotal, total);
      posthog.capture("assessment_completed", {
        assessment: "ybocs",
      });
    }
  };

  const resetForm = () => {
    console.log("resetForm called, resetting isSubmitDisabled");
    setAnswers(
      Array(questionsObsessions.length + questionsCompulsions.length).fill(null)
    );
    setObsessionScore(null);
    setCompulsionScore(null);
    setTotalScore(null);
    setScoreDescription(null);
    setError(null);
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (totalScore !== null && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [totalScore]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>10 Question OCD Test</h1>
          <p className={styles.description}>
            The Yale-Brown Obsessive Compulsive Scale (Y-BOCS) is a test to
            measure the severity of OCD symptoms. This self-assessment can help
            you understand the impact of OCD on your daily life.
          </p>

          <form className={styles.questionnaire}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Obsessions</h2>
              <p className={styles.sectionDescription}>
                Obsessions are unwelcomed and distressing ideas, thoughts, or
                impulses that repeatedly enter your mind.
                <br></br>
                They may seem to occur against your will. They may be repugnant
                to you, you may recognize them as senseless, and they may not
                fit your personality.
              </p>

              {questionsObsessions.map((question, index) => (
                <div key={index} className={styles.questionItem}>
                  <p className={styles.questionText}>{question.text}</p>
                  <div className={styles.optionsContainer}>
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        type="button"
                        className={`${styles.optionButton} ${
                          answers[index] === optionIndex
                            ? styles.selectedOption
                            : ""
                        }`}
                        onClick={() => handleAnswerChange(index, optionIndex)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className={styles.halfwaySection}>
                Nice work; you're halfway through the quiz!
              </div>
            </div>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Compulsions</h2>
              <p className={styles.sectionDescription}>
                Compulsions are repetitive behaviors or mental acts done to
                reduce anxiety or discomfort. These can include washing,
                checking, repeating, hoarding, or straightening, often done
                excessively. &nbsp;
                <strong>Some rituals are mental</strong>, like silently
                repeating words or phrases.
              </p>

              {questionsCompulsions.map((question, index) => (
                <div
                  key={index + questionsObsessions.length} // Offset key for unique identification
                  className={styles.questionItem}
                >
                  <p className={styles.questionText}>{question.text}</p>
                  <div className={styles.optionsContainer}>
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        type="button"
                        className={`${styles.optionButton} ${
                          answers[index + questionsObsessions.length] ===
                          optionIndex
                            ? styles.selectedOption
                            : ""
                        }`}
                        onClick={() =>
                          handleAnswerChange(
                            index + questionsObsessions.length,
                            optionIndex
                          )
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.buttonContainer}>
              {/* WARNING: Changing this Calculate Score button or its behavior may affect our PostHog weekly active user metric.
              We track clicks on this button as part of our user engagement analytics. Please consult with someone who's worked on the PostHog integration before making changes.*/}
              <button
                type="button"
                onClick={() => {
                  console.log("Button clicked");
                  calculateScore();
                }}
                className={styles.submitButton}
                disabled={isSubmitDisabled}
              >
                Calculate Score
              </button>

              {totalScore !== null && !onNext && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.resetButton}
                >
                  Reset
                </button>
              )}
            </div>

            {totalScore !== null && scoreDescription && (
              <>
                <div ref={resultsSectionRef}>
                  <div className={styles.resultSection}>
                    <h2 className={styles.resultTitle}>Your Results</h2>
                    <p className={styles.scoreText}>
                      Obsession Score:{" "}
                      <span className={styles.scoreValue}>
                        {obsessionScore}
                      </span>
                    </p>
                    <p className={styles.scoreText}>
                      Compulsion Score:{" "}
                      <span className={styles.scoreValue}>
                        {compulsionScore}
                      </span>
                    </p>
                    <p className={styles.scoreText}>
                      Total Y-BOCS Score:{" "}
                      <span className={styles.scoreValue}>{totalScore}</span>
                    </p>
                    <p className={styles.scoreDescription}>
                      {scoreDescription}
                    </p>
                  </div>
                </div>
                <p className={styles.scoreDescription}>
                  <strong>
                    We've helped people get from an OCD score of 27 down to 13,
                    just using our course!
                  </strong>
                </p>
                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    className={`${styles.submitButton} ${styles.continueButton}`}
                  >
                    {buttonLabel}
                  </button>
                )}
              </>
            )}
            {!onNext && (
              <div className={styles.interpretationSection}>
                <h2 className={styles.interpretationTitle}>
                  Score Interpretation
                </h2>
                <p className={styles.interpretationDescription}>
                  Each question is scored from 0 to 4, with the total score
                  ranging from 0 to 40.
                </p>
                <table className={styles.interpretationTable}>
                  <thead>
                    <tr>
                      <th>Score Range</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreInterpretations.map((item, index) => (
                      <tr key={index}>
                        <td>{item.range}</td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default Ybocs;
