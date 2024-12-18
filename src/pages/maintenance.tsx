import { GetStaticProps } from "next";
import Head from "next/head";
import { Header } from "@/components/layouts/Header";
import { Main } from "@/components/layouts/Main";
import { MainMaintenance } from "@/components/layouts/Main/MainMaintenance";
import { HOST_NAME } from "@/const/hostname";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

/**
 * Maintenance
 * @keit0728
 */
export default function Maintenance() {
  return (
    <>
      <Head>
        <title>Prompt Monsters | MAINTENANCE</title>
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
        <MainMaintenance />
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        "maintenance",
      ])),
    },
  };
};
