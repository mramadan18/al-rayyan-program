import { useState, useRef, useEffect } from "react";

interface useQuranNavigationProps {
  surahData: any;
  currentVerseIndex: number;
  setCurrentVerseIndex: (index: number) => void;
  setLastReadVerse: (verse: number) => void;
  saveState: (overrides?: { verse?: number }) => void;
  setIsPlaying: (playing: boolean) => void;
}

export function useQuranNavigation({
  surahData,
  currentVerseIndex,
  setCurrentVerseIndex,
  setLastReadVerse,
  saveState,
  setIsPlaying,
}: useQuranNavigationProps) {
  const [playbackMode, setPlaybackMode] = useState<"single" | "continuous">(
    "continuous",
  );

  const playbackModeRef = useRef(playbackMode);

  useEffect(() => {
    playbackModeRef.current = playbackMode;
  }, [playbackMode]);

  const handleNextVerse = () => {
    if (surahData && currentVerseIndex < surahData.ayahs.length - 1) {
      setPlaybackMode("continuous");
      const nextIndex = currentVerseIndex + 1;
      setCurrentVerseIndex(nextIndex);
      setLastReadVerse(nextIndex + 1);
      saveState({ verse: nextIndex + 1 });
      scrollToVerse(nextIndex + 1);
    }
  };

  const handlePreviousVerse = () => {
    if (currentVerseIndex > 0) {
      setPlaybackMode("continuous");
      setCurrentVerseIndex(currentVerseIndex - 1);
      setLastReadVerse(currentVerseIndex);
      saveState({ verse: currentVerseIndex });
      scrollToVerse(currentVerseIndex);
    }
  };

  const handlePlayVerse = (verseIndex: number) => {
    setPlaybackMode("single");
    setCurrentVerseIndex(verseIndex);
    setLastReadVerse(verseIndex + 1);
    saveState({ verse: verseIndex + 1 });
    setIsPlaying(true);
    scrollToVerse(verseIndex + 1);
  };

  const handlePlayFromVerse = (verseIndex: number) => {
    setPlaybackMode("continuous");
    setCurrentVerseIndex(verseIndex);
    setLastReadVerse(verseIndex + 1);
    saveState({ verse: verseIndex + 1 });
    setIsPlaying(true);
    scrollToVerse(verseIndex + 1);
  };

  const handleMarkAsCurrentVerse = (verseIndex: number) => {
    setCurrentVerseIndex(verseIndex);
    setLastReadVerse(verseIndex + 1);
    saveState({ verse: verseIndex + 1 });
    scrollToVerse(verseIndex + 1);
  };

  const scrollToVerse = (verseNumber: number) => {
    document
      .getElementById(`verse-${verseNumber}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return {
    playbackMode,
    playbackModeRef,
    setPlaybackMode,
    handleNextVerse,
    handlePreviousVerse,
    handlePlayVerse,
    handlePlayFromVerse,
    handleMarkAsCurrentVerse,
  };
}
