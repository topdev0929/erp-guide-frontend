import { apiCall } from "@/app/api/api-utils";
import { ApiMethod, SessionType } from "@/app/types/types";
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
} from "lucide-react";

export interface LessonCompletionStatus {
  completed: boolean;
  completedAt?: string;
}

export interface Lesson {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  completionType: string;
  moduleId?: string;
  disabled?: boolean;
  completed?: boolean;
}

// Special case mapping for non-standard lesson paths
export const SPECIAL_LESSON_PATHS = {
  "/assessments/ybocs": "ybocs",
  "/assessments/gad7": "gad7",
} as const;

// Helper to check if a lesson needs special handling
export const isSpecialLessonPath = (path: string): boolean => {
  return path in SPECIAL_LESSON_PATHS;
};

// Explanation: Most lessons follow our new check of 'pull the last thing off the url; that's a session type; let's see if that's in the completed lessons array. But for some, like 'ybocs', gad7, 'erp-techniques' etc. that's not neccessarily a session type / we can't just pull something off the url. So it's mapped here.
export const getCompletionType = (path: string): string => {
  if (isSpecialLessonPath(path)) {
    return SPECIAL_LESSON_PATHS[path as keyof typeof SPECIAL_LESSON_PATHS];
  }

  // Existing session type logic for standard paths
  const type = path
    .replace(/^\/|\/$/g, "")
    .split("/")
    .pop() as SessionType;

  if (!type) {
    console.error(`Invalid completion type from path: ${path}`);
    return SessionType.Basics; // Default fallback
  }

  return type;
};

/**
 * Fetches array of completed lesson IDs
 */
export const getLessonCompletionStatuses = async (): Promise<string[]> => {
  try {
    const response = await apiCall(
      "/user/completed_lessons/",
      ApiMethod.Get,
      "check completed sessions"
    );
    return response.completed_lessons || [];
  } catch (error) {
    console.error("Error fetching completed lessons:", error);
    return [];
  }
};

/**
 * Marks a module as complete
 * @param moduleId - The ID of the module to mark as complete
 * @returns An array of all completed module IDs after the operation
 */
export const markModuleComplete = async (moduleId: string): Promise<string[]> => {
  try {
    const response = await apiCall(
      "/user/mark_module_complete/",
      ApiMethod.Post,
      "mark module as complete",
      { module_id: moduleId }
    );
    return response.completed_lessons || [];
  } catch (error) {
    console.error("Error marking module as complete:", error);
    return [];
  }
};

export const gettingStartedLessons: Lesson[] = [
  {
    title: "1. Intro to the Basics (3 min)",
    description: "Foundation concepts of OCD and recovery",
    icon: BookOpen,
    path: "/meta",
    completionType: "basics",
    moduleId: SessionType.Basics.toString(),
    completed: false,
  },
  {
    title: "2. Identifying your OCD subtypes (4 min) ",
    description: "Understand your specific OCD manifestation",
    icon: Target,
    path: "/meta",
    completionType: "subtypes",
    moduleId: SessionType.Subtypes.toString(),
    completed: false,
  },
  {
    title: "3. Spotting Obsessions and Compulsions (6 min) ",
    description: "Learn to identify OCD patterns",
    icon: Glasses,
    path: "/meta",
    completionType: "obsessions-compulsions",
    moduleId: SessionType.ObsessionsCompulsions.toString(),
    completed: false,
  },
  {
    title: "4. Measuring Your OCD Score (5 min) ",
    description:
      "Assess your current OCD severity; and revisit to track your progress over time",
    icon: BarChart3,
    path: "/assessments/ybocs",
    completionType: "ybocs",
    completed: false,
  },
  {
    title: "5. Building Motivation (6 min) ",
    description: "Develop drive for recovery",
    icon: Flame,
    path: "meta",
    completionType: "motivation",
    moduleId: SessionType.Motivation.toString(),
    completed: false,
  },
  {
    title: "6. First Guided ERP Session (15 min)",
    description: "Begin your ERP journey",
    icon: Brain,
    path: "meta",
    completionType: "first-erp",
    moduleId: SessionType.FirstErp.toString(),
    completed: false,
  },
  {
    title: "7. Exposure Hierarchy (10 min)",
    description: "Create your recovery roadmap",
    icon: Activity,
    path: "/meta",
    completionType: "hierarchy",
    moduleId: SessionType.Hierarchy.toString(),
    completed: false,
  },
  {
    title: "8. First Exposure Plan (6 min)",
    description: "Design a structured exposure exercise",
    icon: Crosshair,
    path: "/plans/initial-questions",
    completionType: "exposure-plan",
    moduleId: undefined,
    completed: false,
  },
  {
    title: "9. Next Steps (3 min)",
    description: "Plan your continued recovery journey",
    icon: Compass,
    path: "/meta",
    completionType: "next-steps",
    moduleId: SessionType.NextSteps.toString(),
    completed: false,
  },
];

