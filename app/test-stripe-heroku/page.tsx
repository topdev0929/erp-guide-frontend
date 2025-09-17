/* Jamie created this page to test stripe integration. Will be useful if we meaningfully edit stripe code and need to test on prod again; because local testing is not reliable. */

"use client";

import React, { useEffect } from "react";
import StripeCheckout from "@/app/components/stripe/stripe-checkout";

const Page = () => {
  useEffect(() => {
    console.log("Page loaded"); // Example logging or any initialization
  }, []);

  return (
    <StripeCheckout
      free_one_week_trial={true}
      redirect_url="/login"
      planType="yearly"
    />
  );
};

export default Page;
