"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, Check } from "lucide-react";

interface TherapyPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: string;
  onValueChange: (value: string) => void;
}

const TherapyPreferencesDialog = ({
  open,
  onOpenChange,
  selected,
  onValueChange,
}: TherapyPreferencesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md [&>button]:hidden rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-background p-4 flex flex-row items-center space-y-0">
          <button
            onClick={() => onOpenChange(false)}
            className="mr-2 text-[#1e543b]"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <DialogTitle className="text-lg">Guidance Style</DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-5">
          <div
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected === "detailed"
                ? "border-[#1e543b] bg-[#f0f7f4]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onValueChange("detailed")}
          >
            <div className="flex-1 pr-4">
              <h3 className="font-medium text-lg mb-1">Detailed Teacher</h3>
              <p className="text-gray-600">
                Provides longer, more detailed responses with thorough
                explanations and examples. Best for understanding complex
                concepts and learning new techniques.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 mt-1">
              {selected === "detailed" && (
                <Check className="h-5 w-5 text-[#1e543b]" />
              )}
            </div>
          </div>

          <div
            className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected === "concise"
                ? "border-[#1e543b] bg-[#f0f7f4]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onValueChange("concise")}
          >
            <div className="flex-1 pr-4">
              <h3 className="font-medium text-lg mb-1">Concise Coach</h3>
              <p className="text-gray-600">
                Offers brief, thought-provoking questions and responses. Best
                for quick check-ins and self-reflection exercises.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 mt-1">
              {selected === "concise" && (
                <Check className="h-5 w-5 text-[#1e543b]" />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapyPreferencesDialog;
