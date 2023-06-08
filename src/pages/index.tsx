import { GetStaticProps } from "next";
import Head from "next/head";
import { Footer } from "@/components/layouts/Footer";
import { Header } from "@/components/layouts/Header";
import { Main } from "@/components/layouts/Main";
import { MainLP } from "@/components/layouts/Main/MainLP/MainLP";
import { HOST_NAME } from "@/const/hostname";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * Home
 * @keit0728
 */
export default function Home() {
  console.log(process.env.NEXT_PUBLIC_BATTLE_CONTRACT);
  return (
    <>
      <Head>
        <title>Prompt Monsters</title>
        <meta property="og:url" content={`https://${HOST_NAME}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prompt Monsters" />
        <meta
          property="og:description"
          content={`Have you ever had a battle with the "strongest monster you thought of" when you were a child? Prompt Monsters is a blockchain game that utilizes AI as a game engine, allowing users to fight with the strongest monsters they can imagine.`}
        />
        <meta
          property="og:image"
          content="/assets/images/prompt-monsters-title.png"
        />
      </Head>
      <Header />
      <Main>
        <MainLP />
      </Main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "lp"])),
    },
  };
};
