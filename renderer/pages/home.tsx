import { PageLayout } from "@/components/layout/PageLayout";
import { NextPrayerCard } from "@/components/home/NextPrayerCard";
import { QuranCompletionCard } from "@/components/home/QuranCompletionCard";
import { PrayerTimeline } from "@/components/home/PrayerTimeline";
import { usePrayerTimes } from "@/contexts/player-times";
import { useQuranCompletion } from "@/hooks/useQuranCompletion";
import { useRouter } from "next/router";
import { NetworkErrorBanner } from "@/components/common/NetworkErrorBanner";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { prayers, nextPrayer, data, loading, error } = usePrayerTimes();
  const { completionState, loading: completionLoading } = useQuranCompletion();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const adjustedDate = new Date();
  adjustedDate.setDate(adjustedDate.getDate() - 1);

  const hijriDate = !mounted
    ? ""
    : new Intl.DateTimeFormat("ar-SA-u-ca-islamic-uma", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(adjustedDate);

  const gregorianDate = !mounted
    ? ""
    : new Intl.DateTimeFormat("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());

  const handleContinueReading = () => {
    // Navigate to Quran page - it will automatically load the last read position
    router.push("/quran");
  };

  // If not mounted, you can still return the structure but with placeholders
  // to avoid large structural shifts, or just return the skeleton state.

  return (
    <PageLayout title="الرئيسية" showTitle={false}>
      <div className="space-y-8 relative">
        <NetworkErrorBanner hasApiError={!!error && !data} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <NextPrayerCard
              prayerName={nextPrayer?.name || "..."}
              timeRemaining={nextPrayer?.remaining || "00:00:00"}
              location={
                data
                  ? `${data.metadata.city}، ${data.metadata.country}`
                  : "جاري تحديد الموقع..."
              }
              hijriDate={hijriDate}
              gregorianDate={gregorianDate}
              loading={loading && !data}
            />
          </section>

          <section className="lg:col-span-1">
            {completionLoading ? (
              <div className="h-full min-h-[150px] bg-card animate-pulse rounded-2xl" />
            ) : (
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
          <PrayerTimeline prayers={prayers} loading={loading && !data} />
        </section>
      </div>
    </PageLayout>
  );
}
