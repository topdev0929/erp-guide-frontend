import { RequiredActionFunctionToolCall } from "openai/resources/beta/threads/runs/runs";
import { apiCall, toolCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { ToolNames } from "@/app/meta/tools";
import { moduleRegistry } from "./modules/registry";
import { useRouter } from "next/navigation";

/**
 * Handles function tool calls for the meta assistant.
 *
 * @param call The tool call event.
 * @param sessionId The current session ID.
 * @returns A promise that resolves to a JSON string representing the result.
 */
export async function metaFunctionCallHandler(
  call: RequiredActionFunctionToolCall,
  sessionId: string
): Promise<string> {
  const args = JSON.parse(call.function.arguments);
  let data = {};

  switch (call.function.name) {
    case ToolNames.SetTimerLength:
      data = {
        action: "appendTimerMessage",
        timer: { duration: args.duration * 60, isRunning: false },
      };
      break;

    case ToolNames.StartTimer:
      data = { action: "updateTimer", timer: { isRunning: true } };
      break;

    case ToolNames.StopTimer:
      data = { action: "updateTimer", timer: { isRunning: false } };
      break;

    case ToolNames.Home:
      data = { action: "navigate", path: "/me" };
      break;

    case ToolNames.SaveObsessions: {
      console.log("💾 Saving obsessions:", args.obsessions);
      data = await toolCall(
        "/ocd/obsessions/",
        ApiMethod.Post,
        ToolNames.SaveObsessions,
        args.obsessions
      );
      break;
    }

    case ToolNames.SaveCompulsions: {
      console.log("💾 Saving compulsions:", args.compulsions);
      data = await toolCall(
        "/ocd/compulsions/",
        ApiMethod.Post,
        ToolNames.SaveCompulsions,
        args.compulsions
      );
      break;
    }

    case ToolNames.ResetObsessionsCompulsionsSubtypes: {
      console.log("🔄 Resetting obsessions and compulsions");
      data = await toolCall(
        "/session/obsessions-compulsions/reset-obsessions-compulsions-subtypes/",
        ApiMethod.Post,
        ToolNames.ResetObsessionsCompulsionsSubtypes
      );
      break;
    }

    case ToolNames.SaveExposureHierarchyData: {
      console.log("💾 Saving exposure hierarchy data:", args.exposures);

      // Transform exposures from string array to properly formatted objects
      const formattedExposures = args.exposures.map((description, index) => ({
        rank: index + 1,
        description: description,
        discomfort: 0,
      }));

      console.log("🔄 Transformed exposure data:", formattedExposures);

      const hierarchyData = await toolCall(
        "/exposures/hierarchy/",
        ApiMethod.Post,
        ToolNames.SaveExposureHierarchyData,
        formattedExposures // Send the transformed array directly
      );

      console.log("📦 Exposure hierarchy save response:", hierarchyData);
      data = { action: "exposureHierarchySaved", ...hierarchyData };
      break;
    }

    case ToolNames.SaveExposure: {
      console.log("💾 Saving new exposure:", args);
      data = await toolCall(
        "/exposures/hierarchy/",
        ApiMethod.Post,
        ToolNames.SaveExposure,
        [{
          description: args.description.trim(),
          discomfort: args.discomfort,
        }]
      );
      break;
    }

    case ToolNames.GoToHierarchySortingPage: {
      data = { action: "navigate", path: "/hierarchy/" };
      break;
    }

    case ToolNames.SaveExposurePlanWeek: {
      console.log("📝 Saving exposure plan week:", args);
      data = await toolCall(
        "/plan/exposure-plan-week/",
        ApiMethod.Post,
        ToolNames.SaveExposurePlanWeek,
        args
      );
      console.log("Saving Exposure Plan Week Response:", data);
      break;
    }

    case ToolNames.GoToExposurePlanHistory: {
      data = { action: "navigate", path: "/plans/" };
      break;
    }

    case ToolNames.ListModules:
      data = { modules: moduleRegistry.listModules() };
      break;

    case ToolNames.GetModule:
      const module = await getModule(args.moduleId);
      data = module;
      break;

    case ToolNames.GetModuleContext: {
      const moduleId = args.moduleId;
      console.log("🔍 GETTING CONTEXT FOR MODULE :", moduleId);

      const contextData = await toolCall(
        `/session/${moduleId}/context/`,
        ApiMethod.Get,
        ToolNames.GetModuleContext
      );

      console.log("📦 Module context received:", contextData);
      data = contextData;
      break;
    }

    case ToolNames.CompleteModule: {
      const moduleId = args.moduleId;
      console.log("🔍 Completing module:", moduleId);

      const completionData = await toolCall(
        `/complete/${moduleId}/session`,
        ApiMethod.Post,
        ToolNames.CompleteModule
      );

      console.log("📦 Module completion response:", completionData);
      data = { action: "completeSession", ...completionData };
      break;
    }

    case ToolNames.SaveSubtypes: {
      console.log("💾 Saving OCD subtypes:", args.subtypes);
      data = await toolCall(
        "/ocd/subtypes/",
        ApiMethod.Post,
        ToolNames.SaveSubtypes,
        args.subtypes // Send the array directly
      );
      break;
    }
    case ToolNames.SaveTherapyPreference: {
      console.log("💾 Saving therapy preference:", args.preference);
      // Validate that preference is one of the allowed values
      if (args.preference !== "DETAILED" && args.preference !== "CONCISE") {
        console.error(`Invalid therapy preference value: ${args.preference}`);
        args.preference = "DETAILED"; // Default to DETAILED if invalid
      }

      data = await toolCall(
        "/user/therapy-preferences/",
        ApiMethod.Post,
        ToolNames.SaveTherapyPreference,
        { preference: args.preference } // Wrap in an object with preference property
      );
      break;
    }

    case ToolNames.SaveJournalEntry: {
      console.log("💾 Saving journal entry:", args);
      console.log("Using session ID:", sessionId);

      data = await toolCall(
        "/journal/",
        ApiMethod.Post,
        ToolNames.SaveJournalEntry,
        {
          title: args.title,
          content: args.content,
          meta_session: sessionId,
        }
      );
      console.log("Journal entry saved:", data);
      break;
    }

    case ToolNames.SaveExposureSessionDiscomfort: {
      console.log("💾 Saving exposure session discomfort:", args);
      console.log("Using session ID:", sessionId);

      data = await toolCall(
        "/erp-sessions/",
        ApiMethod.Post,
        ToolNames.SaveExposureSessionDiscomfort,
        {
          anxiety_before: args.discomfort_peak,
          anxiety_after: args.discomfort_after,
          meta_session: sessionId,
        }
      );
      console.log("Exposure session discomfort saved:", data);
      break;
    }

    default:
      if (call.function.name.startsWith("complete")) {
        data = { action: "completeSession" };
      } else {
        console.error(
          `Function Tool Call '${call?.function?.name}' has no FunctionCallHandler`
        );
        data = { error: "Unhandled function call" };
      }
      break;
  }

  return JSON.stringify(data);
}

/**
 * Selects a random set of initial messages.
 */
export const getRandomInitialMessage = (messages: string[][]) => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

/**
 * Retries an operation with exponential backoff.
 */
export const retryWithExponentialBackoff = async (
  operation: () => Promise<any>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
) => {
  let attempt = 1;
  while (attempt <= maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retry attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }
};

const getModule = async (moduleId: string) => {
  console.log("🔍 getModule called with moduleId:", moduleId);
  const module = moduleRegistry.getModule(moduleId);
  console.log("📦 Module found:", module ? "yes" : "no", module);
  if (!module) {
    return JSON.stringify({ error: "Module not found" });
  }
  return JSON.stringify(module);
};

/**
 * Creates a URL for the meta page with a formatted message parameter.
 *
 * @param moduleName The name of the module (e.g., "basics", "hierarchy")
 * @param customMessage Optional custom message format. If not provided, defaults to "I'd like to start the [moduleName] module"
 * @returns The formatted URL string with encoded message parameter
 */
export const createMetaModuleUrl = (
  moduleName: string,
  customMessage?: string
): string => {
  const message = customMessage
    ? customMessage.replace("{moduleName}", moduleName)
    : `I'd like to start the ${moduleName} module`;

  return `/meta?message=${encodeURIComponent(message)}`;
};

/**
 * Creates a URL for the meta page with a formatted message for an obsession-based exposure plan.
 *
 * @param obsession The obsession description text
 * @returns The formatted URL string with encoded message parameter
 */
export const createMetaObsessionUrl = (obsession: string): string => {
  return `/meta?message=${encodeURIComponent(
    `I want to start the exposure plan module with obsession "${obsession}"`
  )}`;
};
