"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  meta_session: number | null;
}

export default function JournalEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const isNewEntry = params.id === "new";
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(!isNewEntry);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNewEntry) {
      apiCall(`/journal/${params.id}/`, ApiMethod.Get, "fetch journal entry")
        .then((data) => {
          if (data) {
            setJournalEntry(data);
            setTitle(data.title);
            setContent(data.content);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching journal entry:", error);
          setIsLoading(false);
        });
    }
  }, [params.id, isNewEntry]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your journal entry");
      return;
    }

    setIsSaving(true);
    try {
      if (isNewEntry) {
        // Create new journal entry
        console.log("Creating new journal entry:", { title, content });
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
      } else {
        // Update existing journal entry with more detailed logging
        const endpoint = `/journal/${params.id}/`;
        console.log(`Updating journal entry at ${endpoint}:`, {
          id: params.id,
          method: ApiMethod.Patch,
          title,
          content,
        });

        const response = await apiCall(
          endpoint,
          ApiMethod.Patch,
          "update journal entry",
          {
            title,
            content,
          }
        );
        console.log("Journal entry updated:", response);
      }
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
            onClick={handleSave}
            className="flex items-center gap-2 text-[#1e543b] hover:text-[#1e543b]/80 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="text-xl font-semibold">
              {isNewEntry ? "New Journal Entry" : "Edit Journal Entry"}
            </span>
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

        {/* Display linked conversation if it exists */}
        {!isLoading && journalEntry?.meta_session && (
          <div className="mb-4">
            <Link
              href={`/me/conversations/${journalEntry.meta_session}`}
              className="flex items-center gap-2 text-[#349934] hover:text-[#349934]/80 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>View linked conversation</span>
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
