import {
  X,
  Minus,
  Square,
  Copy,
  RefreshCw,
  Download,
  Sparkles,
} from "lucide-react";
import { useWindowControls } from "../../hooks/use-window-controls";
import { useAutoUpdater } from "@/hooks/useAutoUpdater";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

export function TitleBar() {
  const { isMaximized, minimize, maximize, close } = useWindowControls();
  const { status, checkForUpdate } = useAutoUpdater();

  return (
    <div className="fixed top-0 left-0 right-0 h-9 z-1000 flex items-center justify-between bg-background border-b border-border select-none app-drag-region">
      {/* Window Controls (Left side) */}
      <div className="flex items-center h-full no-drag">
        <button
          onClick={close}
          className="h-full w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors focus:outline-none text-foreground/70"
          title="إغلاق"
        >
          <X size={16} strokeWidth={1.5} />
        </button>

        <button
          onClick={maximize}
          className="h-full w-12 flex items-center justify-center hover:bg-foreground/5 transition-colors focus:outline-none text-foreground/70 hover:text-foreground"
          title={isMaximized ? "استعادة" : "تكبير"}
        >
          {isMaximized ? (
            <Copy size={14} strokeWidth={1.5} className="rotate-180" />
          ) : (
            <Square size={14} strokeWidth={1.5} />
          )}
        </button>

        <button
          onClick={minimize}
          className="h-full w-12 flex items-center justify-center hover:bg-foreground/5 transition-colors focus:outline-none text-foreground/70 hover:text-foreground"
          title="تصغير"
        >
          <Minus size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Centered Title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="flex items-center gap-2 opacity-80">
          <span className="text-sm font-bold tracking-tight text-foreground/90 font-sans text-right">
            الريّان
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Right side - Update & Status utility */}
      <div className="flex items-center h-full no-drag px-1">
        {(status === "available" ||
          status === "checking" ||
          status === "downloading" ||
          status === "downloaded") && (
          <Tooltip
            content={
              status === "available"
                ? "تحديث جديد متاح!"
                : status === "downloading"
                  ? "جاري التحميل..."
                  : status === "downloaded"
                    ? "التحديث جاهز للتثبيت"
                    : "جاري التحقق..."
            }
            side="bottom"
          >
            <button
              onClick={() => checkForUpdate()}
              className={cn(
                "h-7 px-2.5 flex items-center gap-1.5 rounded-md transition-all duration-300",
                status === "available"
                  ? "bg-primary/15 text-primary hover:bg-primary/25 animate-pulse"
                  : status === "downloaded"
                    ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                    : "text-muted-foreground hover:bg-foreground/5",
              )}
            >
              {status === "checking" ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : status === "available" ? (
                <>
                  <Sparkles size={13} className="animate-bounce" />
                  <span className="text-[10px] font-bold">تحديث!</span>
                </>
              ) : status === "downloading" ? (
                <Download size={13} className="animate-bounce" />
              ) : status === "downloaded" ? (
                <RefreshCw size={13} />
              ) : null}
            </button>
          </Tooltip>
        )}

        {/* Regular Update Button (Subtle when no update) */}
        {status === "idle" ||
        status === "not-available" ||
        status === "error" ? (
          <Tooltip content="التحقق من التحديثات" side="right">
            <button
              onClick={() => checkForUpdate()}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <RefreshCw size={13} />
            </button>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
}
