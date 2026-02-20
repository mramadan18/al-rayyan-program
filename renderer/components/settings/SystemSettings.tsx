import {
  Settings,
  RotateCcw,
  RefreshCw,
  Download,
  CheckCircle2,
} from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/settings-context";
import { useAutoUpdater } from "@/hooks/useAutoUpdater";
import { toast } from "sonner";
import { useEffect } from "react";

export function SystemSettings() {
  const {
    startAtLogin,
    showMiniWidget,
    miniWidgetSize,
    updateStartAtLogin,
    updateShowMiniWidget,
    updateMiniWidgetSize,
  } = useSettings();

  const { status, checkForUpdate, updateInfo } = useAutoUpdater();

  // Handle manual check feedback
  useEffect(() => {
    if (status === "not-available") {
      toast.success("أنت تستخدم أحدث إصدار بالفعل");
    } else if (status === "error") {
      toast.error("فشل التحقق من وجود تحديثات");
    }
  }, [status]);

  return (
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
            <Label htmlFor="show-mini-widget">عرض علامة مواقيت الصلاة</Label>
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

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>تحديث البرنامج</Label>
            <p className="text-xs text-muted-foreground">
              تحقق من وجود إصدارات جديدة من الريان
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono bg-secondary px-2 py-1 rounded text-muted-foreground border border-border/50">
              v{process.env.APP_VERSION || "1.2.0"}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 min-w-[140px]"
              onClick={checkForUpdate}
              disabled={status === "checking" || status === "downloading"}
            >
              {status === "checking" ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : status === "available" ? (
                <>
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span>تحديث متاح!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>التحقق من التحديث</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
