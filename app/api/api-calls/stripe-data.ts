import { apiCall } from "../api-utils";
import { ApiMethod } from "@/app/types/types";

interface StripeCustomerData {
  stripe_customer_id: string | null;
}

// MUST be called with a stripe_customer_id; or this will fail.
export async function storeStripeCustomerData(
  data: StripeCustomerData
): Promise<void> {
  console.log(
    "🔵 stripe-data.ts -> Starting to store Stripe customer data:",
    data
  );

  try {
    console.log("🔵 stripe-data.ts -> Making API request to /stripe-data/");
    await apiCall(
      "/payment/stripe-data/",
      ApiMethod.Post,
      "store stripe customer data",
      data
    );
    console.log(
      "✅ stripe-data.ts -> DATABASE SUCCESS: Successfully stored Stripe customer data"
    );
  } catch (error) {
    console.error(
      "❌ stripe-data.ts -> Error storing Stripe customer data:",
      error
    );
    throw error;
  }
}
