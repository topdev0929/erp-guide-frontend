import { TokenService } from "@/app/api/auth";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import {
  sendUsEmailUserCourseCancel,
  sendUsEmailUserUpdatedNotificationSettings,
} from "@/app/api/send-email/email-utils";

// Define the enum for therapy preferences
enum TherapyPreference {
  DETAILED = "DETAILED",
  CONCISE = "CONCISE",
}

/**
 * Fetches user settings from the API
 * @returns User settings data
 */
export const fetchUserSettings = async () => {
  try {
    const data = await apiCall("/user/", ApiMethod.Get, "fetch user settings");

    if (data) {
      const userPhone = data.phone || "";
      let consistencyReminder = { enabled: false, time: "7:30am" };
      let isTestAccount = false;
      let therapyPreference = "concise"; // Default to "concise"

      // Check if the email indicates a test account
      if (data.email) {
        isTestAccount =
          data.email.includes("test") || data.email.includes("example");
      }

      // Get therapy preference from API
      if (data.therapy_preferences && data.therapy_preferences.preference) {
        const preference = data.therapy_preferences.preference;
        therapyPreference =
          preference === TherapyPreference.CONCISE ? "concise" : "detailed";
      }

      // Format reminder settings if available
      if (data.notifications_consistency_reminder) {
        const { enabled, time } = data.notifications_consistency_reminder;
        consistencyReminder = {
          enabled,
          time: formatTimeFromApi(time),
        };
      }

      return {
        userPhone,
        consistencyReminder,
        isTestAccount,
        therapyPreference,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
};

/**
 * Saves notification settings to the API
 * @param enabled Whether notifications are enabled
 * @param time Time for notifications in format like "7:30am"
 * @param userPhone User's phone number for email notifications
 * @returns Success status
 */
export const saveNotificationSettings = async (
  enabled: boolean,
  time: string,
  userPhone: string
) => {
  try {
    const timeRegex = /^(\d{1,2}):(\d{2})(am|pm)$/i;
    const match = time.match(timeRegex);
    if (match) {
      let [_, hours, minutes, period] = match;
      let hour = parseInt(hours, 10);

      if (period.toLowerCase() === "pm" && hour < 12) hour += 12;
      if (period.toLowerCase() === "am" && hour === 12) hour = 0;

      const timeString = `${hour.toString().padStart(2, "0")}:${minutes}:00`;
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await apiCall(
        "/notifications/consistency-reminder/",
        ApiMethod.Post,
        "update notification settings",
        {
          enabled,
          time: timeString,
          timezone: userTimezone,
        }
      );

      // Send email notification about the settings update
      await sendUsEmailUserUpdatedNotificationSettings(
        userPhone,
        enabled,
        timeString,
        userTimezone
      );

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error saving notification settings:", error);
    return false;
  }
};

/**
 * Handles user logout by clearing token and PostHog
 * @param posthog PostHog instance
 */
export const handleLogout = (posthog: any) => {
  posthog.reset();
  TokenService.removeToken();
  // Router navigation handled by component
};

/**
 * Handles subscription cancellation
 * @param phone User's phone number
 * @param isPhoneEntered Whether a phone number has been entered
 * @returns Success status
 */
export const handleCancelSubscription = (
  phone: string,
  isPhoneEntered: boolean
) => {
  if (isPhoneEntered) {
    sendUsEmailUserCourseCancel(phone);
    return true;
  }
  return false;
};

/**
 * Helper function to format time from API (HH:MM:SS) to display format (h:MMam/pm)
 * @param time Time string from API in format HH:MM:SS
 * @returns Formatted time string like "7:30am"
 */
export const formatTimeFromApi = (time: string): string => {
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes}${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "7:30am"; // Default fallback
  }
};

/**
 * Saves therapy preference to the API
 * @param style The selected preference ("detailed" or "concise")
 * @returns Success status
 */
export const saveTherapyPreferences = async (style: string) => {
  try {
    // Convert UI style to enum value
    const preferenceValue =
      style === "concise"
        ? TherapyPreference.CONCISE
        : TherapyPreference.DETAILED;

    await apiCall(
      "/user/therapy-preferences/",
      ApiMethod.Post,
      "update therapy preference",
      {
        preference: preferenceValue,
      }
    );
    return true;
  } catch (error) {
    console.error("Error saving therapy preference:", error);
    return false;
  }
};
