import { Moon, Sunrise, Sunset, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RamadanImsakia() {
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: `Ramadan ${i + 1}`,
    suhoor: "04:15 AM",
    imsak: "04:05 AM",
    iftar: "06:45 PM",
  }));

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-950 text-slate-100 p-6 overflow-hidden rounded-xl border border-slate-800">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <Moon className="w-96 h-96 text-amber-500" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Suhoor Card */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Suhoor Time
            </CardTitle>
            <Sunrise className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">04:15 AM</div>
            <p className="text-xs text-slate-500 mt-1">Imsak: 04:05 AM</p>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center p-4 bg-linear-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800 shadow-2xl shadow-amber-900/10">
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 rounded-full"></div>
            <Clock className="w-8 h-8 text-amber-400 relative z-10 animate-pulse" />
          </div>
          <span className="text-sm text-amber-500/80 font-medium mb-1 tracking-wide">
            الوقت المتبقي للإفطار
          </span>
          <span className="text-3xl font-mono font-bold text-white tracking-widest">
            02:45:10
          </span>
        </div>

        {/* Iftar Card */}
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Iftar Time
            </CardTitle>
            <Sunset className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">06:45 PM</div>
            <p className="text-xs text-slate-500 mt-1">Maghrib Prayer</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Table */}
      <Card className="bg-slate-900/30 border-slate-800 backdrop-blur-sm relative z-10 h-[400px]">
        <ScrollArea className="h-full w-full rounded-md">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 p-4 border-b border-slate-800 bg-slate-900/80 sticky top-0 backdrop-blur text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="text-center">Day</div>
              <div className="text-center">Date</div>
              <div className="text-center text-amber-500/80">Suhoor</div>
              <div className="text-center text-red-400/80">Imsak</div>
              <div className="text-center text-green-400/80">Iftar</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-slate-800/50">
              {days.map((day) => (
                <div
                  key={day.day}
                  className="grid grid-cols-5 p-3 text-sm hover:bg-slate-800/30 transition-colors items-center"
                >
                  <div className="text-center font-medium text-slate-300">
                    {day.day}
                  </div>
                  <div className="text-center text-slate-400">{day.date}</div>
                  <div className="text-center font-mono text-amber-200">
                    {day.suhoor}
                  </div>
                  <div className="text-center font-mono text-red-200">
                    {day.imsak}
                  </div>
                  <div className="text-center font-mono text-green-200">
                    {day.iftar}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
