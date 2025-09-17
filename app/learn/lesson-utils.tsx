import { SessionType } from "@/app/types/types";
import {
  LucideIcon,
  BookOpen,
  Target,
  Glasses,
  BarChart3,
  Flame,
  Brain,
  Activity,
  Crosshair,
  Compass,
  ScrollText,
  PenTool,
  Clock,
  Waves,
  HelpCircle,
  Shield,
  AlertCircle,
  Repeat,
  MessageCircleQuestion,
  Gauge,
  Wind,
  Moon,
  Users,
  Check,
} from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

export const getCompletedLessons = async (): Promise<string[]> => {
  try {
    const response = await apiCall(
      "/lessons/completed/",
      ApiMethod.Get,
      "get completed lessons"
    );
    return response.completed_lessons || [];
  } catch (error) {
    console.error("Error fetching completed lessons:", error);
    return [];
  }
};

/*
WARNING: lessonType is an explicit Lesson type on the backendfor AI based lessons. But for the assessments and planner, there is no explicit Lesson. The completed_lessons() API returns "ybocs", "gad7", and "plan" only so the frontend can mark those with checkboxes while still making only one API call. 
*/
export interface Lesson {
  title: string;
  description: string;
  icon: LucideIcon;
  lessonType?: string;
  customPath?: string;
  disabled?: boolean;
  completed?: boolean;
  // Legacy behavior fields
  useLegacyBehavior?: boolean;
  moduleId?: string;
}

export const gettingStartedLessons: Lesson[] = [
  // NEW IMPLEMENTATION - Uses /chat/[lessonType]
  {
    title: "1. Intro to the Basics (3 min)",
    description: "Foundation concepts of OCD and recovery",
    icon: BookOpen,
    lessonType: "basics",
  },

  // LEGACY IMPLEMENTATION - Uses /meta with moduleId
  {
    title: "2. Identifying your OCD subtypes (4 min) ",
    description: "Understand your specific OCD manifestation",
    icon: Target,
    lessonType: "subtypes",
    useLegacyBehavior: true,
    moduleId: "subtypes",
  },
  {
    title: "3. Spotting Obsessions and Compulsions (6 min) ",
    description: "Learn to identify OCD patterns",
    icon: Glasses,
    lessonType: "obsessions-compulsions",
    useLegacyBehavior: true,
    moduleId: "obsessions-compulsions",
  },

  // CUSTOM PATH IMPLEMENTATION - Uses customPath
  {
    title: "4. Measuring Your OCD Score (5 min) ",
    description:
      "Assess your current OCD severity; and revisit to track your progress over time",
    icon: BarChart3,
    lessonType: "ybocs",
    customPath: "/assessments/ybocs",
  },

  // LEGACY IMPLEMENTATION - Uses /meta with moduleId
  {
    title: "5. Building Motivation (6 min) ",
    description: "Develop drive for recovery",
    icon: Flame,
    lessonType: "motivation",
    useLegacyBehavior: true,
    moduleId: "motivation",
  },
  {
    title: "6. First Guided ERP Session (15 min)",
    description: "Begin your ERP journey",
    icon: Brain,
    lessonType: "first-erp",
    useLegacyBehavior: true,
    moduleId: "first-erp",
  },
  {
    title: "7. Exposure Hierarchy (10 min)",
    description: "Create your recovery roadmap",
    icon: Activity,
    lessonType: "hierarchy",
    useLegacyBehavior: true,
    moduleId: "hierarchy",
  },

  // CUSTOM PATH IMPLEMENTATION - Uses customPath
  {
    title: "8. First Exposure Plan (6 min)",
    description: "Design a structured exposure exercise",
    icon: Crosshair,
    lessonType: "plan",
    customPath: "/plans/initial-questions",
  },

  // LEGACY IMPLEMENTATION - Uses /meta with moduleId
  {
    title: "9. Next Steps (3 min)",
    description: "Plan your continued recovery journey",
    icon: Compass,
    lessonType: "next-steps",
    useLegacyBehavior: true,
    moduleId: "next-steps",
  },
];

