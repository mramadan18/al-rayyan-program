import { cn } from "@/lib/utils";
import { SurahSelector } from "./SurahSelector";
import { ReciterSelector } from "./ReciterSelector";
import { TafsirSelector } from "./TafsirSelector";
import { QuranAudioPlayer } from "./QuranAudioPlayer";

interface QuranHeaderProps {
  // Surah selector props
  currentSurahNumber: number;
  currentSurahName?: string;
  surahList: Array<{ number: number; name: string; numberOfAyahs: number }>;
  surahListLoading: boolean;
  onSelectSurah: (number: number) => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;

  // Reciter selector props
  currentReciter: string;
  onSelectReciter: (identifier: string) => void;

  // Tafsir selector props
  tafsirId: "muyassar" | "jalalayn";
  onSelectTafsir: (id: "muyassar" | "jalalayn") => void;

  // Surah info
  surahData?: {
    revelationType: string;
    numberOfAyahs: number;
  };

  // Audio player props
  loading: boolean;
  error?: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  currentVerseIndex: number;
  totalVerses: number;
  onTogglePlay: () => void;
  onNextVerse: () => void;
  onPreviousVerse: () => void;
  onSeek: (percentage: number) => void;
}

export function QuranHeader({
  currentSurahNumber,
  currentSurahName,
  surahList,
  surahListLoading,
  onSelectSurah,
  onNextSurah,
  onPrevSurah,
  currentReciter,
  onSelectReciter,
  tafsirId,
  onSelectTafsir,
  surahData,
  loading,
  error,
  isPlaying,
  currentTime,
  duration,
  progress,
  currentVerseIndex,
  totalVerses,
  onTogglePlay,
  onNextVerse,
  onPreviousVerse,
  onSeek,
}: QuranHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-all duration-300">
      <div className="w-full mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Right: Surah Selector & Navigation */}
        <SurahSelector
          currentSurahNumber={currentSurahNumber}
          currentSurahName={currentSurahName}
          surahList={surahList}
          surahListLoading={surahListLoading}
          onSelectSurah={onSelectSurah}
          onNext={onNextSurah}
          onPrev={onPrevSurah}
        />

        {/* Center: Compact Audio Player */}
        {!loading && !error && (
          <QuranAudioPlayer
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            currentVerseIndex={currentVerseIndex}
            totalVerses={totalVerses}
            onTogglePlay={onTogglePlay}
            onNext={onNextVerse}
            onPrevious={onPreviousVerse}
            onSeek={onSeek}
          />
        )}

        {/* Left: Tafsir Selector & Surah Info */}
        <div className="hidden sm:flex items-center gap-3 text-sm font-quran">
          <ReciterSelector
            currentReciter={currentReciter}
            onSelectReciter={onSelectReciter}
          />

          <TafsirSelector tafsirId={tafsirId} onSelectTafsir={onSelectTafsir} />

          {surahData && (
            <>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-xs font-bold",
                  surahData.revelationType === "Meccan"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
                )}
              >
                {surahData.revelationType === "Meccan" ? "مكية" : "مدنية"}
              </span>
              <span className="text-muted-foreground opacity-60">|</span>
              <span className="text-muted-foreground font-medium">
                {surahData.numberOfAyahs} آية
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
