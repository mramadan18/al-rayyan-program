import { PageLayout } from "@/components/layout/PageLayout";
import { LocationSettings } from "@/components/settings/LocationSettings";
import { AdhanSettings } from "@/components/settings/AdhanSettings";
import { PreAdhanSettings } from "@/components/settings/PreAdhanSettings";
import { DuaSettings } from "@/components/settings/DuaSettings";
import { ZikrSettings } from "@/components/settings/ZikrSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SystemSettings } from "@/components/settings/SystemSettings";
import { DeveloperSettings } from "@/components/settings/DeveloperSettings";

export default function SettingsPage() {
  return (
    <PageLayout title="الإعدادات">
      <div className="grid gap-6 pb-12">
        <LocationSettings />
        <AdhanSettings />
        <PreAdhanSettings />
        <DuaSettings />
        <ZikrSettings />
        <AppearanceSettings />
        <SystemSettings />
        {process.env.NODE_ENV === "development" && <DeveloperSettings />}
      </div>
    </PageLayout>
  );
}
