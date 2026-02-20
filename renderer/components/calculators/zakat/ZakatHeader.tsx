import { Calculator, RefreshCw } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ZakatHeaderProps {
  currency: string;
  setCurrency: (currency: string) => void;
  isLoadingGold: boolean;
  onRefresh: () => void;
}

const CURRENCIES = [
  { label: "جنية مصري", value: "ج.م" },
  { label: "ريال سعودي", value: "ر.س" },
  { label: "درهم إماراتي", value: "د.إ" },
  { label: "دولار أمريكي", value: "$" },
];

export function ZakatHeader({
  currency,
  setCurrency,
  isLoadingGold,
  onRefresh,
}: ZakatHeaderProps) {
  return (
    <CardHeader className="relative pb-4">
      <div className="flex flex-wrap items-center justify-between gap-14">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-[200px]">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl font-bold bg-linear-to-l from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
              حاسبة الزكاة الشرعية
            </CardTitle>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <CardDescription className="text-muted-foreground text-[10px] sm:text-xs">
                حساب دقيق لزكاة المال وزكاة الفطر
              </CardDescription>
              <div className="w-16 sm:w-20">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="h-6 sm:h-7 border-none bg-transparent hover:bg-amber-500/10 text-amber-500 font-bold focus:ring-0 text-[10px] sm:text-xs shadow-none px-1 sm:px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {CURRENCIES.map((c) => (
                      <SelectItem
                        key={c.value}
                        value={c.value}
                        className="text-[10px] sm:text-xs"
                      >
                        {c.value} ({c.label})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoadingGold}
          className="h-8 sm:h-9 gap-2 border-amber-500/20 hover:bg-amber-500/5 hover:text-amber-500 w-full sm:w-auto justify-center sm:justify-start"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5 sm:h-4 sm:w-4",
              isLoadingGold && "animate-spin",
            )}
          />
          <span className="text-xs sm:text-sm">
            {isLoadingGold ? "جاري التحديث..." : "تحديث السعر"}
          </span>
        </Button>
      </div>
    </CardHeader>
  );
}
