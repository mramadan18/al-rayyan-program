import { PageLayout } from "@/components/layout/PageLayout";
import { NextPrayerCard } from "@/components/home/NextPrayerCard";
import { DailyWirdCard } from "@/components/home/DailyWirdCard";
import { PrayerTimeline } from "@/components/home/PrayerTimeline";
import { usePrayerTimes } from "@/contexts/player-times";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { AdhanOverlay } from "@/components/home/AdhanOverlay";

export default function HomePage() {
  const { prayers, nextPrayer, data, loading, simulateAdhan } =
    usePrayerTimes();

  const hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-uma", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const gregorianDate = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  if (loading || !data) {
    return (
      <PageLayout title="الرئيسية" showTitle={false}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-primary text-xl font-bold">
            جاري التحميل...
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="الرئيسية" showTitle={false}>
      <AdhanOverlay />
      <div className="space-y-8 relative">
        <div className="flex justify-between items-center bg-card/50 p-4 rounded-2xl border border-border shadow-sm">
          <div>
            <h2 className="text-lg font-bold">محاكاة النظام</h2>
            <p className="text-sm text-muted-foreground">
              اختبر تنبيهات الأذان والتفاعلات
            </p>
          </div>
          <Button
            onClick={simulateAdhan}
            variant="outline"
            className="gap-2 border-primary/20 hover:bg-primary/5"
          >
            <Bell className="w-4 h-4" />
            تجربة صوت الأذان
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <NextPrayerCard
              prayerName={nextPrayer?.name || "..."}
              timeRemaining={nextPrayer?.remaining || "00:00:00"}
              location={`${data.metadata.city}، ${data.metadata.country}`}
              hijriDate={hijriDate}
              gregorianDate={gregorianDate}
            />
          </section>

          <section className="lg:col-span-1">
            <DailyWirdCard
              progress={40}
              surahName="سورة الكهف"
              verseNumber={45}
              onContinue={() => console.log("Continue reading...")}
            />
          </section>
        </div>

        <section>
          <PrayerTimeline prayers={prayers} />
        </section>
      </div>
    </PageLayout>
  );
}
