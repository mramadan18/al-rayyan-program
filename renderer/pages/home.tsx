import { PageLayout } from "@/components/layout/PageLayout";
import { NextPrayerCard } from "@/components/home/NextPrayerCard";
import { QuranCompletionCard } from "@/components/home/QuranCompletionCard";
import { PrayerTimeline } from "@/components/home/PrayerTimeline";
import { usePrayerTimes } from "@/contexts/player-times";
import { useQuranCompletion } from "@/hooks/useQuranCompletion";
import { useRouter } from "next/router";

export default function HomePage() {
  const { prayers, nextPrayer, data, loading } = usePrayerTimes();
  const { completionState, loading: completionLoading } = useQuranCompletion();
  const router = useRouter();

  const adjustedDate = new Date();
  adjustedDate.setDate(adjustedDate.getDate() - 1);

  const hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-uma", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(adjustedDate);

  const gregorianDate = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handleContinueReading = () => {
    // Navigate to Quran page - it will automatically load the last read position
    router.push("/quran");
  };

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
      <div className="space-y-8 relative">
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
            {!completionLoading && (
              <QuranCompletionCard
                progress={completionState.progress}
                surahName={completionState.surahName}
                verseNumber={completionState.verseNumber}
                onContinue={handleContinueReading}
              />
            )}
          </section>
        </div>

        <section>
          <PrayerTimeline prayers={prayers} />
        </section>
      </div>
    </PageLayout>
  );
}
