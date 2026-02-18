import { useState, useEffect, useRef } from "react";

export function useAudioPreview() {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPreview = (path: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (playingAudio === path) {
        setPlayingAudio(null);
        return;
      }
    }

    const audio = new Audio(path);
    audio.onended = () => setPlayingAudio(null);
    audio.play();
    audioRef.current = audio;
    setPlayingAudio(path);
  };

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return {
    playingAudio,
    handlePlayPreview,
  };
}
