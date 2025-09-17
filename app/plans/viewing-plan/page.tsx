"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Edit2,
  CheckCircle,
  Brain,
  AlertTriangle,
  Repeat,
  Hash,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Loader2,
  Check,
  X,
  Heart,
  Plus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { useRouter } from "next/navigation";

interface DayPlan {
  day_of_week: number;
  description: string;
}

interface Plan {
  id: number;
  summary: string;
  target_obsession: string;
  target_compulsion: string;
  length_of_exposure: string;
  frequency_of_exposure: string;
  days: DayPlan[];
  start_day: number;
  created_at: string;
  underlying_fear: string | null;
  progress_strategy: string | null;
  format_version: number;
  exposures_completed?: number;
  frequency_number?: number;
  self_care_items?: { id: number; description: string; completed?: boolean }[];
}

export default function PlanPage() {
  const router = useRouter();
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editFrequency, setEditFrequency] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // States for exposure adjustment
  const [isGeneratingExposure, setIsGeneratingExposure] = useState(false);
  const [generatedExposure, setGeneratedExposure] = useState<string | null>(
    null
  );
  const [adjustmentDirection, setAdjustmentDirection] = useState<
    "easier" | "harder" | null
  >(null);
  const [exposureError, setExposureError] = useState(false);
  const [adjustedPlan, setAdjustedPlan] = useState<{
    summary: string;
    progress_strategy: string | null;
  } | null>(null);

  // Add these state variables to the component
  const [isAddSelfCareDialogOpen, setIsAddSelfCareDialogOpen] = useState(false);
  const [newSelfCareActivity, setNewSelfCareActivity] = useState("");
  const [isAddingSelfCare, setIsAddingSelfCare] = useState(false);

  // Navigation between plans
  const handlePrevPlan = () => {
    if (currentPlanIndex < allPlans.length - 1) {
      resetExposureAdjustment();
      setCurrentPlanIndex(currentPlanIndex + 1);
      setCurrentPlan(allPlans[currentPlanIndex + 1]);
    }
  };

  const handleNextPlan = () => {
    if (currentPlanIndex > 0) {
      resetExposureAdjustment();
      setCurrentPlanIndex(currentPlanIndex - 1);
      setCurrentPlan(allPlans[currentPlanIndex - 1]);
    }
  };

  // Load data from API on component mount
  useEffect(() => {
    const loadPlanData = async () => {
      try {
        setIsLoading(true);

        // Fetch all plans from the history API
        const planHistory = await apiCall(
          "/plan/exposure-plan-week/history",
          ApiMethod.Get,
          "get plan history"
        );

        console.log("Plan history loaded:", planHistory);

        if (
          planHistory &&
          Array.isArray(planHistory) &&
          planHistory.length > 0
        ) {
          // Find any plan with a non-empty summary
          const validPlan = planHistory.find((plan) => plan.summary);

          if (validPlan) {
            // Sort plans by date, newest first
            const sortedPlans = [...planHistory].sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );

            // Filter out plans with empty summaries
            const validPlans = sortedPlans.filter((plan) => plan.summary);

            // Only proceed if we have at least one valid plan
            if (validPlans.length > 0) {
              setAllPlans(validPlans);
              setCurrentPlan(validPlans[0]);
              setEditFrequency(validPlans[0].frequency_of_exposure);
            } else {
              console.error("No plans with non-empty summaries found");
              setAllPlans([]);
              setCurrentPlan(null);
            }
          } else {
            console.error("No valid plans found or plan with empty summary");
            setAllPlans([]);
            setCurrentPlan(null);
          }
        } else {
          console.error("No valid plans found or plan with empty summary");
          setAllPlans([]);
          setCurrentPlan(null);
        }
      } catch (error) {
        console.error("Error loading plan data:", error);
        setAllPlans([]);
        setCurrentPlan(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanData();
  }, []);

  // Handle opening the edit dialog for plan elements
  const handleEdit = (field: string, value: string) => {
    if (field === "summary") {
      resetExposureAdjustment(); // Reset exposure adjustment when editing the exposure
    }

    setIsEditing(field);
    setEditValue(value || "");
    if (field === "frequency_of_exposure") {
      setEditFrequency(value || "");
    }
  };

  // Handle saving edits for plan elements
  const handleSave = async () => {
    if (!currentPlan) return;

    const updatedPlan = { ...currentPlan };
    let fieldToUpdate = "";
    let valueToUpdate = "";

    if (isEditing === "target_obsession") {
      updatedPlan.target_obsession = editValue;
      fieldToUpdate = "target_obsession";
      valueToUpdate = editValue;
    } else if (isEditing === "underlying_fear") {
      updatedPlan.underlying_fear = editValue;
      fieldToUpdate = "underlying_fear";
      valueToUpdate = editValue;
    } else if (isEditing === "target_compulsion") {
      updatedPlan.target_compulsion = editValue;
      fieldToUpdate = "target_compulsion";
      valueToUpdate = editValue;
    } else if (isEditing === "frequency_of_exposure") {
      updatedPlan.frequency_of_exposure = editFrequency;
      fieldToUpdate = "frequency_of_exposure";
      valueToUpdate = editFrequency;
    } else if (isEditing === "summary") {
      updatedPlan.summary = editValue;
      fieldToUpdate = "summary";
      valueToUpdate = editValue;
    } else if (isEditing === "progress_strategy") {
      if (updatedPlan.format_version === 2) {
        updatedPlan.progress_strategy = editValue;
        fieldToUpdate = "progress_strategy";
        valueToUpdate = editValue;
      }
    }

    // Update local state first for immediate UI feedback
    setCurrentPlan(updatedPlan);

    // Update the plan in the allPlans array
    const updatedPlans = allPlans.map((plan) =>
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    setAllPlans(updatedPlans);

    setIsEditing(null);

    // Update the plan on the server
    try {
      const payload = {
        id: updatedPlan.id,
        [fieldToUpdate]: valueToUpdate,
      };

      console.log("Updating plan with payload:", payload);

      const response = await apiCall(
        "/plan/exposure-plan-week/",
        ApiMethod.Patch,
        "update exposure plan",
        payload
      );

      console.log("Plan update response:", response);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating plan:", error);
      alert(
        "There was an error updating your plan. Your changes have been saved locally but not synced to the server."
      );
    }
  };

  // Function to handle creating a new plan
  const handleCreateNewPlan = () => {
    // When creating a new plan, clear all related localStorage items
    localStorage.removeItem("generatedExposures");
    localStorage.removeItem("userAnswers");
    localStorage.removeItem("selectedExposure");
    localStorage.removeItem("progressStrategy");
    localStorage.removeItem("cleanedPlan");
    localStorage.removeItem("planId");

    router.push("/plans/initial-questions");
  };

  // Handle generating easier/harder exposure
  const handleAdjustIntensity = async (direction: "easier" | "harder") => {
    if (!currentPlan) return;

    setIsGeneratingExposure(true);
    setAdjustmentDirection(direction);
    setGeneratedExposure(null);
    setExposureError(false);
    setAdjustedPlan(null);

    // Create a timeout promise that rejects after 60 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timed out after 60 seconds"));
      }, 60000);
    });

    try {
      // Prepare the payload with the required structure
      const payload = {
        plan_id: currentPlan.id,
        adjustment_type:
          direction === "easier"
            ? "Make this exposure intensity a bit easier for the user"
            : "Make this exposure intensity a bit harder for the user",
        adjustment_notes: "", // Can be left blank as per requirements
      };

      // Race between the API call and the timeout
      const apiResponse = await Promise.race([
        apiCall(
          "/plan/exposure-plan-week/generate-adjusted-plan/",
          ApiMethod.Post,
          `generate ${direction} exposure`,
          payload
        ),
        timeoutPromise,
      ]);

      // Log the complete response object to inspect its structure
      console.log(
        `Full API Response for ${direction} adjustment:`,
        apiResponse
      );
      console.log("Response type:", typeof apiResponse);
      console.log(
        "Response keys:",
        apiResponse ? Object.keys(apiResponse) : "No response"
      );

      // Check if the API response contains a data field that has the plan content
      const response = apiResponse?.data || apiResponse;

      // Check if response exists and has required data, don't rely on 'success' flag
      if (
        response &&
        (response.summary || response.exposure || response.target_obsession)
      ) {
        console.log("Using adjusted plan data:", response);

        // Store both the new summary and progress strategy from the response
        setAdjustedPlan({
          summary: response.summary || "",
          progress_strategy: response.progress_strategy || null,
        });

        // Set the generated exposure for display
        setGeneratedExposure(response.summary || response.exposure || "");
      } else {
        // Log the actual response to help debug
        console.error("Invalid response format:", response);
        setExposureError(true);
      }
    } catch (error) {
      console.error(`Error generating ${direction} exposure:`, error);
      setExposureError(true);
    } finally {
      setIsGeneratingExposure(false);
    }
  };

  // Handle confirming the new exposure
  const handleConfirmExposure = () => {
    if (!currentPlan || !adjustedPlan) return;

    // Update the current plan with the new exposure and strategy
    const updatedPlan = {
      ...currentPlan,
      summary: adjustedPlan.summary,
      progress_strategy:
        adjustedPlan.progress_strategy || currentPlan.progress_strategy,
    };

    setCurrentPlan(updatedPlan);

    // Update the plan in the allPlans array
    const updatedPlans = allPlans.map((plan) =>
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    setAllPlans(updatedPlans);

    // Reset states
    resetExposureAdjustment();

    // Update the plan on the server
    try {
      const payload = {
        id: updatedPlan.id,
        summary: updatedPlan.summary,
        progress_strategy: updatedPlan.progress_strategy,
      };

      apiCall(
        "/plan/exposure-plan-week/",
        ApiMethod.Patch,
        "update exposure plan",
        payload
      );

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating plan:", error);
      alert(
        "There was an error updating your plan. Your changes have been saved locally but not synced to the server."
      );
    }
  };

  // Handle canceling the new exposure
  const handleCancelExposure = () => {
    resetExposureAdjustment();
  };

  // Reset exposure adjustment states
  const resetExposureAdjustment = () => {
    setIsGeneratingExposure(false);
    setGeneratedExposure(null);
    setAdjustmentDirection(null);
    setExposureError(false);
    setAdjustedPlan(null);
  };

  // Handle deleting a plan
  const handleDeletePlan = async () => {
    if (!currentPlan) return;

    try {
      // Call the delete API endpoint
      await apiCall(
        "/plan/exposure-plan-week/",
        ApiMethod.Delete,
        "delete exposure plan",
        { id: currentPlan.id }
      );

      // Remove the plan from local state
      const updatedPlans = allPlans.filter(
        (plan) => plan.id !== currentPlan.id
      );

      if (updatedPlans.length > 0) {
        // If we still have other plans, update to show the next available plan
        setAllPlans(updatedPlans);
        setCurrentPlanIndex(0);
        setCurrentPlan(updatedPlans[0]);
        setEditFrequency(updatedPlans[0].frequency_of_exposure);
      } else {
        // If no plans remain, clear the states
        setAllPlans([]);
        setCurrentPlan(null);
      }

      // Close the dialog
      setIsDeleteDialogOpen(false);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("There was an error deleting your plan. Please try again.");
      setIsDeleteDialogOpen(false);
    }
  };

  // Function to handle updating the number of exposures completed
  const handleUpdateExposuresCompleted = async (clickedIndex: number) => {
    if (!currentPlan) return;

    // Get the maximum allowed exposures from the plan
    const maxExposures = currentPlan.frequency_number || 4;

    // Calculate the new count based on click behavior
    let newCount = currentPlan.exposures_completed || 0;

    // If clicking on a checkbox that's already checked, uncheck it
    if (newCount > clickedIndex) {
      if (clickedIndex === newCount - 1) {
        // If it's the last checked box, just decrement
        newCount = clickedIndex;
      } else {
        // For now, we'll keep the simple behavior where clicking any checked box
        // will set the count to that index
        newCount = clickedIndex;
      }
    } else {
      // Clicking on an unchecked box checks it
      newCount = clickedIndex + 1;
    }

    // Ensure newCount doesn't exceed the maximum
    newCount = Math.min(newCount, maxExposures);

    // Update local state first for immediate UI feedback
    const updatedPlan = {
      ...currentPlan,
      exposures_completed: newCount,
    };

    setCurrentPlan(updatedPlan);

    // Update the plan in the allPlans array
    const updatedPlans = allPlans.map((plan) =>
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    setAllPlans(updatedPlans);

    // Update the plan on the server
    try {
      const payload = {
        id: updatedPlan.id,
        exposures_completed: newCount,
      };

      console.log("Updating plan with exposures_completed:", payload);

      const response = await apiCall(
        "/plan/exposure-plan-week/",
        ApiMethod.Patch,
        "update exposure plan",
        payload
      );

      console.log("Plan update response:", response);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error updating plan exposures_completed:", error);
      alert(
        "There was an error updating your progress. Your changes have been saved locally but not synced to the server."
      );
    }
  };

  // Add this function to handle adding a new self-care activity
  const handleAddSelfCareItem = async () => {
    if (!currentPlan || !newSelfCareActivity.trim()) return;

    setIsAddingSelfCare(true);

    try {
      // Make API call to add the new self-care item using the plan ID in the URL
      const response = await apiCall(
        `/plan/exposure-plan-week/${currentPlan.id}/self-care-item/`,
        ApiMethod.Post,
        "add self-care item",
        { description: newSelfCareActivity.trim() }
      );

      console.log("Self-care item add response:", response);

      if (response && response.id) {
        // Update local state with the new item
        const newItem = {
          id: response.id,
          description: newSelfCareActivity.trim(),
          completed: false,
        };

        const updatedPlan = {
          ...currentPlan,
          self_care_items: [...(currentPlan.self_care_items || []), newItem],
        };

        setCurrentPlan(updatedPlan);

        // Update the plan in the allPlans array
        const updatedPlans = allPlans.map((plan) =>
          plan.id === updatedPlan.id ? updatedPlan : plan
        );
        setAllPlans(updatedPlans);

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

        // Close the dialog and reset the input
        setIsAddSelfCareDialogOpen(false);
        setNewSelfCareActivity("");
      }
    } catch (error) {
      console.error("Error adding self-care item:", error);
      alert("There was an error adding your self-care item. Please try again.");
    } finally {
      setIsAddingSelfCare(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#349934] mx-auto mb-4"></div>
          <p className="text-[#1e543b]">Loading your plan...</p>
        </div>
      </div>
    );
  }

  // If there are no plans or plan has no summary, show a simple message and the create plan button
  if (!currentPlan || allPlans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-[#1e543b] mb-6">
            Weekly Exposure Plan
          </h1>
          <p className="text-[#1e543b] mb-6">
            You don't have any plans saved. Please create a new plan.
          </p>
          <Button
            onClick={handleCreateNewPlan}
            className="bg-[#349934] hover:bg-[#1e543b] text-white font-medium px-6 py-3 rounded-md text-lg w-full"
          >
            Create a new plan
          </Button>
        </div>
      </div>
    );
  }

  // Weekdays array for day names
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1e543b]">
            Your Plan for the Week
          </h1>
          <Button
            onClick={handleCreateNewPlan}
            className="bg-[#349934] hover:bg-[#1e543b] text-white font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Another Plan
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPlan}
            disabled={currentPlanIndex === allPlans.length - 1}
            className="h-12 w-12 rounded-full p-0 mr-2 border-[#349934] border-opacity-30"
          >
            <ChevronLeft
              className={`h-6 w-6 ${
                currentPlanIndex === allPlans.length - 1
                  ? "text-gray-300"
                  : "text-[#349934]"
              }`}
            />
          </Button>

          <div className="flex items-center bg-[#349934] bg-opacity-10 text-[#1e543b] px-3 py-2 rounded-full">
            <Calendar className="h-4 w-4 mr-2" />
            <div>{format(parseISO(currentPlan.created_at), "MMM d, yyyy")}</div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPlan}
            disabled={currentPlanIndex === 0}
            className="h-12 w-12 rounded-full p-0 ml-2 border-[#349934] border-opacity-30"
          >
            <ChevronRight
              className={`h-6 w-6 ${
                currentPlanIndex === 0 ? "text-gray-300" : "text-[#349934]"
              }`}
            />
          </Button>
        </div>

        {/* Success notification */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-[#349934] text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50 animate-in fade-in slide-in-from-top-5 duration-300">
            <CheckCircle className="h-5 w-5 mr-2" />
            Changes saved
          </div>
        )}

        <div className="space-y-4">
          {/* Progress Tracker Card - Only show for the current plan (index 0) */}
          {currentPlanIndex === 0 && (
            <Card className="overflow-hidden">
              <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center">
                <CheckCircle className="h-5 w-5 text-[#1e543b] mr-2" />
                <h2 className="font-medium text-[#1e543b]">Progress Tracker</h2>
              </div>
              <div className="p-4">
                <p className="text-[#1e543b] mb-4">
                  Mark each time you complete the exposure:
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {/* Generate squares based on frequency_number, filled based on exposures_completed */}
                  {Array.from({
                    length: currentPlan?.frequency_number || 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-14 h-14 flex items-center justify-center rounded-md cursor-pointer transition-all duration-200 ${
                        (currentPlan?.exposures_completed || 0) > index
                          ? "bg-[#349934]"
                          : "bg-gray-100"
                      }`}
                      onClick={() => handleUpdateExposuresCompleted(index)}
                    >
                      {(currentPlan?.exposures_completed || 0) > index ? (
                        <CheckCircle className="h-7 w-7 text-white" />
                      ) : (
                        <div className="h-7 w-7 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#1e543b]">
                    {currentPlan?.exposures_completed || 0} of{" "}
                    {currentPlan?.frequency_number || 4} completed
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Target Obsession */}
          <Card className="overflow-hidden">
            <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="h-5 w-5 text-[#1e543b] mr-2" />
                <h2 className="font-medium text-[#1e543b]">Obsession</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleEdit("target_obsession", currentPlan.target_obsession)
                }
                className="h-8 w-8 p-0 rounded-full"
              >
                <Edit2 className="h-4 w-4 text-[#1e543b]" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-[#1e543b]">{currentPlan.target_obsession}</p>
            </div>
          </Card>

          {/* Underlying Fear - only show for format_version 2 */}
          {currentPlan.format_version === 2 && (
            <Card className="overflow-hidden">
              <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-[#1e543b] mr-2" />
                  <h2 className="font-medium text-[#1e543b]">
                    Underlying Fear
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleEdit(
                      "underlying_fear",
                      currentPlan.underlying_fear || ""
                    )
                  }
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Edit2 className="h-4 w-4 text-[#1e543b]" />
                </Button>
              </div>
              <div className="p-4">
                <p className="text-[#1e543b]">{currentPlan.underlying_fear}</p>
              </div>
            </Card>
          )}

          {/* Target Compulsions */}
          <Card className="overflow-hidden">
            <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center">
                <Repeat className="h-5 w-5 text-[#1e543b] mr-2" />
                <h2 className="font-medium text-[#1e543b]">
                  Compulsions to Resist
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleEdit("target_compulsion", currentPlan.target_compulsion)
                }
                className="h-8 w-8 p-0 rounded-full"
              >
                <Edit2 className="h-4 w-4 text-[#1e543b]" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-[#1e543b]">{currentPlan.target_compulsion}</p>
            </div>
          </Card>

          {/* Exposure Plan Card - Combined card for exposure exercise and improvement strategy */}
          <Card className="overflow-hidden">
            <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-[#1e543b] mr-2" />
                <h2 className="font-medium text-[#1e543b]">Exposure Plan</h2>
              </div>
            </div>
            <div className="p-4">
              {/* Show loading state or generated exposure */}
              {isGeneratingExposure ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 text-[#349934] animate-spin mb-2" />
                  <p className="text-sm text-gray-500">
                    Generating{" "}
                    {adjustmentDirection === "easier" ? "easier" : "harder"}{" "}
                    exposure...
                  </p>
                </div>
              ) : exposureError ? (
                <div className="space-y-3">
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-sm text-red-600">
                      Error generating exposure. Please try again.
                    </p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelExposure}
                      className="flex-1 border-gray-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : generatedExposure ? (
                <div className="space-y-3">
                  {/* Adjusted Exposure Exercise Preview */}
                  <div>
                    <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-2">
                      Exposure Exercise
                    </h3>
                    <div className="bg-[#349934] bg-opacity-5 p-3 rounded-md">
                      <p className="text-sm text-[#1e543b]">
                        {generatedExposure}
                      </p>
                    </div>
                  </div>

                  {/* Adjusted Improvement Strategy Preview (if available) */}
                  {adjustedPlan && adjustedPlan.progress_strategy && (
                    <div className="mt-4">
                      <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-2">
                        Improvement Strategy
                      </h3>
                      <div className="bg-[#349934] bg-opacity-5 p-3 rounded-md">
                        <p className="text-sm text-[#1e543b]">
                          {adjustedPlan.progress_strategy}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Confirm/Cancel buttons */}
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelExposure}
                      className="flex-1 border-gray-300"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleConfirmExposure}
                      className="flex-1 bg-[#349934] hover:bg-[#1e543b]"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Exposure Exercise Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                        Exposure Exercise
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEdit("summary", currentPlan?.summary || "")
                        }
                        className="h-6 w-6 p-0 rounded-full"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-[#1e543b]" />
                      </Button>
                    </div>
                    <p className="text-[#1e543b]">{currentPlan?.summary}</p>
                  </div>

                  {/* Improvement Strategy Section */}
                  {currentPlan.format_version === 2 &&
                    currentPlan.progress_strategy && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wide">
                            Improvement Strategy
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleEdit(
                                "progress_strategy",
                                currentPlan.progress_strategy || ""
                              )
                            }
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-[#1e543b]" />
                          </Button>
                        </div>
                        <p className="text-[#1e543b]">
                          {currentPlan.progress_strategy}
                        </p>
                      </div>
                    )}

                  {/* Adjust exposure intensity controls */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-[#1e543b] text-sm font-medium mb-4">
                      Adjust exposure intensity:
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleAdjustIntensity("easier")}
                        className="flex-1 h-12 text-base border-[#349934] text-[#349934] hover:bg-[#349934]/5"
                        disabled={isGeneratingExposure || !currentPlan}
                      >
                        <ArrowDown className="h-5 w-5 mr-2" />
                        Make Easier
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleAdjustIntensity("harder")}
                        className="flex-1 h-12 text-base border-[#349934] text-[#349934] hover:bg-[#349934]/5"
                        disabled={isGeneratingExposure || !currentPlan}
                      >
                        <ArrowUp className="h-5 w-5 mr-2" />
                        Make Harder
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Frequency */}
          <Card className="overflow-hidden">
            <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center">
                <Hash className="h-5 w-5 text-[#1e543b] mr-2" />
                <h2 className="font-medium text-[#1e543b]">Frequency</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleEdit(
                    "frequency_of_exposure",
                    currentPlan.frequency_of_exposure
                  )
                }
                className="h-8 w-8 p-0 rounded-full"
              >
                <Edit2 className="h-4 w-4 text-[#1e543b]" />
              </Button>
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-[#349934]">
                  {currentPlan?.frequency_number || 4}
                </span>
                <span className="ml-2 text-[#1e543b]">times per week</span>
              </div>
            </div>
          </Card>

          {/* Daily Plan - show for all plans that have days data */}
          {currentPlan.days && currentPlan.days.length > 0 && (
            <Card className="overflow-hidden">
              <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#1e543b] mr-2" />
                  <h2 className="font-medium text-[#1e543b]">Daily Plan</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {currentPlan.days.map((day, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                    >
                      <p className="text-[#1e543b] font-medium">
                        {weekdays[day.day_of_week]}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {day.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Self-Care Routine */}
          <Card className="overflow-hidden">
            <div className="bg-[#349934] bg-opacity-10 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-[#1e543b] mr-2" />
                <h2 className="font-medium text-[#1e543b]">
                  Self-Care Routine
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddSelfCareDialogOpen(true)}
                className="h-8 w-8 p-0 rounded-full"
              >
                <Edit2 className="h-4 w-4 text-[#1e543b]" />
              </Button>
            </div>
            <div className="p-4">
              <p className="text-[#1e543b] mb-3">
                After completing your exposures, take time for self-care.
              </p>
              <ul className="space-y-2 text-[#1e543b]">
                {currentPlan?.self_care_items?.length > 0 ? (
                  <>
                    <li className="pt-2 pb-1">
                      <p className="font-medium text-[#1e543b]">
                        Your selected self-care activities:
                      </p>
                    </li>
                    {currentPlan.self_care_items.map((item) => (
                      <li key={item.id} className="flex items-start">
                        <div className="min-w-4 h-4 rounded-full bg-[#349934] mt-1 mr-2"></div>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <div className="min-w-4 h-4 rounded-full bg-[#349934] mt-1 mr-2"></div>
                      <p>
                        Be kind to yourself. Exposures are challenging mental
                        exercises.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-4 h-4 rounded-full bg-[#349934] mt-1 mr-2"></div>
                      <p>
                        Engage in activities you enjoy - go for a walk, listen
                        to music, or spend time with friends.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-4 h-4 rounded-full bg-[#349934] mt-1 mr-2"></div>
                      <p>
                        Physical exercise can help release tension - try a short
                        run or some stretching.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-4 h-4 rounded-full bg-[#349934] mt-1 mr-2"></div>
                      <p>
                        Acknowledge your progress. Each exposure is a step
                        forward, regardless of the outcome.
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-4 h-4 rounded-full bg-[#349934] mt-1 mr-2"></div>
                      <p>
                        Practice mindfulness or deep breathing to help center
                        yourself.
                      </p>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </Card>
        </div>

        {/* Delete plan button */}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="outline"
            className="border-red-300 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-400 font-medium px-6 py-3 rounded-md text-lg w-full max-w-xs"
          >
            Delete this plan
          </Button>
        </div>
      </main>

      {/* Edit Dialog for Plan Elements */}
      <Dialog
        open={isEditing !== null}
        onOpenChange={(open) => !open && setIsEditing(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing === "target_obsession" && (
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Edit Obsession
                </div>
              )}
              {isEditing === "underlying_fear" && (
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Edit Fear
                </div>
              )}
              {isEditing === "target_compulsion" && (
                <div className="flex items-center">
                  <Repeat className="h-5 w-5 mr-2" />
                  Edit Compulsions
                </div>
              )}
              {isEditing === "frequency_of_exposure" && (
                <div className="flex items-center">
                  <Hash className="h-5 w-5 mr-2" />
                  Edit Frequency
                </div>
              )}
              {isEditing === "summary" && (
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Edit Exposure Exercise
                </div>
              )}
              {isEditing === "progress_strategy" && (
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Edit Progress Strategy
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {isEditing === "frequency_of_exposure" ? (
              <div className="space-y-2">
                <label htmlFor="frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <select
                  value={editFrequency}
                  onChange={(e) => setEditFrequency(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="1-2">1-2 times per week</option>
                  <option value="3-4">3-4 times per week</option>
                  <option value="5-7">5-7 times per week</option>
                </select>
              </div>
            ) : isEditing === "progress_strategy" || isEditing === "summary" ? (
              <div className="space-y-2">
                <label htmlFor="textareaField" className="text-sm font-medium">
                  {isEditing === "summary" && "Exposure Exercise"}
                  {isEditing === "progress_strategy" && "Progress Strategy"}
                </label>
                <Textarea
                  id="textareaField"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="editField" className="text-sm font-medium">
                  {isEditing === "target_obsession" && "Obsession"}
                  {isEditing === "underlying_fear" && "Fear"}
                  {isEditing === "target_compulsion" && "Compulsions"}
                </label>
                <Input
                  id="editField"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#349934] hover:bg-[#1e543b]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete This Plan
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePlan}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Self-Care Dialog */}
      <Dialog
        open={isAddSelfCareDialogOpen}
        onOpenChange={setIsAddSelfCareDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Add Self-Care Activity
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <label htmlFor="selfCareActivity" className="text-sm font-medium">
                Activity Description
              </label>
              <Textarea
                id="selfCareActivity"
                value={newSelfCareActivity}
                onChange={(e) => setNewSelfCareActivity(e.target.value)}
                placeholder="e.g., Take a 20-minute walk in nature"
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddSelfCareDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSelfCareItem}
              disabled={isAddingSelfCare || !newSelfCareActivity.trim()}
              className="bg-[#349934] hover:bg-[#1e543b]"
            >
              {isAddingSelfCare ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Activity"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
