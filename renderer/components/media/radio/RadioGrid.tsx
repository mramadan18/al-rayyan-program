import { Radio } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioStation } from "@/contexts/radio-context";
import { RadioCard } from "./RadioCard";

interface RadioGridProps {
  radios: RadioStation[];
  currentRadio: RadioStation | null;
  isPlaying: boolean;
  onSelect: (radio: RadioStation) => void;
}

export function RadioGrid({
  radios,
  currentRadio,
  isPlaying,
  onSelect,
}: RadioGridProps) {
  return (
    <ScrollArea className="flex-1 -mr-4 pr-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-32">
        {radios.map((radio) => (
          <RadioCard
            key={radio.id}
            radio={radio}
            isActive={currentRadio?.id === radio.id}
            isPlaying={isPlaying}
            onSelect={onSelect}
          />
        ))}

        {radios.length === 0 && (
          <div className="col-span-full h-60 flex flex-col items-center justify-center text-slate-500 gap-4">
            <Radio className="w-12 h-12 opacity-20" />
            <p>لا توجد إذاعات مطابقة لبحثك</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
