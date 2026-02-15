import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IpcChannels } from "shared/constants";

export default function DuaWidget() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Get volume from query params if available, otherwise default to 1 (100%)
    const volume = router.query.volume
      ? parseFloat(router.query.volume as string)
      : 1;

    const audio = new Audio("/audio/after-adhan.mp3");
    audio.volume = volume;
    audioRef.current = audio;

    // Update progress bar
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // Close window on end
    const handleEnded = () => {
      if ((window as any).ipc) {
        (window as any).ipc.send(IpcChannels.CLOSE_DUA_WIDGET);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    // Play audio
    audio.play().catch((err) => console.error("Error playing dua audio:", err));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [router.query]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-transparent overflow-hidden">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full h-full p-1"
      >
        <Card className="w-full h-full bg-slate-950/90 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex flex-col justify-between overflow-hidden">
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
              اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ
              الْقَائِمَةِ، آتِ سَيِّدَنَا مُحَمَّدًا الْوَسِيلَةَ
              وَالْفَضِيلَةَ وَالدَّرَجَةَ الرَّفِيعَةَ، وَابْعَثْهُ اللَّهُمَّ
              الْمَقَامَ الْمَحْمُودَ الَّذِي وَعَدْتَهُ، وَصَلَّى اللهُ
              وَسَلَّمَ عَلَى سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ وَعَلَى آلِهِ
              وَصَحْبِهِ أَجْمَعِينَ.
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
  );
}
