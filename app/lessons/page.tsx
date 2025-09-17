"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedGettingStarted } from "@/app/api/api-calls/getting-started-utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, BookOpen, CheckCircle } from "lucide-react";
import NonChatPageWrapper from "@/app/components/nonchat-page-wrapper";
import {
  getLessonCompletionStatuses,
  Lesson,
  gettingStartedLessons,
  libraryLessons,
  markModuleComplete,
  getCompletionType,
} from "./lesson-utils";
import { createMetaModuleUrl } from "@/app/meta/chat-utils";
import { Skeleton } from "@/components/ui/skeleton";

const LessonsPage = () => {
  const router = useRouter();
  const [gettingStartedLessonsState, setGettingStartedLessonsState] = useState<
    Lesson[]
  >(gettingStartedLessons);
  const [libraryLessonsState, setLibraryLessonsState] =
    useState<Lesson[]>(libraryLessons);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLessons = async () => {
      console.log("Initializing lessons...");
      setIsLoading(true);

      try {
        const completedLessons = await getLessonCompletionStatuses();

        console.log("Got completed lessons:", completedLessons);

        // Debug each lesson path before processing
        libraryLessons.forEach((lesson) => {
          console.log("Processing lesson path:", lesson.path);
        });

        // Update getting started lessons
        setGettingStartedLessonsState((prevLessons) =>
          prevLessons.map((lesson) => ({
            ...lesson,
            completed: completedLessons.includes(lesson.completionType),
          }))
        );

        // Update library lessons
        setLibraryLessonsState((prevLessons) =>
          prevLessons.map((lesson) => ({
            ...lesson,
            disabled: lesson.path === "" ? true : false,
            completed: completedLessons.includes(lesson.completionType),
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

  const handleLessonClick =
    (
      path: string,
      title: string,
      moduleId: string,
      completionType: string,
      isCompleted: boolean
    ) =>
    async (e: React.MouseEvent) => {
      try {
        // Mark the module as complete if it's not already completed
        if (!isCompleted) {
          // Use the completion type as the module ID
          const moduleIdToComplete = completionType;
          await markModuleComplete(moduleIdToComplete);

          // You could update the local state here if needed
          // to immediately reflect the completion without waiting for a reload
        }

        // Navigate to the module
        if (moduleId) {
          router.push(createMetaModuleUrl(moduleId));
        } else {
          router.push(path);
        }
      } catch (error) {
        console.error("Error handling lesson click:", error);
        // Still navigate even if marking as complete fails
        if (moduleId) {
          router.push(createMetaModuleUrl(moduleId));
        } else {
          router.push(path);
        }
      }
    };

  const LessonItemSkeleton = ({ hasIndex = false }: { hasIndex?: boolean }) => (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="relative flex-shrink-0">
        <Skeleton className="h-12 w-12 rounded-full" />
        {hasIndex && (
          <Skeleton className="absolute -top-1 -left-1 w-5 h-5 rounded-full" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-9 w-20 rounded-md" />
    </div>
  );

  const LessonItem = ({
    lesson,
    index,
  }: {
    lesson: Lesson;
    index?: number;
  }) => {
    return (
      <div
        className={`group relative flex items-center gap-4 rounded-lg border p-4 transition-colors
          ${
            lesson.disabled
              ? "cursor-not-allowed opacity-60 bg-gray-50"
              : "hover:bg-[#349934] hover:bg-opacity-5 cursor-pointer"
          }`}
        onClick={
          !lesson.disabled
            ? handleLessonClick(
                lesson.path,
                lesson.title,
                lesson.moduleId,
                lesson.completionType,
                lesson.completed
              )
            : undefined
        }
      >
        <div className="relative flex-shrink-0">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#349934] bg-opacity-10">
            {lesson.completed ? (
              <CheckCircle className="h-6 w-6 text-[#349934]" />
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

  return (
    <NonChatPageWrapper>
      <div className="space-y-8">
        {isLoading ? (
          <>
            <section>
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-8 w-44" />
              </div>
              <div className="space-y-3">
                <LessonItemSkeleton hasIndex={true} />
                <LessonItemSkeleton hasIndex={true} />
                <LessonItemSkeleton hasIndex={true} />
                <LessonItemSkeleton hasIndex={true} />
              </div>
            </section>

            <Skeleton className="h-px w-full my-8" />

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48 ml-2" />
              </div>
              <div className="space-y-3">
                <LessonItemSkeleton />
                <LessonItemSkeleton />
                <LessonItemSkeleton />
              </div>
            </section>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </NonChatPageWrapper>
  );
};

export default LessonsPage;
