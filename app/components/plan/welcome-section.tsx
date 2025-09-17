"use client";

import { Card } from "@/components/ui/card";

interface WelcomeSectionProps {
  selectedExposure?: string | null;
  selectedObsession?: string | null;
}

export default function WelcomeSection({
  selectedExposure,
  selectedObsession,
}: WelcomeSectionProps) {
  if (!selectedExposure && !selectedObsession) return null;

  return (
    <Card className="p-4 mb-6">
      <p className="text-sm text-gray-600">
        You&apos;ve selected to work on:{" "}
        <span className="font-bold">
          {decodeURIComponent(selectedExposure || selectedObsession)}
        </span>
      </p>
    </Card>
  );
}
