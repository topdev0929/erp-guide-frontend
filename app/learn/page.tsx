"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedGettingStarted } from "@/app/api/api-calls/getting-started-utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, BookOpen, Check } from "lucide-react";
import NonChatPageWrapper from "@/app/components/nonchat-page-wrapper";
import {
  Lesson,
  gettingStartedLessons,
  libraryLessons,
  getCompletedLessons,
} from "./lesson-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { createMetaModuleUrl } from "@/app/meta/chat-utils";

const LessonItem = ({ lesson, index }: { lesson: Lesson; index?: number }) => {
  const router = useRouter();

  const handleClick = () => {
    if (lesson.disabled) {
      return; // Don't navigate if lesson is disabled
    }

    // Check for legacy behavior first
    if (lesson.useLegacyBehavior && lesson.moduleId) {
      router.push(createMetaModuleUrl(lesson.moduleId));
    } else if (lesson.customPath) {
      router.push(lesson.customPath);
    } else {
      router.push(`chat/${lesson.lessonType}?returnPath=/learn`);
    }
  };

  return (
    <div
      className={`group relative flex items-center gap-4 rounded-lg border p-4 transition-colors
          ${
            lesson.disabled
              ? "cursor-not-allowed opacity-60 bg-gray-50"
              : "hover:bg-[#349934] hover:bg-opacity-5 cursor-pointer"
          }`}
      onClick={!lesson.disabled ? handleClick : undefined}
    >
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#349934] bg-opacity-10">
          {lesson.completed ? (
            <Check className="h-6 w-6 text-[#349934]" />
          ) : (
            <lesson.icon className="h-6 w-6 text-[#349934]" />
          )}
        </div>
        {index && (
          <span className="absolute -top-1 -left-1 bg-[#1e543b] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {index}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold ${
            lesson.disabled ? "text-gray-500" : "text-[#1e543b]"
          }`}
        >
          {lesson.title}
        </h3>
        <p
          className={`text-sm ${
            lesson.disabled ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {lesson.description}
        </p>
      </div>
      {!lesson.disabled && (
        <Button variant="ghost" className="ml-auto shrink-0">
          {lesson.completed ? "Review" : "Start"}
        </Button>
      )}
    </div>
  );
};

const LessonsPage = () => {
  const [gettingStartedLessonsState, setGettingStartedLessonsState] = useState<
    Lesson[]
  >(gettingStartedLessons);
  const [libraryLessonsState, setLibraryLessonsState] =
    useState<Lesson[]>(libraryLessons);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLessons = async () => {
      setIsLoading(true);
      try {
        const completedLessons = await getCompletedLessons();

        // Update getting started lessons
        setGettingStartedLessonsState((prevLessons) =>
          prevLessons.map((lesson) => ({
            ...lesson,
            completed: completedLessons.includes(lesson.lessonType || ""),
          }))
        );

        // Update library lessons
        setLibraryLessonsState((prevLessons) =>
          prevLessons.map((lesson) => ({
            ...lesson,
            completed: completedLessons.includes(lesson.lessonType || ""),
          }))
        );
      } catch (error) {
        console.error("Error initializing lessons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLessons();
  }, []);

  if (isLoading) {
    return (
      <NonChatPageWrapper>
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-[#1e543b]" />
              <h2 className="text-2xl font-bold text-[#1e543b]">
                Getting Started
              </h2>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </NonChatPageWrapper>
    );
  }

  return (
    <NonChatPageWrapper>
      <div className="space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-[#1e543b]" />
            <h2 className="text-2xl font-bold text-[#1e543b]">
              Getting Started
            </h2>
          </div>
          <div className="space-y-3">
            {gettingStartedLessonsState.map((lesson, index) => (
              <LessonItem
                key={lesson.title}
                lesson={lesson}
                index={index + 1}
              />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        <section>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-6 w-6 text-[#1e543b]" />
            <h2 className="text-2xl font-bold text-[#1e543b]">Library</h2>
          </div>
          <div className="space-y-3">
            {libraryLessonsState.map((lesson) => (
              <LessonItem key={lesson.title} lesson={lesson} />
            ))}
          </div>
        </section>
      </div>
    </NonChatPageWrapper>
  );
};

export default LessonsPage;
