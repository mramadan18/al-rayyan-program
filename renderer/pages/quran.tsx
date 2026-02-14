import React, { useState } from "react";
import Head from "next/head";
import { Play, SkipBack, SkipForward, Pause, Copy, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Placeholder Verses Data
const VERSES = [
  { id: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", number: 1 },
  { id: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", number: 2 },
  { id: 3, text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", number: 3 },
  { id: 4, text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", number: 4 },
  { id: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", number: 5 },
  { id: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", number: 6 },
  {
    id: 7,
    text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    number: 7,
  },
];

export default function QuranPage() {
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    <React.Fragment>
      <Head>
        <title>الريّان - المصحف</title>
      </Head>

      {/* Main Container - Distraction Free */}
      <div className="min-h-screen bg-quran-paper text-primary-foreground flex flex-col items-center py-20 relative">
        {/* Quran Text Area */}
        <div className="max-w-3xl w-full px-8 text-center space-y-12">
          <h1 className="text-4xl font-bold text-black/80 mb-12 font-quran">
            سورة الفاتحة
          </h1>

          <div className="space-y-8 leading-loose" dir="rtl">
            {VERSES.map((verse) => (
              <Sheet key={verse.id}>
                <SheetTrigger asChild>
                  <div
                    className={cn(
                      "relative group cursor-pointer transition-all duration-300 rounded-xl p-4 hover:bg-black/5",
                      activeVerse === verse.id ? "bg-primary/10" : "",
                    )}
                    onMouseEnter={() => setActiveVerse(verse.id)}
                    onMouseLeave={() => setActiveVerse(null)}
                  >
                    <p className="text-4xl md:text-5xl font-quran text-black/90 leading-[2.5]">
                      {verse.text}
                      <span className="text-2xl mr-2 font-sans text-primary/60">
                        ۝{verse.number}
                      </span>
                    </p>
                  </div>
                </SheetTrigger>

                {/* Tafsir Drawer (Step 4) */}
                <SheetContent
                  side="left"
                  className="w-[400px] sm:w-[540px] bg-background border-border"
                >
                  <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-xl font-bold">
                        التفسير الميسر
                      </SheetTitle>
                      <SheetClose />
                    </div>
                  </SheetHeader>

                  <div className="space-y-6">
                    {/* Selected Verse Display */}
                    <div className="bg-muted/50 p-6 rounded-lg text-center border border-border">
                      <p className="text-2xl font-quran text-foreground leading-loose">
                        {verse.text}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Copy className="w-4 h-4" />
                        نسخ النص
                      </Button>
                    </div>

                    <Separator className="my-4" />

                    {/* Tafsir Text Placeholder */}
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <p className="text-lg leading-relaxed text-muted-foreground text-justify">
                        (placeholder) {verse.text} - تفسير الآية الكريمة كما ورد
                        في كتب التفسير المعتمدة. هذا نص تجريبي لتوضيح مكان ظهور
                        التفسير. يتميز التفسير الميسر بوضوح العبارة وسهولة الفهم
                        ومناسبته لعموم القراء. شرح المفردات: - الكلمة 1: معناها
                        - الكلمة 2: معناها وفي هذه الآية دلالة عظيمة على رحمة
                        الله بعباده وتوجيههم إلى طريق الحق...
                      </p>
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </div>

        {/* Hidden Audio Player (Appears on Hover/Active) - Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 hover:translate-y-0 translate-y-2 group-hover:translate-y-0 bg-linear-to-t from-background to-transparent pt-12">
          {/* The actual player bar */}
          <div className="max-w-2xl mx-auto bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center gap-6">
            {/* Play Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
            </div>

            {/* Info & Progress */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-foreground">
                  الشيخ مشاري العفاسي
                </span>
                <span className="font-mono text-muted-foreground text-xs">
                  04:33 / 12:45
                </span>
              </div>
              <Slider
                value={[progress]}
                onValueChange={(val) => setProgress(val[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
