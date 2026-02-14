import Head from "next/head";
import { RamadanImsakia } from "@/components/ramadan/RamadanImsakia";

export default function RamadanPage() {
  return (
    <>
      <Head>
        <title>إمساكية رمضان - الريان</title>
      </Head>
      <div className="container mx-auto p-6 max-w-5xl h-[calc(100vh-100px)]">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">
          رمضان ١٤٤٥ هـ
        </h1>
        <RamadanImsakia />
      </div>
    </>
  );
}
