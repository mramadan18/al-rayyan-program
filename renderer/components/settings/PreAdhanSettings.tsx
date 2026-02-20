import { BellRing } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/settings-context";

export function PreAdhanSettings() {
  const {
    showPreAdhan,
    updateShowPreAdhan,
    preAdhanMinutes,
    updatePreAdhanMinutes,
  } = useSettings();

  return (
    <SettingsSection
      title="تنبيه ما قبل الأذان"
      description="تخصيص وقت التنبيه قبل دخول وقت الصلاة"
      icon={BellRing}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notif-pre-adhan">تفعيل التنبيه</Label>
            <p className="text-xs text-muted-foreground">
              تنبيه صوتي ومرئي قبل دخول الوقت
            </p>
          </div>
          <Switch
            id="notif-pre-adhan"
            checked={showPreAdhan}
            onCheckedChange={updateShowPreAdhan}
          />
        </div>

        {showPreAdhan && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pre-adhan-minutes">وقت التنبيه</Label>
              <p className="text-xs text-muted-foreground">قبل الأذان بـ</p>
            </div>
            <div className="w-[120px]">
              <Select
                value={String(preAdhanMinutes)}
                onValueChange={(val) => updatePreAdhanMinutes(Number(val))}
              >
                <SelectTrigger className="w-full bg-secondary/50 border-secondary h-8">
                  <SelectValue placeholder="اختر المدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 دقائق</SelectItem>
                  <SelectItem value="10">10 دقائق</SelectItem>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="20">20 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
