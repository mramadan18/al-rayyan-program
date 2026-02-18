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
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
          <Calculator className="w-6 h-6 text-amber-500" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold bg-linear-to-l from-foreground to-foreground/70 bg-clip-text text-transparent">
            حاسبة الزكاة الشرعية
          </CardTitle>
          <div className="flex items-center gap-2">
            <CardDescription className="text-muted-foreground">
              حساب دقيق لزكاة المال وزكاة الفطر
            </CardDescription>
            <div className="w-24">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-7 border-none bg-transparent hover:bg-amber-500/10 text-amber-500 font-bold focus:ring-0 text-xs shadow-none px-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {CURRENCIES.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      className="text-xs"
                    >
                      {c.value} ({c.label})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoadingGold}
          className="h-9 gap-2 border-amber-500/20 hover:bg-amber-500/5 hover:text-amber-500"
        >
          <RefreshCw
            className={cn("h-4 w-4", isLoadingGold && "animate-spin")}
          />
          {isLoadingGold ? "جاري التحديث..." : "تحديث السعر"}
        </Button>
      </div>
    </CardHeader>
  );
}
