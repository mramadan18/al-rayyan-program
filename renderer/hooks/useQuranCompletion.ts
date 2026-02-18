import { useState, useEffect } from "react";

interface QuranCompletionState {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  totalVerses: number;
  progress: number;
}

const DEFAULT_STATE: QuranCompletionState = {
  surahNumber: 1,
  surahName: "سورة الفاتحة",
  verseNumber: 1,
  totalVerses: 7,
  progress: 0,
};

// عدد الآيات لكل سورة في القرآن الكريم
const SURAH_VERSES = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111,
  110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45,
  83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55,
  78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20,
  56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21,
  11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6,
];

// إجمالي عدد الآيات في القرآن الكريم
const TOTAL_QURAN_VERSES = 6236;

/**
 * حساب النسبة المئوية للتقدم في ختم القرآن الكريم
 * @param surahNumber رقم السورة (1-114)
 * @param verseNumber رقم الآية في السورة الحالية
 * @returns النسبة المئوية للتقدم في القرآن كله
 */
function calculateQuranProgress(
  surahNumber: number,
  verseNumber: number,
): number {
  // حساب عدد الآيات المكتملة من السور السابقة
  let completedVerses = 0;
  for (let i = 0; i < surahNumber - 1; i++) {
    completedVerses += SURAH_VERSES[i];
  }

  // إضافة الآيات المقروءة من السورة الحالية
  completedVerses += verseNumber;

  // حساب النسبة المئوية
  const progress = (completedVerses / TOTAL_QURAN_VERSES) * 100;

  return Math.round(progress * 100) / 100; // تقريب لرقمين عشريين
}

export function useQuranCompletion() {
  const [completionState, setCompletionState] =
    useState<QuranCompletionState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);

  // Load state directly from quran-state (single source of truth)
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await window.ipc.invoke("store-get", "quran-state");
        if (savedState) {
          const verse = savedState.verse || 1;
          const surah = savedState.surah || 1;
          const total = savedState.totalVerses || 7;
          setCompletionState({
            surahNumber: surah,
            surahName: savedState.surahName || "سورة الفاتحة",
            verseNumber: verse,
            totalVerses: total,
            progress: calculateQuranProgress(surah, verse),
          });
        }
      } catch (err) {
        console.error("Failed to load Quran completion state:", err);
      } finally {
        setLoading(false);
      }
    };
    loadState();
  }, []);

  return {
    completionState,
    loading,
  };
}
