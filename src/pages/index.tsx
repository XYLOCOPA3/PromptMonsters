import Head from "next/head";
import { LP } from "@/components/layouts/LP/LP";
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
      <LP />
    </>
  );
}
