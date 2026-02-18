import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Quote,
  Pause,
  Play,
  Volume2,
  VolumeX,
  RotateCw,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import azkarData from "@/public/data/azkar.json";
import { Zikr } from "@/types/azkar";
import { IpcChannels } from "shared/constants";
import { cn } from "@/lib/utils";

const DEFAULT_DURATION = 30000; // 30 seconds default
const UPDATE_INTERVAL = 100;

export default function ZikrWidget() {
  const [zikr, setZikr] = useState<Zikr | null>(null);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [isCopied, setIsCopied] = useState(false);

  // Use refs to track timing state without causing re-renders
  const remainingTimeRef = useRef(DEFAULT_DURATION);
  const lastTickRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClose = useCallback(() => {
    if ((window as any).ipc) {
      (window as any).ipc.send(IpcChannels.CLOSE_ZIKR_WIDGET);
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (zikr?.content) {
      navigator.clipboard.writeText(zikr.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [zikr?.content]);

  const handleRefresh = useCallback(() => {
    // Pick new random Zikr
    const azkar = azkarData as unknown as Zikr[];
    const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
    setZikr(randomZikr);

    // Reset timer
    remainingTimeRef.current = duration;
    setProgress(100);

    // Handle audio for new Zikr
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (randomZikr.audio) {
      const audio = new Audio(randomZikr.audio);
      const params = new URLSearchParams(window.location.search);
      audio.muted = isMuted || params.get("silent") === "true";
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);

      audio
        .play()
        .catch((err) => console.error("Audio auto-play failed:", err));
    }
  }, [duration, isMuted]);

  const handleRestartAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.error("Audio replay failed:", err));
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    // Check for silent mode and duration in URL
    const params = new URLSearchParams(window.location.search);
    const silentMode = params.get("silent") === "true";
    const urlDuration = params.get("duration");

    if (silentMode) setIsMuted(true);

    // Set duration from URL (converted to ms) or default
    const finalDuration = urlDuration
      ? parseInt(urlDuration) * 1000
      : DEFAULT_DURATION;
    setDuration(finalDuration);
    remainingTimeRef.current = finalDuration;

    // Pick random Zikr
    const azkar = azkarData as unknown as Zikr[];
    const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
    setZikr(randomZikr);

    // Setup Audio
    if (randomZikr.audio) {
      const audio = new Audio(randomZikr.audio);
      audio.muted = silentMode;
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);

      audio
        .play()
        .catch((err) => console.error("Audio auto-play failed:", err));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [handleClose]);

  useEffect(() => {
    if (isHovered || isTimerPaused) return;

    lastTickRef.current = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
      setProgress((remainingTimeRef.current / duration) * 100);

      if (remainingTimeRef.current <= 0) {
        clearInterval(timer);
        handleClose();
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered, isTimerPaused, handleClose, duration]);

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!zikr) return null;

  return (
    <>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          background: transparent !important;
          overflow: hidden;
        }
        .zikr-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .zikr-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
        .zikr-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>

      <div
        className="relative h-screen w-screen flex items-center justify-center p-2 bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full relative overflow-hidden rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 shadow-2xl flex flex-col"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 z-50">
            <motion.div
              className="h-full bg-amber-500"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          {/* Header */}
          <div className="p-4 pb-2 flex justify-between items-center bg-white/5 border-b border-white/5 app-drag-region">
            <div className="flex items-center gap-2 text-amber-500/80">
              <Quote className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold font-sans tracking-widest uppercase opacity-70">
                تذكير بالله
              </span>
            </div>

            <div className="flex items-center gap-1 no-drag">
              {zikr.audio && (
                <>
                  <button
                    onClick={handleRestartAudio}
                    className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-amber-500 transition-colors"
                    title="إعادة تشغيل الصوت"
                  >
                    <RotateCw
                      className={cn(
                        "w-4 h-4",
                        isPlaying && "animate-spin-slow",
                      )}
                    />
                  </button>
                  <button
                    onClick={handleToggleMute}
                    className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-amber-500 transition-colors"
                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}

              <button
                onClick={handleRefresh}
                className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-amber-500 transition-colors"
                title="ذكر آخر"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-amber-500 transition-colors"
                title="نسخ الذكر"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className={cn(
                  "p-1.5 rounded-full hover:bg-white/5 transition-colors",
                  isTimerPaused
                    ? "text-amber-500 bg-amber-500/10"
                    : "text-slate-400 hover:text-amber-500",
                )}
                title={isTimerPaused ? "استئناف الوقت" : "إيقاف مؤقت"}
              >
                {isTimerPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto zikr-scrollbar p-6 pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={zikr.content}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center"
              >
                <p
                  className="font-quran text-xl md:text-2xl leading-relaxed text-white drop-shadow-md mb-4"
                  dir="rtl"
                >
                  {zikr.content}
                </p>

                {zikr.count_description && (
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs text-amber-500/90 font-sans">
                      {zikr.count_description}
                    </span>
                  </div>
                )}

                {zikr.fadl && (
                  <p
                    className="mt-4 text-xs text-slate-400 leading-relaxed max-w-xs mx-auto opacity-70 italic"
                    dir="rtl"
                  >
                    {zikr.fadl}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}
