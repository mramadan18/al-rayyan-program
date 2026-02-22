import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TafsirVerse {
  text: string;
  number: number;
  numberInSurah: number;
}

interface QuranTafsirSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tafsirVerse: TafsirVerse | null;
  tafsirId: string;
  tafsirData: any;
  loading: boolean;
  error: string | null;
}

export function QuranTafsirSheet({
  isOpen,
  onOpenChange,
  tafsirVerse,
  tafsirId,
  tafsirData,
  loading,
  error,
}: QuranTafsirSheetProps) {
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        dir="ltr"
        side="right"
        className="w-[400px] sm:w-[540px] bg-background border-border top-9 h-[calc(100vh-2.25rem)] overflow-y-auto px-2"
      >
        <SheetHeader className="mb-6">
          <div className="flex justify-end">
            <SheetDescription className="sr-only">
              تفسير ومعلومات الآية رقم {tafsirVerse?.numberInSurah}
            </SheetDescription>
            <SheetTitle className="text-xl font-bold">
              {tafsirId === "muyassar" ? "التفسير الميسر" : "تفسير الجلالين"}
            </SheetTitle>
          </div>
        </SheetHeader>

        {tafsirVerse && (
          <div className="space-y-6 text-start">
            <div className="bg-muted/50 p-6 rounded-lg text-center border border-border">
              <p className="text-2xl font-quran text-foreground leading-loose">
                {tafsirVerse.text}
              </p>
            </div>

            <div className="flex gap-2 justify-end ">
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => handleCopyText(tafsirVerse.text)}
              >
                <Copy className="w-4 h-4" />
                نسخ النص
              </Button>
            </div>

            <Separator className="my-4" />

            <ScrollArea className="h-[calc(100vh-25rem)] rounded-md border p-6 bg-muted/20">
              <div className="flex flex-col items-center justify-center min-h-[100px] text-center">
                {loading ? (
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
                    {tafsirData?.[tafsirVerse.numberInSurah] ||
                      "التفسير غير متوفر لهذه الآية حالياً."}
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
