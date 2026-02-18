import { MapPin } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/settings-context";

export function LocationSettings() {
  const { locationSettings, updateLocationSettings } = useSettings();

  return (
    <SettingsSection
      title="الموقع والتوقيت"
      description="إعدادات الموقع الجغرافي لحساب مواقيت الصلاة"
      icon={MapPin}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>طريقة الحساب</Label>
          <Select
            value={locationSettings.calculationMethod}
            onValueChange={(value) =>
              updateLocationSettings({
                ...locationSettings,
                calculationMethod: value,
              })
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
              updateLocationSettings({
                ...locationSettings,
                juristicMethod: value,
              })
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
  );
}
