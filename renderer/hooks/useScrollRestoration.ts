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
  saveState: (overrides?: { verse?: number }) => void;
  isPlaying: boolean;
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
  saveState,
  isPlaying,
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
      // Skip scroll tracking when audio is playing - audio handler manages verse
      if (scrollDebounceRef.current || isRestoringScroll.current || isPlaying)
        return;
      scrollDebounceRef.current = true;

      setTimeout(() => {
        scrollDebounceRef.current = false;

        const verseElements = document.querySelectorAll('[id^="verse-"]');
        let currentVisibleVerse = lastReadVerse;

        // Use the center of the visible area as the reading point
        const viewportCenter = window.innerHeight / 2;
        let closestDistance = Infinity;

        for (let i = 0; i < verseElements.length; i++) {
          const el = verseElements[i];
          const rect = el.getBoundingClientRect();

          // Check if the verse is at least partially visible
          if (rect.bottom < 64 || rect.top > window.innerHeight) continue;

          // Find the verse closest to the center of the viewport
          const verseCenter = (rect.top + rect.bottom) / 2;
          const distance = Math.abs(verseCenter - viewportCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            const verseNum = parseInt(el.id.replace("verse-", ""));
            if (!isNaN(verseNum)) {
              currentVisibleVerse = verseNum;
            }
          }
        }

        if (currentVisibleVerse !== lastReadVerse) {
          setLastReadVerse(currentVisibleVerse);
          saveState({ verse: currentVisibleVerse });
        }
      }, 500);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [lastReadVerse, currentSurahNumber, currentReciter, tafsirId]);
}
