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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Copy, Loader2 } from "lucide-react";
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
    updateSurahInfo,
    nextSurah,
    prevSurah,
    selectSurah,
    selectReciter,
    selectTafsir,
    saveState,
  } = useQuranState();

  // Tafsir sheet state
  const [tafsirVerse, setTafsirVerse] = useState<{
    text: string;
    number: number;
    numberInSurah: number;
  } | null>(null);
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);

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

  // Update surah info when data loads (keeps quran-state in sync for daily wird)
  useEffect(() => {
    if (surahData) {
      updateSurahInfo(surahData.name, surahData.numberOfAyahs);
    }
  }, [surahData?.name, surahData?.numberOfAyahs]);

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
        saveState({ verse: nextIndex + 1 });
        document
          .getElementById(`verse-${nextIndex + 1}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setIsPlaying(false);
        setCurrentVerseIndex(0);
        setLastReadVerse(1);
        saveState({ verse: 1 });
      }
    }
  });

  // Scroll restoration (after audio so isPlaying is available)
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

  // Verse navigation handlers
  const handleNextVerse = () => {
    if (surahData && currentVerseIndex < surahData.ayahs.length - 1) {
      setPlaybackMode("continuous");
      const nextIndex = currentVerseIndex + 1;
      setCurrentVerseIndex(nextIndex);
      setLastReadVerse(nextIndex + 1);
      saveState({ verse: nextIndex + 1 });
      document
        .getElementById(`verse-${nextIndex + 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setPlaybackMode("continuous");
      setCurrentVerseIndex((prev) => prev - 1);
      setLastReadVerse(currentVerseIndex);
      saveState({ verse: currentVerseIndex });
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
    saveState({ verse: verseIndex + 1 });
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
    saveState({ verse: verseIndex + 1 });
    setIsPlaying(true);
    document
      .getElementById(`verse-${verseIndex + 1}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Mark verse as current reading position
  const handleMarkAsCurrentVerse = (verseIndex: number) => {
    setCurrentVerseIndex(verseIndex);
    setLastReadVerse(verseIndex + 1);
    saveState({ verse: verseIndex + 1 });
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

  const handleShowTafsir = (verse: any, numberInSurah: number) => {
    setTafsirVerse({
      text: getVerseText(verse, numberInSurah - 1),
      number: verse.number,
      numberInSurah: numberInSurah,
    });
    setIsTafsirOpen(true);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
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
                  onPlayVerse={() => handlePlayVerse(idx)}
                  onPlayFromVerse={() => handlePlayFromVerse(idx)}
                  onMarkAsCurrentVerse={() => handleMarkAsCurrentVerse(idx)}
                  onShowTafsir={() =>
                    handleShowTafsir(verse, verse.numberInSurah)
                  }
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Shared Tafsir Sheet */}
      <Sheet open={isTafsirOpen} onOpenChange={setIsTafsirOpen}>
        <SheetContent
          dir="ltr"
          side="right"
          className="w-[400px] sm:w-[540px] bg-background border-border top-9 h-[calc(100vh-2.25rem)] overflow-y-auto px-2"
        >
          <SheetHeader className="mb-6">
            <div className="flex justify-end">
              <SheetDescription className="sr-only">
                تفسير ومعلومات الآية رقم {tafsirVerse?.numberInSurah}
              </SheetDescription>
              <SheetTitle className="text-xl font-bold">
                {tafsirId === "muyassar" ? "التفسير الميسر" : "تفسير الجلالين"}
              </SheetTitle>
            </div>
          </SheetHeader>

          {tafsirVerse && (
            <div className="space-y-6 text-start">
              {/* Selected Verse Display */}
              <div className="bg-muted/50 p-6 rounded-lg text-center border border-border">
                <p className="text-2xl font-quran text-foreground leading-loose">
                  {tafsirVerse.text}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-2 justify-end ">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => handleCopyText(tafsirVerse.text)}
                >
                  <Copy className="w-4 h-4" />
                  نسخ النص
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Tafsir Content */}
              <ScrollArea className="h-[calc(100vh-25rem)] rounded-md border p-6 bg-muted/20">
                <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
                  {tafsirLoading ? (
                    <div className="flex flex-col items-center gap-3 text-primary/60">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="font-quran">جاري تحميل التفسير...</p>
                    </div>
                  ) : tafsirError ? (
                    <div className="text-destructive p-4">
                      <p className="font-quran mb-2">
                        عذراً، حدث خطأ أثناء تحميل التفسير
                      </p>
                      <p className="text-sm opacity-70">{tafsirError}</p>
                    </div>
                  ) : (
                    <p className="text-xl leading-relaxed text-foreground font-quran">
                      {tafsirData?.[tafsirVerse.numberInSurah] ||
                        "التفسير غير متوفر لهذه الآية حالياً."}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
