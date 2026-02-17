import { PageLayout } from "@/components/layout/PageLayout";
import { LiveRadioPlayer } from "@/components/media/LiveRadioPlayer";

export default function RadioPage() {
  return (
    <PageLayout title="الإذاعة">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-amber-500 mb-4">
          إذاعة القرآن الكريم
        </h1>
        <div className="flex justify-center">
          <LiveRadioPlayer />
        </div>
      </div>
    </PageLayout>
  );
}
