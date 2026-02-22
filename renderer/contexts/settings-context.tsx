import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { IpcChannels } from "shared/constants";

interface LocationSettings {
  calculationMethod: string;
  juristicMethod: string;
  country?: string;
  city?: string;
  lat?: number;
  lon?: number;
}

interface SettingsContextType {
  locationSettings: LocationSettings;
  startAtLogin: boolean;
  showMiniWidget: boolean;
  selectedAdhan: string;
  miniWidgetAlwaysOnTop: boolean;
  miniWidgetSize: number;
  zikrInterval: number;
  zikrDuration: number;
  zikrSilent: boolean;
  zikrPosition: string;
  duaSilent: boolean;
  duaPosition: string;
  showAzkarWidget: boolean;
  prayerNotifications: boolean;
  showPreAdhan: boolean;
  preAdhanMinutes: number;
  showDuaWidget: boolean;
  loading: boolean;
  updateLocationSettings: (settings: LocationSettings) => Promise<void>;
  updateStartAtLogin: (enabled: boolean) => Promise<void>;
  updateShowMiniWidget: (enabled: boolean) => Promise<void>;
  updateSelectedAdhan: (path: string) => Promise<void>;
  updateMiniWidgetAlwaysOnTop: (enabled: boolean) => Promise<void>;
  updateMiniWidgetSize: (size: number) => Promise<void>;
  updateZikrInterval: (minutes: number) => Promise<void>;
  updateZikrDuration: (seconds: number) => Promise<void>;
  updateZikrSilent: (silent: boolean) => Promise<void>;
  updateZikrPosition: (position: string) => Promise<void>;
  updateDuaSilent: (silent: boolean) => Promise<void>;
  updateDuaPosition: (position: string) => Promise<void>;
  updateShowAzkarWidget: (enabled: boolean) => Promise<void>;
  updatePrayerNotifications: (enabled: boolean) => Promise<void>;
  updateShowPreAdhan: (enabled: boolean) => Promise<void>;
  updatePreAdhanMinutes: (minutes: number) => Promise<void>;
  updateShowDuaWidget: (enabled: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locationSettings, setLocationSettings] = useState<LocationSettings>({
    calculationMethod: "EGYPT",
    juristicMethod: "SHAFI",
    country: "",
    city: "",
  });
  const [startAtLogin, setStartAtLogin] = useState(true);
  const [showMiniWidget, setShowMiniWidget] = useState(true);
  const [selectedAdhan, setSelectedAdhan] = useState(
    "/audio/adhan/adhan-1.mp3",
  );
  const [miniWidgetAlwaysOnTop, setMiniWidgetAlwaysOnTop] = useState(false);
  const [miniWidgetSize, setMiniWidgetSize] = useState(1);
  const [zikrInterval, setZikrInterval] = useState(15);
  const [zikrDuration, setZikrDuration] = useState(30);
  const [zikrSilent, setZikrSilent] = useState(true);
  const [zikrPosition, setZikrPosition] = useState("bottom-right");
  const [duaSilent, setDuaSilent] = useState(true);
  const [duaPosition, setDuaPosition] = useState("bottom-right");
  const [showAzkarWidget, setShowAzkarWidget] = useState(true);
  const [prayerNotifications, setPrayerNotifications] = useState(true);
  const [showPreAdhan, setShowPreAdhan] = useState(true);
  const [preAdhanMinutes, setPreAdhanMinutes] = useState(15);
  const [showDuaWidget, setShowDuaWidget] = useState(true);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    if (!window.ipc) {
      setLoading(false);
      return;
    }

