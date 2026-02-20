import { Pin, PinOff, X, MoreHorizontal } from "lucide-react";
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
    updateMiniWidgetSize,
    loading: settingsLoading,
  } = useSettings();
  /* Removed clock state */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply initial zoom
    if (window.ipc && miniWidgetSize) {
      window.ipc.setZoom(miniWidgetSize);
    }
  }, [miniWidgetSize]);

  useEffect(() => {
    if (!window.ipc) return;

    // Listen for zoom updates from main process
    const cleanup = window.ipc.on("apply-mini-widget-zoom", (size: number) => {
      window.ipc.setZoom(size);
    });

    return cleanup;
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

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSize = Math.min(miniWidgetSize + 0.1, 1.5);
    updateMiniWidgetSize(Number(newSize.toFixed(1)));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSize = Math.max(miniWidgetSize - 0.1, 0.7);
    updateMiniWidgetSize(Number(newSize.toFixed(1)));
  };

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
          <div className="flex items-center gap-1">
            <button
              onClick={handleTogglePin}
              className={cn(
                "p-1.5 rounded-full transition-colors hover:bg-white/20 active:scale-95 pointer-events-auto z-50",
                miniWidgetAlwaysOnTop ? "text-amber-400" : "text-white/40",
              )}
              title={
                miniWidgetAlwaysOnTop ? "إلغاء التثبيت" : "تثبيت في المقدمة"
              }
              style={{ WebkitAppRegion: "no-drag" } as any}
            >
              {miniWidgetAlwaysOnTop ? (
                <Pin className="w-4 h-4 pointer-events-none" />
              ) : (
                <PinOff className="w-4 h-4 pointer-events-none" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.ipc?.send(IpcChannels.SHOW_MINI_WIDGET_MENU);
              }}
              className="p-1.5 rounded-full transition-colors hover:bg-white/20 text-white/40 hover:text-white active:scale-95 pointer-events-auto z-50"
              title="خيارات إضافية"
              style={{ WebkitAppRegion: "no-drag" } as any}
            >
              <MoreHorizontal className="w-4 h-4 pointer-events-none" />
            </button>
          </div>

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
        {/* Prayer Info */}
        {prayerLoading || settingsLoading || !mounted ? (
          <div className="h-20 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-full px-4">
            {/* Next Prayer Name & Time */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-quran text-white drop-shadow-md">
                {nextPrayer?.name}
              </span>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-md font-mono text-slate-200 backdrop-blur-sm">
                {(() => {
                  if (!nextPrayer?.time) return "--:--";
                  return nextPrayer.time;
                })()}
              </span>
            </div>

            {/* Remaining Time - White Only */}
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold font-mono tracking-tighter drop-shadow-lg text-white mt-1">
                {nextPrayer?.remaining || "00:00:00"} -
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
