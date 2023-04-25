import Head from "next/head";
import { Footer } from "@/components/layouts/Footer";
import { Header } from "@/components/layouts/Header";
import { Main } from "@/components/layouts/Main";
import { MainLP } from "@/components/layouts/Main/MainLP/MainLP";
import { HOST_NAME } from "@/const/hostname";

/**
 * Home
 * @keit0728
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Prompt Monsters</title>
        <meta property="og:url" content={`https://${HOST_NAME}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prompt Monsters" />
        <meta property="og:description" content="This is Prompt Monsters." />
      </Head>
      <Header />
      <Main>
        <MainLP />
      </Main>
      <Footer />
    </>
  );
}
