import { API_URL } from "./auth";

import { TokenService } from "./auth";
import { ApiMethod, SessionType } from "../types/types";
import { ToolNames } from "../meta/tools";

// NOTE: the url should start with a leading slash
export const apiCall = async (
  url: string,
  method: ApiMethod,
  message: string,
  body: any = null
) => {
  try {
    const fetchOptions: RequestInit = {
      method: method,
      headers: {
        Authorization: TokenService.getToken() ? `Token ${TokenService.getToken()}` : undefined,
        "Content-Type": "application/json",
      },
    };

    if (method !== ApiMethod.Get && body !== null) {
      fetchOptions.body = JSON.stringify(body);
    }

    // Debug logging for request
    console.log(`🔍 API Request to ${url}:`, {
      method,
      headers: fetchOptions.headers,
      body: fetchOptions.body,
    });

    const response = await fetch(`${API_URL}${url}`, fetchOptions);

    if (!response.ok) {
      /* REFACTOR: We should definitely have Sentry save this error; but we don't want it to break the experience for the user if it doens't have ti */
      console.error(`Failed to hit API: ${message} at ${url}`);
      return null;
    }

    // Check if response is empty
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(`Failed to parse JSON response from ${url}:`, e);
        return null;
      }
    } else {
      // For empty responses, return an empty object
      data = {};
      console.log(`Empty response from ${url}, returning empty object`);
    }

    // Debug logging for response
    console.log(`📥 API Response from ${url}:`, {
      status: response.status,
      dataLength: Array.isArray(data) ? data.length : "not an array",
      data: data,
    });

    return data;
  } catch (error) {
    console.error(`❌ Error hitting API: ${message} at ${url}`, error);
    throw error;
  }
};

/* Similar to apiCall but returns data */
export const toolCall = async (
  url: string,
  method: ApiMethod,
  toolName: ToolNames,
  body: any = null
) => {
  // Context data returned back the assistant
  let data = {};

  try {
    const fetchOptions: RequestInit = {
      headers: {
        Authorization: `Token ${TokenService.getToken()}`,
        "Content-Type": "application/json",
      },
      method: method,
    };

    if (method !== ApiMethod.Get && body !== null) {
      fetchOptions.body = JSON.stringify(body);
    }

    // Debug logging for request
    console.log(`🔧 Tool Request to ${url}:`, {
      toolName,
      method,
      headers: fetchOptions.headers,
      body: fetchOptions.body,
    });

    const response = await fetch(`${API_URL}${url}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed calling tool ${toolName}`);
    }

    const responseData = await response.json();

    // Debug logging for response
    console.log(`📦 Tool Response from ${url}:`, {
      toolName,
      status: response.status,
      dataLength: Array.isArray(responseData)
        ? responseData.length
        : "not an array",
      data: responseData,
    });

    data = {
      toolName: "Successfully called tool",
      [toolName]: responseData,
    };
  } catch (error) {
    console.error(`❌ Error calling tool ${toolName}:`, error);
    data = { error: `Failed calling tool ${toolName}: ${error}` };
  }

  return data;
};

export const apiStreamedCall = async (
  url: string,
  method: ApiMethod,
  message: string,
  body: any,
  streamHandler: (stream: ReadableStream) => void
) => {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers: {
        Authorization: `Token ${TokenService.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    streamHandler(response.body);
  } catch (error) {
    console.error(
      `❌ Error in streaming API call: ${message} at ${url}`,
      error
    );
    throw error;
  }
};
