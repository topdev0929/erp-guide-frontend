"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Timer, TrendingUp, BarChart3, ChartBar, ChartLine, CheckCircle } from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ERPSession {
  id: number;
  created_at: string;
  anxiety_before: number;
  anxiety_after: number;
  exposure_technique?: string;
  exposure_details?: string;
  journal_entry?: string;
}

// Component for skeleton loader
const ERPSessionSkeleton = () => (
  <div className="p-4 border-b">
    <Skeleton className="h-4 w-32 mb-2" />
    <div className="flex">
      <Skeleton className="h-4 w-24 mr-2" />
      <Skeleton className="h-4 flex-1" />
    </div>
    <Skeleton className="h-4 w-3/4 mt-1" />
  </div>
);

// Summary statistics component
const ERPSessionsSummary = ({ sessions }: { sessions: ERPSession[] }) => {
  const totalSessions = sessions.length;
  // Calculate average session duration (estimate 15 minutes per session if not tracked)
  const avgSessionDuration = 15;
  const totalDuration = sessions.length * avgSessionDuration;
  const avgBeforeAnxiety = sessions.length > 0 
    ? Math.round(sessions.reduce((sum, session) => sum + session.anxiety_before, 0) / sessions.length * 10) / 10
    : 0;
  const avgAfterAnxiety = sessions.length > 0
    ? Math.round(sessions.reduce((sum, session) => sum + session.anxiety_after, 0) / sessions.length * 10) / 10
    : 0;

  return (
    <div className="mb-6 p-4 bg-muted/30 rounded-lg">
      <h3 className="font-medium mb-3 text-[#1e543b]">Your ERP Progress</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle className="w-4 h-4 text-[#349934]" />
            <span className="text-sm font-medium">Total Sessions</span>
          </div>
          <p className="text-2xl font-bold text-[#349934]">{totalSessions}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Timer className="w-4 h-4 text-[#fd992d]" />
            <span className="text-sm font-medium">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-[#fd992d]">{totalDuration}m</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Avg Before Anxiety</span>
          </div>
          <p className="text-2xl font-bold text-blue-500">{avgBeforeAnxiety}/10</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BarChart3 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Avg After Anxiety</span>
          </div>
          <p className="text-2xl font-bold text-green-500">{avgAfterAnxiety}/10</p>
        </div>
      </div>
    </div>
  );
};

// ERP Session card component
const ERPSessionCard = ({ session }: { session: ERPSession }) => (
  <div className="relative border-b">
    <Link
      href={`/me/erp-sessions/${session.id}`}
      className="flex flex-col p-4 hover:bg-muted/50"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-[#1e543b]">
          ERP Session {session.id}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>~15 min</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
        <span>
          {format(new Date(session.created_at), "MMM d, yyyy")}
        </span>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Before: {session.anxiety_before}/10</span>
        </div>
      </div>
      
      {session.exposure_details && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {session.exposure_details}
        </p>
      )}
      
      {session.journal_entry && (
        <p className="text-sm text-muted-foreground line-clamp-1">
          {session.journal_entry}
        </p>
      )}
      
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </Link>
  </div>
);

export default function ERPSessionsTab({ activeTab }: { activeTab: string }) {
  const [erpSessions, setErpSessions] = useState<ERPSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch ERP sessions
  useEffect(() => {
    if (activeTab === "erp-sessions") {
      setIsLoading(true);
      
      apiCall("/erp-sessions/", ApiMethod.Get, "fetch ERP sessions")
        .then((data) => {
          if (data && data.erp_sessions) {
            setErpSessions(data.erp_sessions);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching ERP sessions:", error);
          setIsLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <>
      {isLoading ? (
        // Show skeleton loaders while loading
        <>
          <ERPSessionSkeleton />
          <ERPSessionSkeleton />
          <ERPSessionSkeleton />
        </>
      ) : erpSessions.length > 0 ? (
        // Show ERP sessions if available
        <>
          <ERPSessionsSummary sessions={erpSessions} />
          <div className="divide-y">
            {erpSessions.map((session) => (
              <ERPSessionCard key={session.id} session={session} />
            ))}
          </div>
        </>
      ) : (
        // Show empty state if no ERP sessions
        <div className="p-8 text-center text-muted-foreground">
          <p>
            Complete your first ERP session to see your progress here.
          </p>
          <p className="text-sm mt-2">
            Start an ERP session from the navigation or chat with the AI guide.
          </p>
        </div>
      )}
    </>
  );
}
