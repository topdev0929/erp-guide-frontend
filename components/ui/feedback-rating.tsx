import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeedbackRatingProps {
  onSubmit?: (rating: number) => void;
  className?: string;
}

// Alternative compact version for inline use
export function FeedbackRating({ onSubmit, className }: FeedbackRatingProps) {
  const [rating, setRating] = React.useState(0);
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    if (onSubmit) {
      onSubmit(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoveredRating || rating);
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              className="p-0.5 transition-colors duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
            >
              <Star
                className={cn(
                  "w-5 h-5 transition-colors duration-200",
                  isFilled
                    ? "fill-accent text-accent"
                    : "text-muted-foreground hover:text-accent/60"
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
