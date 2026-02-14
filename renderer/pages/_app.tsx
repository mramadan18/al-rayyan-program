import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Al Rayyan</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
