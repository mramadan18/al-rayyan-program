import { useState, useEffect } from "react";
import axios from "axios";

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export function useSurahList() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_QURAN_API;
        const response = await axios.get(`${apiUrl}/surah`);
        setSurahs(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching Surah list:", err);
        setError("Failed to load Surah list");
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  return { surahs, loading, error };
}
