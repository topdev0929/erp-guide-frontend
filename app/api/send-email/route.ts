import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Set the SendGrid API key securely in the back-end
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// This is the named export for the POST method
export async function POST(req: NextRequest) {
  try {
    const { message, subject, recipients } = await req.json();

    // Build the email message
    const msg = {
      to: recipients || ["jamie@themangohealth.com", "zach@themangohealth.com"],
      from: "info@themangohealth.com", // Your verified sender email
      subject: subject || "No Subject Provided", // Default to "No Subject Provided" if subject is not passed
      text: message || "No message provided", // Use the message from the request body
      html: `<strong>${message || "No message provided"}</strong>`, // HTML version
    };

    // Send the email via SendGrid
    await sgMail.send(msg);

    // Return JSON response indicating success
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error.message);

    // Return JSON response indicating error
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}
