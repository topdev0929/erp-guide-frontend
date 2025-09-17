import { ApiMethod } from "@/app/types/types";
import { apiCall } from "@/app/api/api-utils";
import StressIcon from "@/app/components/icons/stress-icon";
import FocusIcon from "@/app/components/icons/focus-icon";
import React from "react";

export const optionBackgroundColors = {
  lightGreen: "#E8F5E8",
  lightMint: "#E1F5F4",
  lightPeach: "#FFF4F2",
  lightPurple: "#F8F7FC",
};

export const goalOptions = [
  {
    text: "Reducing My Obsessions",
  },
  {
    text: "Spending Less Time on Compulsions",
  },
  {
    text: "Feeling Less Anxious",
  },
  {
    text: "Reducing My Reassurance-Seeking",
  },
];

export const goalStats = [
  {
    text: "81% report obsessing less",
    correspondingGoalIndex: 0,
    icon: React.createElement(StressIcon),
  },
  {
    text: "92% report fewer compulsions",
    correspondingGoalIndex: 1,
    icon: React.createElement(StressIcon),
  },
  {
    text: "87% report lower anxiety",
    correspondingGoalIndex: 2,
    icon: React.createElement(FocusIcon),
  },
  {
    text: "95% report less time reassurance-seeking",
    correspondingGoalIndex: 3,
    icon: React.createElement(StressIcon),
  },
];

enum ThoughtFrequency {
  UP_TO_ONE = "up_to_one",
  ONE_TO_TWO = "one_to_two",
  MORE_THAN_TWO = "more_than_two",
}

export const frequencyOptions = [
  {
    text: "Up to 1 hour",
    value: ThoughtFrequency.UP_TO_ONE,
  },
  {
    text: "1 to 2 hours",
    value: ThoughtFrequency.ONE_TO_TWO,
  },
  {
    text: "More than 2 hours",
    value: ThoughtFrequency.MORE_THAN_TWO,
  },
];

enum ImpactCategory {
  JOB = "job",
  RELATIONSHIPS = "relationships",
  DAILY_ACTIVITIES = "daily_activities",
  MENTAL_HEALTH = "mental_health",
}

export const impactCategoryOptions = [
  {
    text: "Job & Productivity",
    value: ImpactCategory.JOB,
  },
  {
    text: "Relationships",
    value: ImpactCategory.RELATIONSHIPS,
  },
  {
    text: "Daily Activities and Routines",
    value: ImpactCategory.DAILY_ACTIVITIES,
  },
  {
    text: "Emotional & Mental Health",
    value: ImpactCategory.MENTAL_HEALTH,
  },
];

export const impactStats = [
  {
    text: "achieve professional goals and improve focus at work.",
    correspondingGoalIndex: 0,
    icon: React.createElement(FocusIcon),
  },
  {
    text: "regain control over their relationships.",
    correspondingGoalIndex: 1,
    icon: React.createElement(StressIcon),
  },
  {
    text: "overcome OCD's impact on daily routines.",
    correspondingGoalIndex: 2,
    icon: React.createElement(FocusIcon),
  },
  {
    text: "improve their emotional well-being.",
    correspondingGoalIndex: 3,
    icon: React.createElement(FocusIcon),
  },
];

enum ErpExperience {
  INTRODUCTORY = "introductory",
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export const erpExperienceOptions = [
  { text: "Haven't heard of it", value: ErpExperience.INTRODUCTORY },
  {
    text: "Read about it, haven't tried it",
    value: ErpExperience.BEGINNER,
  },
  { text: "Tried it on my own", value: ErpExperience.INTERMEDIATE },
  {
    text: "Worked with a therapist before",
    value: ErpExperience.ADVANCED,
  },
];

export const saveSelectedGoals = async (indices: number[]) => {
  try {
    await Promise.all(
      indices.map((index) =>
        apiCall("/onboarding/goals/", ApiMethod.Post, "save user goal", {
          goal: goalOptions[index].text,
        })
      )
    );
    console.log("Goals saved successfully");
  } catch (error) {
    console.error("Error saving goals:", error);
  }
};

export const saveSelectedSymptomFrequency = async (index: number) => {
  try {
    await apiCall(
      "/onboarding/thought-frequency/",
      ApiMethod.Post,
      "save symptom frequency",
      { thought_frequency: frequencyOptions[index].value }
    );
    console.log("Symptom frequency saved successfully");
  } catch (error) {
    console.error("Error saving symptom frequency:", error);
  }
};

export const saveSelectedImpactCategories = async (indices: number[]) => {
  try {
    await Promise.all(
      indices.map((index) =>
        apiCall(
          "/onboarding/impact-categories/",
          ApiMethod.Post,
          "save impact category",
          { impact_category: impactCategoryOptions[index].value }
        )
      )
    );
    console.log("Impact categories saved successfully");
  } catch (error) {
    console.error("Error saving impact categories:", error);
  }
};

export const saveSelectedErpExperience = async (index: number) => {
  try {
    await apiCall(
      "/onboarding/erp-experience/",
      ApiMethod.Post,
      "save ERP experience",
      { erp_experience: erpExperienceOptions[index].value }
    );
    console.log("ERP experience saved successfully");
  } catch (error) {
    console.error("Error saving ERP experience:", error);
  }
};
