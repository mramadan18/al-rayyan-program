import { PageLayout } from "@/components/layout/PageLayout";
import { ZakatCalculator } from "@/components/calculators/ZakatCalculator";

export default function ZakatPage() {
  return (
    <PageLayout title="حاسبة الزكاة">
      <div className="container mx-auto max-w-4xl">
        <ZakatCalculator />
      </div>
    </PageLayout>
  );
}
