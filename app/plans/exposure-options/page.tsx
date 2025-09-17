"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, RefreshCw, Check } from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { useRouter } from "next/navigation";

// Remove the difficulty property from the exposure objects and UI
// Update the selection mechanism to only allow one selection
// Make the design more tech-forward and mobile-friendly

// Update the initialExposures to remove difficulty
const initialExposures = [
  {
    id: 1,
    title: "Touch a doorknob without washing hands",
    description:
      "Practice touching doorknobs in your home and resist the urge to wash your hands immediately after.",
  },
  {
    id: 2,
    title: "Leave home without checking locks multiple times",
    description:
      "Practice leaving your home after checking locks only once, tolerating the uncertainty.",
  },
  {
    id: 3,
    title: "Write down intrusive thoughts",
    description:
      "Write down intrusive thoughts as they occur and sit with the discomfort without performing compulsions.",
  },
];

// Update the exposure interface to match API response
interface Exposure {
  id?: number;
  description: string;
}

export default function ExposuresPage() {
  const router = useRouter();
  const [exposures, setExposures] = useState<Exposure[]>([]);
  const [selectedExposure, setSelectedExposure] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [currentExposure, setCurrentExposure] = useState<Exposure>({
    description: "",
  });

  // Load exposures from localStorage on initial render
  useEffect(() => {
    const loadExposures = () => {
      try {
        const savedExposures = localStorage.getItem("generatedExposures");

        if (savedExposures) {
          const parsedExposures = JSON.parse(savedExposures);

          // Add IDs to the exposures if they don't have them
          const exposuresWithIds = parsedExposures.map(
            (exp: Exposure, index: number) => ({
              ...exp,
              id: exp.id || index + 1,
            })
          );

          setExposures(exposuresWithIds);

          // Preselect the first exposure in the list
          if (exposuresWithIds.length > 0 && exposuresWithIds[0].id) {
            setSelectedExposure(exposuresWithIds[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading exposures:", error);
      }
    };

    loadExposures();
  }, []);

  // Updated handleGenerateMore function to call the API with user answers
  const handleGenerateMore = async () => {
    setIsGenerating(true);

    try {
      // Get the original user answers from localStorage
      const savedAnswers = localStorage.getItem("userAnswers");
      const userAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};

      // Prepare the payload with both user answers and previous exposures
      const payload = {
        user_answers: userAnswers,
        previous_exposures: exposures.map(({ description }) => ({
          description,
        })),
      };

      // Make API call to generate more exposures
      const response = await apiCall(
        "/exposures/exposure-generator/",
        ApiMethod.Post,
        "generate more exposure options",
        payload
      );

      if (response && response.success && response.exposures) {
        // Add IDs to the new exposures
        const nextId =
          exposures.length > 0
            ? Math.max(...exposures.map((e: Exposure) => e.id || 0)) + 1
            : 1;

        const newExposuresWithIds = response.exposures.map(
          (exp: Exposure, index: number) => ({
            ...exp,
            id: nextId + index,
          })
        );

        // Combine with existing exposures
        const updatedExposures = [...exposures, ...newExposuresWithIds];
        setExposures(updatedExposures);

        // Update localStorage
        localStorage.removeItem("generatedExposures");
        localStorage.setItem(
          "generatedExposures",
          JSON.stringify(updatedExposures)
        );
      }
    } catch (error) {
      console.error("Error generating more exposures:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectExposure = (id: number) => {
    setSelectedExposure(selectedExposure === id ? null : id);
  };

  const handleEditExposure = (exposure: Exposure) => {
    setCurrentExposure(exposure);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentExposure.id) {
      // New exposure
      const newExposure = {
        ...currentExposure,
        id:
          exposures.length > 0
            ? Math.max(...exposures.map((e: Exposure) => e.id || 0)) + 1
            : 1,
      };
      const updatedExposures = [...exposures, newExposure];
      setExposures(updatedExposures);
      localStorage.removeItem("generatedExposures");
      localStorage.setItem(
        "generatedExposures",
        JSON.stringify(updatedExposures)
      );
    } else {
      // Edit existing exposure
      const updatedExposures = exposures.map((exp) =>
        exp.id === currentExposure.id ? currentExposure : exp
      );
      setExposures(updatedExposures);
      localStorage.removeItem("generatedExposures");
      localStorage.setItem(
        "generatedExposures",
        JSON.stringify(updatedExposures)
      );
    }

    setIsEditDialogOpen(false);
    setIsNewDialogOpen(false);
  };

  const handleCreateNew = () => {
    setCurrentExposure({ description: "" });
    setIsNewDialogOpen(true);
  };

  const handleContinue = () => {
    if (selectedExposure) {
      const selectedExp = exposures.find((exp) => exp.id === selectedExposure);
      if (selectedExp) {
        // Save the selected exposure to localStorage
        localStorage.removeItem("selectedExposure");
        localStorage.setItem("selectedExposure", JSON.stringify(selectedExp));

        // Navigate to the progress-strategy page
        router.push("/plans/progress-strategy");
      }
    } else {
      alert("Please select an exposure to continue.");
    }
  };

  // Remove the getDifficultyColor function as it's no longer needed

  // Replace the return JSX with a more tech-forward design
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#1e543b] mb-2">
          Select an exercise, or create your own.
        </h1>
        <p className="text-gray-600 mb-5">
          Choose <span className="font-bold">ONE</span> option that feels
          somewhat challenging but achievable.
        </p>

        <div className="space-y-4 mb-6">
          {exposures.map((exposure) => (
            <div key={exposure.id} className="relative">
              <Card
                className={`p-4 relative overflow-hidden transition-all cursor-pointer ${
                  selectedExposure === exposure.id
                    ? "ring-2 ring-[#349934] bg-green-50"
                    : "hover:shadow-md hover:bg-gray-50"
                }`}
                onClick={() => handleSelectExposure(exposure.id)}
              >
                {selectedExposure === exposure.id && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#349934]" />
                )}
                <div className="flex flex-col h-full">
                  <div className="flex-1 pl-1 mb-8">
                    <p className="text-sm text-gray-600">
                      {exposure.description}
                    </p>
                  </div>
                  <div className="absolute bottom-4 left-5">
                    {selectedExposure === exposure.id ? (
                      <div className="flex items-center text-sm font-medium text-[#349934]">
                        <Check className="h-4 w-4 mr-1" />
                        Selected
                      </div>
                    ) : (
                      <div className="h-6"></div> // Empty space placeholder with same height
                    )}
                  </div>
                </div>
              </Card>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditExposure(exposure);
                }}
                className="absolute top-0 right-0 h-12 w-12 rounded-full p-0 bg-white border shadow-sm text-gray-500 hover:text-[#1e543b] hover:bg-green-50 z-10 transform translate-x-1/3 -translate-y-1/3"
              >
                <Edit className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-3">
          <Button
            variant="outline"
            onClick={handleGenerateMore}
            disabled={isGenerating}
            className="w-full border-dashed border-gray-300 h-12 hover:bg-green-50 hover:border-[#349934]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                Generate More Options
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleCreateNew}
            className="w-full border-dashed border-gray-300 h-12 hover:bg-green-50 hover:border-[#349934]"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your Own
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selectedExposure}
            className="w-full bg-[#349934] hover:bg-[#1e543b] mt-4 h-12 font-medium"
          >
            Continue with Selected Exposure
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Exposure Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={currentExposure.description}
                onChange={(e) =>
                  setCurrentExposure({
                    ...currentExposure,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#349934] hover:bg-[#1e543b]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Dialog */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Custom Exposure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="new-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="new-description"
                value={currentExposure.description}
                onChange={(e) =>
                  setCurrentExposure({
                    ...currentExposure,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the exposure exercise in detail"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#349934] hover:bg-[#1e543b]"
            >
              Create Exposure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
