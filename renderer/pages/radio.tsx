import { PageLayout } from "@/components/layout/PageLayout";
import { RadioModule } from "@/components/media/RadioModule";

export default function RadioPage() {
  return (
    <PageLayout title="الإذاعة">
      <div className="container mx-auto max-w-7xl h-full py-6">
        <RadioModule />
      </div>
    </PageLayout>
  );
}
