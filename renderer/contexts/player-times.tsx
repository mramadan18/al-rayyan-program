import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { IpcChannels } from "shared/constants";

// --- Types & Interfaces ---
interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerMetadata {
  city: string;
  country: string;
  timezone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface PrayerTimesData {
  metadata: PrayerMetadata;
  timings: PrayerTimings;
}

interface PlayerTimesContextType {
  data: PrayerTimesData | null;
  loading: boolean;
  error: string | null;
  nextPrayer: {
    name: string;
    time: string;
    remaining: string;
  } | null;
  prayers: Array<{
    name: string;
    englishName: string;
    time: string;
    status: "passed" | "active" | "upcoming";
  }>;
  selectedAdhan: string;
  setSelectedAdhan: (path: string) => void;
}

// --- Constants & Utilities ---
const PRAYER_NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const OBLIGATORY_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const formatTime = (time24: string) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  const h12 = hours % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

// --- Context Definition ---
const PrayerTimesContext = createContext<PlayerTimesContextType | null>(null);

export const PlayerTimesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPrayer, setNextPrayer] =
    useState<PlayerTimesContextType["nextPrayer"]>(null);
  const [prayers, setPrayers] = useState<PlayerTimesContextType["prayers"]>([]);
  const [selectedAdhan, setSelectedAdhanState] = useState(
    "/audio/adhan/adhan-1.mp3",
  );

  // 1. Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await window.ipc.invoke("store-get", "selected-adhan");
        if (saved) setSelectedAdhanState(saved as string);
      } catch (err) {
        console.error("Error loading adhan setting:", err);
      }
    };
    loadSettings();
  }, []);

  // 2. Fetch prayer times
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://al-rayyan.mramadan.me/api/v1/prayer-times",
      );
      setData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching prayer times:", err);
      setError("Failed to fetch prayer times");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. Sync with Main Process
  useEffect(() => {
    if (data?.timings) {
      window.ipc.send("update-prayer-times", {
        timings: data.timings,
        adhan: selectedAdhan,
      });
    }
  }, [data, selectedAdhan]);

  // 4. Global Audio Listener (Pre-Adhan etc.)
  useEffect(() => {
    if (!window.ipc) return;

    const handlePlayAudio = (path: string) => {
      const audio = new Audio(path);
      audio.play().catch((err) => console.error("Audio playback error:", err));
    };

    const removeListener = window.ipc.on("play-audio", handlePlayAudio);
    return () => removeListener();
  }, []);

  // 5. Prayer Status Calculation
  const calculateStatus = useCallback(() => {
    if (!data) return;

    const now = new Date();
    const timings = data.timings;

    const prayerList = Object.entries(timings)
      .filter(([name]) => OBLIGATORY_PRAYERS.includes(name))
      .map(([name, time]) => {
        const [hours, minutes] = time.split(":").map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);

        return {
          englishName: name,
          name: PRAYER_NAMES[name],
          time: formatTime(time),
          date: prayerDate,
        };
      });

    // Find current active index
    let activeIndex = -1;
    for (let i = 0; i < prayerList.length; i++) {
      const current = prayerList[i];
      const next = prayerList[i + 1];
      if (now >= current.date && (!next || now < next.date)) {
        activeIndex = i;
        break;
      }
    }
    if (now < prayerList[0].date) activeIndex = -1;

    setPrayers(
      prayerList.map((p, i) => ({
        ...p,
        status:
          i < activeIndex
            ? "passed"
            : i === activeIndex
              ? "active"
              : "upcoming",
      })),
    );

    // Calculate next prayer
    let nextIdx = (activeIndex + 1) % prayerList.length;
    let isNextDay = nextIdx <= activeIndex;

    const next = prayerList[nextIdx];
    const targetDate = new Date(next.date);
    if (isNextDay) targetDate.setDate(targetDate.getDate() + 1);

    const diff = targetDate.getTime() - now.getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    setNextPrayer({
      name: next.name,
      time: next.time,
      remaining: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    });
  }, [data]);

  useEffect(() => {
    const timer = setInterval(calculateStatus, 1000);
    return () => clearInterval(timer);
  }, [calculateStatus]);

  // 6. Helpers
  const setSelectedAdhan = (path: string) => {
    setSelectedAdhanState(path);
    window.ipc.invoke("store-set", "selected-adhan", path);
    window.ipc.send("update-prayer-times", { adhan: path });
  };

  return (
    <PrayerTimesContext.Provider
      value={{
        data,
        loading,
        error,
        nextPrayer,
        prayers,
        selectedAdhan,
        setSelectedAdhan,
      }}
    >
      {children}
    </PrayerTimesContext.Provider>
  );
};

export const usePrayerTimes = () => {
  const context = useContext(PrayerTimesContext);
  if (!context)
    throw new Error("usePrayerTimes must be used within a PlayerTimesProvider");
  return context;
};

export default PrayerTimesContext;
