import { DirectionProvider } from "@/components/ui/direction";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=IBM+Plex+Sans+Arabic:wght@100..700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <DirectionProvider dir="rtl">
          <Main />
          <NextScript />
        </DirectionProvider>
      </body>
    </Html>
  );
}
