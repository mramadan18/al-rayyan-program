import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

interface QuranAudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  currentVerseIndex: number;
  totalVerses: number;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (percentage: number) => void;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export function QuranAudioPlayer({
  isPlaying,
  currentTime,
  duration,
  progress,
  currentVerseIndex,
  totalVerses,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
}: QuranAudioPlayerProps) {
  return (
    <>
      {/* Compact Audio Player */}
      <div className="flex flex-col items-center flex-1 max-w-xs px-2 md:px-0">
        <div className="flex items-center gap-1 md:gap-3 bg-primary/5 dark:bg-primary/10 px-3 py-1 rounded-full border border-primary/10 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
            onClick={onPrevious}
            disabled={currentVerseIndex <= 0}
            title="الآية السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
            onClick={onTogglePlay}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
            onClick={onNext}
            disabled={currentVerseIndex >= totalVerses - 1}
            title="الآية التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="hidden lg:block h-4 w-px bg-primary/20 mx-1" />

          <span className="hidden lg:block text-[10px] font-mono font-medium text-primary/70 min-w-[65px] text-center">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-primary/40 w-full cursor-pointer overflow-hidden"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const per = (x / rect.width) * 100;
          onSeek(per);
        }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${isNaN(progress) ? 0 : progress}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.1 }}
        />
      </div>
    </>
  );
}
