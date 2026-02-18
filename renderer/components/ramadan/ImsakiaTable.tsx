import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RamadanDay } from "./types";

interface ImsakiaTableProps {
  days: RamadanDay[];
}

export function ImsakiaTable({ days }: ImsakiaTableProps) {
  return (
    <Card className="bg-muted/10 border-border backdrop-blur-sm relative z-10 h-[400px]">
      <ScrollArea className="h-full w-full rounded-md" dir="rtl">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-6 p-4 border-b bg-muted/50 sticky top-0 backdrop-blur z-20 text-xs font-semibold text-muted-foreground uppercase tracking-wider gap-2">
            <div className="text-center">اليوم</div>
            <div className="text-center">التاريخ الهجري</div>
            <div className="text-center">التاريخ الميلادي</div>
            <div className="text-center text-amber-500">سحور (فجر)</div>
            <div className="text-center text-red-500">إمساك</div>
            <div className="text-center text-green-500">إفطار (مغرب)</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {days.map((day) => (
              <div
                key={day.rawDate.toISOString()}
                className={`grid grid-cols-6 p-3 text-sm transition-colors items-center gap-2 ${
                  day.isToday
                    ? "bg-amber-500/10 hover:bg-amber-500/20 ring-1 ring-inset ring-amber-500/30"
                    : "hover:bg-muted/20"
                }`}
              >
                <div className="text-center font-medium text-foreground">
                  {day.dayName}
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  {day.hijriDate}
                </div>
                <div className="text-center text-xs text-muted-foreground opacity-70">
                  {day.gregorianDate}
                </div>
                <div className="text-center font-mono text-amber-600 dark:text-amber-400 font-bold">
                  {day.suhoor}
                </div>
                <div className="text-center font-mono text-red-600 dark:text-red-400">
                  {day.imsak}
                </div>
                <div className="text-center font-mono text-green-600 dark:text-green-400 font-bold">
                  {day.iftar}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
