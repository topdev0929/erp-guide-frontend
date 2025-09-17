"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { format } from "date-fns";

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Set default title with today's date when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "MMMM d, yyyy");
    setTitle(`Journal Entry - ${formattedDate}`);
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your journal entry");
      return;
    }

    setIsSaving(true);
    try {
      // Create new journal entry with more detailed logging
      console.log("Sending journal entry:", { title, content });
      const response = await apiCall(
        "/journal/",
        ApiMethod.Post,
        "create journal entry",
        {
          title,
          content,
        }
      );
      console.log("Journal entry created:", response);
      router.push("/me");
    } catch (error) {
      console.error("Error saving journal entry:", error);
      // More detailed error message
      if (error.response) {
        alert(
          `Failed to save journal entry: ${error.response.status} - ${error.response.statusText}`
        );
      } else {
        alert(
          `Failed to save journal entry: ${error.message || "Unknown error"}`
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1e543b] hover:text-[#1e543b]/80 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="text-xl font-semibold">New Journal Entry</span>
          </button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="bg-[#1e543b] hover:bg-[#1e543b]/90 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
          <Textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
