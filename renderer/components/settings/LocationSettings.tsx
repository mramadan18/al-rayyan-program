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
import { Combobox } from "@/components/ui/combobox";
import { useSettings } from "@/contexts/settings-context";
import { usePrayerTimes } from "@/contexts/player-times";
import { Country, State } from "country-state-city";
import { useMemo } from "react";

export function LocationSettings() {
  const { locationSettings, updateLocationSettings } = useSettings();
  const { fetchData } = usePrayerTimes();

  const countries = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
  }, []);

  const selectedCountryCode = useMemo(() => {
    return (
      Country.getAllCountries().find((c) => c.name === locationSettings.country)
        ?.isoCode || ""
    );
  }, [locationSettings.country]);

  const states = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [selectedCountryCode]);

  const selectedStateCode = useMemo(() => {
    if (!selectedCountryCode) return "";
    return (
      State.getStatesOfCountry(selectedCountryCode).find(
        (s) => s.name === locationSettings.city,
      )?.isoCode || ""
    );
  }, [selectedCountryCode, locationSettings.city]);

  const handleUpdate = async (newSettings: typeof locationSettings) => {
    await updateLocationSettings(newSettings);
    // Explicitly fetch data with the new settings to ensure immediate update
    fetchData();
  };

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
              handleUpdate({
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
              handleUpdate({
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
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label>البلد</Label>
          <Combobox
            options={countries}
            value={selectedCountryCode}
            onValueChange={(code) => {
              const countryName = Country.getCountryByCode(code)?.name || "";
              handleUpdate({
                ...locationSettings,
                country: countryName,
                city: "", // Reset state (stored in city) when country changes
              });
            }}
            placeholder="اختر البلد"
            emptyText="لا يوجد بلد بهذا الاسم"
          />
        </div>
        <div className="space-y-2">
          <Label>المحافظة</Label>
          <Combobox
            options={states}
            value={selectedStateCode}
            onValueChange={(stateCode) => {
              const stateObj = State.getStateByCodeAndCountry(
                stateCode,
                selectedCountryCode,
              );
              handleUpdate({
                ...locationSettings,
                city: stateObj?.name || "",
                lat: stateObj
                  ? parseFloat(stateObj.latitude || "0")
                  : undefined,
                lon: stateObj
                  ? parseFloat(stateObj.longitude || "0")
                  : undefined,
              });
            }}
            placeholder="اختر المحافظة"
            emptyText="لا توجد محافظة بهذا الاسم"
            className={
              !selectedCountryCode ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </div>
      </div>
    </SettingsSection>
  );
}
