/* TODO REFACTOR
AI DO NOT DELETE THESE COMMENTS 

We need to clean house here; and delete all the tools that the assistant DOESN'T need access to anymore. 
Ex. completeTYPEsession should be one tool with a parameter passed in like SessionType 

*/
export enum ToolNames {
  ToggleTimerDisplay = "toggleTimerDisplay",
  SetTimerLength = "setTimerLength",
  StartTimer = "startTimer",
  StopTimer = "stopTimer",
  TimeRemaining = "timeRemaining",
  Confetti = "confetti",
  ExtendTimer = "extendTimer",
  SaveExposureHierarchyData = "saveExposureHierarchyData",
  SaveExposurePlanWeek = "saveExposurePlanWeek",
  SaveExposureSessionDiscomfort = "saveExposureSessionDiscomfort",
  SaveObsessions = "saveObsessions",
  SaveCompulsions = "saveCompulsions",
  ResetObsessionsCompulsionsSubtypes = "resetObsessionsCompulsionsSubtypes",
  Home = "home",
  GetMotivation = "getMotivation",
  SaveMotivation = "saveMotivation",
  LogLessonComplete = "logLessonComplete",
  SaveScript = "saveScript",
  SaveSubtypes = "saveSubtypes",
  ListModules = "listModules",
  GetModule = "getModule",
  GetModuleContext = "getModuleContext",
  CompleteModule = "completeModule",
  GoToHierarchySortingPage = "goToHierarchySortingPage",
  GoToExposurePlanHistory = "goToExposurePlanHistory",
  SaveTherapyPreference = "saveTherapyPreference",
  SaveJournalEntry = "saveJournalEntry",
  SaveExposure = "saveExposure",
}

export interface AssistantTool {
  type: "function";
  function: {
    name: ToolNames;
    description: string;
    parameters?: {
      type: string;
      properties: {
        [key: string]: {
          type: string;
          description: string;
          enum?: string[];
          items?: {
            type: string;
            properties?: {
              [key: string]: {
                type: string;
                description: string;
              };
            };
            required?: string[];
          };
        };
      };
      required: string[];
    };
  };
}

