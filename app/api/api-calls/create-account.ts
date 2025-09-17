/* TODO Refactor could probably use api utils instead; although the difference here is we don't have an auth token to pass so we'd have to make sure it works */
import { API_URL } from "@/app/api/auth";

interface RegisterResponse {
  token: string;
}

export async function registerUser(
  phone: string,
  password: string
): Promise<RegisterResponse> {
  console.log("Registering user:", phone);

  const response = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      password,
    }),
  });

  if (!response.ok) {
    let error = { error: "Registration failed" };
    try {
      error = await response.json();
    } catch (err) {
      console.error("Error during registration:", err);
      throw new Error("Unexpected error during registration");
    }
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}
