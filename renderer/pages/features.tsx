import React from "react";
import Head from "next/head";
import { Calculator, Activity, DollarSign, Coins, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FeaturesPage() {
  return (
    <React.Fragment>
      <Head>
        <title>الريّان - المرافق</title>
      </Head>

      <div className="container mx-auto p-6 space-y-8 max-w-5xl">
        <h1 className="text-3xl font-bold font-quran mb-6 border-b pb-4">
          المرافق والأدوات
        </h1>

        <Tabs defaultValue="zakat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="zakat">حاسبة الزكاة</TabsTrigger>
            <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
          </TabsList>

          {/* Zakat Calculator Tab */}
          <TabsContent value="zakat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  حاسبة الزكاة الشرعية
                </CardTitle>
                <CardDescription>
                  احسب زكاة مالك بناءً على سعر الذهب والفضة الحالي.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gold">عيار الذهب (جرام)</Label>
                    <div className="relative">
                      <Coins className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="gold" placeholder="0" className="pr-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="silver">الفضة (جرام)</Label>
                    <div className="relative">
                      <Coins className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="silver" placeholder="0" className="pr-9" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cash">
                      السيولة النقدية (العملة المحلية)
                    </Label>
                    <div className="relative">
                      <Wallet className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cash"
                        placeholder="0.00"
                        className="pr-9 text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Result Card */}
                <div className="mt-8 bg-green-900/10 dark:bg-green-900/20 border border-green-500/20 rounded-xl p-6 text-center">
                  <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                    مقدار الزكاة المستحق
                  </h3>
                  <div className="text-4xl font-bold text-green-800 dark:text-green-300 font-mono">
                    2,500 <span className="text-lg">ج.م</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">حساب الزكاة</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  إحصائيات الاستمرارية
                </CardTitle>
                <CardDescription>
                  تتبع أيام قراءة الورد اليومي والأذكار
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Heatmap Grid */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>فبراير 2026</span>
                    <span className="flex gap-2 text-xs items-center">
                      أقل
                      <span className="w-3 h-3 bg-muted rounded-sm" />
                      <span className="w-3 h-3 bg-primary/40 rounded-sm" />
                      <span className="w-3 h-3 bg-primary rounded-sm" />
                      أكثر
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                    {Array.from({ length: 30 }).map((_, i) => {
                      // Mock data visualization
                      // 0: msg-muted (missed), 1: primary/40 (partial), 2: primary (complete)
                      const level =
                        Math.random() > 0.6 ? 2 : Math.random() > 0.3 ? 1 : 0;
                      const colorClass =
                        level === 2
                          ? "bg-primary shadow-sm ring-1 ring-primary/50"
                          : level === 1
                            ? "bg-primary/40"
                            : "bg-muted hover:bg-muted/80";

                      return (
                        <div
                          key={i}
                          className={cn(
                            "w-4 h-4 rounded-sm transition-colors cursor-pointer",
                            colorClass,
                          )}
                          title={`Day ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </React.Fragment>
  );
}
