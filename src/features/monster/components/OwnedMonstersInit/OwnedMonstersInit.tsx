import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useOwnedMonstersState } from "@/hooks/useOwnedMonsters";
import { useUserValue } from "@/hooks/useUser";
import { ownedMonstersInitState } from "@/stores/ownedMonstersInitState";
import { BaseProps } from "@/types/BaseProps";
import { useSetRecoilState } from "recoil";

export type OwnedMonstersInitProps = BaseProps;

/**
 * OwnedMonstersInit
 * @keit0728
 * @param children Children
 */
export const OwnedMonstersInit = ({ children }: OwnedMonstersInitProps) => {
  const user = useUserValue();
  const [ownedMonsters, ownedMonstersController] = useOwnedMonstersState();
  const setOwnedMonstersInit = useSetRecoilState(ownedMonstersInitState);

  const init = async () => {
    if (user.id === "") return;
    try {
      await ownedMonstersController.init(user.id, ownedMonsters);
    } catch (error) {
      console.error(error);
    }
    setOwnedMonstersInit(true);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [user.id]);

  return <>{children}</>;
};
