import { useState, useEffect } from "react";

interface QuranState {
  surah: number;
  reciter: string;
  tafsir: "muyassar" | "jalalayn";
  verse: number;
}

export function useQuranState() {
  const [currentSurahNumber, setCurrentSurahNumber] = useState(1);
  const [currentReciter, setCurrentReciter] = useState("ar.alafasy");
  const [tafsirId, setTafsirId] = useState<"muyassar" | "jalalayn">("muyassar");
  const [lastReadVerse, setLastReadVerse] = useState(1);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isStateLoaded, setIsStateLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await window.ipc.invoke("store-get", "quran-state");
        if (savedState) {
          if (savedState.surah) setCurrentSurahNumber(savedState.surah);
          if (savedState.reciter) setCurrentReciter(savedState.reciter);
          if (savedState.tafsir) setTafsirId(savedState.tafsir);
          if (savedState.verse) {
            setLastReadVerse(savedState.verse);
            setCurrentVerseIndex(Math.max(0, savedState.verse - 1));
          }
        }
      } catch (err) {
        console.error("Failed to load Quran state:", err);
      } finally {
        setIsStateLoaded(true);
      }
    };
    loadState();
  }, []);

  // Save state helper
  const saveState = (overrides: Partial<QuranState> = {}) => {
    if (!isStateLoaded) return;
    const state: QuranState = {
      surah: overrides.surah ?? currentSurahNumber,
      reciter: overrides.reciter ?? currentReciter,
      tafsir: overrides.tafsir ?? tafsirId,
      verse: overrides.verse ?? lastReadVerse,
    };
    window.ipc.invoke("store-set", "quran-state", state);
  };

  // Save when major settings change
  useEffect(() => {
    if (isStateLoaded) {
      saveState();
    }
  }, [currentSurahNumber, currentReciter, tafsirId, isStateLoaded]);

  // Navigation handlers
  const nextSurah = () => {
    if (currentSurahNumber < 114) {
      setCurrentSurahNumber((prev) => prev + 1);
      setCurrentVerseIndex(0);
      setLastReadVerse(1);
    }
  };

  const prevSurah = () => {
    if (currentSurahNumber > 1) {
      setCurrentSurahNumber((prev) => prev - 1);
      setCurrentVerseIndex(0);
      setLastReadVerse(1);
    }
  };

  const selectSurah = (number: number) => {
    setCurrentSurahNumber(number);
    setCurrentVerseIndex(0);
    setLastReadVerse(1);
  };

  const selectReciter = (identifier: string) => {
    setCurrentReciter(identifier);
    setCurrentVerseIndex(0);
  };

  const selectTafsir = (id: "muyassar" | "jalalayn") => {
    setTafsirId(id);
  };

  return {
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
    saveState,
  };
}
