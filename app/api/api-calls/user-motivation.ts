// I'm pretty sure a tool used to use this; and now we've deleted that link right? Ideally we just move this code into that meta-chat-utils function call handler though right

import { API_URL, TokenService } from "@/app/api/auth";

export async function getMotivation() {
  try {
    const response = await fetch(`${API_URL}/onboarding/motivation/`, {
      headers: {
        Authorization: `Token ${TokenService.getToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch motivation");
    }

    const motivationData = await response.json();
    return { motivationData };
  } catch (error) {
    console.error("Error fetching motivation:", error);
    return { error: "Failed to fetch motivation" };
  }
}

export async function saveMotivation(motivationArgs: any) {
  try {
    const response = await fetch(`${API_URL}/onboarding/motivation/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${TokenService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(motivationArgs),
    });

    if (!response.ok) {
      throw new Error("Failed to save motivation");
    }

    return { saveMotivation: "Successfully saved motivations" };
  } catch (error) {
    console.error("Error saving motivation:", error);
    return { error: "Failed to save motivation" };
  }
}
