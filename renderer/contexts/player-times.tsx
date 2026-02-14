import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

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
  isAdhanActive: boolean;
  setIsAdhanActive: (active: boolean) => void;
  currentAdhan: string | null;
  selectedAdhan: string;
  setSelectedAdhan: (path: string) => void;
  simulateAdhan: () => void;
}

const PrayerTimesContext = createContext<PlayerTimesContextType | null>(null);

const PRAYER_NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const OBLIGATORY_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

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
  const [isAdhanActive, setIsAdhanActive] = useState(false);
  const [currentAdhan, setCurrentAdhan] = useState<string | null>(null);
  const [selectedAdhan, setSelectedAdhanState] = useState(
    "/audio/adhan/adhan-1.mp3",
  );

  useEffect(() => {
    const loadAdhanSetting = async () => {
      try {
        const saved = await window.ipc.invoke("store-get", "selected-adhan");
        if (saved) {
          setSelectedAdhanState(saved as string);
        }
      } catch (error) {
        console.error("Error loading adhan setting:", error);
      }
    };
    loadAdhanSetting();
  }, []);

  const setSelectedAdhan = (path: string) => {
    setSelectedAdhanState(path);
    window.ipc.invoke("store-set", "selected-adhan", path);
    // Notify main process of new adhan path
    window.ipc.send("update-prayer-times", { adhan: path });
  };

  const simulateAdhan = () => {
    if (nextPrayer) {
      setCurrentAdhan(nextPrayer.name);
      setIsAdhanActive(true);
    }
  };

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync with Main Process
  useEffect(() => {
    if (data?.timings) {
      // Send times to main process for background scheduler
      window.ipc.send("update-prayer-times", {
        timings: data.timings,
        adhan: selectedAdhan,
      });
    }
  }, [data, selectedAdhan]);

  // Listen for background audio triggers (e.g. Pre-Adhan)
  useEffect(() => {
    const handlePlayAudio = (path: string) => {
      console.log("Renderer received play-audio:", path);
      const audio = new Audio(path);
      audio.oncanplaythrough = () => console.log("Audio can play through");
      audio.onerror = (e) => console.error("Audio error:", e);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log("Audio playing successfully"))
          .catch((err) =>
            console.error("Error playing background audio:", err),
          );
      }
    };

    let removeListener: (() => void) | undefined;
    if (window.ipc) {
      removeListener = window.ipc.on("play-audio", handlePlayAudio);
    }

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

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

    // Find current and next prayer
    let activeIndex = -1;
    for (let i = 0; i < prayerList.length; i++) {
      const current = prayerList[i];
      const next = prayerList[i + 1];

      if (now >= current.date && (!next || now < next.date)) {
        activeIndex = i;
        break;
      }
    }

    // If it's before Fajr
    if (now < prayerList[0].date) {
      activeIndex = -1;
    }

    const updatedPrayers = prayerList.map((p, i) => {
      let status: "passed" | "active" | "upcoming" = "upcoming";
      if (i < activeIndex) status = "passed";
      else if (i === activeIndex) status = "active";
      return { ...p, status };
    });

    setPrayers(updatedPrayers);

    // Calculate next prayer
    let nextIdx = activeIndex + 1;
    let isNextDay = false;

    if (nextIdx >= prayerList.length) {
      nextIdx = 0;
      isNextDay = true;
    }

    const next = prayerList[nextIdx];
    const targetDate = new Date(next.date);
    if (isNextDay) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const diff = targetDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setNextPrayer({
      name: next.name,
      time: next.time,
      remaining: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    });
  }, [data]);

  useEffect(() => {
    const timer = setInterval(calculateStatus, 1000);
    return () => clearInterval(timer);
  }, [calculateStatus]);

  function formatTime(time24: string) {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "م" : "ص";
    const h12 = hours % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  return (
    <PrayerTimesContext.Provider
      value={{
        data,
        loading,
        error,
        nextPrayer,
        prayers,
        isAdhanActive,
        setIsAdhanActive,
        currentAdhan,
        selectedAdhan,
        setSelectedAdhan,
        simulateAdhan,
      }}
    >
      {children}
    </PrayerTimesContext.Provider>
  );
};

export const usePrayerTimes = () => {
  const context = useContext(PrayerTimesContext);
  if (!context) {
    throw new Error("usePrayerTimes must be used within a PlayerTimesProvider");
  }
  return context;
};

export default PrayerTimesContext;
