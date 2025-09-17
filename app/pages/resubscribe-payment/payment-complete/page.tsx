"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Confetti from "react-confetti";
import { storeStripeCustomerData } from "@/app/api/api-calls/stripe-data";
import { sendUsEmailPaymentComplete } from "@/app/api/send-email/email-utils";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { useAuth } from "@/app/context/auth-context";
import { useProtectSubscriptionRoute } from "@/hooks/useAuthHooks";

export default function WelcomeBackPage() {
  useProtectSubscriptionRoute();
  const { checkAccess } = useAuth();

  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("🔵 Resubscribe Payment Complete Page -> useEffect called");

    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get("session_id");

    console.log("🔵 Resubscribe Payment Complete Page -> URL params:", {
      allParams: Object.fromEntries(searchParams.entries()),
      sessionId,
    });

    if (sessionId) {
      apiCall(
        `/payment/checkout?session_id=${sessionId}`,
        ApiMethod.Get,
        "stripe checkout"
      )
        .then(async (data) => {
          console.log(
            "✅ Resubscribe Payment Complete Page -> Session details:",
            {
              status: data.status,
              customerId: data.customer_id,
              customerEmail: data.customer_email,
              paymentStatus: data.payment_status,
            }
          );

          // TODO add phone number here
          await sendUsEmailPaymentComplete(
            data.customer_email,
            data.customer_name,
            data.customer?.phone || "No phone provided"
          );

          console.log(
            "✅ Resubscribe Payment Complete Page -> Stored customer data"
          );
        })
        .catch((error) => {
          console.error(
            "❌ Resubscribe Payment Complete Page -> Error:",
            error.message
          );
        });
    }

    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoToDashboard = async () => {
    await checkAccess(); // This updates the user's access status now that they've paid!
    router.push("/chat");
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
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardContent className="pt-6 px-6">
            <h1 className="text-2xl font-bold text-center text-[#1e543b] mb-4">
              Welcome Back!
            </h1>
            <p className="text-center text-gray-600 mb-6">
              We're glad to see you again. Your journey towards beating OCD
              continues here.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button
              onClick={handleGoToDashboard}
              className="bg-[#fd992d] hover:bg-[#d73356] text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
