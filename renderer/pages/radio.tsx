import Head from "next/head";
import { LiveRadioPlayer } from "@/components/media/LiveRadioPlayer";

export default function RadioPage() {
  return (
    <>
      <Head>
        <title>Radio - Al-Rayyan</title>
      </Head>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-amber-500 mb-4">Quran Radio</h1>
        <div className="flex justify-center">
          <LiveRadioPlayer />
        </div>
      </div>
    </>
  );
}
