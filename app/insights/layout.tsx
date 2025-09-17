"use client";

import { PropsWithChildren } from "react";
import { useProtectRoute } from "@/hooks/useAuthHooks";

export default function AuthLayout({ children }: PropsWithChildren) {
  useProtectRoute();

  return children;
}
