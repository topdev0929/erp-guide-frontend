import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TimePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pickerHour: string;
  setPickerHour: (hour: string) => void;
  pickerMinute: string;
  setPickerMinute: (minute: string) => void;
  pickerPeriod: string;
  setPickerPeriod: (period: string) => void;
  onSave: () => void;
}

const TimePickerDialog: React.FC<TimePickerDialogProps> = ({
  open,
  onOpenChange,
  pickerHour,
  setPickerHour,
  pickerMinute,
  setPickerMinute,
  pickerPeriod,
  setPickerPeriod,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex items-center">
          <button onClick={() => onOpenChange(false)} className="mr-2 text-xl">
            ←
          </button>
          <DialogTitle>
            What time do you want your consistency reminder?
          </DialogTitle>
        </div>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <select
            value={pickerHour}
            onChange={(e) => setPickerHour(e.target.value)}
            className="p-2 border rounded"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n.toString()}>
                {n}
              </option>
            ))}
          </select>
          <span className="text-xl">:</span>
          <select
            value={pickerMinute}
            onChange={(e) => setPickerMinute(e.target.value)}
            className="p-2 border rounded"
          >
            {Array.from({ length: 60 }, (_, i) =>
              i.toString().padStart(2, "0")
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select
            value={pickerPeriod}
            onChange={(e) => setPickerPeriod(e.target.value)}
            className="p-2 border rounded"
          >
            {["AM", "PM"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={onSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimePickerDialog;
