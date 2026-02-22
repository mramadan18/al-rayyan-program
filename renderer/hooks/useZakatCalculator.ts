import { useState, useEffect, useCallback } from "react";
import {
  fetchGoldPrice,
  calculateZakatMaal,
  calculateZakatFitr,
  FALLBACK_GOLD_PRICE,
} from "@/lib/zakat-utils";

export type TabValue = "maal" | "fitr";

export function useZakatCalculator() {
  const [activeTab, setActiveTab] = useState<TabValue>("fitr");
  const [totalZakat, setTotalZakat] = useState(0);
  const [isLoadingGold, setIsLoadingGold] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [goldPrice, setGoldPrice] = useState(FALLBACK_GOLD_PRICE);
  const [currency, setCurrency] = useState("ج.م");

  // Zakat Al-Maal State
  const [cash, setCash] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [businessAssets, setBusinessAssets] = useState("");
  const [nisabStatus, setNisabStatus] = useState<boolean>(false);
  const [totalWealth, setTotalWealth] = useState(0);

  // Zakat Al-Fitr State
  const [familyMembers, setFamilyMembers] = useState("");
  const [fitrAmount, setFitrAmount] = useState("35");

  const loadGoldPrice = async () => {
    setIsLoadingGold(true);
    setHasError(false);
    try {
      const currencyMap: Record<string, string> = {
        "ج.م": "EGP",
        "ر.س": "SAR",
        "د.إ": "AED",
        $: "USD",
      };
      const apiCurrency = currencyMap[currency] || "EGP";
      const price = await fetchGoldPrice(apiCurrency);
      setGoldPrice(price);
    } catch (error) {
      console.error("Failed to load gold price", error);
      setHasError(true);
    } finally {
      setIsLoadingGold(false);
    }
  };

  useEffect(() => {
    loadGoldPrice();
  }, [currency]);

  const handleCalculateMaal = useCallback(() => {
    const res = calculateZakatMaal(
      parseFloat(cash) || 0,
      parseFloat(goldGrams) || 0,
      parseFloat(businessAssets) || 0,
      goldPrice,
    );
    setTotalWealth(res.totalWealth);
    setNisabStatus(res.isEligible);
    setTotalZakat(res.zakatDue);
  }, [cash, goldGrams, businessAssets, goldPrice]);

  const handleCalculateFitr = useCallback(() => {
    const res = calculateZakatFitr(
      parseInt(familyMembers) || 0,
      parseFloat(fitrAmount) || 0,
    );
    setTotalZakat(res);
  }, [familyMembers, fitrAmount]);

  useEffect(() => {
    if (activeTab === "maal") {
      handleCalculateMaal();
    } else {
      handleCalculateFitr();
    }
  }, [activeTab, handleCalculateMaal, handleCalculateFitr]);

  return {
    activeTab,
    setActiveTab,
    totalZakat,
    isLoadingGold,
    hasError,
    goldPrice,
    loadGoldPrice,
    currency,
    setCurrency,
    cash,
    setCash,
    goldGrams,
    setGoldGrams,
    businessAssets,
    setBusinessAssets,
    nisabStatus,
    totalWealth,
    familyMembers,
    setFamilyMembers,
    fitrAmount,
    setFitrAmount,
  };
}
