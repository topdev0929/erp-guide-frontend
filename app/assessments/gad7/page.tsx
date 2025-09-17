"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/assessments/gad7/page.module.css";
import { API_URL, TokenService } from "@/app/api/auth";
import Link from "next/link";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";

const questions = [
  {
    text: "1. Feeling nervous, anxious, or on edge",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
  {
    text: "2. Not being able to stop or control worrying",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
  {
    text: "3. Worrying too much about different things",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
  {
    text: "4. Trouble relaxing",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
  {
    text: "5. Being so restless that it's hard to sit still",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
  {
    text: "6. Becoming easily annoyed or irritable",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
  {
    text: "7. Feeling afraid as if something awful might happen",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
  },
];

const getScoreDescription = (score: number) => {
  if (score >= 0 && score <= 4) {
    return "Minimal anxiety";
  } else if (score >= 5 && score <= 9) {
    return "Mild anxiety";
  } else if (score >= 10 && score <= 14) {
    return "Moderate anxiety";
  } else if (score >= 15) {
    return "Severe anxiety";
  }
  return "Invalid score";
};

const scoreInterpretations = [
  { range: "0-4", description: "Minimal anxiety" },
  { range: "5-9", description: "Mild anxiety" },
  { range: "10-14", description: "Moderate anxiety" },
  { range: "15-21", description: "Severe anxiety" },
];

const Home = () => {
  const posthog = usePostHog();
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [scoreDescription, setScoreDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resultsSectionRef = useRef<HTMLDivElement>(null);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    setError(null);
  };

  const calculateScore = async (e: React.MouseEvent) => {
    if (answers.some((answer) => answer === null)) {
      setError("Please answer all questions before submitting.");
      setTotalScore(null);
      setScoreDescription(null);
    } else {
      const total = answers.reduce((sum, value) => sum + (value || 0), 0);

      try {
        const response = await fetch(`${API_URL}/assessments/gad7/`, {
          method: "POST",
          headers: {
            Authorization: `Token ${TokenService.getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: total,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit GAD-7 score");
        }

        setTotalScore(total);
        setScoreDescription(getScoreDescription(total));
        setError(null);
        posthog.capture("assessment_completed", {
          assessment: "gad7",
        });
      } catch (error) {
        console.error("Error submitting GAD-7 score:", error);
        setError("Failed to submit score. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setAnswers(Array(questions.length).fill(null));
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
          <h1 className={styles.title}>GAD-7: Anxiety Self-Assessment</h1>
          <p className={styles.description}>
            The Generalized Anxiety Disorder-7 (GAD-7) is a self-reported
            questionnaire for screening and measuring the severity of
            generalized anxiety disorder. Over the last 2 weeks, how often have
            you been bothered by the following problems?
          </p>

          <form className={styles.questionnaire}>
            {questions.map((question, index) => (
              <div key={index} className={styles.question}>
                <h2 className={styles.questionText}>{question.text}</h2>
                <ul className={styles.answerList}>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <label className={styles.answerLabel}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={optionIndex}
                          onChange={() =>
                            handleAnswerChange(index, optionIndex)
                          }
                          checked={answers[index] === optionIndex}
                        />
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={(e) => calculateScore(e)}
                className={styles.submitButton}
              >
                Calculate Score
              </button>
              {totalScore !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.resetButton}
                >
                  Reset
                </button>
              )}
            </div>
            {totalScore !== null && (
              <div className={styles.results} ref={resultsSectionRef}>
                <div className={styles.resultSection}>
                  <h2 className={styles.resultTitle}>Your Results</h2>
                  <p className={styles.scoreText}>
                    Total GAD-7 Score:{" "}
                    <span className={styles.scoreValue}>{totalScore}</span>
                  </p>
                  <p className={styles.scoreDescription}>
                    Based on your score, your anxiety level is:{" "}
                    {scoreDescription}
                  </p>
                </div>

                <div className={styles.interpretationSection}>
                  <h2 className={styles.interpretationTitle}>
                    Score Interpretation
                  </h2>
                  <p className={styles.interpretationDescription}>
                    The GAD-7 score ranges from 0 to 21 with each question being
                    scored from 0 to 3. The anxiety severity is interpreted as
                    follows:
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
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
