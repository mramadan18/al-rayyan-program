import { useState, useRef, useEffect } from "react";
import { Pause, Info, Check, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { removeTashkeel } from "@/lib/utils";
import { Zikr } from "@/types/azkar";
import { toast } from "sonner";

interface ZikrCardProps {
  zikr: Zikr;
  showTashkeel: boolean;
  onComplete?: () => void;
}

export function ZikrCard({ zikr, showTashkeel, onComplete }: ZikrCardProps) {
  const [count, setCount] = useState(zikr.count);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = ((zikr.count - count) / zikr.count) * 100;
  const isCompleted = count === 0;

  useEffect(() => {
    // Reset count if zikr changes (though usually key changes)
    setCount(zikr.count);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [zikr]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (!zikr.audio) {
      toast.error("عذراً", {
        description: "لا يوجد ملف صوتي لهذا الذكر",
      });
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(zikr.audio);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("خطأ", {
          description: "تعذر تشغيل الملف الصوتي. تحقق من الاتصال بالإنترنت.",
        });
      };
      audioRef.current = audio;
    }

    audioRef.current.play().catch((e) => {
      console.error("Audio play error:", e);
      setIsPlaying(false);
      toast.error("خطأ", {
        description: "تعذر تشغيل الملف الصوتي.",
      });
    });
    setIsPlaying(true);
  };

  const handleCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      if (count === 1 && onComplete) {
        onComplete();
      }
    }
  };

  const displayedContent = showTashkeel
    ? zikr.content
    : removeTashkeel(zikr.content);

  // Circular Progress Calculation
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card
      className={cn(
        "border-none shadow-lg transition-all duration-300 overflow-hidden relative group",
        isCompleted
          ? "bg-emerald-500/10 dark:bg-emerald-900/10"
          : "bg-card hover:bg-accent/5",
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />

      {/* Progress Indicator (Background) */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />

      <CardContent className="p-6 relative z-10 flex flex-col gap-6">
        {/* Header: Type Badge & Actions */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                zikr.type === 1
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : zikr.type === 2
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
              )}
            >
              {zikr.type === 1
                ? "الصباح"
                : zikr.type === 2
                  ? "المساء"
                  : "مشترك"}
            </span>
            {zikr.count > 1 && (
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-sans">
                {zikr.count_description}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {/* Audio Button */}
            {zikr.audio && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAudio}
                className={cn(
                  "rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors",
                  isPlaying &&
                    "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
                )}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Info Button - Sheet Trigger */}
            <Sheet open={showExplanation} onOpenChange={setShowExplanation}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[80vh] rounded-t-3xl border-t-amber-500/20"
              >
                <SheetHeader className="pb-6">
                  <SheetTitle className="text-2xl font-bold font-quran text-center mb-2">
                    معلومات الذكر
                  </SheetTitle>
                  <SheetDescription className="text-center font-sans">
                    الفضل والمصدر وشرح المفردات
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto h-full pb-20 px-4 space-y-6">
                  {zikr.fadl && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400">
                        فضل الذكر
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {zikr.fadl}
                      </p>
                    </div>
                  )}

                  {zikr.source && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400">
                        المصدر
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {zikr.source}
                      </p>
                    </div>
                  )}

                  {zikr.explanation_of_hadith_vocabulary && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400">
                        شرح المفردات
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {zikr.explanation_of_hadith_vocabulary}
                      </p>
                    </div>
                  )}

                  {zikr.hadith_text && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-amber-600 dark:text-amber-400">
                        نص الحديث
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {zikr.hadith_text}
                      </p>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Content */}
        <div className="text-center py-4">
          <p
            className={cn(
              "font-quran text-2xl md:text-3xl leading-loose md:leading-loose text-foreground transition-all duration-300",
              isCompleted && "opacity-50",
            )}
          >
            {displayedContent}
          </p>
        </div>

        {/* Footer / Interaction */}
        <div className="flex justify-center items-center mt-2 relative pb-2">
          {/* Counter Button */}
          <button
            onClick={handleCount}
            disabled={isCompleted}
            className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-amber-500/20",
              isCompleted
                ? "bg-emerald-500 text-white cursor-default"
                : "bg-background shadow-lg hover:shadow-xl dark:shadow-none border border-border",
            )}
          >
            {/* Visual Progress Ring using SVG */}
            {!isCompleted && (
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/20"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-amber-500 transition-all duration-500 ease-out"
                />
              </svg>
            )}

            <div className="text-2xl font-bold font-sans z-10">
              {isCompleted ? <Check className="h-8 w-8" /> : count}
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
