import { useState } from "react";
import Image from "next/image";
import { BaseProps } from "@/types/BaseProps";
import { Transition } from "@headlessui/react";
import clsx from "clsx";

export type WarningProps = { hintText: string } & BaseProps;

/**
 * Warning
 * @keit0728
 * @param className Style from parent element
 */
export const Warning = ({ className, hintText }: WarningProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const lines = hintText.split("\n");

  return (
    <div
      className={clsx(className, "flex", "justify-center", "items-center")}
      onMouseEnter={() => setShowWarning(true)}
      onMouseLeave={() => setShowWarning(false)}
    >
      <Image
        className={clsx("w-[30px]")}
        src="/assets/images/warning_white_24dp.svg"
        alt="warning-icon"
        width={50}
        height={50}
      />
      <Transition
        show={showWarning}
        enter="transition-opacity duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-10 p-[10px] text-sm font-medium text-white bg-gray-900 rounded w-[300px] text-justify">
          {lines.map((line, index) => {
            if (line === "") return <br />;
            return <div key={index}>{line}</div>;
          })}
        </div>
      </Transition>
    </div>
  );
};
