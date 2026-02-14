import { Moon, Sunrise, Sunset, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { AzkarCategoryCard } from "@/components/azkar/AzkarCategoryCard";
import { RandomZikr } from "@/components/azkar/RandomZikr";

const AZKAR_CATEGORIES = [
  {
    id: "morning",
    title: "أذكار الصباح",
    icon: Sunrise,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    count: 24,
  },
  {
    id: "evening",
    title: "أذكار المساء",
    icon: Sunset,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    count: 22,
  },
  {
    id: "prayer",
    title: "أذكار الصلاة",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    count: 15,
  },
  {
    id: "sleeping",
    title: "أذكار النوم",
    icon: Moon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    count: 12,
  },
];

export default function AzkarPage() {
  return (
    <PageLayout title="الأذكار" showTitle={false}>
      <header className="flex items-center justify-between border-b pb-4 mb-8">
        <h1 className="text-3xl font-bold font-quran">حصن المسلم</h1>
        <Badge variant="outline" className="px-3 py-1 font-sans">
          ذكرك حصنك
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {AZKAR_CATEGORIES.map((category) => (
          <AzkarCategoryCard
            key={category.id}
            category={category}
            onClick={() => console.log(`Category ${category.id} clicked`)}
          />
        ))}
      </div>

      <RandomZikr
        text="لَا إلَهَ إلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ"
        merit="من قالها في يوم مائة مرة كانت له عدل عشر رقاب، وكتبت له مائة حسنة..."
      />
    </PageLayout>
  );
}
