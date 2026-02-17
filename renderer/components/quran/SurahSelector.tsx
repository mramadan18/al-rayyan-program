import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BookOpen, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface SurahSelectorProps {
  currentSurahNumber: number;
  currentSurahName?: string;
  surahList: Array<{ number: number; name: string; englishName: string }>;
  surahListLoading: boolean;
  onSelectSurah: (number: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SurahSelector({
  currentSurahNumber,
  currentSurahName,
  surahList,
  surahListLoading,
  onSelectSurah,
  onNext,
  onPrev,
}: SurahSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onPrev}
        disabled={currentSurahNumber <= 1}
        title="السورة السابقة"
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[140px] md:min-w-[180px] justify-between font-quran text-base md:text-lg h-9 bg-background/40 hover:bg-accent hover:text-accent-foreground border-primary/20"
          >
            <span className="truncate">
              {currentSurahName || "اختر السورة"}
            </span>
            <BookOpen className="ml-2 h-4 w-4 shrink-0 opacity-40" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] p-0 shadow-2xl border-primary/20"
          align="start"
        >
          <Command className="rtl">
            <CommandInput
              placeholder="ابحث عن سورة..."
              className="text-right font-quran h-10"
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="font-quran p-4 text-center">
                لا توجد نتائج.
              </CommandEmpty>
              <CommandGroup>
                {!surahListLoading &&
                  surahList.map((surah) => (
                    <CommandItem
                      key={surah.number}
                      value={`${surah.number} ${surah.name} ${surah.englishName}`}
                      onSelect={() => {
                        onSelectSurah(surah.number);
                        setOpen(false);
                      }}
                      className="font-quran text-right flex justify-between cursor-pointer py-2 px-4 hover:bg-primary/5"
                    >
                      <span>{surah.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs font-sans opacity-60">
                          {surah.number}
                        </span>
                        {currentSurahNumber === surah.number && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onNext}
        disabled={currentSurahNumber >= 114}
        title="السورة التالية"
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
