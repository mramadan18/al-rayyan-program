import Head from "next/head";
import { ZakatCalculator } from "@/components/calculators/ZakatCalculator";

export default function ZakatPage() {
  return (
    <>
      <Head>
        <title>Zakat Calculator - Al-Rayyan</title>
      </Head>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-amber-500">
            Zakat Calculator
          </h1>
        </div>
        <ZakatCalculator />
      </div>
    </>
  );
}
