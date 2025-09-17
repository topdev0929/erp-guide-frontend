"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Edit } from "lucide-react";
import { apiCall } from "@/app/api/api-utils";
import { ApiMethod } from "@/app/types/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Component for skeleton loader
const JournalSkeleton = () => (
  <div className="p-4 border-b">
    <Skeleton className="h-4 w-32 mb-2" />
    <div className="flex">
      <Skeleton className="h-4 w-24 mr-2" />
      <Skeleton className="h-4 flex-1" />
    </div>
    <Skeleton className="h-4 w-3/4 mt-1" />
  </div>
);

// Journal entry component
const JournalEntryCard = ({ entry }: { entry: JournalEntry }) => (
  <div className="relative border-b">
    <Link
      href={`/me/journal/${entry.id}`}
      className="flex flex-col p-4 hover:bg-muted/50"
    >
      <h3 className="font-medium text-[#1e543b] mb-1">{entry.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        <span className="text-sm text-muted-foreground mr-2">
          {format(new Date(entry.created_at), "MMM d, yyyy")}
        </span>
        {entry.content}
      </p>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </Link>
  </div>
);

export default function JournalTab({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch journal entries
  useEffect(() => {
    if (activeTab === "journal") {
      setIsLoading(true);
      apiCall("/journal/", ApiMethod.Get, "fetch journal entries")
        .then((data) => {
          if (data) {
            setJournalEntries(data);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching journal entries:", error);
          setIsLoading(false);
        });
    }
  }, [activeTab]);

  // Navigate to create new journal entry
  const handleCreateJournal = () => {
    router.push("/me/journal/new");
  };

  return (
    <>
      {isLoading ? (
        // Show skeleton loaders while loading
        <>
          <JournalSkeleton />
          <JournalSkeleton />
          <JournalSkeleton />
        </>
      ) : journalEntries.length > 0 ? (
        // Show journal entries if available
        <div className="divide-y">
          {journalEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        // Show empty state if no journal entries
        <div className="p-8 text-center text-muted-foreground">
          <p>
            {" "}
            Create your first journal entry to track your thoughts and progress.
          </p>
        </div>
      )}

      {/* Add New Journal Entry Button */}
      <div className="fixed bottom-20 right-4">
        <button
          onClick={handleCreateJournal}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#349934] text-white shadow-lg"
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
    </>
  );
}
