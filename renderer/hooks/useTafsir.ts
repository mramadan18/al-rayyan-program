import { useState, useEffect } from "react";
import axios from "axios";

export interface TafsirData {
  [key: number]: string;
}

export function useTafsir(
  surahNumber: number,
  tafsirId: "muyassar" | "jalalayn" = "muyassar",
) {
  const [tafsirData, setTafsirData] = useState<TafsirData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surahNumber) return;

    const fetchTafsir = async () => {
      try {
        console.log(`Fetching tafsir: ${tafsirId} for surah: ${surahNumber}`);
        setLoading(true);
        const fileName =
          tafsirId === "muyassar" ? "ar.muyassar.xml" : "ar.jalalayn.xml";

        // Use axios to fetch the XML file from the public directory
        const response = await axios.get(`/data/${fileName}`, {
          params: { t: Date.now() }, // Cache buster
          responseType: "text",
        });

        const xmlText = response.data;
        console.log(`XML loaded via axios, length: ${xmlText.length}`);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        // Handle parsing errors
        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
          console.error("XML Parse Error:", parseError[0].textContent);
          throw new Error("Failed to parse Tafsir XML");
        }

        const suraNodes = xmlDoc.getElementsByTagName("sura");
        let suraNode = null;
        for (let i = 0; i < suraNodes.length; i++) {
          if (suraNodes[i].getAttribute("index") === surahNumber.toString()) {
            suraNode = suraNodes[i];
            break;
          }
        }

        if (!suraNode) {
          console.warn(`Sura ${surahNumber} not found in XML`);
          setError("Surah not found in Tafsir");
          setTafsirData(null);
          return;
        }

        const ayaNodes = suraNode.getElementsByTagName("aya");
        console.log(`Found ${ayaNodes.length} ayahs for sura ${surahNumber}`);
        const data: TafsirData = {};
        for (let i = 0; i < ayaNodes.length; i++) {
          const aya = ayaNodes[i];
          const index = parseInt(aya.getAttribute("index") || "0");
          const text = aya.getAttribute("text") || "";
          if (index) {
            data[index] = text;
          }
        }

        setTafsirData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading tafsir:", err);
        setError("Failed to load Tafsir");
      } finally {
        setLoading(false);
      }
    };

    fetchTafsir();
  }, [surahNumber, tafsirId]);

  return { tafsirData, loading, error };
}
