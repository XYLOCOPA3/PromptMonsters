import Head from "next/head";
import { Header } from "@/components/layouts/Header";
import { Main } from "@/components/layouts/Main";
import { MainMonsters } from "@/components/layouts/Main/MainMonsters";
import { HOST_NAME } from "@/const/hostname";
import Div100vh from "react-div-100vh";

/**
 * Monsters
 * @keit0728
 */
export default function Monsters() {
  return (
    <>
      <Head>
        <title>Prompt Monsters</title>
        <meta property="og:url" content={`https://${HOST_NAME}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Prompt Monsters" />
        <meta property="og:description" content="This is Prompt Monsters." />
      </Head>
      <Div100vh>
        <Header />
        <Main>
          <MainMonsters />
        </Main>
      </Div100vh>
    </>
  );
}
