import { PageLayout } from "@/components/layout/PageLayout";
import { RadioModule } from "@/components/media/RadioModule";
import { useRadioContext } from "@/contexts/radio-context";

export default function RadioPage() {
  const { currentRadio } = useRadioContext();

  const dynamicTitle = currentRadio ? currentRadio.name : "الإذاعة";

  return (
    <PageLayout 
      title={dynamicTitle}
      containerClassName="p-0 flex flex-col h-full w-full overflow-hidden"
    >
      <div className="flex-1 w-full px-4 md:px-8 py-4 overflow-hidden">
        <RadioModule />
      </div>
    </PageLayout>
  );
}
