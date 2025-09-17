"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Activity,
  ChevronRight,
  ListChecks,
  Calendar,
  BarChart2,
  Target,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { SymptomProgressSection } from "@/app/insights/symptom-progress-section";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useSymptomData } from "./symptom-data";
import NonChatPageWrapper from "@/app/components/nonchat-page-wrapper";

const DashboardContent = () => {
  const [showGettingStartedPopup, setShowGettingStartedPopup] = useState(false);
  const router = useRouter();

  // Use only symptom data loading state
  const { loading: isLoading } = useSymptomData();

  if (isLoading) {
    return (
      <NonChatPageWrapper>
        <div className="space-y-8">
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 -mx-4 -mt-4 mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5 text-[#1e543b]" />
              </Button>
              <h1 className="text-2xl font-bold text-[#1e543b]">Insights</h1>
            </div>
          </header>

          {/* Reading Self-Assessments Skeleton */}
          <div className="mt-12">
            <div className="flex items-center mb-4">
              <BarChart2 className="h-5 w-5 mr-2 text-[#349934]" />
              <Skeleton className="h-7 w-56" />
            </div>

            <div className="max-w-[800px] mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <Card className="bg-white shadow-md border-none overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-[#1e543b] text-white p-3 text-center">
                      <Skeleton className="h-4 w-24 mx-auto bg-white/40" />
                    </div>
                    <div className="p-4 text-center">
                      <Skeleton className="h-9 w-9 mx-auto rounded-full mb-2" />
                      <Skeleton className="h-5 w-32 mx-auto" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-md border-none overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-[#349934] text-white p-3 text-center">
                      <Skeleton className="h-4 w-24 mx-auto bg-white/40" />
                    </div>
                    <div className="p-4 text-center">
                      <Skeleton className="h-9 w-9 mx-auto rounded-full mb-2" />
                      <Skeleton className="h-5 w-32 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-[#349934]" />
                <Skeleton className="h-7 w-40" />
              </div>

              <Card className="bg-white shadow-md border-none p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-[180px] w-full" />
                  <div className="flex justify-between items-center mt-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-28 rounded-md" />
                  </div>
                </div>
              </Card>

              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#349934]" />
                <Skeleton className="h-7 w-40" />
              </div>

              <Card className="bg-white shadow-md border-none p-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-[180px] w-full" />
                  <div className="flex justify-between items-center mt-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-28 rounded-md" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </NonChatPageWrapper>
    );
  }

  return (
    <NonChatPageWrapper>
      <div className="space-y-8">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 -mx-4 -mt-4 mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 text-[#1e543b]" />
            </Button>
            <h1 className="text-2xl font-bold text-[#1e543b]">Insights</h1>
          </div>
        </header>

        <section className="mt-12">
          <SymptomProgressSection />
        </section>

        <Dialog
          open={showGettingStartedPopup}
          onOpenChange={setShowGettingStartedPopup}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center text-[#1e543b]">
                Welcome to Insights
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                Complete the 'Getting Started' lessons on the Learn tab to begin
                tracking your recovery journey.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setShowGettingStartedPopup(false)}
                className="bg-[#fd992d] text-white hover:bg-[#d73356]"
              >
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </NonChatPageWrapper>
  );
};

const Dashboard = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DashboardContent />
  </Suspense>
);

export default Dashboard;
