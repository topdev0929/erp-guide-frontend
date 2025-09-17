import { DeleteModalProps } from '@/app/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteConfirmationModal = ({
  subtypeName,
  onConfirm,
  onCancel,
}: DeleteModalProps) => (
  <Dialog open={true} onOpenChange={() => onCancel()}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="space-y-3">
        <DialogTitle className="text-xl font-semibold text-[#1e543b]">
          Delete Subtype?
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Are you sure you want to delete the subtype "{subtypeName}"? All
          obsessions and compulsions related to this subtype will be permanently
          deleted.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
