"use client";

const TEAM = [
  "jamie@themangohealth.com",
  "zach@themangohealth.com",
  "malena@themangohealth.com",
  "anton@themangohealth.com",
];

const JAMIE = ["jamie@themangohealth.com"];

export const sendUsEmailUserCourseCancel = async (
  interestedUser: string
): Promise<string> => {
  try {
    const subject_and_message = `Course cancellation requested for ${interestedUser}`;

    // Send the email
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: subject_and_message,
        message: subject_and_message,
        recipients: TEAM,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return "Info Received - we'll reach out ASAP with next steps!";
    } else {
      return "Failed to send email: " + data.error;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return "Error sending email.";
  }
};

export const sendUsEmailPaymentComplete = async (
  customerEmail: string,
  customerName: string,
  phoneNumber: string
): Promise<void> => {
  try {
    const subject = "New Course Signup! 🎉";
    const message = `Someone just completed the payment process and signed up for the course!\n\nCustomer Email: ${customerEmail}\nCustomer Name: ${customerName}\nPhone Number: ${phoneNumber}`;

    // Send the email
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        message,
        recipients: TEAM,
      }),
    });
  } catch (error) {
    console.error("Error sending payment complete email:", error);
  }
};

export const sendUsEmailUserUpdatedNotificationSettings = async (
  phoneNumber: string,
  enabled: boolean,
  time: string,
  timezone: string
): Promise<void> => {
  try {
    const subject = "Notification Settings Updated";
    const message =
      `A user has updated their notification settings:\n\n` +
      `Phone Number: ${phoneNumber}\n` +
      `Notifications Enabled: ${enabled}\n` +
      `Reminder Time: ${time}\n` +
      `Timezone: ${timezone}`;

    // Send the email
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        message,
        recipients: JAMIE,
      }),
    });
  } catch (error) {
    console.error("Error sending notification settings update email:", error);
  }
};

export const sendUsEmailFeedback = async (
  rating: number,
  chatId: number,
  comment: string
): Promise<void> => {
  try {
    const subject = "Feedback submitted";
    const message = `A user has submitted feedback:\n\nRating: ${rating}\nChat ID: ${chatId}\nComment: ${comment}`;

    // Send the email
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        message,
        recipients: TEAM,
      }),
    });
  } catch (error) {
    console.error("Error sending feedback email:", error);
  }
};