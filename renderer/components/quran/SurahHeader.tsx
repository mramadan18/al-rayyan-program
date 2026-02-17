import { motion } from "framer-motion";

interface SurahHeaderProps {
  surahName?: string;
  surahNumber: number;
}

export function SurahHeader({ surahName, surahNumber }: SurahHeaderProps) {
  const showBasmala = surahNumber !== 1 && surahNumber !== 9;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-2 space-y-3"
    >
      <h1 className="text-2xl md:text-4xl font-bold text-black/80 dark:text-white/90 font-quran drop-shadow-sm leading-relaxed">
        {surahName}
      </h1>

      {showBasmala && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative py-4 px-4 flex flex-col items-center"
        >
          <div className="relative flex flex-col items-center space-y-3">
            {/* Top Ornament */}
            <div className="text-primary/30">
              <svg
                width="80"
                height="15"
                viewBox="0 0 120 20"
                fill="currentColor"
              >
                <path d="M0 10 Q30 0 60 10 Q90 20 120 10 Q90 0 60 10 Q30 20 0 10" />
              </svg>
            </div>

            <h2 className="font-quran text-3xl md:text-4xl text-primary/80 dark:text-primary/70 selection:bg-primary/20 leading-tight">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </h2>

            {/* Bottom Ornament */}
            <div className="text-primary/30 rotate-180">
              <svg
                width="80"
                height="15"
                viewBox="0 0 120 20"
                fill="currentColor"
              >
                <path d="M0 10 Q30 0 60 10 Q90 20 120 10 Q90 0 60 10 Q30 20 0 10" />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
