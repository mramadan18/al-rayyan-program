import { Copy, Check } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZakatFooterProps {
  activeTab: "maal" | "fitr";
  totalZakat: number;
  totalWealth: number;
  goldPrice: number;
  currency: string;
  isMounted: boolean;
  onCopy: () => void;
  copied: boolean;
}

export function ZakatFooter({
  activeTab,
  totalZakat,
  totalWealth,
  goldPrice,
  currency,
  isMounted,
  onCopy,
  copied,
}: ZakatFooterProps) {
  return (
    <CardFooter className="bg-muted/30 p-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
      <div className="flex flex-col gap-1 w-full md:w-auto text-center md:text-right">
        <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
          {activeTab === "maal"
            ? "إجمالي الزكاة المستحقة"
            : "إجمالي زكاة الفطر"}
        </span>
        <div className="flex items-center justify-center md:justify-start gap-4">
          <span className="text-4xl font-mono font-bold text-amber-500 tracking-tighter">
            {isMounted
              ? totalZakat.toLocaleString("ar-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}
          </span>
          <span className="text-amber-500 font-bold">{currency}</span>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "h-10 w-10 transition-all hover:bg-amber-500/10",
              copied && "text-green-500",
            )}
            onClick={onCopy}
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-start gap-2 text-xs text-muted-foreground w-full md:w-auto">
        {activeTab === "maal" && (
          <p className="bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/10">
            إجمالي الثروة:{" "}
            <span className="font-bold text-foreground">
              {isMounted ? totalWealth.toLocaleString() : "---"} {currency}
            </span>
          </p>
        )}
        <p className="italic opacity-80">
          * تم الحساب بناءً على سعر الذهب اليوم:{" "}
          <span className="text-amber-600 font-bold">
            {isMounted ? goldPrice.toLocaleString() : "---"} {currency}
          </span>{" "}
          للجرام
        </p>
      </div>
    </CardFooter>
  );
}
