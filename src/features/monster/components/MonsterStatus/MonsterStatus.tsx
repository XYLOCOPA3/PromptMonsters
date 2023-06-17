import { useMonsterValue } from "@/hooks/useMonster";
import { MonsterModel } from "@/models/MonsterModel";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type MonsterStatusProps = BaseProps;

/**
 * Result of monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const MonsterStatus = ({ className }: MonsterStatusProps) => {
  const monster = useMonsterValue();

  if (monster === undefined) return <></>;
  if (monster.name === "") return <></>;
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
      {_buildIDOrResurrectionPrompt(monster)}
      <div className={clsx("text-sm", "text-gray-400")}># Feature</div>
      <div>{monster.feature}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Name</div>
      <div>{monster.name}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Flavor text</div>
      <div>{monster.flavor}</div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Status</div>
      <div>
        HP: {monster.status.HP} / ATK: {monster.status.ATK} / DEF:{" "}
        {monster.status.DEF} / INT: {monster.status.INT} / MGR:{" "}
        {monster.status.MGR} / AGL: {monster.status.AGL}
      </div>
      <br />
      <div className={clsx("text-sm", "text-gray-400")}># Skills</div>
      {monster.skills.map((skill) => (
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
        <div>{monster.id}</div>
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
