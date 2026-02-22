import { FlaskConical } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { Button } from "@/components/ui/button";
import { IpcChannels } from "shared/constants";

export function DeveloperSettings() {
  return (
    <SettingsSection title="أدوات المطور" icon={FlaskConical}>
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => window.ipc.send(IpcChannels.OPEN_ADHAN_WIDGET)}
        >
          تجربة نافذة الأذان
        </Button>
        <Button
          variant="outline"
          onClick={() => window.ipc.send("test-pre-adhan")}
        >
          تجربة تنبيه قبل الصلاة
        </Button>
        <Button
          variant="outline"
          onClick={() => window.ipc.send(IpcChannels.OPEN_DUA_WIDGET)}
        >
          تجربة نافذة الدعاء
        </Button>
        <Button
          variant="outline"
          onClick={() => window.ipc.send(IpcChannels.OPEN_ZIKR_WIDGET)}
        >
          تجربة نافذة الذكر
        </Button>
        {/* <Button
          variant="outline"
          onClick={() => window.ipc.send("test-iqamah")}
        >
          تجربة عداد الإقامة
        </Button> */}
        <Button
          variant="outline"
          onClick={() => window.ipc.send(IpcChannels.WINDOW_CLOSE)}
        >
          إغلاق للعلبة (Tray)
        </Button>
      </div>
    </SettingsSection>
  );
}
