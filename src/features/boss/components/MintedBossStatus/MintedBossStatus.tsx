import Link from "next/link";
import { useMintedBossValue } from "@/hooks/useMintedBoss";
import { MonsterModel } from "@/models/MonsterModel";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MintedBossStatusProps = BaseProps;

/**
 * MintedBossStatus
 * @keit0728
 * @param className Style from parent element
 */
export const MintedBossStatus = ({ className }: MintedBossStatusProps) => {
  const mintedBoss = useMintedBossValue();

  if (mintedBoss === undefined || mintedBoss.name === "") return <></>;
  return (
    <div
      className={clsx(
        className,
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "text-justify",
      )}
    >
      {_buildIDOrResurrectionPrompt(mintedBoss)}
      <div className={clsx("text-sm", "text-gray-400")}># Feature</div>
      <div>{mintedBoss.feature}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Name</div>
      <div>{mintedBoss.name}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Flavor text</div>
      <div>{mintedBoss.flavor}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Status</div>
      <div>
        HP: {mintedBoss.status.HP} / ATK: {mintedBoss.status.ATK} / DEF:{" "}
        {mintedBoss.status.DEF} / INT: {mintedBoss.status.INT} / MGR:{" "}
        {mintedBoss.status.MGR} / AGL: {mintedBoss.status.AGL}
      </div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Skills</div>
      {mintedBoss.skills.map((skill) => (
        <div key={skill}>- {skill}</div>
      ))}
    </div>
  );
};

/**
 * Build ID or Resurrection Prompt
 * @param monster MonsterModel
 */
export const _buildIDOrResurrectionPrompt = (monster: MonsterModel) => {
  if (monster.id !== "")
    return (
      <>
        <div className={clsx("text-sm", "text-gray-400")}># Id</div>
        <Link
          className={clsx(
            "mb-2",
            "text-blue-500",
            "hover:underline",
            "font-bold",
          )}
          href={`https://tofunft.com/nft/mch-verse/0x12C7aA85c8BE2b32bdCfC013Da08347EeE95c238/${monster.id}`}
          target="_blank"
        >
          <div>{monster.id}</div>
        </Link>
        <br />
      </>
    );
  if (monster.resurrectionPrompt !== "")
    return (
      <>
        <div className={clsx("text-sm", "text-gray-400")}>
          # Resurrection Prompt
        </div>
        <div className={clsx("text-[12px]", "md:text-base")}>
          {monster.resurrectionPrompt}
        </div>
        <br />
      </>
    );
  return <></>;
};
