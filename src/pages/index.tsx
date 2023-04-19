import Head from "next/head";
import { Header } from "@/components/layouts/Header";
import { Main } from "@/components/layouts/Main";
import { MainHome } from "@/components/layouts/Main/MainIndex";
import Div100vh from "react-div-100vh";

/**
 * Home
 * @keit0728
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Prompt Monsters</title>
        <meta
          property="og:url"
          content={`https://${process.env.NEXT_PUBLIC_HOSTNAME}/`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prompt Monsters" />
        <meta property="og:description" content="This is Prompt Monsters." />
      </Head>
      <Div100vh>
        <Header />
        <Main>
          <MainHome />
        </Main>
      </Div100vh>
    </>
  );
}
