import { Activity, Move } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function MiniWidget() {
  // Placeholder data
  const nextPrayer = "Asr";
  const timeLeft = "00:45:12";
  const progress = 65; // Percentage elapsed

  return (
    <div className="fixed top-4 right-4 z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md shadow-2xl w-[280px]">
      {/* Drag Handle */}
      <div
        className="absolute top-0 left-0 w-full h-4 bg-transparent cursor-move group"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties} // TypeScript fix for electron drag
      >
        <div className="mx-auto w-8 h-1 bg-white/20 rounded-full mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4 relative">
        {/* Header: Icon + Next Prayer */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-amber-500">
            <div className="relative">
              <Activity className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-sm font-medium text-amber-100">
              Next: {nextPrayer}
            </span>
          </div>
          <Move className="w-3 h-3 text-slate-500 opacity-50" />
        </div>

        {/* Center: Countdown */}
        <div className="text-center py-2">
          <span className="text-4xl font-mono font-bold text-white tracking-wider drop-shadow-lg">
            {timeLeft}
          </span>
        </div>

        {/* Footer: Progress Bar */}
        <div className="mt-3 space-y-1">
          <Progress
            value={progress}
            className="h-1 bg-slate-700/50 [&>div]:bg-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Dhuhr</span>
            <span>Asr</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
