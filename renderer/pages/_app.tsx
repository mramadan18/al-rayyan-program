import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

import Layout from "../components/Layout";
import { ThemeProvider } from "@/components/theme-provider";

function MyApp({ Component, pageProps }: AppProps) {
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
