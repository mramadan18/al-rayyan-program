import { Bell, Play, Pause } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/settings-context";
import { useAudioPreview } from "@/hooks/use-audio-preview";

const ADHAN_SOUNDS = [
  { id: "adhan-1", name: "اذان 1", path: "/audio/adhan/adhan-1.mp3" },
  { id: "adhan-2", name: "اذان 2", path: "/audio/adhan/adhan-2.mp3" },
  { id: "adhan-3", name: "اذان 3", path: "/audio/adhan/adhan-3.mp3" },
  { id: "adhan-4", name: "اذان 4", path: "/audio/adhan/adhan-4.mp3" },
  { id: "adhan-5", name: "اذان 5", path: "/audio/adhan/adhan-5.mp3" },
];

export function AdhanSettings() {
  const {
    selectedAdhan,
    updateSelectedAdhan,
    prayerNotifications,
    updatePrayerNotifications,
  } = useSettings();
  const { playingAudio, handlePlayPreview } = useAudioPreview();

  return (
    <SettingsSection title="التنبيهات والأذان" icon={Bell}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notif-prayers">تنبيهات الصلوات</Label>
            <p className="text-xs text-muted-foreground">
              إشعار عند دخول وقت الصلاة
            </p>
          </div>
          <Switch
            id="notif-prayers"
            checked={prayerNotifications}
            onCheckedChange={updatePrayerNotifications}
          />
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
      </div>
    </SettingsSection>
  );
}
