import { useCallback } from "react";
import { selectedMonsterIdNameState } from "@/stores/selectedMonsterIdNameState";
import { setCookie } from "cookies-next";
import { useRecoilValue, useSetRecoilState } from "recoil";

export const useSelectedMonsterIdNameValue = (): string => {
  const selectedMonsterIdName = useRecoilValue(selectedMonsterIdNameState);
  return selectedMonsterIdName;
};

export const useSetSelectedMonsterIdNameState = (): ((
  selectedMonsterIdName: string,
) => void) => {
  const setSelectedMonsterIdNameInternal = useSetRecoilState(
    selectedMonsterIdNameState,
  );
  const setSelectedMonsterIdName = useCallback(
    (selectedMonsterIdName: string) => {
      const ids = selectedMonsterIdName.split(" ");
      const id = ids[ids.length - 1];
      setCookie("SELECTED_MONSTER_ID", !isNaN(Number(id)) ? id : "");
      setSelectedMonsterIdNameInternal(selectedMonsterIdName);
    },
    [setSelectedMonsterIdNameInternal],
  );
  return setSelectedMonsterIdName;
};

export const useSelectedMonsterIdNameState = (): [
  string,
  (selectedMonsterIdName: string) => void,
] => [useSelectedMonsterIdNameValue(), useSetSelectedMonsterIdNameState()];
