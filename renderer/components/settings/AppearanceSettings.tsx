import { Monitor } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { AppearanceToggle } from "./AppearanceToggle";
import { useTheme } from "next-themes";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection title="المظهر" icon={Monitor}>
      <AppearanceToggle
        currentTheme={(theme as any) || "system"}
        onThemeChange={(t) => setTheme(t)}
      />
    </SettingsSection>
  );
}
