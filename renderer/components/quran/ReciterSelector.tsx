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
import { Mic, Check } from "lucide-react";
import { RECITERS } from "@/constants/reciters";

interface ReciterSelectorProps {
  currentReciter: string;
  onSelectReciter: (identifier: string) => void;
}

export function ReciterSelector({
  currentReciter,
  onSelectReciter,
}: ReciterSelectorProps) {
  const [reciterOpen, setReciterOpen] = useState(false);

  const currentReciterName =
    RECITERS.find((r) => r.identifier === currentReciter)?.name ||
    "مشاري العفاسي";

  return (
    <Popover open={reciterOpen} onOpenChange={setReciterOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-primary transition-colors h-8"
        >
          <Mic className="w-4 h-4" />
          <span className="hidden lg:inline">{currentReciterName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0 shadow-lg" align="end">
        <Command className="rtl">
          <CommandInput
            placeholder="ابحث عن قارئ..."
            className="text-right font-quran h-9"
          />
          <CommandList>
            <CommandEmpty className="font-quran p-4 text-center">
              لا يوجد قارئ بهذا الاسم
            </CommandEmpty>
            <CommandGroup heading="القراء">
              {RECITERS.map((reciter) => (
                <CommandItem
                  key={reciter.identifier}
                  value={reciter.name}
                  onSelect={() => {
                    onSelectReciter(reciter.identifier);
                    setReciterOpen(false);
                  }}
                  className="cursor-pointer font-quran justify-between text-right"
                >
                  <span className="truncate">{reciter.name}</span>
                  {currentReciter === reciter.identifier && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
