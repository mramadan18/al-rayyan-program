import { useState } from "react";
import {
  Calculator,
  DollarSign,
  Coins,
  TrendingUp,
  Users,
  Copy,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ZakatCalculator() {
  const [totalZakat, setTotalZakat] = useState(0);
  const [copied, setCopied] = useState(false);

  // Zakat Al-Maal State
  const [cash, setCash] = useState("");
  const [gold24, setGold24] = useState("");

  // Zakat Al-Fitr State
  const [familyMembers, setFamilyMembers] = useState("");
  const FITR_AMOUNT_PER_PERSON = 35; // Example amount (EGP/Neutral)

  const calculateMaal = () => {
    // Simple logic for demonstration (2.5%)
    const cashVal = parseFloat(cash) || 0;
    const result = cashVal * 0.025;
    setTotalZakat(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(totalZakat.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-card border-border shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Calculator className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">
                حاسبة الزكاة
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                احسب زكاتك بدقة وسهولة
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="maal"
            className="w-full"
            onValueChange={() => setTotalZakat(0)}
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted mb-6">
              <TabsTrigger
                value="maal"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                زكاة المال
              </TabsTrigger>
              <TabsTrigger
                value="fitr"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                زكاة الفطر
              </TabsTrigger>
            </TabsList>

            {/* Zakat Al-Maal Tab */}
            <TabsContent value="maal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cash" className="text-foreground">
                    إجمالي المبلغ النقدي
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cash"
                      placeholder="0.00"
                      className="pr-9 bg-background border-border focus-visible:ring-amber-500"
                      value={cash}
                      onChange={(e) => {
                        setCash(e.target.value);
                        // Instant calc
                        const cashVal = parseFloat(e.target.value) || 0;
                        setTotalZakat(cashVal * 0.025);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gold" className="text-foreground">
                    الذهب (جرام)
                  </Label>
                  <div className="relative">
                    <Coins className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="gold"
                      placeholder="0"
                      className="pr-9 bg-background border-border focus-visible:ring-amber-500"
                      value={gold24}
                      onChange={(e) => setGold24(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="text-foreground">
                    أصول تجارية
                  </Label>
                  <div className="relative">
                    <TrendingUp className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="business"
                      placeholder="0.00"
                      className="pr-9 bg-background border-border focus-visible:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Zakat Al-Fitr Tab */}
            <TabsContent value="fitr" className="space-y-6">
              <div className="space-y-4 max-w-md mx-auto py-4">
                <div className="space-y-2">
                  <Label htmlFor="members" className="text-foreground">
                    عدد أفراد الأسرة
                  </Label>
                  <div className="relative">
                    <Users className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="members"
                      type="number"
                      placeholder="1"
                      className="pr-9 bg-background border-border focus-visible:ring-amber-500 h-12 text-lg"
                      value={familyMembers}
                      onChange={(e) => {
                        setFamilyMembers(e.target.value);
                        const members = parseInt(e.target.value) || 0;
                        setTotalZakat(members * FITR_AMOUNT_PER_PERSON);
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    القيمة التقديرية للفرد:{" "}
                    <span className="text-amber-500 font-bold">
                      {FITR_AMOUNT_PER_PERSON} ج.م
                    </span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="bg-muted/30 p-6 border-t border-border flex flex-row items-center justify-between gap-4">
          <span className="text-muted-foreground text-sm font-medium">
            إجمالي الزكاة المستحقة
          </span>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono font-bold text-amber-500 tracking-tight">
              {totalZakat.toLocaleString("ar-EG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <Button
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 border-border bg-background hover:bg-muted transition-all",
                copied && "text-green-500 border-green-500/50",
              )}
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