    try {
      const [
        savedLoc,
        savedStart,
        savedWidget,
        savedAdhan,
        savedPin,
        savedSize,
        savedZikrInterval,
        savedZikrDuration,
        savedZikrSilent,
        savedZikrPosition,
        savedDuaSilent,
        savedDuaPosition,
        savedAzkarEnabled,
        savedPrayerNotifications,
        savedShowPreAdhan,
        savedPreAdhanMinutes,
        savedShowDua,
      ] = await Promise.all([
        window.ipc.invoke("store-get", "location-settings"),
        window.ipc.invoke("store-get", "start-at-login"),
        window.ipc.invoke("store-get", "show-mini-widget"),
        window.ipc.invoke("store-get", "selected-adhan"),
        window.ipc.invoke("store-get", "mini-widget-always-on-top"),
        window.ipc.invoke("store-get", "mini-widget-size"),
        window.ipc.invoke("store-get", "zikr-interval"),
        window.ipc.invoke("store-get", "zikr-duration"),
        window.ipc.invoke("store-get", "zikr-silent"),
        window.ipc.invoke("store-get", "zikr-position"),
        window.ipc.invoke("store-get", "dua-silent"),
        window.ipc.invoke("store-get", "dua-position"),
        window.ipc.invoke("store-get", "azkar-widget-enabled"),
        window.ipc.invoke("store-get", "prayer-notifications-enabled"),
        window.ipc.invoke("store-get", "show-pre-adhan"),
        window.ipc.invoke("store-get", "pre-adhan-minutes"),
        window.ipc.invoke("store-get", "dua-widget-enabled"),
      ]);

      if (savedLoc) setLocationSettings(savedLoc as LocationSettings);
      else
        window.ipc.invoke("store-set", "location-settings", locationSettings);

      if (savedStart !== undefined) setStartAtLogin(!!savedStart);
      else {
        setStartAtLogin(true);
        window.ipc.invoke("set-startup", true);
      }

      if (savedWidget !== undefined) setShowMiniWidget(!!savedWidget);
      else {
        setShowMiniWidget(true);
        window.ipc.invoke("store-set", "show-mini-widget", true);
        window.ipc.send(IpcChannels.OPEN_MINI_WIDGET);
      }

      if (savedAdhan) setSelectedAdhan(savedAdhan as string);
      else window.ipc.invoke("store-set", "selected-adhan", selectedAdhan);

      if (savedPin !== undefined) setMiniWidgetAlwaysOnTop(!!savedPin);
      else window.ipc.invoke("store-set", "mini-widget-always-on-top", false);

      if (savedSize !== undefined) setMiniWidgetSize(Number(savedSize));
      else window.ipc.invoke("store-set", "mini-widget-size", 1);

      if (savedZikrInterval !== undefined)
        setZikrInterval(Number(savedZikrInterval));
      else window.ipc.invoke("store-set", "zikr-interval", 15);

      if (savedZikrDuration !== undefined)
        setZikrDuration(Number(savedZikrDuration));
      else window.ipc.invoke("store-set", "zikr-duration", 30);

      if (savedZikrSilent !== undefined) setZikrSilent(!!savedZikrSilent);
      else window.ipc.invoke("store-set", "zikr-silent", true);

      if (savedZikrPosition !== undefined)
        setZikrPosition(String(savedZikrPosition));
      else window.ipc.invoke("store-set", "zikr-position", "bottom-right");

      if (savedDuaSilent !== undefined) setDuaSilent(!!savedDuaSilent);
      else window.ipc.invoke("store-set", "dua-silent", true);

      if (savedDuaPosition !== undefined)
        setDuaPosition(String(savedDuaPosition));
      else window.ipc.invoke("store-set", "dua-position", "bottom-right");

      if (savedAzkarEnabled !== undefined)
        setShowAzkarWidget(!!savedAzkarEnabled);
      else window.ipc.invoke("store-set", "azkar-widget-enabled", true);

      if (savedPrayerNotifications !== undefined)
        setPrayerNotifications(!!savedPrayerNotifications);
      else window.ipc.invoke("store-set", "prayer-notifications-enabled", true);

      if (savedShowPreAdhan !== undefined) setShowPreAdhan(!!savedShowPreAdhan);
      else window.ipc.invoke("store-set", "show-pre-adhan", true);

      if (savedPreAdhanMinutes !== undefined)
        setPreAdhanMinutes(Number(savedPreAdhanMinutes));
      else window.ipc.invoke("store-set", "pre-adhan-minutes", 15);

      if (savedShowDua !== undefined) setShowDuaWidget(!!savedShowDua);
      else window.ipc.invoke("store-set", "dua-widget-enabled", true);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (!window.ipc) return;

    const handleSettingsUpdated = (payload: { key: string; val: any }) => {
      const { key, val } = payload;
      switch (key) {
        case "location-settings":
          setLocationSettings((prev) =>
            JSON.stringify(prev) !== JSON.stringify(val) ? val : prev,
          );
          break;
        case "start-at-login":
          setStartAtLogin(val);
          break;
        case "show-mini-widget":
          setShowMiniWidget(val);
          break;
        case "selected-adhan":
          setSelectedAdhan(val);
          break;
        case "mini-widget-always-on-top":
          setMiniWidgetAlwaysOnTop(val);
          break;
        case "mini-widget-size":
          setMiniWidgetSize(val);
          break;
        case "zikr-interval":
          setZikrInterval(val);
          break;
        case "zikr-duration":
          setZikrDuration(val);
          break;
        case "zikr-silent":
          setZikrSilent(val);
          break;
        case "zikr-position":
          setZikrPosition(val);
          break;
        case "dua-silent":
          setDuaSilent(val);
          break;
        case "dua-position":
          setDuaPosition(val);
          break;
        case "azkar-widget-enabled":
          setShowAzkarWidget(val);
          break;
        case "prayer-notifications-enabled":
          setPrayerNotifications(val);
          break;
        case "show-pre-adhan":
          setShowPreAdhan(val);
          break;
        case "pre-adhan-minutes":
          setPreAdhanMinutes(val);
          break;
        case "dua-widget-enabled":
          setShowDuaWidget(val);
          break;
      }
    };

    const removeListener = window.ipc.on(
      "settings-updated",
      handleSettingsUpdated,
    );
    return () => removeListener();
  }, []);

  const updateLocationSettings = useCallback(
    async (settings: LocationSettings) => {
      setLocationSettings(settings);
      if (window.ipc) {
        await window.ipc.invoke("store-set", "location-settings", settings);
      }
    },
    [],
  );

  const updateStartAtLogin = useCallback(async (enabled: boolean) => {
    setStartAtLogin(enabled);
    if (window.ipc) {
      await window.ipc.invoke("set-startup", enabled);
    }
  }, []);

  const updateShowMiniWidget = useCallback(async (enabled: boolean) => {
    setShowMiniWidget(enabled);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "show-mini-widget", enabled);
      if (enabled) window.ipc.send(IpcChannels.OPEN_MINI_WIDGET);
      else window.ipc.send(IpcChannels.CLOSE_MINI_WIDGET);
    }
  }, []);

  const updateSelectedAdhan = useCallback(async (path: string) => {
    setSelectedAdhan(path);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "selected-adhan", path);
      window.ipc.send("update-prayer-times", { adhan: path });
    }
  }, []);

  const updateMiniWidgetAlwaysOnTop = useCallback(async (enabled: boolean) => {
    setMiniWidgetAlwaysOnTop(enabled);
    if (window.ipc) {
      await window.ipc.invoke(IpcChannels.TOGGLE_ALWAYS_ON_TOP);
    }
  }, []);

  const updateMiniWidgetSize = useCallback(async (size: number) => {
    setMiniWidgetSize(size);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "mini-widget-size", size);
      window.ipc.send("update-mini-widget-size", size);
    }
  }, []);

  const updateZikrInterval = useCallback(async (minutes: number) => {
    setZikrInterval(minutes);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-interval", minutes);
      window.ipc.send("update-zikr-settings", { interval: minutes });
    }
  }, []);

  const updateZikrDuration = useCallback(async (seconds: number) => {
    setZikrDuration(seconds);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-duration", seconds);
      window.ipc.send("update-zikr-settings", { duration: seconds });
    }
  }, []);

  const updateZikrSilent = useCallback(async (silent: boolean) => {
    setZikrSilent(silent);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-silent", silent);
      window.ipc.send("update-zikr-settings", { silent });
    }
  }, []);

  const updateZikrPosition = useCallback(async (position: string) => {
    setZikrPosition(position);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-position", position);
      window.ipc.send("update-zikr-settings", { position });
      window.ipc.send(IpcChannels.OPEN_ZIKR_WIDGET);
    }
  }, []);

  const updateDuaSilent = useCallback(async (silent: boolean) => {
    setDuaSilent(silent);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "dua-silent", silent);
    }
  }, []);

  const updateDuaPosition = useCallback(async (position: string) => {
    setDuaPosition(position);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "dua-position", position);
    }
  }, []);

  const updateShowAzkarWidget = useCallback(async (enabled: boolean) => {
    setShowAzkarWidget(enabled);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "azkar-widget-enabled", enabled);
      if (enabled) window.ipc.send("enable-azkar-widget");
      else window.ipc.send("disable-azkar-widget");
    }
  }, []);

  const updatePrayerNotifications = useCallback(async (enabled: boolean) => {
    setPrayerNotifications(enabled);
    if (window.ipc) {
      await window.ipc.invoke(
        "store-set",
        "prayer-notifications-enabled",
        enabled,
      );
      window.ipc.send("update-prayer-times", { prayerNotifications: enabled });
    }
  }, []);

  const updateShowPreAdhan = useCallback(async (enabled: boolean) => {
    setShowPreAdhan(enabled);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "show-pre-adhan", enabled);
      window.ipc.send("update-prayer-times", { showPreAdhan: enabled });
    }
  }, []);

  const updatePreAdhanMinutes = useCallback(async (minutes: number) => {
    setPreAdhanMinutes(minutes);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "pre-adhan-minutes", minutes);
      window.ipc.send("update-prayer-times", { preAdhanMinutes: minutes });
    }
  }, []);

  const updateShowDuaWidget = useCallback(async (enabled: boolean) => {
    setShowDuaWidget(enabled);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "dua-widget-enabled", enabled);
    }
  }, []);

  const value = useMemo(
    () => ({
      locationSettings,
      startAtLogin,
      showMiniWidget,
      selectedAdhan,
      miniWidgetAlwaysOnTop,
      miniWidgetSize,
      zikrInterval,
      zikrDuration,
      zikrSilent,
      zikrPosition,
      duaSilent,
      duaPosition,
      showAzkarWidget,
      prayerNotifications,
      showPreAdhan,
      preAdhanMinutes,
      showDuaWidget,
      loading,
      updateLocationSettings,
      updateStartAtLogin,
      updateShowMiniWidget,
      updateSelectedAdhan,
      updateMiniWidgetAlwaysOnTop,
      updateMiniWidgetSize,
      updateZikrInterval,
      updateZikrDuration,
      updateZikrSilent,
      updateZikrPosition,
      updateDuaSilent,
      updateDuaPosition,
      updateShowAzkarWidget,
      updatePrayerNotifications,
      updateShowPreAdhan,
      updatePreAdhanMinutes,
      updateShowDuaWidget,
    }),
    [
      locationSettings,
      startAtLogin,
      showMiniWidget,
      selectedAdhan,
      miniWidgetAlwaysOnTop,
      miniWidgetSize,
      zikrInterval,
      zikrDuration,
      zikrSilent,
      zikrPosition,
      duaSilent,
      duaPosition,
      showAzkarWidget,
      prayerNotifications,
      showPreAdhan,
      preAdhanMinutes,
      showDuaWidget,
      loading,
      updateLocationSettings,
      updateStartAtLogin,
      updateShowMiniWidget,
      updateSelectedAdhan,
      updateMiniWidgetAlwaysOnTop,
      updateMiniWidgetSize,
      updateZikrInterval,
      updateZikrDuration,
      updateZikrSilent,
      updateZikrPosition,
      updateDuaSilent,
      updateDuaPosition,
      updateShowAzkarWidget,
      updatePrayerNotifications,
      updateShowPreAdhan,
      updatePreAdhanMinutes,
      updateShowDuaWidget,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within a SettingsProvider");
  return context;
};
