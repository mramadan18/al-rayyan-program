import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface AppearanceToggleProps {
  currentTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export function AppearanceToggle({
  currentTheme = "light",
  onThemeChange,
}: AppearanceToggleProps) {
  const themes = [
    { id: "light", label: "فاتح", icon: Sun },
    { id: "dark", label: "داكن", icon: Moon },
    { id: "system", label: "النظام", icon: Monitor },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-4">
      {themes.map((theme) => {
        const Icon = theme.icon;
        const isActive = currentTheme === theme.id;

        return (
          <Button
            key={theme.id}
            variant="outline"
            onClick={() => onThemeChange?.(theme.id as Theme)}
            className={cn(
              "h-24 flex flex-col gap-2 transition-all",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:bg-accent",
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span>{theme.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
