import {
  Monitor,
  Bell,
  MapPin,
  Play,
  Pause,
  FlaskConical,
  Settings,
  RotateCcw,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { IpcChannels } from "shared/constants";
import { useSettings } from "@/contexts/settings-context";

const ADHAN_SOUNDS = [
  { id: "adhan-1", name: "اذان 1", path: "/audio/adhan/adhan-1.mp3" },
  { id: "adhan-2", name: "اذان 2", path: "/audio/adhan/adhan-2.mp3" },
  { id: "adhan-3", name: "اذان 3", path: "/audio/adhan/adhan-3.mp3" },
  { id: "adhan-4", name: "اذان 4", path: "/audio/adhan/adhan-4.mp3" },
  { id: "adhan-5", name: "اذان 5", path: "/audio/adhan/adhan-5.mp3" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    locationSettings,
    startAtLogin,
    showMiniWidget,
    selectedAdhan,
    miniWidgetSize,
    updateLocationSettings,
    updateStartAtLogin,
    updateShowMiniWidget,
    updateSelectedAdhan,
    updateMiniWidgetSize,
  } = useSettings();

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
                  updateLocationSettings({
                    ...locationSettings,
                    calculationMethod: value,
                  })
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
                  updateLocationSettings({
                    ...locationSettings,
                    juristicMethod: value,
                  })
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
                    onClick={() => updateSelectedAdhan(sound.path)}
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

        <SettingsSection title="إعدادات النظام" icon={Settings}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="start-at-login">التشغيل عند بدء الجهاز</Label>
                <p className="text-xs text-muted-foreground">
                  تشغيل البرنامج تلقائياً عند فتح الويندوز
                </p>
              </div>
              <Switch
                id="start-at-login"
                checked={startAtLogin}
                onCheckedChange={updateStartAtLogin}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-mini-widget">
                  عرض علامة مواقيت الصلاة
                </Label>
                <p className="text-xs text-muted-foreground">
                  إظهار نافذة صغيرة لمواقيت الصلاة على سطح المكتب
                </p>
              </div>
              <Switch
                id="show-mini-widget"
                checked={showMiniWidget}
                onCheckedChange={updateShowMiniWidget}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>حجم علامة مواقيت الصلاة</Label>
                <p className="text-xs text-muted-foreground">
                  تغيير حجم النافذة على سطح المكتب (0.7 - 1.5)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 w-48">
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.1"
                    value={miniWidgetSize}
                    onChange={(e) =>
                      updateMiniWidgetSize(parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-mono w-10 text-center">
                    {Math.round(miniWidgetSize * 100)}%
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => updateMiniWidgetSize(1.0)}
                  title="إعادة ضبط الحجم"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="أدوات المطور" icon={FlaskConical}>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => window.ipc.send(IpcChannels.OPEN_ADHAN_WIDGET)}
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
              onClick={() => window.ipc.send(IpcChannels.OPEN_DUA_WIDGET)}
            >
              تجربة نافذة الدعاء
            </Button>
            <Button
              variant="outline"
              onClick={() => window.ipc.send(IpcChannels.OPEN_ZIKR_WIDGET)}
            >
              تجربة نافذة الذكر
            </Button>
            <Button
              variant="outline"
              onClick={() => window.ipc.send(IpcChannels.WINDOW_CLOSE)}
            >
              إغلاق للعلبة (Tray)
            </Button>
          </div>
        </SettingsSection>
      </div>
    </PageLayout>
  );
}
