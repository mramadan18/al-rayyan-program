import { useState, useEffect } from "react";
import axios from "axios";

export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio: string; // URL to audio file
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Verse[];
}

// Default reciter is Al-Afasy
export function useQuranData(
  surahNumber: number = 1,
  reciterId: string = "ar.alafasy",
) {
  const [data, setData] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_QURAN_API;
        const response = await axios.get(
          `${apiUrl}/surah/${surahNumber}/${reciterId}`,
        );
        setData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching Quran data:", err);
        setError("Failed to load Surah data");
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber, reciterId]);

  return { data, loading, error };
}
