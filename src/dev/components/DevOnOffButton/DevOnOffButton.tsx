import { Button } from "@/components/elements/Button";
import { devOnOffState } from "@/dev/stores/devOnOffState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState } from "recoil";

export type DevOnOffButtonProps = BaseProps;

/**
 * DevOnOffButton
 * @keit0728
 * @param className Style from parent element
 */
export const DevOnOffButton = ({ className }: DevOnOffButtonProps) => {
  const [devOnOff, setDevOnOff] = useRecoilState(devOnOffState);

  const handleClick = async () => {
    setDevOnOff((prevState) => !prevState);
  };

  return (
    <Button
      className={clsx(className, "m-[5px]", "p-[5px]")}
      onClick={handleClick}
    >
      {devOnOff ? "DevOff" : "DevOn"}
    </Button>
  );
};
