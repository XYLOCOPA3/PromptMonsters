import { Button } from "@/components/elements/Button";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilValue } from "recoil";

export type LanguageSwitchProps = {
  loading?: boolean;
  onClick: () => void;
} & BaseProps;

/**
 * LanguageSwitch
 * @keit0728
 * @param className Style from parent element
 * @param children Children
 * @param loading Loading or not
 * @param onClick Click event
 */
export const LanguageSwitch = ({
  className,
  children,
  loading,
  onClick,
}: LanguageSwitchProps) => {
  const disable = useRecoilValue(disableState);

  return (
    <Button
      className={clsx(
        className,
        "h-[40px]",
        "flex",
        "justify-center",
        "items-center",
      )}
      disabled={disable}
      variant="secondary"
      loading={loading}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
