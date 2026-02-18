import { Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RadioStation } from "@/contexts/radio-context";

interface RadioCardProps {
  radio: RadioStation;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: (radio: RadioStation) => void;
}

export function RadioCard({
  radio,
  isActive,
  isPlaying,
  onSelect,
}: RadioCardProps) {
  return (
    <Card
      dir="rtl"
      onClick={() => onSelect(radio)}
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 group relative overflow-hidden",
        isActive &&
          "border-amber-500/50 bg-slate-900/80 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]",
      )}
    >
      {isActive && isPlaying && (
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 to-transparent pointer-events-none animate-pulse" />
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-cairo font-bold text-lg truncate transition-colors",
              isActive
                ? "text-amber-500"
                : "text-slate-200 group-hover:text-white",
            )}
          >
            {radio.name}
          </h3>
          {isActive && (
            <p className="text-xs text-amber-500/80 font-medium mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              جاري التشغيل الآن
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isActive
              ? "bg-amber-500 text-slate-950"
              : "bg-slate-800 text-slate-400 group-hover:text-amber-500 group-hover:bg-slate-800",
          )}
        >
          {isActive && isPlaying ? (
            <div className="flex gap-1 h-4 items-end justify-center">
              <span className="w-1 bg-current animate-bounce h-2"></span>
              <span className="w-1 bg-current animate-[bounce_1.2s_infinite] h-4"></span>
              <span className="w-1 bg-current animate-[bounce_0.8s_infinite] h-3"></span>
            </div>
          ) : (
            <Radio className="w-6 h-6" />
          )}
        </div>
      </div>
    </Card>
  );
}
