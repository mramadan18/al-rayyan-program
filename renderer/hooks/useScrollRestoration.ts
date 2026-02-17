import { useEffect, useRef } from "react";

interface UseScrollRestorationProps {
  isStateLoaded: boolean;
  lastReadVerse: number;
  loading: boolean;
  surahNumber: number;
  currentSurahNumber: number;
  currentReciter: string;
  tafsirId: string;
  setLastReadVerse: (verse: number) => void;
}

export function useScrollRestoration({
  isStateLoaded,
  lastReadVerse,
  loading,
  surahNumber,
  currentSurahNumber,
  currentReciter,
  tafsirId,
  setLastReadVerse,
}: UseScrollRestorationProps) {
  const isRestoringScroll = useRef(false);
  const scrollDebounceRef = useRef(false);

  // Initialize restoring state based on loaded data
  useEffect(() => {
    if (isStateLoaded && lastReadVerse > 1) {
      isRestoringScroll.current = true;
    }
  }, [isStateLoaded]);

  // Handle scroll restoration
  useEffect(() => {
    if (!loading && surahNumber && isStateLoaded && lastReadVerse > 1) {
      isRestoringScroll.current = true;

      const attemptScroll = (startTime: number) => {
        const container = document.getElementById("main-scroll-container");
        const element = document.getElementById(`verse-${lastReadVerse}`);

        if (container && element) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const currentDiff = elementRect.top - containerRect.top - 100;

          if (Math.abs(currentDiff) > 5) {
            container.scrollTop = container.scrollTop + currentDiff;
          }
        }

        if (performance.now() - startTime < 1500) {
          requestAnimationFrame(() => attemptScroll(startTime));
        } else {
          isRestoringScroll.current = false;
        }
      };

      setTimeout(
        () => requestAnimationFrame(() => attemptScroll(performance.now())),
        100,
      );
    } else if (!loading && surahNumber) {
      isRestoringScroll.current = false;
    }
  }, [loading, surahNumber, isStateLoaded]);

  // Scroll tracking
  useEffect(() => {
    const container = document.getElementById("main-scroll-container");
    if (!container) return;

    const onScroll = () => {
      if (scrollDebounceRef.current || isRestoringScroll.current) return;
      scrollDebounceRef.current = true;

      setTimeout(() => {
        scrollDebounceRef.current = false;

        const verseElements = document.querySelectorAll('[id^="verse-"]');
        let currentVisibleVerse = lastReadVerse;

        for (let i = 0; i < verseElements.length; i++) {
          const el = verseElements[i];
          const rect = el.getBoundingClientRect();

          if (rect.top >= 64 && rect.top < window.innerHeight) {
            const verseNum = parseInt(el.id.replace("verse-", ""));
            if (!isNaN(verseNum)) {
              currentVisibleVerse = verseNum;
              break;
            }
          }
        }

        if (currentVisibleVerse !== lastReadVerse) {
          setLastReadVerse(currentVisibleVerse);
          window.ipc.invoke("store-set", "quran-state", {
            surah: currentSurahNumber,
            reciter: currentReciter,
            tafsir: tafsirId,
            verse: currentVisibleVerse,
          });
        }
      }, 500);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [lastReadVerse, currentSurahNumber, currentReciter, tafsirId]);
}
