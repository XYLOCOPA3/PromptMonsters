import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { mchVerse } from "@/const/chainParams";
import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterState } from "@/hooks/useMonster";
import { useRestorePriceState } from "@/hooks/useRestorePrice";
import { useUserValue } from "@/hooks/useUser";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import { useWeb3Modal } from "@web3modal/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { useNetwork } from "wagmi";

export type RestoreStaminaButtonProps = BaseProps;

/**
 * Restore stamina button
 * @keit0728
 * @param className Style from parent element
 */
export const RestoreStaminaButton = ({
  className,
}: RestoreStaminaButtonProps) => {
  const [restorePrice, restorePriceController] = useRestorePriceState();

  const user = useUserValue();
  const [monster, monsterController] = useMonsterState();
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useRecoilState(disableState);
  const { chain } = useNetwork();

  const { t: tCommon } = useTranslation("common");
  const { open } = useWeb3Modal();

  /**
   * Click event
   */
  const handleClick = async () => {
    if (user.id === "") {
      alert(tCommon("notLogin"));
      await open();
      return;
    }
    if (chain!.id !== mchVerse.id) {
      alert(tCommon("changeNetwork"));
      return;
    }
    setDisable(true);
    setLoading(true);
    try {
      await monsterController.restoreStamina(monster.id, restorePrice, user.id);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        console.log(e.message);
        const msg = _getErrorMsg(e.message);
        alert("Failed to restore stamina.\n\nReason: " + msg);
      } else
        alert(
          "Failed to restore stamina.\n\n" +
            "Reason: \n- Stamina is not empty.\n- Failed to send transaction.",
        );
    }
    setDisable(false);
    setLoading(false);
  };

  useLayoutEffectOfSSR(() => {
    restorePriceController.init();
  }, []);

  if (monster === undefined) return <></>;
  if (restorePrice === 0 || monster.stamina !== 0 || monster.name === "")
    return <></>;
  return (
    <Button
      disabled={disable}
      className={clsx(
        className,
        "px-[10px]",
        "w-[100%]",
        "h-[62px]",
        "max-w-[200px]",
      )}
      variant="secondary"
      loading={loading}
      onClick={handleClick}
    >
      RESTORE STAMINA <br />
      {restorePrice} MCHC
    </Button>
  );
};

const _getErrorMsg = (errorMsg: string) => {
  if (errorMsg.includes("-32603")) {
    const msg = errorMsg.split(",")[0].split("(")[1];
    return msg;
  } else if (errorMsg.includes("user rejected transaction"))
    return "Rejected transaction";
  else return errorMsg;
};
