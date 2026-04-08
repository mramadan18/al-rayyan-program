import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { toast } from "sonner";
import { IpcChannels } from "../../main/shared/constants";

export interface RadioStation {
  id: number | string;
  name: string;
  url: string;
  recent_date: string;
  categoryId?: string;
}

interface RadioContextType {
  radios: RadioStation[];
  currentRadio: RadioStation | null;
  setCurrentRadio: (radio: RadioStation | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  volume: number[];
  setVolume: (value: number[]) => void;
  isMuted: boolean;
  toggleMute: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  togglePlay: () => void;
  handleError: () => void;
  filteredRadios: RadioStation[];
  playNext: () => void;
  playPrevious: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const audioRef = useRef<HTMLAudioElement>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const response = await fetch("/data/radios.json");
        const data = await response.json();

        let allRadios: RadioStation[] = [];
        if (data.categories) {
          allRadios = data.categories.flatMap((cat: any) =>
            cat.radios.map((r: any) => ({ ...r, categoryId: cat.id })),
          );
        } else {
          allRadios = data.radios || [];
        }
        setRadios(allRadios);

        // Load last played radio
        if (window.ipc) {
          const lastRadio = await window.ipc.invoke("store-get", "last-radio");
          if (lastRadio) {
            const found = allRadios.find((r) => r.id === lastRadio.id);
            if (found) {
              setCurrentRadio(found);
            }
          }

          // Load last volume level
          const lastVolume = await window.ipc.invoke("store-get", "radio-volume");
          if (lastVolume !== undefined && lastVolume !== null) {
            setVolume([lastVolume]);
          }
        }
      } catch (error) {
        console.error("Error fetching radios:", error);
        toast.error("فشل في تحميل قائمة الإذاعات");
      }
    };
    fetchRadios();
  }, []);

  const handleError = () => {
    setIsPlaying(false);
    toast.error("حدث خطأ في تشغيل الإذاعة. قد يكون الرابط غير متاح حالياً.");
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentRadio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = currentRadio.url;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(handleError);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume[0];
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  useEffect(() => {
    if (currentRadio && audioRef.current) {
      // Save last radio
      if (window.ipc) {
        window.ipc.invoke("store-set", "last-radio", currentRadio);
      }

      // Prevent autoplay on initial load
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        audioRef.current.src = currentRadio.url;
        return;
      }

      audioRef.current.src = currentRadio.url;
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(handleError);
    }
  }, [currentRadio]);

  const playNext = () => {
    if (!currentRadio || radios.length === 0) return;
    const index = radios.findIndex((r) => r.id === currentRadio.id);
    if (index === -1) return;
    const nextIndex = (index + 1) % radios.length;
    setCurrentRadio(radios[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentRadio || radios.length === 0) return;
    const index = radios.findIndex((r) => r.id === currentRadio.id);
    if (index === -1) return;
    const prevIndex = (index - 1 + radios.length) % radios.length;
    setCurrentRadio(radios[prevIndex]);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
    }
    // Save volume level
    if (window.ipc) {
      window.ipc.invoke("store-set", "radio-volume", volume[0]);
    }
  }, [volume, isMuted]);
  
  // Media Session handling for Windows/Global Media Controls
  useEffect(() => {
    if ("mediaSession" in navigator && currentRadio) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentRadio.name,
        artist: "الريّان - الإذاعة",
        album: "البث المباشر",
        artwork: [
          { src: "/images/logo.png", sizes: "96x96", type: "image/png" },
          { src: "/images/logo.png", sizes: "128x128", type: "image/png" },
          { src: "/images/logo.png", sizes: "192x192", type: "image/png" },
          { src: "/images/logo.png", sizes: "256x256", type: "image/png" },
          { src: "/images/logo.png", sizes: "384x384", type: "image/png" },
          { src: "/images/logo.png", sizes: "512x512", type: "image/png" },
        ],
      });
    }
  }, [currentRadio]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const currentTogglePlay = togglePlay;
    
    navigator.mediaSession.setActionHandler("play", () => {
      currentTogglePlay();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      currentTogglePlay();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      playPrevious();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      playNext();
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, [currentRadio, radios, togglePlay]);

  // Listen for tray radio toggle command
  useEffect(() => {
    if (!window.ipc) return;

    const removeListener = window.ipc.on(
      IpcChannels.TOGGLE_RADIO_FROM_TRAY,
      () => {
        if (!audioRef.current || !currentRadio) return;

        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.src = currentRadio.url;
          audioRef.current.load();
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(handleError);
        }
      },
    );

    return () => {
      removeListener?.();
    };
  }, [isPlaying, currentRadio, audioRef, handleError]);

  // Sync radio playing state to the tray menu
  useEffect(() => {
    if (window.ipc) {
      window.ipc.send(IpcChannels.SYNC_RADIO_STATE, isPlaying);
    }
  }, [isPlaying]);

  const filteredRadios = useMemo(() => {
    return radios.filter((radio) => {
      const matchesSearch = radio.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || radio.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [radios, searchTerm, selectedCategory]);

  const value = {
    radios,
    currentRadio,
    setCurrentRadio,
    isPlaying,
    setIsPlaying,
    searchTerm,
    setSearchTerm,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    selectedCategory,
    setSelectedCategory,
    audioRef: audioRef as React.RefObject<HTMLAudioElement>,
    togglePlay,
    handleError,
    filteredRadios,
    playNext,
    playPrevious,
  };

  return (
    <RadioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onError={handleError}
        onEnded={() => setIsPlaying(false)}
      />
    </RadioContext.Provider>
  );
}

export function useRadioContext() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error("useRadioContext must be used within a RadioProvider");
  }
  return context;
}
