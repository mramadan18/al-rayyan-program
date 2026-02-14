import { Play, Pause, Volume2, Radio } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function LiveRadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-4 shadow-2xl backdrop-blur-lg bg-opacity-95 text-slate-100 flex items-center justify-between gap-4">
      {/* Station Info */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <Radio className="w-6 h-6 text-amber-500" />
          </div>
          {/* Live Indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm text-slate-200 leading-none">
              إذاعة القرآن الكريم
            </h3>
            <Badge
              variant="destructive"
              className="bg-red-600/90 hover:bg-red-600 text-[10px] h-4 px-1.5 animate-pulse"
            >
              LIVE
            </Badge>
          </div>
          <p className="text-xs text-slate-400">Cairo Public Radio</p>
        </div>
      </div>

      {/* Visualizer (CSS Animation) */}
      <div className="flex-1 flex items-center justify-center gap-[3px] h-8 max-w-[200px] opacity-80">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 bg-amber-500/50 rounded-full transition-all duration-300 ease-in-out",
              isPlaying ? "animate-bounce" : "h-1",
            )}
            style={{
              height: isPlaying ? `${Math.random() * 100}%` : "4px",
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10 border-2 border-amber-500"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-1" />
          )}
        </button>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-2 w-32 group">
          <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          <Slider
            defaultValue={[80]}
            max={100}
            step={1}
            value={volume}
            onValueChange={setVolume}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