// To learn more about the parameters and properties, read about json-schema
export const allTools: { [key in ToolNames]: AssistantTool } = {
  [ToolNames.ToggleTimerDisplay]: {
    type: "function",
    function: {
      name: ToolNames.ToggleTimerDisplay,
      description: "Toggle showing or hiding the timer",
    },
  },
  [ToolNames.SetTimerLength]: {
    type: "function",
    function: {
      name: ToolNames.SetTimerLength,
      description: "Set the timer to a specified length in minutes",
      parameters: {
        type: "object",
        properties: {
          duration: {
            type: "number",
            description: "The length of the timer",
          },
        },
        required: ["duration"],
      },
    },
  },
  [ToolNames.StartTimer]: {
    type: "function",
    function: {
      name: ToolNames.StartTimer,
      description: "Start the timer",
    },
  },
  [ToolNames.StopTimer]: {
    type: "function",
    function: {
      name: ToolNames.StopTimer,
      description: "Stop the timer",
    },
  },
  [ToolNames.TimeRemaining]: {
    type: "function",
    function: {
      name: ToolNames.TimeRemaining,
      description: "Provide the time remaining on the timer.",
    },
  },
  [ToolNames.Confetti]: {
    type: "function",
    function: {
      name: ToolNames.Confetti,
      description:
        "Display confetti when they are congratulated for completing a session",
    },
  },
  [ToolNames.ExtendTimer]: {
    type: "function",
    function: {
      name: ToolNames.ExtendTimer,
      description: "Extend the timer to a specified length in minutes",
      parameters: {
        type: "object",
        properties: {
          extensionMinutes: {
            type: "number",
            description: "The additional time to add in minutes",
          },
        },
        required: ["extensionMinutes"],
      },
    },
  },
  [ToolNames.SaveExposureHierarchyData]: {
    type: "function",
    function: {
      name: ToolNames.SaveExposureHierarchyData,
      description:
        "Save the unsorted list of exposure descriptions to local storage for later sorting",
      parameters: {
        type: "object",
        properties: {
          exposures: {
            type: "array",
            description: "The list of exposure descriptions to save",
            items: {
              type: "string",
            },
          },
        },
        required: ["exposures"],
      },
    },
  },

  [ToolNames.SaveExposurePlanWeek]: {
    type: "function",
    function: {
      name: ToolNames.SaveExposurePlanWeek,
      description: "Save the exposure plan for the week",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "A brief summary of the week's exposure plan",
          },
          target_obsession: {
            type: "string",
            description: "The primary obsession being targeted",
          },
          target_compulsion: {
            type: "string",
            description: "The primary compulsion being targeted",
          },
          length_of_exposure: {
            type: "string",
            description: "Duration of each exposure (e.g., '15-30 minutes')",
          },
          frequency_of_exposure: {
            type: "string",
            description:
              "How often to perform the exposure (e.g., '3 times per day')",
          },
          days: {
            type: "array",
            description: "List of daily exposure tasks",
            items: {
              type: "object",
              properties: {
                day_of_week: {
                  type: "number",
                  description: "Day of the week (0-6, where 0 is Sunday)",
                },
                description: {
                  type: "string",
                  description: "Description of the exposure task for this day",
                },
              },
              required: ["day_of_week", "description"],
            },
          },
        },
        required: [
          "summary",
          "target_obsession",
          "target_compulsion",
          "length_of_exposure",
          "frequency_of_exposure",
          "days",
        ],
      },
    },
  },
  [ToolNames.GoToExposurePlanHistory]: {
    type: "function",
    function: {
      name: ToolNames.GoToExposurePlanHistory,
      description: "Redirect to show the user's exposure plan history",
    },
  },

  [ToolNames.SaveExposureSessionDiscomfort]: {
    type: "function",
    function: {
      name: ToolNames.SaveExposureSessionDiscomfort,
      description:
        "Save the discomfort level of the user during the exposure session",
      parameters: {
        type: "object",
        properties: {
          discomfort_peak: {
            type: "number",
            description:
              "The peak discomfort level of the user during the exposure session",
          },
          discomfort_after: {
            type: "number",
            description:
              "The discomfort level of the user after the exposure session",
          },
        },
        required: ["discomfort_peak", "discomfort_after"],
      },
    },
  },
  [ToolNames.Home]: {
    type: "function",
    function: {
      name: ToolNames.Home,
      description: "Redirect to the home page",
    },
  },

  [ToolNames.SaveObsessions]: {
    type: "function",
    function: {
      name: ToolNames.SaveObsessions,
      description: "Save the obsessions",
      parameters: {
        type: "object",
        properties: {
          obsessions: {
            type: "array",
            description: "The list of obsessions to save",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  description: "Text description of the obsession",
                },
                subtype: {
                  type: "string",
                  description: "The OCD subtype category for this obsession",
                },
                current: {
                  type: "boolean",
                  description:
                    "Whether this obsession is either currently active or in the past",
                },
              },
              required: ["description", "subtype", "current"],
            },
          },
        },
        required: ["obsessions"],
      },
    },
  },
  [ToolNames.SaveCompulsions]: {
    type: "function",
    function: {
      name: ToolNames.SaveCompulsions,
      description: "Save the compulsions",
      parameters: {
        type: "object",
        properties: {
          compulsions: {
            type: "array",
            description: "The list of compulsions to save",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  description: "Text description of the compulsion",
                },
                subtype: {
                  type: "string",
                  description: "The OCD subtype category for this compulsion",
                },
                current: {
                  type: "boolean",
                  description:
                    "Whether this compulsion is either currently active or in the past",
                },
              },
              required: ["description", "subtype", "current"],
            },
          },
        },
        required: ["compulsions"],
      },
    },
  },
  [ToolNames.ResetObsessionsCompulsionsSubtypes]: {
    type: "function",
    function: {
      name: ToolNames.ResetObsessionsCompulsionsSubtypes,
      description:
        "Reset the obsessions, compulsions, and subtypes for the user",
    },
  },

  [ToolNames.GetMotivation]: {
    type: "function",
    function: {
      name: ToolNames.GetMotivation,
      description:
        "Fetches the existing motivating answers we've saved that the user has answered in the past.",
    },
  },
  [ToolNames.SaveMotivation]: {
    type: "function",
    function: {
      name: ToolNames.SaveMotivation,
      description: "Save the motivation question and answer for the user",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The motivation question",
          },
          answer: {
            type: "string",
            description: "The user's answer to the motivation question",
          },
        },
        required: ["question", "answer"],
      },
    },
  },
  [ToolNames.LogLessonComplete]: {
    type: "function",
    function: {
      name: ToolNames.LogLessonComplete,
      description:
        "Logs that the user has completed lesson three, the session on motivation.",
      parameters: {
        type: "object",
        properties: {
          lesson: {
            type: "string",
            description: "The lesson number that the user has completed",
          },
        },
        required: ["lesson"],
      },
    },
  },

  [ToolNames.SaveScript]: {
    type: "function",
    function: {
      name: ToolNames.SaveScript,
      description: "Save the script",
      parameters: {
        type: "object",
        properties: {
          script: {
            type: "string",
            description: "The script to save",
          },
          summary: {
            type: "string",
            description: "A few word summary of the script",
          },
        },
        required: ["script", "summary"],
      },
    },
  },
  [ToolNames.SaveSubtypes]: {
    type: "function",
    function: {
      name: ToolNames.SaveSubtypes,
      description: "Save the OCD subtypes selected by the user",
      parameters: {
        type: "object",
        properties: {
          subtypes: {
            type: "array",
            description: "The list of OCD subtypes to save",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "The name of the OCD subtype",
                },
              },
              required: ["name"],
            },
          },
        },
        required: ["subtypes"],
      },
    },
  },
  [ToolNames.ListModules]: {
    type: "function",
    function: {
      name: ToolNames.ListModules,
      description:
        "Get a list of all available instruction modules and their descriptions",
    },
  },
  [ToolNames.GetModule]: {
    type: "function",
    function: {
      name: ToolNames.GetModule,
      description: "Get the full instructions for a specific module",
      parameters: {
        type: "object",
        properties: {
          moduleId: {
            type: "string",
            description: "The ID of the module to retrieve",
          },
        },
        required: ["moduleId"],
      },
    },
  },
  [ToolNames.GetModuleContext]: {
    type: "function",
    function: {
      name: ToolNames.GetModuleContext,
      description:
        "Fetches important user-specific context for a specific module",
      parameters: {
        type: "object",
        properties: {
          moduleId: {
            type: "string",
            description: "The ID of the module to get context for",
          },
        },
        required: ["moduleId"],
      },
    },
  },
  [ToolNames.CompleteModule]: {
    type: "function",
    function: {
      name: ToolNames.CompleteModule,
      description: "Saves a particular module as complete",
      parameters: {
        type: "object",
        properties: {
          moduleId: {
            type: "string",
            description: "The ID of the module to complete",
          },
        },
        required: ["moduleId"],
      },
    },
  },
  [ToolNames.GoToHierarchySortingPage]: {
    type: "function",
    function: {
      name: ToolNames.GoToHierarchySortingPage,
      description:
        "Redirect the user to the exposure hierarchy sorting page where they can set discomfort levels for each task",
    },
  },
  [ToolNames.SaveTherapyPreference]: {
    type: "function",
    function: {
      name: ToolNames.SaveTherapyPreference,
      description:
        "Save the therapy preference for the user; for later use in future sessions.",
      parameters: {
        type: "object",
        properties: {
          preference: {
            type: "string",
            description:
              "The user's therapy style preference - must be either DETAILED or CONCISE",
            enum: ["DETAILED", "CONCISE"],
          },
        },
        required: ["preference"],
      },
    },
  },
  [ToolNames.SaveJournalEntry]: {
    type: "function",
    function: {
      name: ToolNames.SaveJournalEntry,
      description: "Save a journal entry linked to the current session",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title of the journal entry",
          },
          content: {
            type: "string",
            description: "The content of the journal entry",
          },
        },
        required: ["title", "content"],
      },
    },
  },
  [ToolNames.SaveExposure]: {
    type: "function",
    function: {
      name: ToolNames.SaveExposure,
      description: "Save a new exposure to the exposure hierarchy",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description: "The description of the exposure task",
          },
          discomfort: {
            type: "number",
            description: "The initial discomfort level (0-10)",
          },
        },
        required: ["description", "discomfort"],
      },
    },
  },
};
