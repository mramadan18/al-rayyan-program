import { Play, Pause, Radio, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioStation } from "@/contexts/radio-context";

interface RadioPlayerBarProps {
  currentRadio: RadioStation;
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number[];
  setVolume: (value: number[]) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export function RadioPlayerBar({
  currentRadio,
  isPlaying,
  togglePlay,
  volume,
  setVolume,
  isMuted,
  toggleMute,
}: RadioPlayerBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-100 p-4 animate-in slide-in-from-bottom duration-300">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800" />

      <div className="container mx-auto relative z-10 flex items-center justify-between gap-4 max-w-5xl">
        {/* Station Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Radio className="w-6 h-6 text-amber-500" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-white truncate">
              {currentRadio.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs text-red-400 font-medium">مباشر</span>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-900/20"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="hidden md:flex items-center gap-3 w-48 flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-white/10"
            onClick={toggleMute}
          >
            {isMuted || volume[0] === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume[0] * 100]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume([val[0] / 100])}
            className="w-32 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
