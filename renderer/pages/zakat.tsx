import { PageLayout } from "@/components/layout/PageLayout";
import { ZakatCalculator } from "@/components/calculators/ZakatCalculator";

export default function ZakatPage() {
  return (
    <PageLayout title="حاسبة الزكاة">
      <ZakatCalculator />
    </PageLayout>
  );
}
