"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import GridOptionsSlide from "@/app/pages/onboarding/onboarding-slides/grid-options-slide";
import DidYouKnowTextSlide from "@/app/pages/onboarding/onboarding-slides/did-you-know-text-slide";
import ProgressTracker from "@/app/pages/onboarding/onboarding-slides/progress-tracker";
import AccountCreationSlide from "@/app/pages/onboarding/onboarding-slides/account-creation-slide";
import PersonalizedTextMultiSelectionSlide from "@/app/pages/onboarding/onboarding-slides/personalized-text-multi-selection-slide";
import PersonalizedTextOneSelectionSlide from "@/app/pages/onboarding/onboarding-slides/personalized-text-one-selection-slide";
import {
  goalOptions,
  frequencyOptions,
  impactCategoryOptions,
  erpExperienceOptions,
  saveSelectedGoals,
  saveSelectedSymptomFrequency,
  saveSelectedImpactCategories,
  saveSelectedErpExperience,
  optionBackgroundColors,
  goalStats,
  impactStats,
} from "./utils";
import ProgramCreationAnimation from "@/app/pages/onboarding/onboarding-slides/program-creation-animation";
import ListOptionsSlide from "@/app/pages/onboarding/onboarding-slides/list-options-slide";
import IntroSlide from "@/app/pages/onboarding/onboarding-slides/intro-slide";
import { usePostHog } from "posthog-js/react";
import { useProtectAuthRoute } from "@/hooks/useAuthHooks";
import { useRouter } from "next/navigation";

const CoursePage = () => {
  //  useProtectAuthRoute();
  const router = useRouter();

  const posthog = usePostHog();
  const [slide, setSlide] = useState(1); // TEMP DO NOT PUSH TO PROD WITHOUT CHANGING TO 1

  // This saves the user's selections; so we can save it all aftey they create an account.
  const [selectedGoal, setSelectedGoal] = useState<number[]>([]);
  const [ocdFrequency, setOcdFrequency] = useState<number>(-1); // TODO WHY?
  const [impactAreas, setImpactAreas] = useState<number[]>([]);
  const [erpExperience, setErpExperience] = useState<number>(-1);

  const totalSlidesForProgressBar = 9;

  useEffect(() => {
    if (slide === 1) {
      console.log("Logging Posthog event: onboarding_started");
      posthog.capture("onboarding_started");
    }
    logSlide(slide);
  }, [slide]);

  const nextSlide = () => {
    // First, scroll to top - this is an awesome hack that fixes a bug where folks might scroll down to the bottom of a slide; then the next slide starts at a weird place.
    window.scrollTo(0, 0);

    // Then change the slide
    setSlide((prevSlide) => prevSlide + 1);
  };

  const logSlide = (slideNumber) => {
    console.log("Logging Posthog event: onboarding_slide_viewed", {
      slide: slideNumber,
    });
    posthog.capture("onboarding_slide_viewed", { slide: slideNumber });
  };

  const saveAllUserSelections = async () => {
    await Promise.all([
      saveSelectedGoals(selectedGoal),
      saveSelectedSymptomFrequency(ocdFrequency),
      saveSelectedImpactCategories(impactAreas),
      saveSelectedErpExperience(erpExperience),
    ]);
  };

  const handleAccountCreation = async () => {
    await saveAllUserSelections();
    // Redirect to payment flow with next slide number
    router.push(`/pages/onboarding/payment?slide=${slide + 1}`);
  };

  return (
    <div className={styles.container}>
      {slide < totalSlidesForProgressBar && (
        <div className={styles.progressTrackerContainer}>
          <ProgressTracker
            currentStep={slide}
            totalSteps={totalSlidesForProgressBar}
          />
        </div>
      )}
      <div key={slide} className={styles.fadeIn}>
        {slide === 1 && (
          <IntroSlide
            title="Answer a few questions to personalize your experience."
            onNext={nextSlide}
          />
        )}

        {slide === 2 && (
          <GridOptionsSlide
            title="Select the goals that matter to you"
            options={goalOptions.map((opt) => ({
              text: opt.text,
              icon: "🎯",
            }))}
            backgroundColors={Object.values(optionBackgroundColors)}
            onSubmit={(indices) => {
              setSelectedGoal(indices);
              nextSlide();
            }}
            multiSelect={true}
          />
        )}

        {/*Naming is a little confusing; because the multi-selection slide type should be used regardless of if 1 or many options is chosen on previous slide. */}
        {slide === 3 && (
          <PersonalizedTextMultiSelectionSlide
            title="Here's what our members are saying: "
            stats={goalStats}
            selectedGoals={selectedGoal}
            footnote="Based on a study of members who use Mango four times per week, for 3 weeks"
            onNext={nextSlide}
          />
        )}

        {slide === 4 && (
          <ListOptionsSlide
            title="Frequency of repetitive thoughts"
            text="How often are you experiencing repetitive thoughts each day?"
            options={frequencyOptions.map((opt) => ({
              text: opt.text,
              icon: "⏰",
            }))}
            onSelect={(index) => {
              setOcdFrequency(index);
              nextSlide();
            }}
            backgroundColors={Object.values(optionBackgroundColors)}
          />
        )}

        {slide === 5 && (
          <GridOptionsSlide
            title="How does OCD impact you? (select all that apply)"
            options={impactCategoryOptions.map((opt) => ({
              text: opt.text,
              icon: "🎯",
            }))}
            backgroundColors={Object.values(optionBackgroundColors)}
            onSubmit={(selectedIndices) => {
              setImpactAreas(selectedIndices);
              nextSlide();
            }}
            multiSelect={true}
          />
        )}
        {/* TODO move these strings into the utils. Optional - capitalize if used in bulleted list*/}
        {slide === 6 &&
          (impactAreas.length === 1 ? (
            <PersonalizedTextOneSelectionSlide
              title="Principles used by our AI guides have helped <strong>millions</strong> of people"
              stats={impactStats}
              selectedGoals={impactAreas}
              onNext={nextSlide}
            />
          ) : (
            <PersonalizedTextMultiSelectionSlide
              title="Principles used by our AI guides have helped <strong>millions</strong> of people"
              stats={impactStats}
              selectedGoals={impactAreas}
              onNext={nextSlide}
            />
          ))}

        {slide === 7 && (
          <DidYouKnowTextSlide
            title=""
            subtitle="DID YOU KNOW?"
            splitTitle={{
              main: "On Mango, your conversations are:",
              bullets: [
                "Anonymous by design",
                "Securely encrypted",
                "100% confidential, never shared.",
              ],
            }}
            onNext={nextSlide}
          />
        )}

        {slide === 8 && (
          <ListOptionsSlide
            title="What best describes your experience with ERP therapy?"
            text="Your AI guide will be tailored to your experience level."
            options={erpExperienceOptions.map((opt) => ({
              text: opt.text,
              icon: "📚",
            }))}
            backgroundColors={Object.values(optionBackgroundColors)}
            onSelect={(index) => {
              setErpExperience(index);
              nextSlide();
            }}
          />
        )}

        {slide === 9 && <ProgramCreationAnimation onNext={nextSlide} />}

        {slide === 10 && (
          <AccountCreationSlide
            title="Sign Up"
            onSubmit={handleAccountCreation}
            onSaveAccountDetails={saveAllUserSelections}
          />
        )}
      </div>
    </div>
  );
};

export default CoursePage;
