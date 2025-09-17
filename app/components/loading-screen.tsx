import { LoaderCircle } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed left-0 top-0 w-screen h-screen bg-black/50 flex justify-center items-center">
      <LoaderCircle size={64} className="text-white animate-spin" />
    </div>
  );
}
