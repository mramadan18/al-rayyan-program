export const GOLD_NISAB_GRAMS = 85;
export const ZAKAT_RATE = 0.025; // 2.5%

// Last known price for 1 gram of 24K Gold (in EGP - as an example default)
// Ideally, this should be in USD and converted, or fetched directly in the user's currency.
// Let's use a reasonable default. In Feb 2026, let's assume ~4000 EGP/gram for demo.
export const FALLBACK_GOLD_PRICE = 4000;

export interface ZakatCalculationResult {
  totalWealth: number;
  nisabValue: number;
  isEligible: boolean;
  zakatDue: number;
  goldPriceUsed: number;
}

export async function fetchGoldPrice(
  currency: string = "EGP",
): Promise<number> {
  try {
    // Note: Most Gold APIs require an API key.
    // This is a placeholder for GoldAPI.io or similar.
    // Replace 'YOUR_API_KEY' with a real key.
    const apiKey = process.env.NEXT_PUBLIC_GOLD_API_KEY || "";

    if (!apiKey) {
      console.warn("Gold API key not found, using fallback price.");
      return FALLBACK_GOLD_PRICE;
    }

    const response = await fetch(`https://www.goldapi.io/api/XAU/${currency}`, {
      headers: {
        "x-access-token": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch gold price");
    }

    const data = await response.json();
    // GoldAPI returns price per gram if requested or you might need to convert from ounce
    // Usually 'price' field is what we need.
    return data.price_gram_24k || FALLBACK_GOLD_PRICE;
  } catch (error) {
    console.error("Error fetching gold price:", error);
    return FALLBACK_GOLD_PRICE;
  }
}

export function calculateZakatMaal(
  cash: number,
  goldGrams: number,
  businessAssets: number,
  currentGoldPrice: number,
): ZakatCalculationResult {
  const goldValue = goldGrams * currentGoldPrice;
  const totalWealth = cash + goldValue + businessAssets;
  const nisabValue = GOLD_NISAB_GRAMS * currentGoldPrice;
  const isEligible = totalWealth >= nisabValue;
  const zakatDue = isEligible ? totalWealth * ZAKAT_RATE : 0;

  return {
    totalWealth,
    nisabValue,
    isEligible,
    zakatDue,
    goldPriceUsed: currentGoldPrice,
  };
}

export function calculateZakatFitr(
  familyMembers: number,
  fitrAmountPerPerson: number,
): number {
  return familyMembers * fitrAmountPerPerson;
}
