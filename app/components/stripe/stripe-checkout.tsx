import React, { useCallback } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeCheckout {
  clientSecret: string;
  free_one_week_trial: boolean;
  redirect_url: string;
  planType: "monthly" | "yearly";
}

export default function App({
  free_one_week_trial,
  redirect_url,
  planType,
}: {
  free_one_week_trial: boolean;
  redirect_url: string;
  planType: "monthly" | "yearly";
}): JSX.Element {
  const fetchClientSecret = useCallback(
    async (
      free_one_week_trial: boolean,
      redirect_url: string,
      planType: string
    ): Promise<string> => {
      console.log(
        "🔵 Stripe checkout start of file -> Fetching client secret with params:",
        {
          free_one_week_trial,
          redirect_url,
          planType,
        }
      );

      const data = await apiCall(
        "/payment/checkout/",
        ApiMethod.Post,
        "stripe checkout",
        {
          free_one_week_trial,
          redirect_url: `${location.origin}${redirect_url}`,
          planType,
        }
      );

      console.log("✅ Stripe checkout -> Client secret response:", {
        clientSecret: data.clientSecret,
        sessionId: data.sessionId,
      });

      if (!data.clientSecret) {
        console.error(
          "❌ Stripe checkout ->No client secret in response:",
          data
        );
        throw new Error("No client secret received from server");
      }

      return data.clientSecret;
    },
    []
  );

  const options = {
    fetchClientSecret: () =>
      fetchClientSecret(free_one_week_trial, redirect_url, planType),
  };

  const handleComplete = useCallback(async () => {
    console.log("🔵 handleComplete called - Location:", window.location.href);
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");

    console.log("🔵 Checking for session_id in URL params:", {
      allParams: Object.fromEntries(urlParams.entries()),
      sessionId,
    });

    if (sessionId) {
      try {
        const data = await apiCall(
          `/payment/checkout?session_id=${sessionId}`,
          ApiMethod.Get,
          "stripe checkout"
        );
        console.log("🔵 Checkout session details:", {
          status: data.status,
          customerId: data.customer_id,
          paymentStatus: data.payment_status,
          customerEmail: data.customer_email,
        });
      } catch (error) {
        console.error("❌ Error checking session status:", error);
      }
    }
  }, []);

  React.useEffect(() => {
    handleComplete();
  }, [handleComplete]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise as Promise<Stripe | null>}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
