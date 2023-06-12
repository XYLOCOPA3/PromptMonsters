import { Button } from "@/components/elements/Button";
import { ITEMS, MAX_LIFE_POINT } from "@/const/bossBattle";
import { BossBattlePrevButton, BossBattleUseButton } from "@/features/boss";
import { useBossValue } from "@/hooks/useBoss";
import { useBossBattleState } from "@/hooks/useBossBattle";
import { useLanguageValue } from "@/hooks/useLanguage";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";

export type BossBattleMenuItemProps = BaseProps;

/**
 * BossBattleMenuItem
 * @keit0728
 * @param className Style from parent element
 */
export const BossBattleMenuItem = ({ className }: BossBattleMenuItemProps) => {
  const language = useLanguageValue();
  const boss = useBossValue();
  const [bossBattle, bossBattleController] = useBossBattleState();

  if (boss.name === "" || bossBattle.itemIds.length === 0 || language === "")
    return <></>;
  return (
    <>
      <div
        className={clsx(
          className,
          "flex",
          "mb-[10px]",
          "h-[190px]",
          "md:h-[250px]",
        )}
      >
        <div
          className={clsx(
            "w-1/3",
            "font-bold",
            "bg-[#272727]/80",
            "py-[10px]",
            "px-[4px]",
            "rounded-lg",
            "border-[1px]",
            "text-center",
            "mr-[10px]",
            bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
            "overflow-y-scroll",
            "md:p-[10px]",
          )}
        >
          <div className={clsx("flex", "flex-col")}>
            {bossBattle.itemIds.map((itemId, index) => {
              const handleClick = async () => {
                await bossBattleController.setItemId(itemId);
              };
              return (
                <>
                  <Button
                    key={index}
                    variant="bossBattle"
                    className={clsx(
                      "my-[2px]",
                      "py-[5px]",
                      "text-[11px]",
                      "md:py-[10px]",
                      "md:text-[16px]",
                    )}
                    holdDown={itemId === bossBattle.setItemId}
                    onClick={handleClick}
                  >
                    {ITEMS[language as "日本語" | "English"][itemId].name}
                  </Button>
                </>
              );
            })}
          </div>
        </div>
        <div
          className={clsx(
            "w-2/3",
            "font-bold",
            "bg-[#272727]/80",
            "p-[10px]",
            "rounded-lg",
            "border-[1px]",
            bossBattle.lp < MAX_LIFE_POINT / 4 ? "border-[#FCA7A4]" : "",
            "overflow-y-scroll",
          )}
        >
          {bossBattle.itemIds.includes(bossBattle.setItemId) ? (
            ITEMS[language as "日本語" | "English"][bossBattle.setItemId].desc
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className={clsx("flex", "justify-between")}>
        <BossBattlePrevButton className={clsx("w-1/4")} />
        <BossBattleUseButton className={clsx("w-1/4")} />
      </div>
    </>
  );
};
