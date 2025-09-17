import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

export const hasCompletedGettingStarted = async (): Promise<boolean> => {
  try {
    const data = await apiCall(
      "/completed-getting-started/",
      ApiMethod.Get,
      "check getting started completion"
    );
    return data?.completed || false;
  } catch (error) {
    console.error("Error checking getting started completion:", error);
    return false;
  }
};
