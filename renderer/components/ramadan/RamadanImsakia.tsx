import { Moon, AlertTriangle } from "lucide-react";
import { useRamadanImsakia } from "@/hooks/useRamadanImsakia";
import { ImsakiaHeader } from "./ImsakiaHeader";
import { ImsakiaTable } from "./ImsakiaTable";

export function RamadanImsakia() {
  const { days, loading, error, countdown, nextEventLabel, displayDay, retry } =
    useRamadanImsakia();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 rounded-xl border border-red-500/30 text-red-500 h-[400px]">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold">{error}</p>
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="text-muted-foreground animate-pulse">
          جاري تحميل الإمساكية...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[600px] bg-card text-card-foreground p-6 overflow-y-auto rounded-xl border shadow-lg">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <Moon className="w-96 h-96 text-amber-500" />
      </div>

      <ImsakiaHeader
        displayDay={displayDay}
        nextEventLabel={nextEventLabel}
        countdown={countdown}
      />

      <ImsakiaTable days={days} />
    </div>
  );
}
