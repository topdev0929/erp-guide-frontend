"use client";

import { PropsWithChildren } from "react";
import { useProtectRoute } from "@/hooks/useAuthHooks";
import TimerBubble from "./_components/timer-bubble";

export default function AuthLayout({ children }: PropsWithChildren) {
  useProtectRoute();

  return children;
}
