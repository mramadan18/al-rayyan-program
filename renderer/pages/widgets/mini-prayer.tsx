import Head from "next/head";
import { MiniWidget } from "@/components/widgets/MiniWidget";
import { PlayerTimesProvider } from "@/contexts/player-times";

// Minimal widget window
export default function MiniPrayerWidgetPage() {
  return (
    <>
      <Head>
        <title>Al-Rayyan Widget</title>
      </Head>
      <PlayerTimesProvider>
        <div className="h-screen w-screen bg-transparent overflow-hidden rounded-3xl">
          {/* The MiniWidget itself handles drag and styling */}
          <MiniWidget />
        </div>
      </PlayerTimesProvider>
      <style jsx global>{`
        body {
          background: transparent !important;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
