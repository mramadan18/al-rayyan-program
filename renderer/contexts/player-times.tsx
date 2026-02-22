import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { useSettings } from "./settings-context";

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
  iqamah: {
    name: string;
    remaining: string;
    isGracePeriod: boolean;
  } | null;
  prayers: Array<{
    name: string;
    englishName: string;
    time: string;
    status: "passed" | "active" | "upcoming";
    date: Date;
  }>;
  selectedAdhan: string;
  setSelectedAdhan: (path: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  fetchData: (manualLocation?: {
    country: string;
    city: string;
    lat?: number;
    lon?: number;
  }) => Promise<void>;
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

const OBLIGATORY_PRAYERS = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

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
  const [iqamah, setIqamah] = useState<PlayerTimesContextType["iqamah"]>(null);
  const [prayers, setPrayers] = useState<PlayerTimesContextType["prayers"]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const {
    selectedAdhan,
    updateSelectedAdhan,
    locationSettings,
    updateLocationSettings,
  } = useSettings();

  // 1. Fetch prayer times
  const fetchData = useCallback(
    async (manualLocation?: {
      country: string;
      city: string;
      lat?: number;
      lon?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);

        let lat: number | undefined = manualLocation?.lat;
        let lon: number | undefined = manualLocation?.lon;

        // Try to get geolocation if no manual location or coordinates are provided
        if (!lat && !lon && !manualLocation && !locationSettings.city) {
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  timeout: 3000,
                });
              },
            );
            lat = position.coords.latitude;
            lon = position.coords.longitude;
          } catch (geoErr) {
            console.warn("Geolocation failed or timed out:", geoErr);
            // Fallback: don't set lat/lon, API might use IP
          }
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_PRAYER_TIMES_API ||
          "https://al-rayyan.mramadan.me/api/v1/prayer-times";
        const params = new URLSearchParams();

        if (manualLocation) {
          params.append("country", manualLocation.country);
          params.append("city", manualLocation.city);
        } else if (locationSettings.country && locationSettings.city) {
          params.append("country", locationSettings.country);
          params.append("city", locationSettings.city);
        }

        if (lat !== undefined && lon !== undefined) {
          params.append("lat", lat.toFixed(4));
          params.append("lon", lon.toFixed(4));
        }

        params.append("method", locationSettings.calculationMethod || "EGYPT");
        params.append("madhab", locationSettings.juristicMethod || "SHAFI");

        const fullUrl = `${baseUrl}?${params.toString()}`;
        console.log("Fetching prayer times from:", fullUrl);

        const response = await axios.get(fullUrl);
        setData(response.data);

        // If we got data and it was a manual selection, save it
        if (manualLocation) {
          updateLocationSettings({
            ...locationSettings,
            country: manualLocation.country,
            city: manualLocation.city,
            lat: lat || locationSettings.lat,
            lon: lon || locationSettings.lon,
          });
        }
      } catch (err) {
        console.error("Error fetching prayer times:", err);
        setError("Failed to fetch prayer times");
        // Open modal if fetching fails (and we don't already have data?)
        setIsLocationModalOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [locationSettings, updateLocationSettings],
  );

  useEffect(() => {
    fetchData();
  }, [
    locationSettings.country,
    locationSettings.city,
    locationSettings.lat,
    locationSettings.lon,
    locationSettings.calculationMethod,
    locationSettings.juristicMethod,
  ]);

  // 3. Sync with Main Process
  useEffect(() => {
    if (data?.timings && window.ipc) {
      window.ipc.send("update-prayer-times", {
        timings: data.timings,
        adhan: selectedAdhan,
      });
    }
  }, [data, selectedAdhan]);

  // 4. Global Audio Listener (Pre-Adhan etc.)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!window.ipc) return;

    const handlePlayAudio = (path: string) => {
      // Stop current if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const audio = new Audio(path);
      audioRef.current = audio;
      audio.play().catch((err) => console.error("Audio playback error:", err));

      audio.onended = () => {
        audioRef.current = null;
      };
    };

    const handleStopAudio = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };

    const handleMuteAudio = (muted: boolean) => {
      if (audioRef.current) {
        audioRef.current.muted = muted;
      }
    };

    const removePlayListener = window.ipc.on("play-audio", handlePlayAudio);
    const removeStopListener = window.ipc.on("stop-audio", handleStopAudio);
    const removeMuteListener = window.ipc.on("mute-audio", handleMuteAudio);

    return () => {
      removePlayListener();
      removeStopListener();
      removeMuteListener();
      handleStopAudio();
    };
  }, []);

  // 4.5. Background Sync Listener
  useEffect(() => {
    if (!window.ipc) return;

    const handlePrayerTimesChanged = (payload: any) => {
      if (payload.timings) {
        setData((prev) => {
          // 1. If we don't have data yet, accept the new timings
          if (!prev) {
            return {
              timings: payload.timings,
              metadata: {
                city: "",
                country: "",
                timezone: "",
                coordinates: { lat: 0, lng: 0 },
              },
            } as PrayerTimesData;
          }

          // 2. Check if timings are actually different to prevent infinite loops
          const hasChanged =
            JSON.stringify(prev.timings) !== JSON.stringify(payload.timings);

          if (!hasChanged) return prev;

          return {
            ...prev,
            timings: payload.timings,
          };
        });
      }
    };

    const removeListener = window.ipc.on(
      "prayer-times-changed",
      handlePrayerTimesChanged,
    );

    /* 
    const removeTestIqamahListener = window.ipc.on("test-iqamah", () => {
      if (testIqamahTimeoutRef.current) {
        clearTimeout(testIqamahTimeoutRef.current);
      }

      setIqamah({
        name: "تجربة",
        remaining: "00:05", // Example of upward count (5 seconds passed)
        isGracePeriod: true,
      });

      // Maintain test state for 60 seconds
      testIqamahTimeoutRef.current = setTimeout(() => {
        setIqamah(null);
        testIqamahTimeoutRef.current = null;
      }, 60000);
    });
    */

    return () => {
      removeListener();
      // removeTestIqamahListener();
      if (testIqamahTimeoutRef.current)
        clearTimeout(testIqamahTimeoutRef.current);
    };
  }, []);

  const testIqamahTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 5. Prayer Status Calculation
  const calculateStatus = useCallback(() => {
    if (!data) return;

    const now = new Date();
    const timings = data.timings;

    const prayerList = OBLIGATORY_PRAYERS.map((name) => {
      const time = timings[name as keyof PrayerTimings];
      // Note: We assume time exists for these keys as per PrayerTimings interface
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
        date: p.date,
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

    // Calculate Iqamah (20 mins after active prayer) - NOW COUNTING UPWARDS
    // Only calculate if not in test mode
    // if (!testIqamahTimeoutRef.current) {
    if (activeIndex !== -1) {
      const activePrayer = prayerList[activeIndex];
      const diffSinceActive = now.getTime() - activePrayer.date.getTime();
      const iqamahDuration = 20 * 60 * 1000; // 20 minutes

      if (diffSinceActive >= 0 && diffSinceActive < iqamahDuration) {
        // Count UPWARDS from 00:00
        const elapsed = diffSinceActive;
        const m = Math.floor(elapsed / 60000);
        const s = Math.floor((elapsed % 60000) / 1000);
        setIqamah({
          name: activePrayer.name,
          remaining: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
          isGracePeriod: true,
        });
      } else {
        setIqamah(null);
      }
    } else {
      setIqamah(null);
    }
    // }
  }, [data]);

  useEffect(() => {
    const timer = setInterval(calculateStatus, 1000);
    return () => clearInterval(timer);
  }, [calculateStatus]);

  // 6. Helpers
  const setSelectedAdhan = (path: string) => {
    updateSelectedAdhan(path);
  };

  return (
    <PrayerTimesContext.Provider
      value={{
        data,
        loading,
        error,
        nextPrayer,
        iqamah,
        prayers,
        selectedAdhan,
        setSelectedAdhan,
        isLocationModalOpen,
        setIsLocationModalOpen,
        fetchData,
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
