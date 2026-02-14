import { PageLayout } from "@/components/layout/PageLayout";
import { NextPrayerCard } from "@/components/home/NextPrayerCard";
import { DailyWirdCard } from "@/components/home/DailyWirdCard";
import { PrayerTimeline, PrayerTime } from "@/components/home/PrayerTimeline";

const PRATER_TIMES: PrayerTime[] = [
  { name: "الفجر", time: "05:12 ص", status: "passed" },
  { name: "الظهر", time: "12:30 م", status: "passed" },
  { name: "العصر", time: "03:45 م", status: "passed" },
  { name: "المغرب", time: "06:15 م", status: "active" },
  { name: "العشاء", time: "07:45 م", status: "upcoming" },
];

export default function HomePage() {
  return (
    <PageLayout title="الرئيسية" showTitle={false}>
      <div className="space-y-8">
        {/* Helper Grid for Hero and Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Section - Next Prayer */}
          <section className="lg:col-span-2">
            <NextPrayerCard
              prayerName="المغرب"
              timeRemaining="02:45:10"
              location="القاهرة، مصر"
              hijriDate="14 رجب 1447 هـ"
              gregorianDate="14 فبراير 2026 م"
            />
          </section>

          {/* Side Section - Daily Wird */}
          <section className="lg:col-span-1">
            <DailyWirdCard
              progress={40}
              surahName="سورة الكهف"
              verseNumber={45}
              onContinue={() => console.log("Continue reading...")}
            />
          </section>
        </div>

        {/* Prayer Timeline Section */}
        <section>
          <PrayerTimeline prayers={PRATER_TIMES} />
        </section>
      </div>
    </PageLayout>
  );
}
