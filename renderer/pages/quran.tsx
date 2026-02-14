import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { VerseItem } from "@/components/quran/VerseItem";
import { AudioPlayer } from "@/components/quran/AudioPlayer";

// Placeholder Verses Data
const VERSES = [
  { id: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", number: 1 },
  { id: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", number: 2 },
  { id: 3, text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", number: 3 },
  { id: 4, text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", number: 4 },
  { id: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", number: 5 },
  { id: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", number: 6 },
  {
    id: 7,
    text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    number: 7,
  },
];

export default function QuranPage() {
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    <PageLayout
      title="المصحف"
      showTitle={false}
      className="bg-quran-paper"
      containerClassName="py-20 flex flex-col items-center"
    >
      {/* Quran Text Area */}
      <div className="max-w-3xl w-full px-8 text-center space-y-12">
        <h1 className="text-4xl font-bold text-black/80 mb-12 font-quran">
          سورة الفاتحة
        </h1>

        <div className="space-y-8 leading-loose">
          {VERSES.map((verse) => (
            <VerseItem
              key={verse.id}
              verse={verse}
              isActive={activeVerse === verse.id}
              onMouseEnter={() => setActiveVerse(verse.id)}
              onMouseLeave={() => setActiveVerse(null)}
            />
          ))}
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        progress={progress}
        onProgressChange={setProgress}
        reciterName="الشيخ مشاري العفاسي"
        durationLabel="04:33 / 12:45"
      />
    </PageLayout>
  );
}
