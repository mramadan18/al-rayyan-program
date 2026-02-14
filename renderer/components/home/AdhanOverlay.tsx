import { useState, useEffect, useRef } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePrayerTimes } from "@/contexts/player-times";

export const AdhanOverlay = () => {
  const { isAdhanActive, currentAdhan, setIsAdhanActive, selectedAdhan } =
    usePrayerTimes();
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isAdhanActive && selectedAdhan) {
      const audio = new Audio(selectedAdhan);
      audio.muted = muted;
      audio.onended = () => setIsAdhanActive(false);
      audio.play().catch((err) => console.error("Error playing adhan:", err));
      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = "";
        audioRef.current = null;
      };
    }
  }, [isAdhanActive, selectedAdhan, setIsAdhanActive]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  if (!isAdhanActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 text-white p-4 backdrop-blur-md"
      >
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="adhan-pattern"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0,30 L30,0 L60,30 L30,60 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#adhan-pattern)" />
          </svg>
        </div>

        <motion.div
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 text-center space-y-8 max-w-2xl w-full"
        >
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-light text-primary/80"
            >
              حان الآن موعد أذان
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="text-7xl md:text-9xl font-bold font-quran text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]"
            >
              {currentAdhan}
            </motion.h1>
          </div>

          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 rounded-full bg-primary/20 absolute"
              />
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center relative">
                {!muted ? (
                  <Volume2 className="w-8 h-8 text-primary animate-pulse" />
                ) : (
                  <VolumeX className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-lg font-medium tracking-wider">
                جاري تشغيل الأذان...
              </span>
              <span className="text-sm opacity-50">الله أكبر، الله أكبر</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-white/20 hover:bg-white/10 text-white"
              onClick={() => setMuted(!muted)}
            >
              {muted ? "تشغيل الصوت" : "كتم الصوت"}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full px-8 bg-red-600 hover:bg-red-700"
              onClick={() => setIsAdhanActive(false)}
            >
              <X className="w-4 h-4 ml-2" />
              إغلاق
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
