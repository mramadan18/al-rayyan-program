/**
 * Helper function to remove Bismillah from the first verse of a surah
 * (except for Al-Fatiha)
 */
export const getVerseText = (
  verseText: string,
  surahNumber: number,
  verseIndex: number,
) => {
  if (surahNumber !== 1 && verseIndex === 0) {
    const bismillahRegex = /^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَـٰنِ\s+ٱلرَّحِيمِ\s*/;
    const bismillahRegexSimple =
      /^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/;

    let cleanedText = verseText
      .replace(bismillahRegex, "")
      .replace(bismillahRegexSimple, "")
      .trim();

    // Secondary check for partial Bismillah
    if (
      cleanedText.startsWith("بِسْمِ") &&
      !cleanedText.includes("ٱلْحَمْدُ لِلَّهِ")
    ) {
      const words = cleanedText.split(/\s+/);
      if (
        words.length >= 4 &&
        (words[0].includes("بِسْمِ") || words[1].includes("اللَّه"))
      ) {
        cleanedText = words.slice(4).join(" ").trim();
      }
    }
    return cleanedText;
  }

  return verseText;
};
