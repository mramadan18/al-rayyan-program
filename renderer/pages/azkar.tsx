import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
import { ZikrCard } from "@/components/azkar/ZikrCard";
import { Badge } from "@/components/ui/badge";
import { Sunrise, Sunset, BookOpen } from "lucide-react";
import azkarData from "@/public/data/azkar.json";
import { Zikr } from "@/types/azkar"; // Ensure this type is correct

export default function AzkarPage() {
  const [showTashkeel, setShowTashkeel] = useState(true);

  // Load Tashkeel preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showTashkeel");
      if (saved !== null) {
        setShowTashkeel(JSON.parse(saved));
      }
    }
  }, []);

  const toggleTashkeel = (checked: boolean) => {
    setShowTashkeel(checked);
    localStorage.setItem("showTashkeel", JSON.stringify(checked));
  };

  // Filter Azkar
  // Type 1: Morning
  // Type 2: Evening
  // Type 0: Both
  const morningAzkar = (azkarData as unknown as Zikr[]).filter(
    (z) => z.type === 1 || z.type === 0,
  );
  const eveningAzkar = (azkarData as unknown as Zikr[]).filter(
    (z) => z.type === 2 || z.type === 0,
  );
  const bothAzkar = (azkarData as unknown as Zikr[]).filter(
    (z) => z.type === 0,
  );

  return (
    <PageLayout title="الأذكار" showTitle={false}>
      <div className="space-y-6 pb-20">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold font-quran text-primary">
              حصن المسلم
            </h1>
            <p className="text-muted-foreground mt-1">
              أذكار الصباح والمساء من الكتاب والسنة
            </p>
          </div>

          <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg border">
            <div className="flex items-center gap-2">
              <Switch
                id="tashkeel-mode"
                checked={showTashkeel}
                onCheckedChange={toggleTashkeel}
              />
              <Label
                htmlFor="tashkeel-mode"
                className="cursor-pointer font-sans select-none"
              >
                التشكيل
              </Label>
            </div>
          </div>
        </header>

        {/* Tabs Section */}
        <Tabs defaultValue="morning" className="w-full" dir="rtl">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger
                value="morning"
                className="gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400"
              >
                <Sunrise className="h-4 w-4" />
                <span>الصباح</span>
              </TabsTrigger>
              <TabsTrigger
                value="evening"
                className="gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400"
              >
                <Sunset className="h-4 w-4" />
                <span>المساء</span>
              </TabsTrigger>
              <TabsTrigger
                value="both"
                className="gap-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-400"
              >
                <BookOpen className="h-4 w-4" />
                <span>مشتركة</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Morning Azkar */}
          <TabsContent
            value="morning"
            className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-200 bg-amber-50"
              >
                {morningAzkar.length} ذكر
              </Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {morningAzkar.map((zikr) => (
                <ZikrCard
                  key={`morning-${zikr.order}-${zikr.type}`}
                  zikr={zikr}
                  showTashkeel={showTashkeel}
                />
              ))}
            </div>
          </TabsContent>

          {/* Evening Azkar */}
          <TabsContent
            value="evening"
            className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="text-indigo-600 border-indigo-200 bg-indigo-50"
              >
                {eveningAzkar.length} ذكر
              </Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {eveningAzkar.map((zikr) => (
                <ZikrCard
                  key={`evening-${zikr.order}-${zikr.type}`}
                  zikr={zikr}
                  showTashkeel={showTashkeel}
                />
              ))}
            </div>
          </TabsContent>

          {/* Both/Common Azkar */}
          <TabsContent
            value="both"
            className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="text-slate-600 border-slate-200 bg-slate-50"
              >
                {bothAzkar.length} ذكر
              </Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {bothAzkar.map((zikr) => (
                <ZikrCard
                  key={`both-${zikr.order}-${zikr.type}`}
                  zikr={zikr}
                  showTashkeel={showTashkeel}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
