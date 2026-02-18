import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Quote, Pause, Play, Volume2, VolumeX } from "lucide-react";
import azkarData from "@/public/data/azkar.json";
import { Zikr } from "@/types/azkar";
import { IpcChannels } from "shared/constants";
import { cn } from "@/lib/utils";

export default function ZikrWidget() {
  const [zikr, setZikr] = useState<Zikr | null>(null);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const DURATION = 30000; // 30 seconds
  const UPDATE_INTERVAL = 100;

  // Use refs to track timing state without causing re-renders
  const remainingTimeRef = useRef(DURATION);
  const lastTickRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pick random Zikr only on mount
    const randomZikr = (azkarData as unknown as Zikr[])[
      Math.floor(Math.random() * (azkarData as unknown as Zikr[]).length)
    ];
    setZikr(randomZikr);

    // Auto-play audio if available
    if (randomZikr.audio) {
      const audio = new Audio(randomZikr.audio);
      audioRef.current = audio;
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
  }, []);

  useEffect(() => {
    // If hovered or manually paused, don't run the timer
    if (isHovered || isTimerPaused) return;

    // Reset last tick when starting/resuming
    lastTickRef.current = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      // Update remaining time
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);

      const newProgress = (remainingTimeRef.current / DURATION) * 100;
      setProgress(newProgress);

      if (remainingTimeRef.current <= 0) {
        clearInterval(timer);
        handleClose();
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, [isHovered, isTimerPaused]); // Re-run effect when hover or manual pause state changes

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleClose = () => {
    if ((window as any).ipc) {
      (window as any).ipc.send(IpcChannels.CLOSE_ZIKR_WIDGET);
    } else {
      console.log("Mock Close: IPC not available");
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
        }
      `}</style>
      <div
        className="relative h-screen w-screen flex items-center justify-center bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-screen h-screen relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-amber-500/20 shadow-2xl">
          {/* Progress Bar Top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800/50">
            <motion.div
              className="h-full bg-linear-to-r from-amber-600 to-amber-400"
              style={{ width: `${progress}%` }}
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>

          <div className="p-6 pt-4 h-full flex flex-col overflow-hidden">
            {/* Header (Fixed) */}
            <div
              className="flex justify-between items-center shrink-0 mb-2"
              style={{ WebkitAppRegion: "drag" } as any}
            >
              <div className="flex items-center gap-2 text-amber-500">
                <Quote className="w-5 h-5 fill-current opacity-80" />
                <span className="text-sm font-bold font-sans tracking-wide uppercase">
                  تذكير
                </span>
              </div>

              <div
                className="flex items-center gap-1"
                style={{ WebkitAppRegion: "no-drag" } as any}
              >
                {/* Audio Mute Button */}
                {zikr.audio && (
                  <button
                    onClick={handleToggleMute}
                    className="text-slate-400 hover:text-amber-500 transition-colors p-1.5 hover:bg-white/5 rounded-full"
                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Timer Pause Button */}
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className={cn(
                    "text-slate-400 hover:text-amber-500 transition-colors p-1.5 hover:bg-white/5 rounded-full",
                    isTimerPaused && "text-amber-500 bg-amber-500/10",
                  )}
                  title={isTimerPaused ? "استئناف الوقت" : "إيقاف مؤقت للوقت"}
                >
                  {isTimerPaused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-white/5 rounded-full"
                  title="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content (Scrollable) */}
            <div className="grow overflow-y-auto pr-2 custom-scrollbar pt-2">
              <div className="text-center py-3 flex flex-col justify-center items-center min-h-full">
                <p
                  className="font-quran text-lg md:text-xl leading-loose text-white drop-shadow-sm px-2"
                  dir="rtl"
                >
                  {zikr.content}
                </p>

                {/* Metadata */}
                {(zikr.count_description || zikr.fadl) && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 items-center justify-center w-full">
                    {zikr.count_description && (
                      <span className="text-xs bg-slate-800/50 text-amber-400/80 px-3 py-1 rounded-full border border-amber-500/10">
                        {zikr.count_description}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
