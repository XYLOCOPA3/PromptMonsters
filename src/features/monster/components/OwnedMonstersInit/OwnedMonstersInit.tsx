import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterValue } from "@/hooks/useMonster";
import { useOwnedMonstersController } from "@/hooks/useOwnedMonsters";
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
  const monster = useMonsterValue();
  const ownedMonsterIdsController = useOwnedMonstersController();
  const setOwnedMonstersInit = useSetRecoilState(ownedMonstersInitState);

  const init = async () => {
    if (user.id === "") return;
    await ownedMonsterIdsController.init(user.id, monster);
    setOwnedMonstersInit(true);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [user.id]);

  return <>{children}</>;
};
