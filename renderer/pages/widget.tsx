import Head from "next/head";
import { MiniWidget } from "@/components/widgets/MiniWidget";

// Minimal widget window
export default function WidgetPage() {
  return (
    <>
      <Head>
        <title>Al-Rayyan Widget</title>
      </Head>
      <div className="h-screen w-screen flex items-center justify-center bg-transparent overflow-hidden">
        {/* The MiniWidget itself handles drag and styling */}
        <MiniWidget />
      </div>
      <style jsx global>{`
        body {
          background: transparent !important;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
