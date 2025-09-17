const Sentry = require("@sentry/node");
const axios = require("axios");

require("dotenv").config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  monitorRetentionDays: 30,
});
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const checkBackend = async () => {
  const response = await axios.get(API_URL.split("/api")[0] + "/health");

  if (response.status !== 200) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }

  console.log("Backend health check passed");
};

const checkFrontend = async () => {
  const response = await axios.get("https://themangohealth.com/");

  if (response.status !== 200) {
    throw new Error(`Health check failed with status: ${response.status}`);
  }

  console.log("Frontend health check passed");
};

async function main() {
  const checkInId = Sentry.captureCheckIn({
    monitorSlug: "health-check",
    status: "in_progress",
  });

  try {
    await checkBackend();
    await checkFrontend();

    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: "health-check",
      status: "ok",
    });
    console.log("Health check passed");
  } catch (err) {
    Sentry.captureCheckIn({
      checkInId,
      monitorSlug: "health-check",
      status: "error",
    });
    console.error("Health check failed", err);
  }
}

main();
