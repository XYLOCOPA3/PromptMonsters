import { useState } from "react";
import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import uuid from "react-uuid";

export type HintProps = { hintText: string } & BaseProps;

/**
 * Hint
 * @keit0728
 * @param className Style from parent element
 */
export const Hint = ({ className, hintText }: HintProps) => {
  const [showHint, setShowHint] = useState(false);
  const lines = hintText.split("\n");

  return (
    <div
      className={clsx(className, "flex", "justify-center", "items-center")}
      onMouseEnter={() => setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
    >
      <Image
        className={clsx("w-[30px]")}
        src="/assets/images/help_white_24dp.svg"
        alt="hint-icon"
        width={50}
        height={50}
      />
      <Transition
        show={showHint}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-10 p-[10px] text-sm font-medium text-white bg-gray-900 rounded w-[300px] text-justify">
          {lines.map((line) => {
            if (line === "") return <br key={uuid()} />;
            return <div key={uuid()}>{line}</div>;
          })}
        </div>
      </Transition>
    </div>
  );
};
