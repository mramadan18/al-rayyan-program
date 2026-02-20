import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSettings } from "@/contexts/settings-context";
import { usePrayerTimes as usePrayerTimesContext } from "@/contexts/player-times";
import { APIDataItem, RamadanDay, Timings } from "@/components/ramadan/types";

export function useRamadanImsakia() {
  const [days, setDays] = useState<RamadanDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [nextEventLabel, setNextEventLabel] = useState<string>("تحميل...");

  const { data: prayerData } = usePrayerTimesContext();
  const { locationSettings } = useSettings();

  const CITY = prayerData?.metadata?.city || "Cairo";
  const COUNTRY = prayerData?.metadata?.country || "Egypt";

  const getMethodId = (method: string) => {
    const map: Record<string, number> = {
      EGYPT: 5,
      UMM_AL_QURA: 4,
      MWL: 3,
      KARACHI: 1,
      NORTH_AMERICA: 2,
      DUBAI: 11,
      KUWAIT: 12,
      QATAR: 10,
      SINGAPORE: 11,
      TURKEY: 13,
    };
    return map[method] || 5;
  };

  const METHOD = getMethodId(locationSettings.calculationMethod);
  const MONTH = 9;
  const YEAR = 1447;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((timeStr: string) => {
    const cleanTime = timeStr.split(" ")[0];
    const [hours, minutes] = cleanTime.split(":").map(Number);
    const suffix = hours >= 12 ? "م" : "ص";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }, []);

  const parseTime = useCallback((date: Date, timeStr: string): Date => {
    const cleanTime = timeStr.split(" ")[0];
    const [hours, minutes] = cleanTime.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  }, []);

  const getTimeDifference = useCallback((start: Date, end: Date): string => {
    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return "00:00:00";
    const totalSeconds = Math.floor(diff / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const updateCountdown = useCallback(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    let currentDayIndex = days.findIndex(
      (d) => d.rawDate.toDateString() === todayStr,
    );

    if (currentDayIndex === -1) {
      if (days.length > 0 && now < days[0].rawDate) {
        setNextEventLabel("رمضان لم يبدأ بعد");
        setCountdown("---");
        return;
      }
      if (days.length > 0 && now > days[days.length - 1].rawDate) {
        setNextEventLabel("انتهى رمضان");
        setCountdown("---");
        return;
      }
      return;
    }

    const todayData = days[currentDayIndex];
    const maghribTime = parseTime(
      todayData.rawDate,
      todayData.timingsRaw.Maghrib,
    );

    if (now < maghribTime) {
      setNextEventLabel("المتبقي للإفطار");
      setCountdown(getTimeDifference(now, maghribTime));
    } else {
      if (currentDayIndex + 1 < days.length) {
        const nextDay = days[currentDayIndex + 1];
        const fajrNextDay = parseTime(nextDay.rawDate, nextDay.timingsRaw.Fajr);
        const suhoorNextDay = new Date(fajrNextDay.getTime() - 60 * 60 * 1000);
        setNextEventLabel("المتبقي للسحور");
        setCountdown(getTimeDifference(now, suhoorNextDay));
      } else {
        setNextEventLabel("كل عام وأنتم بخير");
        setCountdown("---");
      }
    }
  }, [days, parseTime, getTimeDifference]);

  const processData = useCallback(
    (apiData: APIDataItem[]) => {
      const today = new Date();
      const todayStr = today.toDateString();

      let processedDays: RamadanDay[] = apiData.map((item) => {
        const gregDateParts = item.date.gregorian.date.split("-");
        const dateObj = new Date(
          Number(gregDateParts[2]),
          Number(gregDateParts[1]) - 1,
          Number(gregDateParts[0]),
        );
        const isToday = dateObj.toDateString() === todayStr;

        const fajrTime = parseTime(dateObj, item.timings.Fajr);
        const suhoorTime = new Date(fajrTime.getTime() - 60 * 60 * 1000);
        const suhoorStr = `${suhoorTime.getHours().toString().padStart(2, "0")}:${suhoorTime.getMinutes().toString().padStart(2, "0")}`;

        return {
          dayName: item.date.hijri.weekday.ar,
          hijriDate: `${item.date.hijri.day} ${item.date.hijri.month.ar}`,
          gregorianDate: `${item.date.gregorian.day} ${item.date.gregorian.month.en}`,
          suhoor: formatTime(suhoorStr),
          imsak: formatTime(item.timings.Imsak),
          iftar: formatTime(item.timings.Maghrib),
          isToday: isToday,
          rawDate: dateObj,
          timingsRaw: item.timings,
        };
      });

      const startDate = new Date(2026, 1, 19);
      processedDays = processedDays.filter((day) => day.rawDate >= startDate);
      processedDays = processedDays.map((day, index) => ({
        ...day,
        hijriDate: `${index + 1} رمضان`,
      }));
      setDays(processedDays);
    },
    [formatTime],
  );

  const fetchRamadanData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const now = new Date();
      // We don't really use the first response except as a probe or we can skip it
      // For now keeping logic similar to previous stable version
      const ramadanResponse = await axios.get(
        `https://api.aladhan.com/v1/hijriCalendarByCity/${YEAR}/${MONTH}`,
        {
          params: { city: CITY, country: COUNTRY, method: METHOD },
        },
      );
      if (ramadanResponse.data && ramadanResponse.data.data) {
        processData(ramadanResponse.data.data);
      } else {
        throw new Error("Invalid data format from API");
      }
    } catch (err) {
      setError("فشل في تحميل البيانات. يرجى التحقق من الاتصال بالإنترنت.");
    } finally {
      setLoading(false);
    }
  }, [CITY, COUNTRY, METHOD, processData]);

  useEffect(() => {
    fetchRamadanData();
  }, [fetchRamadanData]);

  useEffect(() => {
    if (days.length > 0) {
      updateCountdown();
      timerRef.current = setInterval(updateCountdown, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [days, updateCountdown]);

  // Derive current display day
  const now = new Date();
  const currentDayIndex = days.findIndex(
    (d) => d.rawDate.toDateString() === now.toDateString(),
  );
  let displayDay: RamadanDay | null = null;
  if (currentDayIndex !== -1) {
    const today = days[currentDayIndex];
    const maghribTime = parseTime(today.rawDate, today.timingsRaw.Maghrib);
    displayDay = now < maghribTime ? today : days[currentDayIndex + 1] || today;
  } else if (days.length > 0) {
    displayDay = days[0];
  }

  return {
    days,
    loading,
    error,
    countdown,
    nextEventLabel,
    displayDay,
    retry: fetchRamadanData,
  };
}
