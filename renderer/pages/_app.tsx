import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import "../styles/globals.css";

import Layout from "../components/Layout";
import { ThemeProvider } from "@/components/common/ThemeProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isWidget = router.pathname.startsWith("/widgets/");

  if (isWidget) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        <Head>
          <title>Al Rayyan</title>
        </Head>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
