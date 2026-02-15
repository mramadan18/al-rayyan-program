import { Monitor, Bell, MapPin, Play, Pause, FlaskConical } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { AppearanceToggle } from "@/components/settings/AppearanceToggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePrayerTimes } from "@/contexts/player-times";
import { cn } from "@/lib/utils";

const ADHAN_SOUNDS = [
  { id: "adhan-1", name: "اذان 1", path: "/audio/adhan/adhan-1.mp3" },
  {
    id: "adhan-2",
    name: "اذان 2",
    path: "/audio/adhan/adhan-2.mp3",
  },
  {
    id: "adhan-3",
    name: "اذان 3",
    path: "/audio/adhan/adhan-3.mp3",
  },
  {
    id: "adhan-4",
    name: "اذان 4",
    path: "/audio/adhan/adhan-4.mp3",
  },
  { id: "adhan-5", name: "اذان 5", path: "/audio/adhan/adhan-5.mp3" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { selectedAdhan, setSelectedAdhan } = usePrayerTimes();
  const [locationSettings, setLocationSettings] = useState({
    calculationMethod: "EGYPT",
    juristicMethod: "SHAFI",
  });

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await window.ipc.invoke("store-get", "location-settings");
        if (saved) {
          setLocationSettings(saved as typeof locationSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  const handleSettingChange = (
    key: keyof typeof locationSettings,
    value: any,
  ) => {
    const newSettings = { ...locationSettings, [key]: value };
    setLocationSettings(newSettings);
    window.ipc.invoke("store-set", "location-settings", newSettings);
  };

  const handlePlayPreview = (path: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (playingAudio === path) {
        setPlayingAudio(null);
        return;
      }
    }

    const audio = new Audio(path);
    audio.onended = () => setPlayingAudio(null);
    audio.play();
    audioRef.current = audio;
    setPlayingAudio(path);
  };

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <PageLayout title="الإعدادات">
      <div className="grid gap-6">
        <SettingsSection
          title="الموقع والتوقيت"
          description="إعدادات الموقع الجغرافي لحساب مواقيت الصلاة"
          icon={MapPin}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>طريقة الحساب</Label>
              <Select
                value={locationSettings.calculationMethod}
                onValueChange={(value) =>
                  handleSettingChange("calculationMethod", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر طريقة الحساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EGYPT">
                    الهيئة المصرية العامة للمساحة
                  </SelectItem>
                  <SelectItem value="UMM_AL_QURA">
                    أم القرى - مكة المكرمة
                  </SelectItem>
                  <SelectItem value="MWL">رابطة العالم الإسلامي</SelectItem>
                  <SelectItem value="KARACHI">
                    كراتشي (جامعة العلوم الإسلامية)
                  </SelectItem>
                  <SelectItem value="NORTH_AMERICA">
                    أمريكا الشمالية (ISNA)
                  </SelectItem>
                  <SelectItem value="DUBAI">دبي</SelectItem>
                  <SelectItem value="KUWAIT">الكويت</SelectItem>
                  <SelectItem value="QATAR">قطر</SelectItem>
                  <SelectItem value="SINGAPORE">سنغافورة</SelectItem>
                  <SelectItem value="TURKEY">تركيا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المذهب الفقهي (العصر)</Label>
              <Select
                value={locationSettings.juristicMethod}
                onValueChange={(value) =>
                  handleSettingChange("juristicMethod", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المذهب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SHAFI">
                    الجمهور (شافعي، مالكي، حنبلي)
                  </SelectItem>
                  <SelectItem value="HANAFI">الحنفي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="التنبيهات والأذان" icon={Bell}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-prayers">تنبيهات الصلوات</Label>
                <p className="text-xs text-muted-foreground">
                  إشعار عند دخول وقت الصلاة
                </p>
              </div>
              <Switch id="notif-prayers" defaultChecked />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-0.5">
                <Label htmlFor="adhan-sound">صوت الأذان</Label>
                <p className="text-xs text-muted-foreground">
                  تشغيل الأذان كاملاً عند دخول الوقت
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 bg-secondary/20 p-4 rounded-lg">
                {ADHAN_SOUNDS.map((sound) => (
                  <div
                    key={sound.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md transition-all cursor-pointer border group",
                      selectedAdhan === sound.path
                        ? "bg-primary/10 border-primary"
                        : "bg-background border-transparent hover:bg-accent/50",
                    )}
                    onClick={() => setSelectedAdhan(sound.path)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                          selectedAdhan === sound.path
                            ? "border-primary bg-primary/20"
                            : "border-muted-foreground group-hover:border-foreground",
                        )}
                      >
                        {selectedAdhan === sound.path && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          selectedAdhan === sound.path
                            ? "text-primary"
                            : "text-foreground",
                        )}
                      >
                        {sound.name}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        playingAudio === sound.path
                          ? "bg-primary/20 text-primary"
                          : "",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPreview(sound.path);
                      }}
                    >
                      {playingAudio === sound.path ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notif-azkar">أذكار الصباح والمساء</Label>
                <p className="text-xs text-muted-foreground">
                  تذكير يومي بالأذكار
                </p>
              </div>
              <Switch id="notif-azkar" defaultChecked />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="المظهر" icon={Monitor}>
          <AppearanceToggle
            currentTheme={(theme as any) || "system"}
            onThemeChange={(t) => setTheme(t)}
          />
        </SettingsSection>

        {/* Developer / Testing Section */}
        <SettingsSection title="أدوات المطور" icon={FlaskConical}>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => window.ipc.send("test-adhan-widget")}
            >
              تجربة نافذة الأذان
            </Button>
            <Button
              variant="outline"
              onClick={() => window.ipc.send("test-pre-adhan")}
            >
              تجربة تنبيه قبل الصلاة
            </Button>
            <Button
              variant="outline"
              onClick={() => window.ipc.send("show-dua-widget")}
            >
              تجربة نافذة الدعاء
            </Button>
            <Button
              variant="outline"
              onClick={() => window.ipc.send("window-close")}
            >
              إغلاق للعلبة (Tray)
            </Button>
          </div>
        </SettingsSection>
      </div>
    </PageLayout>
  );
}
