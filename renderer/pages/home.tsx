import React from "react";
import Head from "next/head";
import { Check, MoveRight, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>الريّان - الرئيسية</title>
      </Head>

      <div className="container mx-auto p-6 space-y-8 max-w-5xl">
        {/* Helper Grid for Hero and Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Section - Next Prayer */}
          <section className="lg:col-span-2">
            <Card className="relative overflow-hidden border-none shadow-xl bg-primary text-primary-foreground h-full flex flex-col justify-between">
              {/* Geometric Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#islamic-pattern)"
                  />
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
                    القاهرة، مصر
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 text-center py-8">
                <h1 className="text-6xl md:text-8xl font-bold font-quran mb-2 tracking-wide">
                  المغرب
                </h1>
                <div className="text-4xl md:text-5xl font-mono opacity-90 font-light tracking-widest tabular-nums">
                  02:45:10
                </div>
              </CardContent>

              <CardFooter className="relative z-10 bg-black/10 backdrop-blur-md py-3 flex justify-between text-sm font-medium">
                <span>14 رجب 1447 هـ</span>
                <span>14 فبراير 2026 م</span>
              </CardFooter>
            </Card>
          </section>

          {/* Side Section - Daily Wird */}
          <section className="lg:col-span-1">
            <Card className="h-full border-none shadow-lg bg-card text-card-foreground flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  وردي اليومي
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                {/* Progress Circle Visual Placeholder */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  {/* Simple SVG Ring */}
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="283"
                      strokeDashoffset="170"
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">40%</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-muted-foreground text-sm">توقفت عند</p>
                  <p className="text-xl font-semibold font-quran">سورة الكهف</p>
                  <p className="text-xs text-muted-foreground">الآية 45</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-6 px-6">
                <Button
                  className="w-full gap-2 text-lg h-12 shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  متابعة القراءة
                  <MoveRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          </section>
        </div>

        {/* Prayer Timeline Section */}
        <section>
          <Card className="border-none shadow-md bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10" />

                {[
                  { name: "الفجر", time: "05:12 ص", status: "passed" },
                  { name: "الظهر", time: "12:30 م", status: "passed" },
                  { name: "العصر", time: "03:45 م", status: "active" }, // Active Next? Wait, Maghrib is next in Hero. So Asr is current/passed? Layout says Next is Maghrib. So Asr is passed. Maghrib is next/active.
                  { name: "المغرب", time: "06:15 م", status: "active" }, // Let's make this active/next
                  { name: "العشاء", time: "07:45 م", status: "upcoming" },
                ].map((prayer, idx) => (
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
        </section>
      </div>
    </React.Fragment>
  );
}
