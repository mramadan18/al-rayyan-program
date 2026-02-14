import React from "react";
import Head from "next/head";

// Minimal widget window
export default function WidgetPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Al-Rayyan Widget</title>
      </Head>
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-transparent select-none draggable">
        {/* We assume the window itself is transparent via Electron configuration */}
        <div className="text-center group">
          <h1
            className="text-4xl font-bold text-amber-400 drop-shadow-md font-quran mb-1 transform group-hover:scale-105 transition-transform"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            المغرب
          </h1>
          <p
            className="text-2xl font-mono text-white font-medium tracking-widest"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
          >
            02:45:10
          </p>
        </div>
      </div>
      <style jsx global>{`
        body {
          background: transparent !important;
          overflow: hidden;
        }
        .draggable {
          -webkit-app-region: drag;
        }
      `}</style>
    </React.Fragment>
  );
}
