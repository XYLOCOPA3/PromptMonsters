import { Fragment } from "react";
import Link from "next/link";
import { drawerOpenState } from "@/stores/drawerOpenState";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

/**
 * ドロワー
 * @feature
 * @author keit
 */
export const Drawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(drawerOpenState);
  const { t: tCommon } = useTranslation("common");

  const handleClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Transition show={isDrawerOpen} as={Fragment}>
      <Dialog
        unmount={false}
        onClose={() => setIsDrawerOpen(false)}
        className="fixed z-30 inset-0 overflow-y-auto"
      >
        <div className="flex w-3/4 h-screen">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-in-out duration-250"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            entered="opacity-100"
            leave="transition-opacity ease-in-out duration-250"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={clsx("fixed", "inset-0", "bg-black/60")}
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div
              className={clsx(
                "absolute",
                "top-0",
                "left-0",
                "bottom-0",
                "bg-[#303339]",
              )}
            >
              <Dialog.Panel>
                <div className={clsx("flex", "flex-col", "py-[10px]")}>
                  <Link
                    className={clsx("mx-[20px]", "my-[10px]", "font-bold")}
                    href="/monsters"
                    onClick={handleClick}
                  >
                    {tCommon("generate")}
                  </Link>
                  <Link
                    className={clsx("mx-[20px]", "my-[10px]", "font-bold")}
                    href="/boss-battle"
                    onClick={handleClick}
                  >
                    {tCommon("boss")}
                  </Link>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
