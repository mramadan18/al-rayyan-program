import { Play, SkipBack, SkipForward, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  progress: number;
  onProgressChange: (value: number) => void;
  reciterName: string;
  durationLabel: string;
}

export function AudioPlayer({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  progress,
  onProgressChange,
  reciterName,
  durationLabel,
}: AudioPlayerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 translate-y-2 hover:translate-y-0 bg-linear-to-t from-background to-transparent pt-12 group/player">
      <div className="max-w-2xl mx-auto bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-6">
        {/* Play Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={onPrevious}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={onNext}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Info & Progress */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-foreground">{reciterName}</span>
            <span className="font-mono text-muted-foreground text-xs">
              {durationLabel}
            </span>
          </div>
          <Slider
            value={[progress]}
            onValueChange={(val) => onProgressChange(val[0])}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
