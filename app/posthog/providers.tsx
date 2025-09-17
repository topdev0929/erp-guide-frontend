"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import PostHogPageView from "./PostHogPageView";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
      capture_exceptions: {
        capture_console_errors: true,
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
      },
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}

// // app/providers.js
// "use client";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";
// import { useEffect, useState } from "react";

// if (typeof window !== "undefined") {
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
//     person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
//   });
// }
// export function CSPostHogProvider({ children }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return children;
//   }

//   return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
// }
