import { useState, useEffect } from "react";
import { DollarSign, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useZakatCalculator, TabValue } from "@/hooks/useZakatCalculator";
import { ZakatHeader } from "./zakat/ZakatHeader";
import { ZakatMaalForm } from "./zakat/ZakatMaalForm";
import { ZakatFitrForm } from "./zakat/ZakatFitrForm";
import { ZakatFooter } from "./zakat/ZakatFooter";

export function ZakatCalculator() {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    activeTab,
    setActiveTab,
    totalZakat,
    isLoadingGold,
    goldPrice,
    loadGoldPrice,
    currency,
    setCurrency,
    cash,
    setCash,
    goldGrams,
    setGoldGrams,
    businessAssets,
    setBusinessAssets,
    nisabStatus,
    totalWealth,
    familyMembers,
    setFamilyMembers,
    fitrAmount,
    setFitrAmount,
  } = useZakatCalculator();

  const handleCopy = () => {
    navigator.clipboard.writeText(totalZakat.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-in fade-in duration-500">
      <Card className="bg-card border-border shadow-2xl overflow-hidden">
        <ZakatHeader
          currency={currency}
          setCurrency={setCurrency}
          isLoadingGold={isLoadingGold}
          onRefresh={loadGoldPrice}
        />

        <CardContent>
          <Tabs
            defaultValue="fitr"
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as TabValue)}
            className="w-full"
            dir="rtl"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 mb-8 rounded-xl h-12">
              <TabsTrigger
                value="fitr"
                className="rounded-lg transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <Users className="w-4 h-4 ml-2" />
                زكاة الفطر
              </TabsTrigger>
              <TabsTrigger
                value="maal"
                className="rounded-lg transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <DollarSign className="w-4 h-4 ml-2" />
                زكاة المال
              </TabsTrigger>
            </TabsList>

            <TabsContent value="maal">
              <ZakatMaalForm
                cash={cash}
                setCash={setCash}
                goldGrams={goldGrams}
                setGoldGrams={setGoldGrams}
                businessAssets={businessAssets}
                setBusinessAssets={setBusinessAssets}
                currency={currency}
                nisabStatus={nisabStatus}
                goldPrice={goldPrice}
                isMounted={isMounted}
              />
            </TabsContent>

            <TabsContent value="fitr">
              <ZakatFitrForm
                familyMembers={familyMembers}
                setFamilyMembers={setFamilyMembers}
                fitrAmount={fitrAmount}
                setFitrAmount={setFitrAmount}
                currency={currency}
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        <ZakatFooter
          activeTab={activeTab}
          totalZakat={totalZakat}
          totalWealth={totalWealth}
          goldPrice={goldPrice}
          currency={currency}
          isMounted={isMounted}
          onCopy={handleCopy}
          copied={copied}
        />
      </Card>
    </div>
  );
}
