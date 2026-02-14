import { Moon, Sunrise, Sunset, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RamadanImsakia() {
  const days = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: `رمضان ${i + 1}`,
    suhoor: "04:15 ص",
    imsak: "04:05 ص",
    iftar: "06:45 م",
  }));

  return (
    <div className="relative w-full h-full min-h-[600px] bg-card text-card-foreground p-6 overflow-hidden rounded-xl border shadow-lg">
      {/* Background Watermark */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <Moon className="w-96 h-96 text-amber-500" />
      </div>

      {/* Header Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Suhoor Card */}
        <Card className="bg-muted/30 border-border backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              وقت السحور
            </CardTitle>
            <Sunrise className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">04:15 ص</div>
            <p className="text-xs text-muted-foreground mt-1">
              الإمساك: 04:05 ص
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl border shadow-md">
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 rounded-full"></div>
            <Clock className="w-8 h-8 text-amber-500 relative z-10 animate-pulse" />
          </div>
          <span className="text-sm text-amber-500 font-medium mb-1 tracking-wide">
            الوقت المتبقي للإفطار
          </span>
          <span className="text-3xl font-mono font-bold text-foreground tracking-widest">
            02:45:10
          </span>
        </div>

        {/* Iftar Card */}
        <Card className="bg-muted/30 border-border backdrop-blur-sm hover:border-amber-500/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              وقت الإفطار
            </CardTitle>
            <Sunset className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">06:45 م</div>
            <p className="text-xs text-muted-foreground mt-1">صلاة المغرب</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Table */}
      <Card className="bg-muted/10 border-border backdrop-blur-sm relative z-10 h-[400px]">
        <ScrollArea className="h-full w-full rounded-md">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 p-4 border-b bg-muted/50 sticky top-0 backdrop-blur text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="text-center">اليوم</div>
              <div className="text-center">التاريخ</div>
              <div className="text-center text-amber-500">سحور</div>
              <div className="text-center text-red-500">إمساك</div>
              <div className="text-center text-green-500">إفطار</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {days.map((day) => (
                <div
                  key={day.day}
                  className="grid grid-cols-5 p-3 text-sm hover:bg-muted/20 transition-colors items-center"
                >
                  <div className="text-center font-medium text-foreground">
                    {day.day}
                  </div>
                  <div className="text-center text-muted-foreground">
                    {day.date}
                  </div>
                  <div className="text-center font-mono text-amber-600 dark:text-amber-200">
                    {day.suhoor}
                  </div>
                  <div className="text-center font-mono text-red-600 dark:text-red-200">
                    {day.imsak}
                  </div>
                  <div className="text-center font-mono text-green-600 dark:text-green-200">
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
