import React from "react";
import Head from "next/head";
import {
  Sun,
  Moon,
  Sunrise,
  Sunset,
  BookOpen,
  ChevronLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const AZKAR_CATEGORIES = [
  {
    id: "morning",
    title: "أذكار الصباح",
    icon: Sunrise,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    count: 24,
  },
  {
    id: "evening",
    title: "أذكار المساء",
    icon: Sunset,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    count: 22,
  },
  {
    id: "prayer",
    title: "أذكار الصلاة",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    count: 15,
  },
  {
    id: "sleeping",
    title: "أذكار النوم",
    icon: Moon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    count: 12,
  },
];

export default function AzkarPage() {
  return (
    <React.Fragment>
      <Head>
        <title>الريّان - الأذكار</title>
      </Head>

      <div className="container mx-auto p-6 space-y-8 max-w-5xl">
        <header className="flex items-center justify-between border-b pb-4 mb-8">
          <h1 className="text-3xl font-bold font-quran">حصن المسلم</h1>
          <Badge variant="outline" className="px-3 py-1 font-sans">
            ذكرك حصنك
          </Badge>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {AZKAR_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-lg transition-all duration-300 border-none bg-card hover:bg-accent/5 cursor-pointer overflow-hidden relative"
            >
              {/* Decorative background glow */}
              <div
                className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity ${category.bg.replace("/10", "/30")}`}
              />

              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.bg} ${category.color}`}
                  >
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-quran mb-1 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      {category.count} ذكر
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden group-hover:flex"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Zikr - Daily Example */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 font-quran">ذكر عشوائي</h2>
          <Card className="bg-linear-to-br from-primary/5 to-transparent border-primary/20">
            <CardContent className="p-8 text-center space-y-6">
              <p className="text-3xl md:text-4xl leading-loose font-quran text-foreground/90">
                "لَا إلَهَ إلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ
                الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ"
              </p>
              <div className="text-sm text-muted-foreground bg-background/50 inline-block px-4 py-1 rounded-full border">
                من قالها في يوم مائة مرة كانت له عدل عشر رقاب، وكتبت له مائة
                حسنة...
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </React.Fragment>
  );
}
