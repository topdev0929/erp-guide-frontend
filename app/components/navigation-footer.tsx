"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, User, MessageCircle, ClipboardList } from "lucide-react";
import {
  PUBLIC_PATHS,
  CHAT_PATHS,
  RESUBSCRIBE_PATHS,
  ONBOARDING_PATHS,
} from "@/app/config/paths";

// IMPORTANT NOTE: If we change the names of these items; we need to change the names of the nav-btn-<name> classes in the onboarding-tour.tsx file too.
const navItems = [
  { name: "Guide", href: "/chat", icon: MessageCircle },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "ERP Plan", href: "/plans/viewing-plan/", icon: ClipboardList },
  { name: "Me", href: "/me", icon: User },
];

export default function NavigationFooter() {
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.some((path) => path === pathname);
  const isResubscribePath = RESUBSCRIBE_PATHS.some((path) => path === pathname);
  const isOnboardingPath = ONBOARDING_PATHS.some((path) => path === pathname);
  const isChatPath = CHAT_PATHS.some((path) => path === pathname);
  const isLessonChatPath = pathname.startsWith("/chat/");
  const isMetaPath = pathname === "/meta";

  // Don't render the footer on:
  // - Public paths (not logged in)
  // - Onboarding paths
  // - Resubscribe payment paths
  // - Chat paths (bad UI, cuts into screen space)
  // - Lesson chat paths (any path starting with /chat/)
  // - Meta path (chat interface)
  if (
    isPublicPath ||
    isOnboardingPath ||
    isResubscribePath ||
    isChatPath ||
    isLessonChatPath ||
    isMetaPath
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-between items-center h-16">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={
                  item.name === "ERP Session"
                    ? `${item.href}?returnPath=${encodeURIComponent(pathname)}`
                    : item.href
                }
                className={`flex flex-col items-center justify-center w-16 h-16 text-xs font-medium transition-colors whitespace-nowrap ${
                  pathname === item.href
                    ? "text-[#349934] hover:text-[#1e543b]"
                    : "text-gray-500 hover:text-[#fd992d]"
                }    nav-btn-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
