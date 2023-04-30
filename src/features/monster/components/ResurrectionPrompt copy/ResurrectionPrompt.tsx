import { useState } from "react";
import { Button } from "@/components/elements/Button";
import { disableState } from "@/stores/disableState";
import { BaseProps } from "@/types/BaseProps";
import clsx from "clsx";
import { useRecoilState } from "recoil";

let resurrectionPrompt = "";
const languages = ["English", "Japanese", "Korean", "Chinese"];
const maxLength = 45;

export type ResurrectionPromptProps = BaseProps;

/**
 * Monster generator
 * @keit0728
 * @param className Style from parent element
 */
export const ResurrectionPrompt = ({ className }: ResurrectionPromptProps) => {
  const [disable, setDisable] = useRecoilState(disableState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resurrectionPrompt = e.target.value;
  };

  const handleClick = () => {
    setDisable(true);
    setLoading(true);
    setDisable(false);
    setLoading(false);
  };

  return (
    <div className={clsx("flex", "flex-col", "items-center")}>
      <input
        className={clsx(
          "bg-gray-700",
          "px-2",
          "rounded-lg",
          "w-[100%]",
          "h-[40px]",
          "mb-[20px]",
        )}
        type="text"
        name="name"
        placeholder="Monster features: ex. fire, cool, dragon"
        onChange={handleChange}
      />
      <div
        className={clsx("flex", "justify-center", "items-center", "w-[100%]")}
      >
        <Button
          className={clsx(
            "w-[100%]",
            "h-[40px]",
            "flex",
            "justify-center",
            "items-center",
            "mb-[20px]",
          )}
          disabled={disable}
          variant="secondary"
          loading={loading}
          onClick={handleClick}
        >
          Resurrection Prompt
        </Button>
      </div>
    </div>
  );
};
