import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Languages, Check } from "lucide-react";

interface TafsirSelectorProps {
  tafsirId: "muyassar" | "jalalayn";
  onSelectTafsir: (id: "muyassar" | "jalalayn") => void;
}

export function TafsirSelector({
  tafsirId,
  onSelectTafsir,
}: TafsirSelectorProps) {
  const [tafsirOpen, setTafsirOpen] = useState(false);

  const tafsirName =
    tafsirId === "muyassar" ? "التفسير الميسر" : "تفسير الجلالين";

  return (
    <Popover open={tafsirOpen} onOpenChange={setTafsirOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-primary transition-colors h-8"
        >
          <Languages className="w-4 h-4" />
          <span className="hidden lg:inline">{tafsirName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 shadow-lg" align="end">
        <Command>
          <CommandList>
            <CommandGroup heading="اختر التفسير">
              <CommandItem
                onSelect={() => {
                  onSelectTafsir("muyassar");
                  setTafsirOpen(false);
                }}
                className="cursor-pointer font-quran justify-between"
              >
                التفسير الميسر
                {tafsirId === "muyassar" && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onSelectTafsir("jalalayn");
                  setTafsirOpen(false);
                }}
                className="cursor-pointer font-quran justify-between"
              >
                تفسير الجلالين
                {tafsirId === "jalalayn" && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
