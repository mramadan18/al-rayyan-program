import { PageLayout } from "@/components/layout/PageLayout";
import { RadioModule } from "@/components/media/RadioModule";
import { useRadioContext } from "@/contexts/radio-context";

export default function RadioPage() {
  const { currentRadio } = useRadioContext();

  const dynamicTitle = currentRadio ? currentRadio.name : "الإذاعة";

  return (
    <PageLayout title={dynamicTitle}>
      <div className="container mx-auto max-w-7xl h-full py-6">
        <RadioModule />
      </div>
    </PageLayout>
  );
}
