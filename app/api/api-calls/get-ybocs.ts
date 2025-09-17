"use client";

// TODO we need better type safety than this so people get it right

import { API_URL, TokenService } from "@/app/api/auth"; // Adjust the import path as needed
export const getYbocsData = async () => {
  console.log("YBOCS Request being sent:", {
    url: `${API_URL}/api/assessments/ybocs`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await fetch(`${API_URL}/assessments/ybocs/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${TokenService.getToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error during onboarding:", error);
      throw new Error(error.error || "Onboarding failed");
    }

    const result = await response.json();
    console.log("GET Ybocs successful:", result);
    return result; // Return the result for further use if needed
  } catch (error) {
    console.error("Error getting ybocs info:", error.message);
    throw error; // Rethrow error to handle it in calling function if needed
  }
};
