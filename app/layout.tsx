import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./posthog/providers";
import NavigationFooter from "@/app/components/navigation-footer";
import { NavigationProvider } from "@/app/context/navigation-context";
import { AuthProvider } from "@/app/context/auth-context";
import { OnboardingTour } from "./components/onboarding-tour";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Guide for OCD by Mango Health",
  description:
    "Conversational AI guide providing OCD support and guided ERP sessions.",
  icons: {
    icon: "/mangologo.png",
  },
};

/*IMPORTANT NOTE: We can add this to add padding to all pages for the footer -> 
 <body className={`${inter.className} pb-16`}>
BUT; that creates a really weird bug on all the pages involving the assistant chat (it creates a second scrollbar; which is really weird for the user). Instead, we should just add padding to the pages that need it; which is every page except the ones that use chat.tsx. -> Pretty sure I later did this using paths?
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PostHogProvider>
        <body className={inter.className}>
          <AuthProvider>
            <NavigationProvider>
              <main className="min-h-[100dvh] bg-gray-50">{children}</main>
              <NavigationFooter />
              <div id="navigation-portal"></div>
              <OnboardingTour />
            </NavigationProvider>
          </AuthProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
