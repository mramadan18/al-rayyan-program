import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";

export interface RadioStation {
  id: number;
  name: string;
  url: string;
  recent_date: string;
  categoryId?: string;
}

export function useRadio() {
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastVolumeRef = useRef(0.5);
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
            // Find the radio in the current list to ensure URL/data is fresh
            const found = allRadios.find((r) => r.id === lastRadio.id);
            if (found) {
              setCurrentRadio(found);
            }
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
    }
  }, [volume, isMuted]);

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

  return {
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
    audioRef,
    togglePlay,
    handleError,
    filteredRadios,
  };
}
