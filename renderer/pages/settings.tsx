import { Monitor, Bell, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { AppearanceToggle } from "@/components/settings/AppearanceToggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [locationSettings, setLocationSettings] = useState({
    autoLocation: true,
    calculationMethod: "EGYPT",
    juristicMethod: "SHAFI",
  });

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

  return (
    <PageLayout title="الإعدادات">
      <div className="grid gap-6">
        {/* General / Location */}
        <SettingsSection
          title="الموقع والتوقيت"
          description="إعدادات الموقع الجغرافي لحساب مواقيت الصلاة"
          icon={MapPin}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>تحديد الموقع تلقائياً</Label>
              <p className="text-xs text-muted-foreground">
                استخدام GPS لتحديد المدينة الحالية
              </p>
            </div>
            <Switch
              id="auto-loc"
              checked={locationSettings.autoLocation}
              onCheckedChange={(value) =>
                handleSettingChange("autoLocation", value)
              }
            />
          </div>
          <Separator />
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

        {/* Notifications */}
        <SettingsSection title="التنبيهات والأذان" icon={Bell}>
          {[
            {
              label: "تنبيهات الصلوات",
              sub: "إشعار عند دخول وقت الصلاة",
              id: "notif-prayers",
            },
            {
              label: "صوت الأذان",
              sub: "تشغيل الأذان كاملاً",
              id: "adhan-sound",
            },
            {
              label: "أذكار الصباح والمساء",
              sub: "تذكير يومي",
              id: "notif-azkar",
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={item.id}>{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </div>
              <Switch id={item.id} defaultChecked />
            </div>
          ))}
        </SettingsSection>

        <SettingsSection title="المظهر" icon={Monitor}>
          <AppearanceToggle
            currentTheme={(theme as any) || "system"}
            onThemeChange={(t) => setTheme(t)}
          />
        </SettingsSection>
      </div>
    </PageLayout>
  );
}
