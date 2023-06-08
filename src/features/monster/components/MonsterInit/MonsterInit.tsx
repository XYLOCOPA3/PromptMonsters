import { useLayoutEffectOfSSR } from "@/hooks/useLayoutEffectOfSSR";
import { useMonsterController } from "@/hooks/useMonster";
import { useUserValue } from "@/hooks/useUser";
import { monsterInitState } from "@/stores/monsterInitState";
import { BaseProps } from "@/types/BaseProps";
import { useSetRecoilState } from "recoil";

export type MonsterInitProps = BaseProps;

/**
 * MonsterInit
 * @keit0728
 * @param children Children
 */
export const MonsterInit = ({ children }: MonsterInitProps) => {
  const user = useUserValue();
  const monsterController = useMonsterController();
  const setMonstersInit = useSetRecoilState(monsterInitState);

  const init = async () => {
    if (user.id === "") return;
    try {
      await monsterController.init();
    } catch (error) {
      console.error(error);
      // TODO: エラー文考える
      if (error instanceof Error) alert("Error\n\nReason: " + error.message);
      else alert("Error");
      return;
    }
    setMonstersInit(true);
  };

  useLayoutEffectOfSSR(() => {
    init();
  }, [user.id]);

  return <>{children}</>;
};
