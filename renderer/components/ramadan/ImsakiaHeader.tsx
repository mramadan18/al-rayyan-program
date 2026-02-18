import { Sunrise, Sunset, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RamadanDay } from "./types";

interface ImsakiaHeaderProps {
  displayDay: RamadanDay | null;
  nextEventLabel: string;
  countdown: string;
}

export function ImsakiaHeader({
  displayDay,
  nextEventLabel,
  countdown,
}: ImsakiaHeaderProps) {
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Suhoor Card */}
      <Card className="bg-muted/30 border-border backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {displayDay ? `سحور يوم ${displayDay.dayName}` : "وقت السحور"}
          </CardTitle>
          <Sunrise className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {displayDay ? displayDay.suhoor : "--:--"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            الإمساك: {displayDay ? displayDay.imsak : "--:--"}
          </p>
        </CardContent>
      </Card>

      {/* Countdown Card */}
      <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl border shadow-md">
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 rounded-full"></div>
          <Clock className="w-8 h-8 text-amber-500 relative z-10 animate-pulse" />
        </div>
        <span className="text-sm text-amber-500 font-medium mb-1 tracking-wide">
          {nextEventLabel}
        </span>
        <span
          className="text-3xl font-mono font-bold text-foreground tracking-widest"
          dir="ltr"
        >
          {countdown}
        </span>
      </div>

      {/* Iftar Card */}
      <Card className="bg-muted/30 border-border backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {displayDay ? `إفطار يوم ${displayDay.dayName}` : "وقت الإفطار"}
          </CardTitle>
          <Sunset className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {displayDay ? displayDay.iftar : "--:--"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">صلاة المغرب</p>
        </CardContent>
      </Card>
    </div>
  );
}
