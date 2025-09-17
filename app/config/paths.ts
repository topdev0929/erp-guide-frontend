/* This file is essential for middleware, aka redirection. Some logic explained here: https://docs.google.com/document/d/1_e8iQt_xNkQjjAuw3s7SLYz9PnV4i4z0Dj6Jk0XwVZY/edit?tab=t.0 */
export const PUBLIC_PATHS = [
  "/",
  "",
  "/login",
  "/pages/signup",
  "/privacy-policy",
  "/terms-of-service",
  "/pages/onboarding/payment-complete",
  "/pages/resubscribe-payment/payment-complete",
] as const;

/* TODO: Refactor: Pretty sure this is completely out of date and can be removed, but should test first. */
export const CHAT_PATHS = [
  "/lessons/motivation",
  "/lessons/obsessions-compulsions",
  "/lessons/script-writing",
  "/plan/exposure-plan",
  "/plan/hierarchy/create",
  "/pages/user-erp",
  "/lessons/first-erp",
  "/lessons/subtypes",
  "/lessons/next-steps",
  "/assistant/basics",
  "/assistant/exposure-techniques",
  "/assistant/ocd-stigma",
  "/assistant/shapeshifting",
  "/assistant/doubting-disease",
  "/assistant/compulsive-erp",
  "/chat",
] as const;

export const ONBOARDING_PATHS = [
  "/pages/onboarding",
  "/pages/onboarding/payment",
] as const;

export const RESUBSCRIBE_PATHS = ["/pages/resubscribe-payment"] as const;

/* REMOVED: CONDITIONAL_FOOTER_PATHS - no longer using conditional logic */
