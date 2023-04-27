import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useOwnedMonstersController } from "@/hooks/useOwnedMonsters";
import { useUserValue } from "@/hooks/useUser";
import { BaseProps } from "@/types/BaseProps";

export type OwnedMonstersInitProps = BaseProps;

/**
 * OwnedMonstersInit
 * @keit0728
 * @param children Children
 */
export const OwnedMonstersInit = ({ children }: OwnedMonstersInitProps) => {
  const user = useUserValue();
  const ownedMonsterIdsController = useOwnedMonstersController();

  const init = async () => {
    if (user.id === "") return;
    await ownedMonsterIdsController.init(user.id);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [user.id]);

  return <>{children}</>;
};
