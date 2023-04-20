import { Footer } from "@/components/layouts/LP/Footer";
import {
  Abstract,
  ContactUs,
  Feature,
  Partner,
  PlayNowButton,
  RoadMap,
  SubTitle,
  Thumbnail,
  Title,
  TwitterIcon,
} from "@/features/lp";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type LPProps = BaseProps;

/**
 * LP
 * @keit0728
 * @param children Children elements
 */
export const LP = ({ children }: LPProps) => {
  return (
    <>
      <main
        className={clsx(
          "overflow-y-scroll",
          "flex",
          "flex-col",
          "items-center",
        )}
      >
        <TwitterIcon />
        <Title />
        <SubTitle />
        <PlayNowButton />
        <Thumbnail className={clsx("mb-[100px]", "md:mb-[200px]")} />
        <Abstract className={clsx("w-[90%]", "mb-[100px]", "md:mb-[200px]")} />
        <div
          className={clsx(
            "flex",
            "flex-col",
            "items-center",
            "mb-[30px]",
            "md:justify-evenly",
            "md:flex-row",
            "md:mb-[100px]",
          )}
        >
          <Feature
            className={clsx("md:h-[420px]")}
            title="Auto-generate monsters 🧌"
            description='We use AI to automatically generate new monsters based on the features of the input monster. For example, by inputting features such as "breathes fire", "has scales", and "has a tail", the system can generate a new monster that matches those features.'
          />
          <Feature
            className={clsx("md:h-[420px]")}
            title="Fully on-chain dynamic NFT ⛓"
            description="The automatically generated monsters have their own unique names, flavor texts, and stats. It is possible to mint a fully on-chain NFT containing this information with just one click. Additionally, an SVG image containing this information (similar to the Loot project) is also generated. Therefore, these assets possess not only the aspect of a fully on-chain NFT but also the facet of a dynamic NFT."
          />
          <Feature
            className={clsx("md:h-[420px]")}
            title="NFT Monsters fight ⚔️"
            description="Monsters minted as NFTs can battle against other NFT monsters. The combat system is extremely simple; all you need to do is click the Fight button. The AI understands the monsters' stats and skills and automatically generates the battle results."
          />
        </div>
        <Partner className={clsx("mb-[100px]")} />
        <RoadMap className={clsx("mb-[100px]")} />
        <ContactUs className={clsx("mb-[100px]")} />
      </main>
      <Footer />
    </>
  );
};
