import { Clock, Pin, PinOff, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePrayerTimes } from "@/contexts/player-times";
import { cn } from "@/lib/utils";
import { IpcChannels } from "shared/constants";
import { useSettings } from "@/contexts/settings-context";

export function MiniWidget() {
  const { nextPrayer, loading: prayerLoading } = usePrayerTimes();
  const {
    miniWidgetAlwaysOnTop,
    updateMiniWidgetAlwaysOnTop,
    miniWidgetSize,
    loading: settingsLoading,
  } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Update clock every second
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Toggle Pin clicked");
    try {
      await updateMiniWidgetAlwaysOnTop(!miniWidgetAlwaysOnTop);
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.ipc) {
      window.ipc.send(IpcChannels.CLOSE_MINI_WIDGET);
    }
  };

  const formattedTime = currentTime
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace("AM", "ص")
    .replace("PM", "م");

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] text-white select-none transition-all duration-300 w-[300px] h-[150px]">
      {/* Container for Drag and Controls */}
      <div className="absolute inset-0 z-20">
        {/* Drag Region */}
        <div
          className="absolute inset-0 cursor-move"
          style={{ WebkitAppRegion: "drag" } as any}
        />

        {/* Top Bar Controls */}
        <div className="relative flex items-center justify-between px-4 pt-3 h-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleTogglePin}
            className={cn(
              "p-1.5 rounded-full transition-colors hover:bg-white/20 active:scale-95 pointer-events-auto z-50",
              miniWidgetAlwaysOnTop ? "text-amber-400" : "text-white/40",
            )}
            title={miniWidgetAlwaysOnTop ? "إلغاء التثبيت" : "تثبيت في المقدمة"}
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            {miniWidgetAlwaysOnTop ? (
              <Pin className="w-4 h-4 pointer-events-none" />
            ) : (
              <PinOff className="w-4 h-4 pointer-events-none" />
            )}
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full transition-colors hover:bg-red-500/30 text-white/40 hover:text-red-400 active:scale-95 pointer-events-auto z-50"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            <X className="w-4 h-4 pointer-events-none" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
        {/* Clock */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Clock className="w-3.5 h-3.5 text-amber-500/80" />
          <span className="text-base font-medium text-slate-400 font-mono tracking-wider">
            {mounted ? formattedTime : "--:--:-- --"}
          </span>
        </div>

        {/* Prayer Info */}
        {prayerLoading || settingsLoading || !mounted ? (
          <div className="h-20 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex flex-col items-center">
              <span className="text-sm text-slate-400 font-medium mb-1">
                الصلاة القادمة: {nextPrayer?.name || "..."}
              </span>
              <span className="text-4xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 drop-shadow-sm">
                {nextPrayer?.remaining || "00:00:00"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
    </div>
  );
}
