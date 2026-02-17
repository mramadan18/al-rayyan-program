import { useState, useRef, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { VerseItem } from "@/components/quran/VerseItem";
import { QuranHeader } from "@/components/quran/QuranHeader";
import { SurahHeader } from "@/components/quran/SurahHeader";
import { useQuranData } from "@/hooks/useQuranData";
import { useQuranAudio } from "@/hooks/useQuranAudio";
import { useSurahList } from "@/hooks/useSurahList";
import { useTafsir } from "@/hooks/useTafsir";
import { useQuranState } from "@/hooks/useQuranState";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function QuranPage() {
  // State management
  const {
    currentSurahNumber,
    currentReciter,
    tafsirId,
    lastReadVerse,
    currentVerseIndex,
    isStateLoaded,
    setCurrentVerseIndex,
    setLastReadVerse,
    nextSurah,
    prevSurah,
    selectSurah,
    selectReciter,
    selectTafsir,
  } = useQuranState();

  // Playback mode: 'single' = play one verse only, 'continuous' = play from verse onwards
  const [playbackMode, setPlaybackMode] = useState<"single" | "continuous">(
    "continuous",
  );

  // Use ref to track the latest playbackMode value for the audio callback
  const playbackModeRef = useRef(playbackMode);

  // Update ref whenever playbackMode changes
  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  // Data fetching
  const {
    data: surahData,
    loading,
    error,
  } = useQuranData(currentSurahNumber, currentReciter);
  const { surahs: surahList, loading: surahListLoading } = useSurahList();
  const {
    tafsirData,
    loading: tafsirLoading,
    error: tafsirError,
  } = useTafsir(currentSurahNumber, tafsirId);

  // Scroll restoration
  useScrollRestoration({
    isStateLoaded,
    lastReadVerse,
    loading,
    surahNumber: surahData?.number,
    currentSurahNumber,
    currentReciter,
    tafsirId,
    setLastReadVerse,
  });

  // Audio playback
  const currentVerseAudio = surahData?.ayahs[currentVerseIndex]?.audio || null;
  const {
    isPlaying,
    setIsPlaying,
    togglePlay,
    progress,
    currentTime,
    duration,
    seek,
  } = useQuranAudio(currentVerseAudio, () => {
    // On audio end callback - use ref to get latest playbackMode value
    if (playbackModeRef.current === "single") {
      // Single verse mode: just stop
      setIsPlaying(false);
    } else {
      // Continuous mode: move to next verse
      if (surahData && currentVerseIndex < surahData.ayahs.length - 1) {
        const nextIndex = currentVerseIndex + 1;
        setCurrentVerseIndex(nextIndex);
        setLastReadVerse(nextIndex + 1);
        document
          .getElementById(`verse-${nextIndex + 1}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setIsPlaying(false);
        setCurrentVerseIndex(0);
        setLastReadVerse(1);
      }
    }
  });

  // Verse navigation handlers
  const handleNextVerse = () => {
    if (surahData && currentVerseIndex < surahData.ayahs.length - 1) {
      setPlaybackMode("continuous"); // Ensure continuous mode for header navigation
      const nextIndex = currentVerseIndex + 1;
      setCurrentVerseIndex(nextIndex);
      setLastReadVerse(nextIndex + 1);
      document
        .getElementById(`verse-${nextIndex + 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setPlaybackMode("continuous"); // Ensure continuous mode for header navigation
      setCurrentVerseIndex((prev) => prev - 1);
      setLastReadVerse(currentVerseIndex);
      document
        .getElementById(`verse-${currentVerseIndex}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Play specific verse (single mode - stops after this verse)
  const handlePlayVerse = (verseIndex: number) => {
    setPlaybackMode("single");
    setCurrentVerseIndex(verseIndex);
    setLastReadVerse(verseIndex + 1);
    setIsPlaying(true);
    document
      .getElementById(`verse-${verseIndex + 1}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Play from specific verse (continuous mode - continues to next verses)
  const handlePlayFromVerse = (verseIndex: number) => {
    setPlaybackMode("continuous");
    setCurrentVerseIndex(verseIndex);
    setLastReadVerse(verseIndex + 1);
    setIsPlaying(true);
    document
      .getElementById(`verse-${verseIndex + 1}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Get current surah name
  const currentSurahName =
    surahList.find((s) => s.number === currentSurahNumber)?.name ||
    surahData?.name;

  // Helper function to remove Bismillah from first verse
  const getVerseText = (verse: any, idx: number) => {
    let verseText = verse.text;

    if (currentSurahNumber !== 1 && idx === 0) {
      const bismillahRegex =
        /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَـٰنِ\s+ٱلرَّحِيمِ\s*/;
      const bismillahRegexSimple =
        /^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/;

      verseText = verseText
        .replace(bismillahRegex, "")
        .replace(bismillahRegexSimple, "")
        .trim();

      if (
        verseText.startsWith("بِسْمِ") &&
        !verseText.includes("ٱلْحَمْدُ لِلَّهِ")
      ) {
        const words = verseText.split(/\s+/);
        if (
          words.length >= 4 &&
          (words[0].includes("بِسْمِ") || words[1].includes("اللَّه"))
        ) {
          verseText = words.slice(4).join(" ").trim();
        }
      }
    }

    return verseText;
  };

  return (
    <PageLayout
      title="المصحف"
      showTitle={false}
      containerClassName="p-0 flex flex-col w-full h-full"
    >
      {/* Top Navigation Bar */}
      <QuranHeader
        currentSurahNumber={currentSurahNumber}
        currentSurahName={currentSurahName}
        surahList={surahList}
        surahListLoading={surahListLoading}
        onSelectSurah={selectSurah}
        onNextSurah={nextSurah}
        onPrevSurah={prevSurah}
        currentReciter={currentReciter}
        onSelectReciter={selectReciter}
        tafsirId={tafsirId}
        onSelectTafsir={selectTafsir}
        surahData={
          surahData
            ? {
                revelationType: surahData.revelationType,
                numberOfAyahs: surahData.numberOfAyahs,
              }
            : undefined
        }
        loading={loading}
        error={error}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        currentVerseIndex={currentVerseIndex}
        totalVerses={surahData?.ayahs.length || 0}
        onTogglePlay={togglePlay}
        onNextVerse={handleNextVerse}
        onPreviousVerse={handlePreviousVerse}
        onSeek={seek}
      />

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto min-h-0 w-full"
        id="quran-container"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-primary/60">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-quran text-xl">جاري تحميل الآيات...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[50vh] p-8">
            <div className="text-destructive bg-destructive/10 px-6 py-4 rounded-xl text-center">
              <p className="mb-2">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-8 py-10 text-center grid place-items-center">
            {/* Surah Header */}
            <SurahHeader
              surahName={surahData?.name}
              surahNumber={currentSurahNumber}
            />

            {/* Verses List */}
            <motion.div
              className="text-center leading-[3] px-2 md:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {surahData?.ayahs.map((verse, idx) => (
                <VerseItem
                  key={verse.number}
                  verse={{
                    id: verse.number,
                    text: getVerseText(verse, idx),
                    number: verse.numberInSurah,
                  }}
                  isActive={currentVerseIndex === idx}
                  tafsirText={tafsirData?.[verse.numberInSurah]}
                  tafsirName={
                    tafsirId === "muyassar"
                      ? "التفسير الميسر"
                      : "تفسير الجلالين"
                  }
                  isLoading={tafsirLoading}
                  error={tafsirError}
                  onPlayVerse={() => handlePlayVerse(idx)}
                  onPlayFromVerse={() => handlePlayFromVerse(idx)}
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
