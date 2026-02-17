import { useState, useEffect } from "react";

interface DailyWirdState {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  totalVerses: number;
  progress: number;
}

const DEFAULT_STATE: DailyWirdState = {
  surahNumber: 1,
  surahName: "سورة الفاتحة",
  verseNumber: 1,
  totalVerses: 7,
  progress: 0,
};

export function useDailyWird() {
  const [wirdState, setWirdState] = useState<DailyWirdState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  // Load state directly from quran-state (single source of truth)
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await window.ipc.invoke("store-get", "quran-state");
        if (savedState) {
          const verse = savedState.verse || 1;
          const total = savedState.totalVerses || 7;
          setWirdState({
            surahNumber: savedState.surah || 1,
            surahName: savedState.surahName || "سورة الفاتحة",
            verseNumber: verse,
            totalVerses: total,
            progress: Math.round((verse / total) * 100),
          });
        }
      } catch (err) {
        console.error("Failed to load daily wird state:", err);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  return {
    wirdState,
    loading,
  };
}
