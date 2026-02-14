import { Monitor, Bell, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { AppearanceToggle } from "@/components/settings/AppearanceToggle";
import { Switch } from "@/components/shared/Switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
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
            <Switch id="auto-loc" defaultChecked />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>طريقة الحساب</Label>
              <select className="w-full p-2 rounded-md border bg-background text-sm">
                <option>الهيئة المصرية العامة للمساحة</option>
                <option>أم القرى - مكة المكرمة</option>
                <option>رابطة العالم الإسلامي</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>المذهب الفقهي (العصر)</Label>
              <select className="w-full p-2 rounded-md border bg-background text-sm">
                <option>الجمهور (شافعي، مالكي، حنبلي)</option>
                <option>الحنفي</option>
              </select>
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

        {/* Appearance */}
        <SettingsSection title="المظهر" icon={Monitor}>
          <AppearanceToggle
            currentTheme="light"
            onThemeChange={(theme) => console.log(`Theme changed to ${theme}`)}
          />
        </SettingsSection>
      </div>
    </PageLayout>
  );
}
