import { useState, useRef, useEffect } from "react";

export function useQuranAudio(
  activeVerseAudio: string | null,
  onAudioEnd?: () => void,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!activeVerseAudio) return;

    // Create or update audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(activeVerseAudio);
    } else {
      audioRef.current.src = activeVerseAudio;
    }

    const audio = audioRef.current;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setProgress(0);
      if (onAudioEnd) onAudioEnd();
      else setIsPlaying(false);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    // If it was playing (or intended to play automatically), play the new source
    if (isPlaying) {
      audio.play().catch((e) => console.error("Play error:", e));
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [activeVerseAudio]); // Depend only on the source URL

  // Effect for play/pause toggle separately from source change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Only call play if it's paused to avoid promise errors if called rapidly
      if (audio.paused) {
        audio.play().catch((e) => console.error("Play error:", e));
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const seek = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  return {
    isPlaying,
    setIsPlaying,
    togglePlay,
    progress,
    currentTime,
    duration,
    seek,
  };
}
