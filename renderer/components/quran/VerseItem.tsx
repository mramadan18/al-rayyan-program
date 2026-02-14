import { Copy } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface VerseItemProps {
  verse: {
    id: number;
    text: string;
    number: number;
  };
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function VerseItem({
  verse,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: VerseItemProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className={cn(
            "relative group cursor-pointer transition-all duration-300 rounded-xl p-4 hover:bg-black/5",
            isActive ? "bg-primary/10" : "",
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <p className="text-4xl md:text-5xl font-quran text-black/90 leading-[2.5]">
            {verse.text}
            <span className="text-2xl mr-2 font-sans text-primary/60">
              ۝{verse.number}
            </span>
          </p>
        </div>
      </SheetTrigger>

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

        <div className="space-y-6 text-right">
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
              (placeholder) {verse.text} - تفسير الآية الكريمة كما ورد في كتب
              التفسير المعتمدة. هذا نص تجريبي لتوضيح مكان ظهور التفسير. يتميز
              التفسير الميسر بوضوح العبارة وسهولة الفهم ومناسبته لعموم القراء.
              شرح المفردات: - الكلمة 1: معناها - الكلمة 2: معناها وفي هذه الآية
              دلالة عظيمة على رحمة الله بعباده وتوجيههم إلى طريق الحق...
            </p>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
