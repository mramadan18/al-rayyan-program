import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NextPrayerCardProps {
  prayerName: string;
  timeRemaining: string;
  location: string;
  hijriDate: string;
  gregorianDate: string;
  loading?: boolean;
}

export function NextPrayerCard({
  prayerName,
  timeRemaining,
  location,
  hijriDate,
  gregorianDate,
  loading = false,
}: NextPrayerCardProps) {
  if (loading || !prayerName || prayerName === "...") {
    return (
      <Card className="relative overflow-hidden border-none shadow-xl bg-primary/20 text-primary-foreground h-full flex flex-col justify-between animate-pulse min-h-[300px]">
        <CardHeader className="relative z-10 pb-2">
          <div className="flex justify-between items-start">
            <div className="h-6 w-24 bg-primary/30 rounded-full" />
            <div className="h-6 w-32 bg-primary/30 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 text-center py-8 flex flex-col items-center gap-4">
          <div className="h-16 w-48 bg-primary/30 rounded-lg" />
          <div className="h-10 w-36 bg-primary/30 rounded-lg" />
        </CardContent>
        <CardFooter className="relative z-10 bg-black/5 backdrop-blur-md py-3 flex justify-between">
          <div className="h-4 w-32 bg-primary/30 rounded" />
          <div className="h-4 w-32 bg-primary/30 rounded" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-none shadow-xl bg-primary text-primary-foreground h-full flex flex-col justify-between group">
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="islamic-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,20 L20,0 L40,20 L20,40 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>

      <CardHeader className="relative z-10 pb-2">
        <div className="flex justify-between items-start">
          <Badge
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
          >
            الصلاة القادمة
          </Badge>
          <Badge
            variant="outline"
            className="border-white/20 text-white flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            {location}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 text-center py-8">
        <h1 className="text-6xl md:text-8xl font-bold font-quran mb-2 tracking-wide group-hover:scale-105 transition-transform duration-500">
          {prayerName}
        </h1>
        <div className="text-4xl md:text-5xl font-mono opacity-90 font-light tracking-widest tabular-nums">
          {timeRemaining}
        </div>
      </CardContent>

      <CardFooter className="relative z-10 bg-black/10 backdrop-blur-md py-3 flex justify-between text-sm font-medium">
        <span>{hijriDate}</span>
        <span>{gregorianDate}</span>
      </CardFooter>
    </Card>
  );
}
