"use client";

import type React from "react";

import { useState } from "react";
import {
  Activity,
  Info,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InterpretationModalProps {
  trigger: React.ReactNode;
  type: "ybocs" | "gad7";
}

export function InterpretationModal({
  trigger,
  type,
}: InterpretationModalProps) {
  const [activeTab, setActiveTab] = useState<string>("about");

  const ybocsRanges = [
    { range: "0-7", severity: "Subclinical", color: "#4ade80" },
    { range: "8-15", severity: "Mild", color: "#facc15" },
    { range: "16-23", severity: "Moderate", color: "#fb923c" },
    { range: "24-31", severity: "Severe", color: "#f87171" },
    { range: "32-40", severity: "Extreme", color: "#ef4444" },
  ];

  const gadRanges = [
    { range: "0-4", severity: "Minimal", color: "#4ade80" },
    { range: "5-9", severity: "Mild", color: "#facc15" },
    { range: "10-14", severity: "Moderate", color: "#fb923c" },
    { range: "15-21", severity: "Severe", color: "#f87171" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1e543b]">
            {type === "ybocs" ? (
              <BarChart3 className="h-5 w-5 text-[#349934]" />
            ) : (
              <Activity className="h-5 w-5 text-[#fd992d]" />
            )}
            {type === "ybocs" ? "YBOCS Interpretation" : "GAD-7 Interpretation"}
          </DialogTitle>
          <DialogDescription className="text-[#1e543b]/70">
            Understanding your assessment scores
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="about"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="ranges">Score Ranges</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-4 space-y-4">
            <div className="bg-[#349934]/5 p-4 rounded-lg border border-[#349934]/10">
              <p className="text-sm text-[#1e543b] leading-relaxed">
                These self-assessments are provided as a resource to help track
                symptom intensity over time.
                {type === "ybocs"
                  ? " The Yale-Brown Obsessive Compulsive Scale (Y-BOCS) measures OCD symptom severity."
                  : " The Generalized Anxiety Disorder 7 (GAD-7) screens for anxiety severity."}
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 border border-[#349934]/10 rounded-lg">
              <Info className="h-5 w-5 text-[#349934] mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-[#1e543b]">
                  Clinical Guidance
                </h4>
                <p className="text-xs text-[#1e543b]/70 mt-1">
                  Complete assessments no more than once a week. Remember that
                  healing isn't always linear - ups and downs are normal in
                  recovery.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center p-4">
              <TrendingUp className="h-24 w-24 text-[#349934]/20" />
            </div>
          </TabsContent>

          <TabsContent value="ranges" className="mt-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#1e543b]">
                {type === "ybocs"
                  ? "YBOCS Score Interpretation"
                  : "GAD-7 Score Interpretation"}
              </h3>

              <div className="grid gap-2">
                {(type === "ybocs" ? ybocsRanges : gadRanges).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                      style={{ backgroundColor: `${item.color}10` }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium text-[#1e543b]">
                          {item.range}
                        </span>
                      </div>
                      <span className="text-sm text-[#1e543b]">
                        {item.severity}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="flex items-start gap-3 p-3 mt-3 bg-amber-50 border border-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-xs text-[#1e543b]/80">
                  These ranges are for reference only. Always consult with a
                  healthcare professional for clinical assessment and diagnosis.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogClose asChild>
          <Button variant="outline" className="mt-2">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
