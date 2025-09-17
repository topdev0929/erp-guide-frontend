"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import NonChatPageWrapper from "@/app/components/nonchat-page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import JournalTab from "./components/JournalTab";
import ConversationsTab from "./components/ConversationsTab";
import ERPSessionsTab from "./components/ERPSessionsTab";

import { MyOCDSection } from "@/app/components/ocd-section";

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState("journal");
  const [userTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Check for tab parameter in URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam === "conversations") {
      setActiveTab("conversations");
    } else if (tabParam === "erp-sessions") {
      setActiveTab("erp-sessions");
    }
  }, []);

  return (
    <NonChatPageWrapper>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-xl font-bold text-[#1e543b]">My Profile</h1>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-1 bg-white hover:bg-gray-50 text-[#1e543b] rounded-lg border border-gray-200 transition-colors me-user-settings-btn"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">User Settings</span>
          </Link>
        </div>

        {/* OCD Profile Section */}
        <section className="mb-2">
          <MyOCDSection />
        </section>

        <Tabs
          defaultValue="journal"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-3 me-journal-tab">
            <TabsTrigger value="journal" className="py-2 text-base">
              Journal
            </TabsTrigger>
            <TabsTrigger
              value="conversations"
              className="py-2 text-base me-conversations-tab"
            >
              Conversations
            </TabsTrigger>
            <TabsTrigger
              value="erp-sessions"
              className="py-2 text-base me-erp-sessions-tab"
            >
              ERP Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal">
            <JournalTab activeTab={activeTab} />
          </TabsContent>

          <TabsContent value="conversations">
            <ConversationsTab userTimezone={userTimezone} />
          </TabsContent>

          <TabsContent value="erp-sessions">
            <ERPSessionsTab activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
    </NonChatPageWrapper>
  );
}
