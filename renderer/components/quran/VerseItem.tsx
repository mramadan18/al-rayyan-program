import { useState } from "react";
import {
  Copy,
  Loader2,
  Play,
  ListStart,
  BookOpen,
  Bookmark,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  tafsirText?: string;
  tafsirName?: string;
  isLoading?: boolean;
  error?: string | null;
  onPlayVerse?: () => void;
  onPlayFromVerse?: () => void;
  onMarkAsCurrentVerse?: () => void;
}

export function VerseItem({
  verse,
  isActive,
  tafsirText,
  tafsirName = "التفسير",
  isLoading,
  error,
  onPlayVerse,
  onPlayFromVerse,
  onMarkAsCurrentVerse,
}: VerseItemProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopyVerse = () => {
    navigator.clipboard.writeText(verse.text);
  };

  // Handle right-click to open dropdown
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(true);
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <span
            id={`verse-${verse.number}`}
            onContextMenu={handleContextMenu}
            className={cn(
              "relative inline cursor-pointer transition-colors duration-200 rounded-md px-1 hover:bg-black/5 dark:hover:bg-white/5",
              isActive
                ? "bg-primary/20 text-primary-foreground dark:text-primary"
                : "",
            )}
          >
            <span className="text-2xl md:text-3xl font-quran leading-[2.8] text-foreground">
              {verse.text}
              <span className="relative inline-flex items-center justify-center w-12 h-12 mx-2 select-none align-middle transform translate-y-2 group/ayah transition-all duration-300">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover/ayah:rotate-180"
                >
                  {/* Complex Shamsa/Floral Pattern */}
                  <path
                    fill="currentColor"
                    fillOpacity="0.15"
                    d="M50 0 L58 20 C70 10 90 10 80 30 L100 50 L80 70 C90 90 70 90 58 80 L50 100 L42 80 C30 90 10 90 20 70 L0 50 L20 30 C10 10 30 10 42 20 Z"
                  />
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    d="M50 8 L60 35 L92 50 L60 65 L50 92 L40 65 L8 50 L40 35 Z"
                  />
                  {/* Inner Dots for elegance */}
                  <circle
                    cx="50"
                    cy="18"
                    r="2"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                  <circle
                    cx="50"
                    cy="82"
                    r="2"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                  <circle
                    cx="18"
                    cy="50"
                    r="2"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />
                  <circle
                    cx="82"
                    cy="50"
                    r="2"
                    fill="currentColor"
                    fillOpacity="0.5"
                  />

                  {/* Elegant center circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="18"
                    fill="white"
                    className="dark:fill-slate-950"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                  />
                </svg>
                <span className="relative z-10 text-[10px] md:text-[11px] font-bold font-sans text-primary group-hover/ayah:scale-110 transition-transform">
                  {verse.number}
                </span>
              </span>
            </span>
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuItem
            onClick={() => {
              if (onPlayVerse) onPlayVerse();
            }}
            className="cursor-pointer flex items-center gap-2 font-quran text-right"
          >
            <Play className="w-4 h-4" />
            <span>الاستماع لهذه الآية فقط</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              if (onPlayFromVerse) onPlayFromVerse();
            }}
            className="cursor-pointer flex items-center gap-2 font-quran text-right"
          >
            <ListStart className="w-4 h-4" />
            <span>الاستماع من بداية هذه الآية</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              if (onMarkAsCurrentVerse) onMarkAsCurrentVerse();
              setDropdownOpen(false);
            }}
            className="cursor-pointer flex items-center gap-2 font-quran text-right"
          >
            <Bookmark className="w-4 h-4" />
            <span>تعليم كموقع قراءة حالي</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setSheetOpen(true)}
            className="cursor-pointer flex items-center gap-2 font-quran text-right"
          >
            <BookOpen className="w-4 h-4" />
            <span>عرض التفسير</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleCopyVerse}
            className="cursor-pointer flex items-center gap-2 font-quran text-right"
          >
            <Copy className="w-4 h-4" />
            <span>نسخ الآية</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tafsir Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          dir="ltr"
          side="right"
          className="w-[400px] sm:w-[540px] bg-background border-border top-9 h-[calc(100vh-2.25rem)] overflow-y-auto px-2"
        >
          <SheetHeader className="mb-6">
            <div className="flex items-center justify-between">
              <SheetClose />
              <SheetTitle className="text-xl font-bold">
                {tafsirName}
              </SheetTitle>
              <SheetDescription className="sr-only">
                تفسير ومعلومات الآية رقم {verse.number}
              </SheetDescription>
            </div>
          </SheetHeader>

          <div className="space-y-6 text-start">
            {/* Selected Verse Display */}
            <div className="bg-muted/50 p-6 rounded-lg text-center border border-border">
              <p className="text-2xl font-quran text-foreground leading-loose">
                {verse.text}
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-2 justify-end ">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={handleCopyVerse}
              >
                <Copy className="w-4 h-4" />
                نسخ النص
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Tafsir Content */}
            <ScrollArea className="h-[400px] rounded-md border p-6 bg-muted/20">
              <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3 text-primary/60">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="font-quran">جاري تحميل التفسير...</p>
                  </div>
                ) : error ? (
                  <div className="text-destructive p-4">
                    <p className="font-quran mb-2">
                      عذراً، حدث خطأ أثناء تحميل التفسير
                    </p>
                    <p className="text-sm opacity-70">{error}</p>
                  </div>
                ) : (
                  <p className="text-xl leading-relaxed text-foreground font-quran">
                    {tafsirText || "التفسير غير متوفر لهذه الآية حالياً."}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
