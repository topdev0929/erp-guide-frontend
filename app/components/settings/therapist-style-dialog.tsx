"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";

// We need to create simple versions of these components since the imports are failing
const RadioGroup = ({ children, value, onValueChange, className }) => {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          checked: child.props.value === value,
          onChange: () => onValueChange(child.props.value),
        })
      )}
    </div>
  );
};

const RadioGroupItem = ({
  value,
  id,
  className,
  checked = false,
  onChange = () => {},
}) => {
  return (
    <div className={className}>
      <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded-full border-2 border-primary text-primary"
      />
    </div>
  );
};

const Label = ({ htmlFor, className, children }) => {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
};

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
      <DialogContent className="max-w-md [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center space-y-0 pb-2">
          <button
            onClick={() => onOpenChange(false)}
            className="mr-2 text-[#1e543b]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <DialogTitle>Communication Preference</DialogTitle>
        </DialogHeader>
        <div className="p-2 space-y-6">
          <RadioGroup
            value={selected}
            onValueChange={onValueChange}
            className="space-y-4"
          >
            <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
              <RadioGroupItem value="detailed" id="detailed" className="mt-1" />
              <div className="space-y-2">
                <Label htmlFor="detailed" className="text-base font-medium">
                  Detailed Teacher
                </Label>
                <p className="text-sm text-muted-foreground">
                  Provides longer, more detailed responses with thorough
                  explanations and examples. Best for understanding complex
                  concepts and learning new techniques.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
              <RadioGroupItem value="concise" id="concise" className="mt-1" />
              <div className="space-y-2">
                <Label htmlFor="concise" className="text-base font-medium">
                  Concise Coach
                </Label>
                <p className="text-sm text-muted-foreground">
                  Offers brief, thought-provoking questions and responses. Best
                  for quick check-ins and self-reflection exercises.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapyPreferencesDialog;
