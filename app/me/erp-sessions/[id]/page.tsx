"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Timer, TrendingUp, Calendar } from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import NonChatPageWrapper from "@/app/components/nonchat-page-wrapper";

interface ERPSession {
  id: number;
  created_at: string;
  anxiety_before: number;
  anxiety_after: number;
  exposure_technique?: string;
  exposure_details?: string;
  journal_entry?: string;
}

export default function ERPSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<ERPSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!params.id) return;

      try {
        setIsLoading(true);
        
        const data = await apiCall(
          `/erp-sessions/${params.id}/`,
          ApiMethod.Get,
          "fetch ERP session details"
        );
        
        if (data) {
          setSession(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching ERP session:", error);
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [params.id]);

  if (isLoading) {
    return (
      <NonChatPageWrapper>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </NonChatPageWrapper>
    );
  }

  if (!session) {
    return (
      <NonChatPageWrapper>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Session not found</p>
        </div>
      </NonChatPageWrapper>
    );
  }

  return (
    <NonChatPageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-[#1e543b]">
            ERP Session {session.id}
          </h1>
        </div>

        {/* Session Details */}
        <div className="space-y-4">
          {/* Date and Duration */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(new Date(session.created_at), "MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                ~15 minutes
              </span>
            </div>
          </div>

          {/* Anxiety Levels */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium">Before</h3>
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {session.anxiety_before}/10
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-medium">After</h3>
              </div>
              <p className="text-2xl font-bold text-green-500">
                {session.anxiety_after}/10
              </p>
            </div>
          </div>

          {/* Exposure Details */}
          {session.exposure_details && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">Exposure Details</h3>
              <p className="text-sm text-muted-foreground">
                {session.exposure_details}
              </p>
            </div>
          )}

          {/* Technique Used */}
          {session.exposure_technique && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">Technique Used</h3>
              <p className="text-sm text-muted-foreground">
                {session.exposure_technique}
              </p>
            </div>
          )}

          {/* Journal Entry */}
          {session.journal_entry && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium mb-2">Session Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {session.journal_entry}
              </p>
            </div>
          )}
        </div>
      </div>
    </NonChatPageWrapper>
  );
}
