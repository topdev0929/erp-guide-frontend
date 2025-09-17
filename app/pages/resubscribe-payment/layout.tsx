"use client";

import { PropsWithChildren } from "react";
import { useProtectSubscriptionRoute } from "@/hooks/useAuthHooks";

export default function Layout({ children }: PropsWithChildren) {
  useProtectSubscriptionRoute();

  return children;
}
