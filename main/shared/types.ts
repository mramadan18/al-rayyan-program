export interface Settings {
  location: {
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    quranFontSize: number;
    showMiniWidget: boolean;
  };
  audio: {
    adhanSound: string;
    volume: number;
  };
  notifications: {
    enabled: boolean;
    beforeMinutes: number;
  };
}

export interface PrayerTime {
  name: string;
  time: string;
  remaining?: string;
}
