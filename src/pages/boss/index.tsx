import { GetStaticProps } from "next";
import Head from "next/head";
import { Header } from "@/components/layouts/Header";
import { Main } from "@/components/layouts/Main";
import { MainBoss } from "@/components/layouts/Main/MainBoss";
import { HOST_NAME } from "@/const/hostname";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * BossBattle
 * @keit0728
 */
export default function BossBattle() {
  return (
    <>
      <Head>
        <title>Prompt Monsters | BOSS</title>
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
        <MainBoss />
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "boss"])),
    },
  };
};
