import { X, Minus, Square, Copy } from "lucide-react";
import { useWindowControls } from "../../hooks/use-window-controls";

export function TitleBar() {
  const { isMaximized, minimize, maximize, close } = useWindowControls();

  return (
    <div className="fixed top-0 left-0 right-0 h-9 z-1000 flex items-center justify-between bg-background border-b border-border select-none app-drag-region">
      {/* Window Controls (Left side - standard for some Arabic setups/preferences, but usually on the right in Windows. Let's keep it functional as per previous design) */}
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
          <span className="text-sm font-bold tracking-tight text-foreground/90 font-sans">
            الريّان
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Right side spacer/utility */}
      <div className="flex items-center px-4 h-full">
        {/* Placeholder for future icons or status indicators */}
      </div>
    </div>
  );
}
