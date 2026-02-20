import { Quote } from "lucide-react";
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

export function ZikrSettings() {
  const {
    zikrInterval,
    zikrDuration,
    zikrSilent,
    zikrPosition,
    showAzkarWidget,
    updateZikrInterval,
    updateZikrDuration,
    updateZikrSilent,
    updateZikrPosition,
    updateShowAzkarWidget,
  } = useSettings();

  return (
    <SettingsSection
      title="إعدادات الذكر التلقائي"
      description="تخصيص ظهور نافذة الأذكار المنبثقة"
      icon={Quote}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="azkar-widget-enabled">تفعيل نافذة الأذكار</Label>
            <p className="text-xs text-muted-foreground">
              إظهار نافذة الأذكار المنبثقة تلقائياً
            </p>
          </div>
          <Switch
            id="azkar-widget-enabled"
            checked={showAzkarWidget}
            onCheckedChange={updateShowAzkarWidget}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>تكرار الظهور</Label>
            <Select
              value={String(zikrInterval)}
              onValueChange={(val) => updateZikrInterval(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المدة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">كل 5 دقائق</SelectItem>
                <SelectItem value="15">كل 15 دقيقة</SelectItem>
                <SelectItem value="30">كل 30 دقيقة</SelectItem>
                <SelectItem value="60">كل ساعة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>مدة البقاء</Label>
            <Select
              value={String(zikrDuration)}
              onValueChange={(val) => updateZikrDuration(Number(val))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر المدة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 ثانية</SelectItem>
                <SelectItem value="30">30 ثانية</SelectItem>
                <SelectItem value="60">دقيقة واحدة</SelectItem>
                <SelectItem value="120">دقيقتان</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>موقع النافذة</Label>
            <Select value={zikrPosition} onValueChange={updateZikrPosition}>
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
            <Label htmlFor="zikr-silent">الوضع الصامت</Label>
            <p className="text-xs text-muted-foreground">
              عدم تشغيل الصوت تلقائياً عند ظهور الذكر
            </p>
          </div>
          <Switch
            id="zikr-silent"
            checked={zikrSilent}
            onCheckedChange={updateZikrSilent}
          />
        </div>
      </div>
    </SettingsSection>
  );
}
