import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PrayerTime {
  name: string;
  time: string;
  status: "passed" | "active" | "upcoming";
}

interface PrayerTimelineProps {
  prayers: PrayerTime[];
}

export function PrayerTimeline({ prayers }: PrayerTimelineProps) {
  return (
    <Card className="border-none shadow-md bg-card/50 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10" />

          {prayers.map((prayer, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl min-w-[100px] transition-all duration-300",
                prayer.status === "active"
                  ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-4 ring-background"
                  : "bg-card hover:bg-accent/50 text-muted-foreground border border-border",
              )}
            >
              <span className="text-xs opacity-70">{prayer.time}</span>
              <span className="font-bold font-quran text-lg">
                {prayer.name}
              </span>
              {prayer.status === "passed" && (
                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center mt-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
