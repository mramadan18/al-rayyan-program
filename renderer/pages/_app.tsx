import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import "../styles/globals.css";

import Layout from "../components/Layout";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { SettingsProvider } from "@/contexts/settings-context";
import { RadioProvider } from "@/contexts/radio-context";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isWidget = router.pathname.startsWith("/widgets/");

  if (isWidget) {
    return (
      <SettingsProvider>
        <RadioProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Component {...pageProps} />
          </ThemeProvider>
        </RadioProvider>
      </SettingsProvider>
    );
  }

  return (
    <SettingsProvider>
      <RadioProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Layout>
            <Head>
              <title>Al Rayyan</title>
            </Head>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </RadioProvider>
    </SettingsProvider>
  );
}

export default MyApp;
