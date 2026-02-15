import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { X, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { IpcChannels } from "shared/constants";

export default function AdhanWidgetPage() {
  const router = useRouter();
  const [prayerName, setPrayerName] = useState<string>("");
  const [audioPath, setAudioPath] = useState<string>("");
  const [muted, setMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isPreAdhan, setIsPreAdhan] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const PRAYER_NAMES: Record<string, string> = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
    "Test Prayer": "تجربة الصلاة",
  };

  useEffect(() => {
    if (router.isReady) {
      const { prayer, audio, targetTime } = router.query;
      if (prayer) setPrayerName(prayer as string);
      if (audio) {
        setAudioPath(audio as string);
      }

      if (targetTime) {
        setIsPreAdhan(true);
        // Start countdown
        const target = parseInt(targetTime as string);
        const timer = setInterval(() => {
          const now = Date.now();
          const diff = target - now;

          if (diff <= 0) {
            clearInterval(timer);
            setIsPreAdhan(false); // Switch to Adhan mode
            setTimeLeft("");
          } else {
            const m = Math.floor(diff / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
          }
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [router.isReady, router.query]);

  // Handle Close Button Click
  const handleClose = () => {
    // Send IPC to main process to close this window
    if (window.ipc) {
      window.ipc.send(IpcChannels.CLOSE_ADHAN_WIDGET);
    }
  };

  useEffect(() => {
    if (audioPath) {
      const audio = new Audio(audioPath);
      audio.muted = muted;
      audio
        .play()
        .catch((err) => console.error("Widget audio play error:", err));
      audioRef.current = audio;

      audio.onended = () => {
        if (window.ipc) {
          window.ipc.send(IpcChannels.CLOSE_ADHAN_WIDGET);
          window.ipc.send(IpcChannels.OPEN_DUA_WIDGET);
        }
      };

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [audioPath]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <>
      <Head>
        <title>Adhan Alert</title>
      </Head>
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden bg-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-[90%] md:w-[400px] bg-background/95 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-2xl p-6 flex flex-col items-center justify-between relative overflow-hidden drag-handle cursor-move"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="z-10 w-full flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                تنبيه الصلاة
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors no-drag"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="z-10 text-center py-6 space-y-3 w-full">
            <h2 className="text-muted-foreground text-sm font-medium">
              {isPreAdhan ? "الوقت المتبقي للأذان" : "حان الآن موعد أذان"}
            </h2>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold text-primary font-quran drop-shadow-[0_2px_10px_rgba(var(--primary),0.3)]"
            >
              {PRAYER_NAMES[prayerName] || prayerName || "..."}
            </motion.h1>
            {isPreAdhan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-mono text-primary/80 mt-2"
              >
                {timeLeft}
              </motion.div>
            )}
          </div>

          <div className="z-10 w-full flex items-center gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-9 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300 no-drag"
              onClick={() => setMuted(!muted)}
            >
              {muted ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" /> تشغيل الصوت
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2 animate-pulse" /> كتم الصوت
                </>
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs h-9 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 no-drag"
              onClick={handleClose}
            >
              إغلاق التنبيه
            </Button>
          </div>
        </motion.div>
      </div>
      <style jsx global>{`
        body {
          background: transparent !important;
          overflow: hidden;
        }
        .drag-handle {
          -webkit-app-region: drag;
        }
        .no-drag {
          -webkit-app-region: no-drag;
        }
      `}</style>
    </>
  );
}
