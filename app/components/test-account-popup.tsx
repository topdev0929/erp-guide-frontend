import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";

interface TestAccountPopupProps {
  open: boolean;
  onClose: () => void;
}

const TestAccountPopup: React.FC<TestAccountPopupProps> = ({
  open,
  onClose,
}) => {
  const handleSetTestAccount = async () => {
    try {
      await apiCall(
        '/user/test-account/',
        ApiMethod.Post,
        'set test account status',
        { test_account: true }
      );
      onClose();
    } catch (error) {
      console.error('Failed to set test account:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-[#1e543b]">
            Internal Use Only
          </DialogTitle>
        </DialogHeader>
        <div className="text-center mb-4">
          Would you like to set as a test account?
        </div>
        <div className="flex justify-between gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 text-[#1e543b] border-[#1e543b]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetTestAccount}
            className="flex-1 bg-[#fd992d] text-white hover:bg-[#d73356]"
          >
            Set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestAccountPopup; 