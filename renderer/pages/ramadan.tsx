import { PageLayout } from "@/components/layout/PageLayout";
import { RamadanImsakia } from "@/components/ramadan/RamadanImsakia";

export default function RamadanPage() {
  return (
    <PageLayout title="إمساكية رمضان" showTitle={false}>
      <div className="container mx-auto max-w-5xl h-[calc(100vh-100px)]">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">
          رمضان ١٤٤٧ هـ
        </h1>
        <RamadanImsakia />
      </div>
    </PageLayout>
  );
}
