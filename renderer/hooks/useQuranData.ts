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

export function useQuranData(surahNumber: number = 1) {
  const [data, setData] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        // Using Al-Afasy recitation as default
        const response = await axios.get(
          `http://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`,
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
  }, [surahNumber]);

  return { data, loading, error };
}
