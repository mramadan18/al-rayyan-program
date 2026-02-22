import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { QuranHeader } from "@/components/quran/QuranHeader";
import { SurahHeader } from "@/components/quran/SurahHeader";
import { VersesList } from "@/components/quran/VersesList";
import { QuranTafsirSheet } from "@/components/quran/QuranTafsirSheet";
import { useQuranData } from "@/hooks/useQuranData";
import { useQuranAudio } from "@/hooks/useQuranAudio";
import { useSurahList } from "@/hooks/useSurahList";
import { useTafsir } from "@/hooks/useTafsir";
import { useQuranState } from "@/hooks/useQuranState";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useQuranNavigation } from "@/hooks/useQuranNavigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVerseText } from "@/lib/quranUtils";

export default function QuranPage() {
  // 1. State management
  const {
    currentSurahNumber,
    currentReciter,
    tafsirId,
    lastReadVerse,
    currentVerseIndex,
    isStateLoaded,
    setCurrentVerseIndex,
    setLastReadVerse,
    updateSurahInfo,
    nextSurah,
    prevSurah,
    selectSurah,
    selectReciter,
    selectTafsir,
    saveState,
  } = useQuranState();

  // 2. Data fetching
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

  // 3. Audio playback
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
    // On audio end callback
    if (playbackModeRef.current === "single") {
      setIsPlaying(false);
    } else {
      handleNextVerse();
      if (!surahData || currentVerseIndex >= surahData.ayahs.length - 1) {
        setIsPlaying(false);
        setCurrentVerseIndex(0);
        setLastReadVerse(1);
        saveState({ verse: 1 });
      }
    }
  });

  // 4. Navigation & Playback logic
  const {
    playbackModeRef,
    handleNextVerse,
    handlePreviousVerse,
    handlePlayVerse,
    handlePlayFromVerse,
    handleMarkAsCurrentVerse,
  } = useQuranNavigation({
    surahData,
    currentVerseIndex,
    setCurrentVerseIndex,
    setLastReadVerse,
    saveState,
    setIsPlaying,
  });

  // 5. Tafsir state
  const [tafsirVerse, setTafsirVerse] = useState<{
    text: string;
    number: number;
    numberInSurah: number;
  } | null>(null);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);

  const handleShowTafsir = (verse: any, numberInSurah: number) => {
    setTafsirVerse({
      text: getVerseText(verse.text, currentSurahNumber, numberInSurah - 1),
      number: verse.number,
      numberInSurah: numberInSurah,
    });
    setIsTafsirOpen(true);
  };

  // 6. Scroll restoration
  useScrollRestoration({
    isStateLoaded,
    lastReadVerse,
    loading,
    surahNumber: surahData?.number,
    currentSurahNumber,
    currentReciter,
    tafsirId,
    setLastReadVerse,
    saveState,
    isPlaying,
  });

  // 7. Effects
  useEffect(() => {
    if (surahData) {
      updateSurahInfo(surahData.name, surahData.numberOfAyahs);
    }
  }, [surahData?.name, surahData?.numberOfAyahs]);

  // Derived state
  const currentSurahName =
    surahList.find((s) => s.number === currentSurahNumber)?.name ||
    surahData?.name;

  return (
    <PageLayout
      title="المصحف"
      showTitle={false}
      containerClassName="p-0 flex flex-col w-full h-full"
    >
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
            <SurahHeader
              surahName={surahData?.name}
              surahNumber={currentSurahNumber}
            />
            <VersesList
              surahData={surahData}
              currentSurahNumber={currentSurahNumber}
              currentVerseIndex={currentVerseIndex}
              handlePlayVerse={handlePlayVerse}
              handlePlayFromVerse={handlePlayFromVerse}
              handleMarkAsCurrentVerse={handleMarkAsCurrentVerse}
              handleShowTafsir={handleShowTafsir}
            />
          </div>
        )}
      </div>

      <QuranTafsirSheet
        isOpen={isTafsirOpen}
        onOpenChange={setIsTafsirOpen}
        tafsirVerse={tafsirVerse}
        tafsirId={tafsirId}
        tafsirData={tafsirData}
        loading={tafsirLoading}
        error={tafsirError}
      />
    </PageLayout>
  );
}
