import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 py-10">
      {/* Post thread skeleton */}
      <div className="flex items-center gap-3 w-full py-7">
        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
        <div className="h-5 w-40 rounded bg-muted animate-pulse" />
      </div>

      {/* Thread card skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex w-full gap-4 py-7 border-t border-border">
          <div className="flex flex-col items-center gap-2">
            <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
            <div className="w-0.5 grow rounded-full bg-muted animate-pulse" />
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
              <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="flex gap-3 mt-2">
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
