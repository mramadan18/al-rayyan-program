import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { VerseItem } from "@/components/quran/VerseItem";
import { useQuranData } from "@/hooks/useQuranData";
import { useQuranAudio } from "@/hooks/useQuranAudio";
import { useSurahList } from "@/hooks/useSurahList";
import { useTafsir } from "@/hooks/useTafsir";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Check,
  Play,
  Pause,
  Languages,
  Home,
} from "lucide-react";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default function QuranPage() {
  const router = useRouter();
  const [currentSurahNumber, setCurrentSurahNumber] = useState(1);
  const { data: surahData, loading, error } = useQuranData(currentSurahNumber);
  const { surahs: surahList, loading: surahListLoading } = useSurahList();
  const [tafsirId, setTafsirId] = useState<"muyassar" | "jalalayn">("muyassar");
  const {
    tafsirData,
    loading: tafsirLoading,
    error: tafsirError,
  } = useTafsir(currentSurahNumber, tafsirId);

  const [open, setOpen] = useState(false);
  const [tafsirOpen, setTafsirOpen] = useState(false);

  // Audio state
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  // Get current verse audio URL safely
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
    // On end, move to next verse
    if (surahData && currentVerseIndex < surahData.ayahs.length - 1) {
      setCurrentVerseIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentVerseIndex(0);
    }
  });

  // Reset audio index when surah changes
  useEffect(() => {
    setCurrentVerseIndex(0);
    setIsPlaying(false);
  }, [currentSurahNumber, setIsPlaying]);

  const handleNext = () => {
    if (surahData && currentVerseIndex < surahData.ayahs.length - 1) {
      setCurrentVerseIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex((prev) => prev - 1);
    }
  };

  const nextSurah = () => {
    if (currentSurahNumber < 114) setCurrentSurahNumber((prev) => prev + 1);
  };

  const prevSurah = () => {
    if (currentSurahNumber > 1) setCurrentSurahNumber((prev) => prev - 1);
  };

  const currentSurahName =
    surahList.find((s) => s.number === currentSurahNumber)?.name ||
    surahData?.name;

  return (
    <PageLayout
      title="المصحف"
      showTitle={false}
      containerClassName="p-0 flex flex-col w-full h-full "
    >
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="w-full mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Right: Surah Selector & Navigation */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={nextSurah}
              disabled={currentSurahNumber >= 114}
              title="السورة التالية"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="min-w-[140px] md:min-w-[180px] justify-between font-quran text-base md:text-lg h-9 bg-background/40 hover:bg-accent hover:text-accent-foreground border-primary/20"
                >
                  <span className="truncate">
                    {currentSurahName || "اختر السورة"}
                  </span>
                  <BookOpen className="ml-2 h-4 w-4 shrink-0 opacity-40" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[280px] p-0 shadow-2xl border-primary/20"
                align="start"
              >
                <Command className="rtl">
                  <CommandInput
                    placeholder="ابحث عن سورة..."
                    className="text-right font-quran h-10"
                  />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty className="font-quran p-4 text-center">
                      لا توجد نتائج.
                    </CommandEmpty>
                    <CommandGroup>
                      {!surahListLoading &&
                        surahList.map((surah) => (
                          <CommandItem
                            key={surah.number}
                            value={`${surah.number} ${surah.name} ${surah.englishName}`}
                            onSelect={() => {
                              setCurrentSurahNumber(surah.number);
                              setOpen(false);
                            }}
                            className="font-quran text-right flex justify-between cursor-pointer py-2 px-4 hover:bg-primary/5"
                          >
                            <span>{surah.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground text-xs font-sans opacity-60">
                                {surah.number}
                              </span>
                              {currentSurahNumber === surah.number && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={prevSurah}
              disabled={currentSurahNumber <= 1}
              title="السورة السابقة"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Center: Compact Audio Player */}
          {!loading && !error && (
            <div className="flex flex-col items-center flex-1 max-w-xs px-2 md:px-0">
              <div className="flex items-center gap-1 md:gap-3 bg-primary/5 dark:bg-primary/10 px-3 py-1 rounded-full border border-primary/10 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 md:h-8 md:w-8 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                  onClick={handlePrevious}
                  disabled={currentVerseIndex <= 0}
                  title="الآية السابقة"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform"
                  onClick={togglePlay}
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
                  onClick={handleNext}
                  disabled={
                    !surahData ||
                    currentVerseIndex >= surahData.ayahs.length - 1
                  }
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
          )}

          {/* Left: Tafsir Selector & Surah Info */}
          <div className="hidden sm:flex items-center gap-3 text-sm font-quran">
            <Popover open={tafsirOpen} onOpenChange={setTafsirOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-primary transition-colors h-8"
                >
                  <Languages className="w-4 h-4" />
                  <span className="hidden lg:inline">
                    {tafsirId === "muyassar"
                      ? "التفسير الميسر"
                      : "تفسير الجلالين"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0 shadow-lg" align="end">
                <Command>
                  <CommandList>
                    <CommandGroup heading="اختر التفسير">
                      <CommandItem
                        onSelect={() => {
                          setTafsirId("muyassar");
                          setTafsirOpen(false);
                        }}
                        className="cursor-pointer font-quran justify-between"
                      >
                        التفسير الميسر
                        {tafsirId === "muyassar" && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </CommandItem>
                      <CommandItem
                        onSelect={() => {
                          setTafsirId("jalalayn");
                          setTafsirOpen(false);
                        }}
                        className="cursor-pointer font-quran justify-between"
                      >
                        تفسير الجلالين
                        {tafsirId === "jalalayn" && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

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

            <div className="h-4 w-px bg-border/40 mx-1 hidden lg:block" />

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
              onClick={() => router.push("/home")}
              title="العودة للرئيسية"
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Bar at the bottom of header */}
        {!loading && !error && (
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-primary/40 w-full cursor-pointer overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const per = (x / rect.width) * 100;
              seek(per);
            }}
          >
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.1 }}
            />
          </div>
        )}
      </div>

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
            {/* Header of Surah */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-2 space-y-3"
            >
              <h1 className="text-2xl md:text-4xl font-bold text-black/80 dark:text-white/90 font-quran drop-shadow-sm leading-relaxed">
                {surahData?.name}
              </h1>

              {currentSurahNumber !== 1 && currentSurahNumber !== 9 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative py-4 px-4 flex flex-col items-center"
                >
                  <div className="relative flex flex-col items-center space-y-3">
                    {/* Top Ornament */}
                    <div className="text-primary/30">
                      <svg
                        width="80"
                        height="15"
                        viewBox="0 0 120 20"
                        fill="currentColor"
                      >
                        <path d="M0 10 Q30 0 60 10 Q90 20 120 10 Q90 0 60 10 Q30 20 0 10" />
                      </svg>
                    </div>

                    <h2 className="font-quran text-3xl md:text-4xl text-primary/80 dark:text-primary/70 selection:bg-primary/20 leading-tight">
                      بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                    </h2>

                    {/* Bottom Ornament */}
                    <div className="text-primary/30 rotate-180">
                      <svg
                        width="80"
                        height="15"
                        viewBox="0 0 120 20"
                        fill="currentColor"
                      >
                        <path d="M0 10 Q30 0 60 10 Q90 20 120 10 Q90 0 60 10 Q30 20 0 10" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="text-center leading-[3] px-2 md:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {surahData?.ayahs.map((verse, idx) => {
                let verseText = verse.text;

                // If it's the first verse of any surah except Al-Fatihah,
                // we want to remove the Bismillah prefix if it exists in the API text string
                if (currentSurahNumber !== 1 && idx === 0) {
                  // This regex targets "Bismillah al-Rahman al-Rahim" with various possible diacritics
                  const bismillahRegex =
                    /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَـٰنِ\s+ٱلرَّحِيمِ\s*/;
                  const bismillahRegexSimple =
                    /^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/;

                  verseText = verseText
                    .replace(bismillahRegex, "")
                    .replace(bismillahRegexSimple, "")
                    .trim();

                  // Secondary fallback: if it still starts with "بِسْمِ" and it's not Fatihah
                  if (
                    verseText.startsWith("بِسْمِ") &&
                    !verseText.includes("ٱلْحَمْدُ لِلَّهِ")
                  ) {
                    const words = verseText.split(/\s+/);
                    if (
                      words.length >= 4 &&
                      (words[0].includes("بِسْمِ") ||
                        words[1].includes("اللَّه"))
                    ) {
                      verseText = words.slice(4).join(" ").trim();
                    }
                  }
                }

                return (
                  <VerseItem
                    key={verse.number}
                    verse={{
                      id: verse.number,
                      text: verseText,
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
                  />
                );
              })}
            </motion.div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
