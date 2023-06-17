import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Drawer } from "@/components/elements/Drawer";
import { mchVerse } from "@/const/chainParams";
import { DevComponents } from "@/dev/components/DevComponents";
import { AutoLogin } from "@/features/auth";
import { BossEventInit, BossInit } from "@/features/boss";
import { TwitterIcon } from "@/features/lp";
import {
  MonsterInit,
  MonsterMintPriceInit,
  OwnedMonstersInit,
} from "@/features/monster";
import "@/styles/globals.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { appWithTranslation } from "next-i18next";
import { RecoilRoot } from "recoil";
import { WagmiConfig, configureChains, createConfig } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
const chains = [mchVerse];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ version: 1, chains, projectId }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

const App = ({ Component, pageProps }: AppProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="msapplication-square70x70logo"
          content="/assets/favicons/site-tile-70x70.png"
        />
        <meta
          name="msapplication-square150x150logo"
          content="/assets/favicons/site-tile-150x150.png"
        />
        <meta
          name="msapplication-wide310x150logo"
          content="/assets/favicons/site-tile-310x150.png"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/assets/favicons/site-tile-310x310.png"
        />
        <meta name="msapplication-TileColor" content="#0078d7" />
        <link
          rel="shortcut icon"
          type="image/vnd.microsoft.icon"
          href="/assets/favicons/favicon.ico"
        />
        <link
          rel="icon"
          type="image/vnd.microsoft.icon"
          href="/assets/favicons/favicon.ico"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/assets/favicons/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/assets/favicons/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/assets/favicons/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/assets/favicons/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/assets/favicons/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/assets/favicons/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/assets/favicons/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/assets/favicons/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/favicons/apple-touch-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="36x36"
          href="/assets/favicons/android-chrome-36x36.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/assets/favicons/android-chrome-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/assets/favicons/android-chrome-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/assets/favicons/android-chrome-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/assets/favicons/android-chrome-128x128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href="/assets/favicons/android-chrome-144x144.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href="/assets/favicons/android-chrome-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/assets/favicons/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/assets/favicons/android-chrome-256x256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href="/assets/favicons/android-chrome-384x384.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/assets/favicons/android-chrome-512x512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="36x36"
          href="/assets/favicons/icon-36x36.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/assets/favicons/icon-48x48.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="72x72"
          href="/assets/favicons/icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/assets/favicons/icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/assets/favicons/icon-128x128.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="144x144"
          href="/assets/favicons/icon-144x144.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="152x152"
          href="/assets/favicons/icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="160x160"
          href="/assets/favicons/icon-160x160.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/assets/favicons/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/assets/favicons/icon-196x196.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="256x256"
          href="/assets/favicons/icon-256x256.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="384x384"
          href="/assets/favicons/icon-384x384.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/assets/favicons/icon-512x512.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicons/icon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="24x24"
          href="/assets/favicons/icon-24x24.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicons/icon-32x32.png"
        />
        <link rel="manifest" href="/assets/favicons/manifest.json" />{" "}
      </Head>
      {ready ? (
        <WagmiConfig config={wagmiClient}>
          <RecoilRoot>
            <AutoLogin>
              <MonsterMintPriceInit>
                <OwnedMonstersInit>
                  <BossEventInit>
                    <BossInit>
                      <MonsterInit>
                        {/* TODO: 後で消す */}
                        <DevComponents />
                        <TwitterIcon />
                        <Drawer />
                        <Component {...pageProps} />
                      </MonsterInit>
                    </BossInit>
                  </BossEventInit>
                </OwnedMonstersInit>
              </MonsterMintPriceInit>
            </AutoLogin>
          </RecoilRoot>
        </WagmiConfig>
      ) : null}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
};

export default appWithTranslation(App);
