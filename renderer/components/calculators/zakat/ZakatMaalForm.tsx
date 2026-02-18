import { DollarSign, Coins, TrendingUp, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GOLD_NISAB_GRAMS } from "@/lib/zakat-utils";

interface ZakatMaalFormProps {
  cash: string;
  setCash: (v: string) => void;
  goldGrams: string;
  setGoldGrams: (v: string) => void;
  businessAssets: string;
  setBusinessAssets: (v: string) => void;
  currency: string;
  nisabStatus: boolean;
  goldPrice: number;
  isMounted: boolean;
}

export function ZakatMaalForm({
  cash,
  setCash,
  goldGrams,
  setGoldGrams,
  businessAssets,
  setBusinessAssets,
  currency,
  nisabStatus,
  goldPrice,
  isMounted,
}: ZakatMaalFormProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cash" className="text-foreground font-medium">
            السيولة النقدية ({currency})
          </Label>
          <div className="relative group">
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            <Input
              id="cash"
              type="number"
              placeholder="0.00"
              className="pr-10 h-11 bg-background border-border focus-visible:ring-amber-500 transition-shadow"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gold" className="text-foreground font-medium">
            الذهب (جرام عيار 24)
          </Label>
          <div className="relative group">
            <Coins className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            <Input
              id="gold"
              type="number"
              placeholder="0"
              className="pr-10 h-11 bg-background border-border focus-visible:ring-amber-500 transition-shadow"
              value={goldGrams}
              onChange={(e) => setGoldGrams(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="business" className="text-foreground font-medium">
            عروض التجارة / أصول تجارية ({currency})
          </Label>
          <div className="relative group">
            <TrendingUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" />
            <Input
              id="business"
              type="number"
              placeholder="0.00"
              className="pr-10 h-11 bg-background border-border focus-visible:ring-amber-500 transition-shadow"
              value={businessAssets}
              onChange={(e) => setBusinessAssets(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "p-4 rounded-xl border flex items-start gap-3 transition-colors",
          nisabStatus
            ? "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200"
            : "bg-muted/50 border-border text-muted-foreground",
        )}
      >
        <Info className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">
            {nisabStatus ? "مالك بلغ النصاب" : "مالك لم يبلغ النصاب بعد"}
          </p>
          <p className="opacity-80">
            نصاب الذهب الحالي ({GOLD_NISAB_GRAMS} جرام):{" "}
            <span className="font-mono font-bold">
              {isMounted
                ? (goldPrice * GOLD_NISAB_GRAMS).toLocaleString()
                : "---"}{" "}
              {currency}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
