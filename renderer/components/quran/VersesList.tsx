import { motion } from "framer-motion";
import { VerseItem } from "./VerseItem";
import { getVerseText } from "@/lib/quranUtils";

interface VersesListProps {
  surahData: any;
  currentSurahNumber: number;
  currentVerseIndex: number;
  handlePlayVerse: (index: number) => void;
  handlePlayFromVerse: (index: number) => void;
  handleMarkAsCurrentVerse: (index: number) => void;
  handleShowTafsir: (verse: any, numberInSurah: number) => void;
}

export function VersesList({
  surahData,
  currentSurahNumber,
  currentVerseIndex,
  handlePlayVerse,
  handlePlayFromVerse,
  handleMarkAsCurrentVerse,
  handleShowTafsir,
}: VersesListProps) {
  return (
    <motion.div
      className="text-center leading-[3] px-2 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {surahData?.ayahs.map((verse: any, idx: number) => (
        <VerseItem
          key={verse.number}
          verse={{
            id: verse.number,
            text: getVerseText(verse.text, currentSurahNumber, idx),
            number: verse.numberInSurah,
          }}
          isActive={currentVerseIndex === idx}
          onPlayVerse={() => handlePlayVerse(idx)}
          onPlayFromVerse={() => handlePlayFromVerse(idx)}
          onMarkAsCurrentVerse={() => handleMarkAsCurrentVerse(idx)}
          onShowTafsir={() => handleShowTafsir(verse, verse.numberInSurah)}
        />
      ))}
    </motion.div>
  );
}
