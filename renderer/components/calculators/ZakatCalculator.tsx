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
  const [silver, setSilver] = useState("");

  // Zakat Al-Fitr State
  const [familyMembers, setFamilyMembers] = useState("");
  const FITR_AMOUNT_PER_PERSON = 15; // Example amount

  const calculateMaal = () => {
    // Simple logic for demonstration (2.5%)
    const cashVal = parseFloat(cash) || 0;
    const result = cashVal * 0.025;
    setTotalZakat(result);
  };

  const calculateFitr = () => {
    const members = parseInt(familyMembers) || 0;
    setTotalZakat(members * FITR_AMOUNT_PER_PERSON);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(totalZakat.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Calculator className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-100">
                Zakat Calculator
              </CardTitle>
              <CardDescription className="text-slate-400">
                Calculate your obligations accurately
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
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 mb-6">
              <TabsTrigger
                value="maal"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950"
              >
                Zakat Al-Maal
              </TabsTrigger>
              <TabsTrigger
                value="fitr"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950"
              >
                Zakat Al-Fitr
              </TabsTrigger>
            </TabsList>

            {/* Zakat Al-Maal Tab */}
            <TabsContent value="maal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cash" className="text-slate-300">
                    Cash Amount
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="cash"
                      placeholder="0.00"
                      className="pl-9 bg-slate-950 border-slate-800 focus-visible:ring-amber-500"
                      value={cash}
                      onChange={(e) => {
                        setCash(e.target.value);
                        calculateMaal();
                      }} // Instant calc for demo
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gold" className="text-slate-300">
                    Gold (grams)
                  </Label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="gold"
                      placeholder="0"
                      className="pl-9 bg-slate-950 border-slate-800 focus-visible:ring-amber-500"
                      value={gold24}
                      onChange={(e) => setGold24(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business" className="text-slate-300">
                    Business Assets
                  </Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="business"
                      placeholder="0.00"
                      className="pl-9 bg-slate-950 border-slate-800 focus-visible:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Zakat Al-Fitr Tab */}
            <TabsContent value="fitr" className="space-y-6">
              <div className="space-y-4 max-w-md mx-auto py-4">
                <div className="space-y-2">
                  <Label htmlFor="members" className="text-slate-300">
                    Number of Family Members
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      id="members"
                      type="number"
                      placeholder="1"
                      className="pl-9 bg-slate-950 border-slate-800 focus-visible:ring-amber-500 h-12 text-lg"
                      value={familyMembers}
                      onChange={(e) => {
                        setFamilyMembers(e.target.value);
                        // Trigger calc handled by effect or simple logic here
                        const members = parseInt(e.target.value) || 0;
                        setTotalZakat(members * FITR_AMOUNT_PER_PERSON);
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Estimated amount per person:{" "}
                    <span className="text-amber-500 font-bold">
                      ${FITR_AMOUNT_PER_PERSON}
                    </span>
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="bg-slate-950/50 p-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-slate-400 text-sm font-medium">
            Total Zakat Payable
          </span>
          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono font-bold text-amber-500 tracking-tight">
              $
              {totalZakat.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <Button
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 border-slate-700 bg-slate-800 hover:bg-slate-700 transition-all",
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
