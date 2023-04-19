import { useMonsterValue } from "@/hooks/useMonster";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type ResultProps = BaseProps;

/**
 * Result of monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const Result = ({ className }: ResultProps) => {
  const monster = useMonsterValue();

  if (monster.name === "") return <></>;
  return (
    <div
      className={clsx(
        "border-white",
        "border-[1px]",
        "rounded-md",
        "p-[10px]",
        "text-justify",
        className,
      )}
    >
      {monster.id === "" ? (
        <></>
      ) : (
        <>
          <div className={clsx("text-sm", "text-gray-400")}># Id</div>
          <div>{monster.id}</div>
          <br />
        </>
      )}
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
