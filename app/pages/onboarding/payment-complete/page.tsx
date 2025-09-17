"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Confetti from "react-confetti";
import { storeStripeCustomerData } from "@/app/api/api-calls/stripe-data";
import { sendUsEmailPaymentComplete } from "@/app/api/send-email/email-utils";
import { usePostHog } from "posthog-js/react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { useAuth } from "@/app/context/auth-context";

export default function PostPaymentPage() {
  const { checkAccess } = useAuth();

  const posthog = usePostHog();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [finalOnboardingSlide, setFinalOnboardingSlide] = useState(14);
  const [acquisitionSource, setAcquisitionSource] = useState<string>("");
  const [otherDescription, setOtherDescription] = useState<string>("");

  useEffect(() => {
    // Get all URL params including session_id
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");
    // Original useEffect logic
    setFinalOnboardingSlide(
      parseInt(searchParams.get("currentOnboardingSlide") || "13") + 1
    );

    // Onboarding - logs final slide (one more than the last onboarding slide)
    console.log("🔵 Posthog - Payment Complete Page -> Logging final slide:", {
      slide: finalOnboardingSlide,
    }); // temp for debugging
    posthog.capture("onboarding_slide_viewed", {
      slide: finalOnboardingSlide,
    });

    console.log("🔵 Payment Complete Page -> URL params:", {
      allParams: Object.fromEntries(searchParams.entries()),
      sessionId,
    });

    // Show confetti immediately and hide after 5 seconds
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);

    // If we have a session ID, fetch the session details
    if (sessionId) {
      apiCall(
        `/payment/checkout?session_id=${sessionId}`,
        ApiMethod.Get,
        "stripe checkout"
      )
        .then(async (data) => {
          console.log("✅ Payment Complete Page -> Session details:", {
            status: data.status,
            customerId: data.customer_id,
            customerEmail: data.customer_email,
            paymentStatus: data.payment_status,
          });

          // Use the storeStripeCustomerData function directly
          await storeStripeCustomerData({
            stripe_customer_id: data.customer_id,
          });

          // Fetch the user's phone number from the /settings endpoint
          const settingsData = await apiCall(
            "/user/",
            ApiMethod.Get,
            "fetch user settings"
          );
          const phone = settingsData?.phone || "No phone provided";

          // Identify user in PostHog with their phone number
          posthog.identify(phone);
          posthog.people.set({ phone });

          // Fire PostHog event for free trial started
          console.log("🚀 Firing free trial started event");
          posthog.capture("free_trial_started", {
            stripe_customer_id: data.customer_id,
            customer_email: data.customer_email,
            session_id: sessionId,
            trial_source: "checkout_completion",
          });

          // Email notification letting us know a new user has signed up
          await sendUsEmailPaymentComplete(
            data.customer_email,
            data.customer_name,
            phone
          );

          console.log("✅ Payment Complete Page -> Stored customer data");
        })
        .catch((error) => {
          console.error("❌ Payment Complete Page -> Error:", error);
        });
    }

    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update window size on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Original useEffect cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer); // Clean up the confetti timer
    };
  }, []);

  // Update handleSourceSubmit to trigger confetti
  const handleSourceSubmit = async () => {
    try {
      const body =
        acquisitionSource === "other"
          ? { source: acquisitionSource, other_description: otherDescription }
          : { source: acquisitionSource };

      await apiCall(
        "/onboarding/acquisition-source/",
        ApiMethod.Post,
        "submit acquisition source",
        body
      );

      // Posthog Code to Save Acquisition Source to Property of Person on Posthog
      interface PeopleProperties {
        acquisition_source: string;
        acquisition_source_description?: string;
      }
      // Create an object to hold the people properties
      const peopleProperties: PeopleProperties = {
        acquisition_source: acquisitionSource,
      };
      // If the user chose 'other' and provided a custom description, record it
      if (acquisitionSource === "other" && otherDescription) {
        peopleProperties.acquisition_source_description = otherDescription;
      }
      // Save the properties to the user's profile
      posthog.people.set(peopleProperties);

      // Instead of showing success card, redirect to chat
      await checkAccess(); // Refresh access status; as the user just paid and this needs to be updated
      router.push("/chat");
    } catch (error) {
      console.error("Failed to submit acquisition source:", error);
      // Even on error, still redirect (since it's not critical)
      await checkAccess();
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-[#349934] bg-opacity-10 flex flex-col items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {
          <Card className="w-full max-w-md bg-white shadow-lg">
            <CardContent className="pt-6 px-6">
              <h1 className="text-2xl font-bold text-center text-[#1e543b] mb-4">
                How Did You Hear About Mango?
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Your response will help us ensure as many people as possible are
                able to break free from OCD.
              </p>
              <div className="space-y-4">
                {["friend", "reddit", "therapist", "other"].map((source) => (
                  <div key={source} className="flex items-center">
                    <Button
                      variant={
                        acquisitionSource === source ? "default" : "outline"
                      }
                      className="w-full"
                      onClick={() => setAcquisitionSource(source)}
                    >
                      {source === "friend" && "From a friend"}
                      {source === "reddit" && "From Reddit"}
                      {source === "therapist" && "From your therapist"}
                      {source === "other" && "Somewhere else"}
                    </Button>
                  </div>
                ))}

                {acquisitionSource === "other" && (
                  <textarea
                    className="w-full p-2 border rounded-md"
                    placeholder="Please tell us where you heard about us..."
                    value={otherDescription}
                    onChange={(e) => setOtherDescription(e.target.value)}
                    rows={3}
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button
                onClick={handleSourceSubmit}
                disabled={
                  !acquisitionSource ||
                  (acquisitionSource === "other" && !otherDescription)
                }
                className="bg-[#fd992d] hover:bg-[#d73356] text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        }
      </motion.div>
    </div>
  );
}
