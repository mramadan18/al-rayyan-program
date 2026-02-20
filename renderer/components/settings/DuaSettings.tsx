import { BookOpen } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/settings-context";

export function DuaSettings() {
  const {
    duaSilent,
    duaPosition,
    showDuaWidget,
    updateDuaSilent,
    updateDuaPosition,
    updateShowDuaWidget,
  } = useSettings();

  return (
    <SettingsSection
      title="إعدادات دعاء ما بعد الأذان"
      description="تخصيص ظهور نافذة الدعاء بعد الأذان"
      icon={BookOpen}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dua-widget-enabled">تفعيل نافذة الدعاء</Label>
            <p className="text-xs text-muted-foreground">
              إظهار نافذة الدعاء المنبثقة بعد الأذان
            </p>
          </div>
          <Switch
            id="dua-widget-enabled"
            checked={showDuaWidget}
            onCheckedChange={updateShowDuaWidget}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>موقع النافذة</Label>
            <Select
              disabled={!showDuaWidget}
              value={duaPosition}
              onValueChange={updateDuaPosition}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الموقع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-right">أعلى اليمين</SelectItem>
                <SelectItem value="top-left">أعلى اليسار</SelectItem>
                <SelectItem value="bottom-right">أسفل اليمين</SelectItem>
                <SelectItem value="bottom-left">أسفل اليسار</SelectItem>
                <SelectItem value="center">الوسط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dua-silent">الوضع الصامت</Label>
            <p className="text-xs text-muted-foreground">
              عدم تشغيل الصوت تلقائياً عند ظهور الدعاء
            </p>
          </div>
          <Switch
            id="dua-silent"
            disabled={!showDuaWidget}
            checked={duaSilent}
            onCheckedChange={updateDuaSilent}
          />
        </div>
      </div>
    </SettingsSection>
  );
}
