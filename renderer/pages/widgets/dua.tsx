import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Pin, PinOff, Volume2, VolumeX } from "lucide-react";
import { IpcChannels } from "shared/constants";
import { cn } from "@/lib/utils";

export default function DuaWidget() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isHoveredRef = useRef(false);
  const isPinnedRef = useRef(false);
  const audioEndedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);
  useEffect(() => {
    isPinnedRef.current = isPinned;
  }, [isPinned]);

  const handleClose = useCallback(() => {
    if ((window as any).ipc) {
      (window as any).ipc.send(IpcChannels.CLOSE_DUA_WIDGET);
    }
  }, []);

  // Try to close — only if audio ended, not hovered, not pinned
  const tryClose = useCallback(() => {
    if (
      audioEndedRef.current &&
      !isHoveredRef.current &&
      !isPinnedRef.current
    ) {
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const silentMode = params.get("silent") === "true";
    const volume = params.get("volume")
      ? parseFloat(params.get("volume") as string)
      : 1;

    if (silentMode) setIsMuted(true);

    const audio = new Audio("/audio/after-adhan.mp3");
    audio.volume = volume;
    audio.muted = silentMode;
    audioRef.current = audio;

    // Update progress bar based on audio playback
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // When audio ends, mark it and try to close
    const handleEnded = () => {
      audioEndedRef.current = true;
      tryClose();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    // Play audio
    audio.play().catch((err) => console.error("Error playing dua audio:", err));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      window.removeEventListener("keydown", handleKeyDown);
      audio.pause();
    };
  }, [router.query, handleClose, tryClose]);

  // When mouse leaves, try to close (if audio already ended)
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Use setTimeout to let the ref update first
    setTimeout(() => tryClose(), 50);
  }, [tryClose]);

  // When unpinned, try to close (if audio already ended)
  const handleTogglePin = useCallback(() => {
    setIsPinned((prev) => {
      const newVal = !prev;
      if (!newVal) {
        // Unpinning — check if should close after ref updates
        setTimeout(() => tryClose(), 50);
      }
      return newVal;
    });
  }, [tryClose]);

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <>
      <style jsx global>{`
        body {
          background: transparent !important;
          overflow: hidden;
        }
      `}</style>
      <div
        className="w-screen h-screen flex items-center justify-center bg-transparent overflow-hidden p-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full p-1"
        >
          <Card className="w-full h-full bg-slate-950/90 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex flex-col justify-between overflow-hidden relative">
            {/* Action buttons — visible on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 left-2 z-10 flex items-center gap-1"
                >
                  {/* Mute */}
                  <button
                    onClick={handleToggleMute}
                    className={cn(
                      "p-1.5 rounded-full backdrop-blur-sm transition-colors",
                      isMuted
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-amber-400",
                    )}
                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Pin */}
                  <button
                    onClick={handleTogglePin}
                    className={cn(
                      "p-1.5 rounded-full backdrop-blur-sm transition-colors",
                      isPinned
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-amber-400",
                    )}
                    title={isPinned ? "إلغاء التثبيت" : "تثبيت النافذة"}
                  >
                    {isPinned ? (
                      <PinOff className="w-4 h-4" />
                    ) : (
                      <Pin className="w-4 h-4" />
                    )}
                  </button>

                  {/* Close */}
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:bg-red-500/20 hover:text-red-400 backdrop-blur-sm transition-colors"
                    title="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-4 h-full relative">
              {/* Header */}
              <h1 className="text-amber-500 font-bold text-lg font-cairo">
                دعاء ما بعد الأذان
              </h1>

              {/* Dua Text */}
              <p
                className="text-white text-xl leading-relaxed text-center font-quran"
                dir="rtl"
              >
                اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ
                الْقَائِمَةِ، آتِ سَيِّدَنَا مُحَمَّدًا الْوَسِيلَةَ
                وَالْفَضِيلَةَ وَالدَّرَجَةَ الرَّفِيعَةَ، وَابْعَثْهُ
                اللَّهُمَّ الْمَقَامَ الْمَحْمُودَ الَّذِي وَعَدْتَهُ، وَصَلَّى
                اللهُ وَسَلَّمَ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ وَعَلَى
                آلِهِ وَصَحْبِهِ أَجْمَعِينَ.
              </p>

              {/* Progress Bar */}
              <div className="w-full absolute bottom-0 left-0">
                <Progress
                  value={progress}
                  className="h-1 bg-slate-800 rounded-none w-full [&>div]:bg-amber-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
