import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { IpcChannels } from "shared/constants";

interface LocationSettings {
  calculationMethod: string;
  juristicMethod: string;
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
  });
  const [startAtLogin, setStartAtLogin] = useState(false);
  const [showMiniWidget, setShowMiniWidget] = useState(false);
  const [selectedAdhan, setSelectedAdhan] = useState(
    "/audio/adhan/adhan-1.mp3",
  );
  const [miniWidgetAlwaysOnTop, setMiniWidgetAlwaysOnTop] = useState(true);
  const [miniWidgetSize, setMiniWidgetSize] = useState(1);
  const [zikrInterval, setZikrInterval] = useState(15);
  const [zikrDuration, setZikrDuration] = useState(30);
  const [zikrSilent, setZikrSilent] = useState(false);
  const [zikrPosition, setZikrPosition] = useState("bottom-right");
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
      ]);

      if (savedLoc) setLocationSettings(savedLoc as LocationSettings);
      else
        window.ipc.invoke("store-set", "location-settings", locationSettings);

      if (savedStart !== undefined) setStartAtLogin(!!savedStart);
      else window.ipc.invoke("store-set", "start-at-login", false);

      if (savedWidget !== undefined) setShowMiniWidget(!!savedWidget);

      if (savedAdhan) setSelectedAdhan(savedAdhan as string);
      else window.ipc.invoke("store-set", "selected-adhan", selectedAdhan);

      if (savedPin !== undefined) setMiniWidgetAlwaysOnTop(!!savedPin);
      else window.ipc.invoke("store-set", "mini-widget-always-on-top", true);

      if (savedSize !== undefined) setMiniWidgetSize(Number(savedSize));
      else window.ipc.invoke("store-set", "mini-widget-size", 1);

      if (savedZikrInterval !== undefined)
        setZikrInterval(Number(savedZikrInterval));
      else window.ipc.invoke("store-set", "zikr-interval", 15);

      if (savedZikrDuration !== undefined)
        setZikrDuration(Number(savedZikrDuration));
      else window.ipc.invoke("store-set", "zikr-duration", 30);

      if (savedZikrSilent !== undefined) setZikrSilent(!!savedZikrSilent);
      else window.ipc.invoke("store-set", "zikr-silent", false);

      if (savedZikrPosition !== undefined)
        setZikrPosition(String(savedZikrPosition));
      else window.ipc.invoke("store-set", "zikr-position", "bottom-right");
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateLocationSettings = async (settings: LocationSettings) => {
    setLocationSettings(settings);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "location-settings", settings);
    }
  };

  const updateStartAtLogin = async (enabled: boolean) => {
    setStartAtLogin(enabled);
    if (window.ipc) {
      await window.ipc.invoke("set-startup", enabled);
    }
  };

  const updateShowMiniWidget = async (enabled: boolean) => {
    setShowMiniWidget(enabled);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "show-mini-widget", enabled);
      if (enabled) window.ipc.send(IpcChannels.OPEN_MINI_WIDGET);
      else window.ipc.send(IpcChannels.CLOSE_MINI_WIDGET);
    }
  };

  const updateSelectedAdhan = async (path: string) => {
    setSelectedAdhan(path);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "selected-adhan", path);
      window.ipc.send("update-prayer-times", { adhan: path });
    }
  };

  const updateMiniWidgetAlwaysOnTop = async (enabled: boolean) => {
    setMiniWidgetAlwaysOnTop(enabled);
    if (window.ipc) {
      await window.ipc.invoke(IpcChannels.TOGGLE_ALWAYS_ON_TOP);
    }
  };

  const updateMiniWidgetSize = async (size: number) => {
    setMiniWidgetSize(size);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "mini-widget-size", size);
      window.ipc.send("update-mini-widget-size", size);
    }
  };

  const updateZikrInterval = async (minutes: number) => {
    setZikrInterval(minutes);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-interval", minutes);
      window.ipc.send("update-zikr-settings", { interval: minutes });
    }
  };

  const updateZikrDuration = async (seconds: number) => {
    setZikrDuration(seconds);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-duration", seconds);
      window.ipc.send("update-zikr-settings", { duration: seconds });
    }
  };

  const updateZikrSilent = async (silent: boolean) => {
    setZikrSilent(silent);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-silent", silent);
      window.ipc.send("update-zikr-settings", { silent });
    }
  };

  const updateZikrPosition = async (position: string) => {
    setZikrPosition(position);
    if (window.ipc) {
      await window.ipc.invoke("store-set", "zikr-position", position);
      window.ipc.send("update-zikr-settings", { position });
      window.ipc.send(IpcChannels.OPEN_ZIKR_WIDGET);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
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
      }}
    >
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