/* NOTE: If path is empty quotes; then it's automatically disabled */
export const libraryLessons: Lesson[] = [
  // LEGACY IMPLEMENTATION - Uses /meta with moduleId
  {
    title: "Exposure Script Writing Techniques",
    description: "Create effective exposure scripts",
    icon: PenTool,
    lessonType: "script",
    useLegacyBehavior: true,
    moduleId: "script-writing",
  },

  // CUSTOM PATH IMPLEMENTATION - Uses customPath
  {
    title: "Measuring Your Anxiety Score",
    description:
      "Assess your current anxiety level, and watch it improve over time",
    icon: Compass,
    lessonType: "gad7",
    customPath: "/assessments/gad7",
  },

  // LEGACY IMPLEMENTATION - Uses /meta with moduleId
  {
    title: "Exploring Exposure Techniques",
    description:
      "Discover various approaches including articles, videos, scripts, and in-person exposures",
    icon: Compass,
    lessonType: "exposure-techniques",
    useLegacyBehavior: true,
    moduleId: "exposure-techniques",
  },
  {
    title: "You're Not Alone",
    description:
      "No matter what intrusive thoughts you have, it's just OCD, not a reflection of who you are",
    icon: Users,
    lessonType: "stigma",
    useLegacyBehavior: true,
    moduleId: "ocd-stigma",
  },
  {
    title: "How OCD Changes over Time",
    description:
      "Learn how OCD transforms and apply consistent skills to manage it",
    icon: Clock,
    lessonType: "shapeshifting",
    useLegacyBehavior: true,
    moduleId: "shapeshifting",
  },
  {
    title: "The Doubting Disease",
    description: "Understanding why OCD is known as the doubting disease",
    icon: HelpCircle,
    lessonType: "doubting-disease",
    useLegacyBehavior: true,
    moduleId: "doubting-disease",
  },
  {
    title: "Using ERP as a compulsion",
    description: "Avoiding the trap of turning treatment into ritual",
    icon: Repeat,
    lessonType: "erp-as-compulsion",
    useLegacyBehavior: true,
    moduleId: "compulsive-erp",
  },
  {
    title: "Misconceptions and Misdiagnoses",
    description: "Navigate common misunderstandings and diagnostic challenges",
    icon: AlertCircle,
    lessonType: "misdiagnosis",
    useLegacyBehavior: true,
    moduleId: "misdiagnosis",
  },
  {
    title: "Pure O",
    description: "Understanding and managing mental compulsions",
    icon: Brain,
    lessonType: "pure-ocd",
    useLegacyBehavior: true,
    moduleId: "pureo",
  },
  {
    title: "OCD Vs ADHD, Anxiety, and PTSD",
    description:
      "Understanding the differences between OCD and other conditions with similiarities",
    icon: Brain,
    lessonType: "ocd-adhd-anxiety-ptsd",
    useLegacyBehavior: true,
    moduleId: "ocd-adhd-anxiety-ptsd",
  },

  // NOT IMPLEMENTED YET - Remain disabled (these had empty moduleId in old system)
  {
    title: "Spiraling, Spiking, and Flare-ups",
    description: "Recognize patterns in how OCD impacts your daily life",
    icon: Waves,
    lessonType: "spiral",
    disabled: true,
  },
  {
    title: "Trusting yourself",
    description: "Learn to embrace uncertainty and let go of control",
    icon: Shield,
    lessonType: "trusting-yourself",
    disabled: true,
  },
  {
    title: "Identifying Hard-To-Spot OCD Symptoms",
    description: "Recognize subtle OCD manifestations",
    icon: Target,
    lessonType: "spotting-obsessions-and-compulsions",
    disabled: true,
  },
  {
    title: "How to Do ERP The Right Way",
    description: "Master ERP techniques",
    icon: ScrollText,
    lessonType: "erp-techniques",
    disabled: true,
  },
  {
    title: "What is Reassurance",
    description: "Understanding the role of reassurance in OCD",
    icon: MessageCircleQuestion,
    lessonType: "reassurance",
    disabled: true,
  },
  {
    title: "Trouble Boosting Discomfort",
    description: "Managing low anxiety during ERP exercises",
    icon: Gauge,
    lessonType: "trouble-boosting-discomfort",
    disabled: true,
  },
  {
    title: "Values",
    description: "Identifying core values and building the life you want",
    icon: Crosshair,
    lessonType: "values",
    disabled: true,
  },
  {
    title: "Bedtime Routines",
    description: "Making sleep time work for you",
    icon: Moon,
    lessonType: "bedtime-routines",
    disabled: true,
  },
  {
    title: "Exposure Coaching",
    description: "Working with others to keep you accountable",
    icon: Users,
    lessonType: "exposure-coaching",
    disabled: true,
  },
  {
    title: "Medication vs Therapy",
    description: "Comparing treatment approaches",
    icon: Wind,
    lessonType: "medication-vs-therapy",
    disabled: true,
  },
];