/* NOTE: If path is empty quotes; then it's automatically disabled */
export const libraryLessons: Lesson[] = [
  {
    title: "Exposure Script Writing Techniques",
    description: "Create effective exposure scripts",
    icon: PenTool,
    path: "/meta",
    completionType: "script-writing",
    moduleId: SessionType.ScriptWriting.toString(),
    completed: false,
  },
  {
    title: "Measuring Your Anxiety Score",
    description:
      "Assess your current anxiety level, and watch it improve over time",
    icon: Compass,
    path: "/assessments/gad7",
    completionType: "gad7",
    disabled: true,
    completed: false,
  },
  {
    title: "Exploring Exposure Techniques",
    description:
      "Discover various approaches including articles, videos, scripts, and in-person exposures",
    icon: Compass,
    path: "/meta",
    completionType: "exposure-techniques",
    moduleId: SessionType.ExposureTechniques.toString(),
    disabled: true,
    completed: false,
  },
  {
    title: "You're Not Alone",
    description:
      "No matter what intrusive thoughts you have, it's just OCD, not a reflection of who you are",
    icon: Users,
    path: "/meta",
    completionType: "ocd-stigma",
    moduleId: SessionType.OCDStigma.toString(),
    disabled: true,
    completed: false,
  },
  {
    title: "How OCD Changes over Time",
    description:
      "Learn how OCD transforms and apply consistent skills to manage it",
    icon: Clock,
    path: "/meta",
    completionType: "shapeshifting",
    moduleId: SessionType.Shapeshifting.toString(),
    disabled: true,
    completed: false,
  },
  {
    title: "The Doubting Disease",
    description: "Understanding why OCD is known as the doubting disease",
    icon: HelpCircle,
    path: "/meta",
    completionType: "doubting-disease",
    moduleId: SessionType.DoubtingDisease.toString(),
    disabled: true,
    completed: false,
  },
  {
    title: "Using ERP as a compulsion",
    description: "Avoiding the trap of turning treatment into ritual",
    icon: Repeat,
    path: "/meta",
    completionType: "compulsive-erp",
    moduleId: SessionType.CompulsiveErp.toString(),
    disabled: true,
    completed: false,
  },
  {
    title: "Misconceptions and Misdiagnoses",
    description: "Navigate common misunderstandings and diagnostic challenges",
    icon: AlertCircle,
    path: "/meta",
    completionType: "misdiagnosis",
    moduleId: "misdiagnosis",
    disabled: true,
    completed: false,
  },
  {
    title: "Pure O",
    description: "Understanding and managing mental compulsions",
    icon: Brain,
    path: "/meta",
    completionType: "pureo",
    moduleId: "pureo",
    disabled: true,
    completed: false,
  },
  {
    title: "OCD Vs ADHD, Anxiety, and PTSD",
    description:
      "Understanding the differences between OCD and other conditions with similiarities",
    icon: Brain,
    path: "/meta",
    completionType: "ocd-adhd-anxiety-ptsd",
    moduleId: SessionType.OCDADHDAnxietyPTSD.toString(),
    disabled: true,
    completed: false,
  },
  {
    title: "Spiraling, Spiking, and Flare-ups",
    description: "Recognize patterns in how OCD impacts your daily life",
    icon: Waves,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },

  {
    title: "Trusting yourself",
    description: "Learn to embrace uncertainty and let go of control",
    icon: Shield,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },

  {
    title: "Identifying Hard-To-Spot OCD Symptoms",
    description: "Recognize subtle OCD manifestations",
    icon: Target,
    path: "",
    completionType: "spotting-obsessions-and-compulsions",
    moduleId: "",
    disabled: true,
    completed: false,
  },
  {
    title: "How to Do ERP The Right Way",
    description: "Master ERP techniques",
    icon: ScrollText,
    path: "",
    completionType: "erp-techniques",
    moduleId: "",
    disabled: true,
    completed: false,
  },

  {
    title: "What is Reassurance",
    description: "Understanding the role of reassurance in OCD",
    icon: MessageCircleQuestion,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },
  {
    title: "Trouble Boosting Discomfort",
    description: "Managing low anxiety during ERP exercises",
    icon: Gauge,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },
  {
    title: "Values",
    description: "Identifying core values and building the life you want",
    icon: Crosshair,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },
  {
    title: "Mindfulness in OCD Recovery",
    description: "Learn to observe thoughts without engaging with them",
    icon: Wind,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },
  {
    title: "Sleep",
    description:
      "Discover why sleep is the foundation of mental wellness and emotional resilience",
    icon: Moon,
    path: "",
    completionType: "",
    moduleId: "",
    disabled: true,
    completed: false,
  },
];
