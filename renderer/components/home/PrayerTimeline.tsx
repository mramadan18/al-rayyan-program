import { Check, CloudSun, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PrayerTime {
  name: string;
  time: string;
  status: "passed" | "active" | "upcoming";
}

interface PrayerTimelineProps {
  prayers: PrayerTime[];
}

const getPrayerIcon = (name: string, idx: number) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("fajr") || lowerName.includes("فجر")) return Sunrise;
  if (
    lowerName.includes("shuruq") ||
    lowerName.includes("shurooq") ||
    lowerName.includes("شروق")
  )
    return CloudSun;
  if (
    lowerName.includes("dhuhr") ||
    lowerName.includes("zuhr") ||
    lowerName.includes("ظهر")
  )
    return Sun;
  if (lowerName.includes("asr") || lowerName.includes("عصر")) return CloudSun;
  if (lowerName.includes("maghrib") || lowerName.includes("مغرب"))
    return Sunset;
  if (lowerName.includes("isha") || lowerName.includes("عشاء")) return Moon;

  // Fallback by index if name matching fails
  if (idx === 0) return Sunrise;
  if (idx === 1) return Sun;
  if (idx === 2) return CloudSun;
  if (idx === 3) return Sunset;
  return Moon;
};

export function PrayerTimeline({ prayers }: PrayerTimelineProps) {
  // Calculate progress for the timeline bar
  const activeIndex = prayers.findIndex((p) => p.status === "active");
  const progress =
    activeIndex === -1
      ? prayers.every((p) => p.status === "passed")
        ? 100
        : 0
      : (activeIndex / (prayers.length - 1)) * 100;

  return (
    <Card className="border-none shadow-lg bg-linear-to-br from-card/80 to-background/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          مواقيت الصلاة
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          {/* Background Line (Desktop) */}
          <div className="hidden md:block absolute top-9 left-0 right-0 h-1 bg-muted rounded-full -z-10">
            <div
              className="h-full bg-primary/30 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%`, direction: "ltr" }}
            />
          </div>

          {/* Background Line (Mobile) */}
          <div className="md:hidden absolute right-9 top-0 bottom-0 w-1 bg-muted rounded-full -z-10">
            <div
              className="w-full bg-primary/30 rounded-full transition-all duration-1000 ease-out"
              style={{ height: `${progress}%` }}
            />
          </div>

          {prayers.map((prayer, idx) => {
            const Icon = getPrayerIcon(prayer.name, idx);
            const isActive = prayer.status === "active";
            const isPassed = prayer.status === "passed";

            return (
              <div
                key={idx}
                className={cn(
                  "relative group flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto p-2 rounded-xl transition-all duration-500",
                  isActive ? "z-10" : "z-0",
                )}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all duration-500",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary),0.4)] scale-110"
                      : isPassed
                        ? "bg-card text-primary border-primary/50"
                        : "bg-muted text-muted-foreground border-transparent",
                  )}
                >
                  <Icon
                    className={cn("w-6 h-6", isActive && "animate-pulse")}
                  />

                  {/* Status Indicator Badge */}
                  {isPassed && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-background">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div
                  className={cn(
                    "flex flex-col md:items-center gap-0.5 transition-all duration-300",
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "opacity-80 group-hover:opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-semibold font-quran",
                      isActive ? "text-primary text-lg" : "text-foreground",
                    )}
                  >
                    {prayer.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-mono tracking-wider",
                      isActive
                        ? "text-primary/80 font-bold"
                        : "text-muted-foreground",
                    )}
                  >
                    {prayer.time}
                  </span>
                </div>

                {/* Active Indicator (Glow behind) */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10 blur-xl transition-all duration-500" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
