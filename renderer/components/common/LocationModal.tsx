import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { usePrayerTimes } from "@/contexts/player-times";
import { MapPin, Loader2 } from "lucide-react";
import { Country, State } from "country-state-city";

export function LocationModal() {
  const { isLocationModalOpen, setIsLocationModalOpen, fetchData, loading } =
    usePrayerTimes();
  const [countryName, setCountryName] = useState("Egypt");
  const [stateName, setStateName] = useState("Cairo");

  const countries = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      value: c.isoCode,
      label: c.name,
    }));
  }, []);

  const selectedCountryCode = useMemo(() => {
    return (
      Country.getAllCountries().find((c) => c.name === countryName)?.isoCode ||
      ""
    );
  }, [countryName]);

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
        (s) => s.name === stateName,
      )?.isoCode || ""
    );
  }, [selectedCountryCode, stateName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (countryName && stateName) {
      const stateObj = State.getStatesOfCountry(selectedCountryCode).find(
        (s) => s.name === stateName,
      );
      await fetchData({
        country: countryName,
        city: stateName, // API still expects 'city' key
        lat: stateObj ? parseFloat(stateObj.latitude || "0") : undefined,
        lon: stateObj ? parseFloat(stateObj.longitude || "0") : undefined,
      });
      setIsLocationModalOpen(false);
    }
  };

  return (
    <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            تحديد الموقع
          </DialogTitle>
          <DialogDescription>
            فشلنا في تحديد موقعك تلقائياً. يرجى إدخال بلدك ومحافظتك للحصول على
            مواقيت الصلاة الصحيحة.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>البلد</Label>
            <Combobox
              options={countries}
              value={selectedCountryCode}
              onValueChange={(code) => {
                const name = Country.getCountryByCode(code)?.name || "";
                setCountryName(name);
                setStateName(""); // Reset state when country changes
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
              onValueChange={(code) => {
                const s = State.getStateByCodeAndCountry(
                  code,
                  selectedCountryCode,
                );
                setStateName(s?.name || "");
              }}
              placeholder="اختر المحافظة"
              emptyText="لا توجد محافظة بهذا الاسم"
              className={
                !selectedCountryCode ? "opacity-50 cursor-not-allowed" : ""
              }
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !countryName || !stateName}
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحميل...
                </>
              ) : (
                "تأكيد الموقع"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
