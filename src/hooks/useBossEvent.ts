import { BossEventState, bossEventState } from "@/stores/bossEventState";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";

export interface BossEventController {
  init: () => Promise<void>;
  reset: () => void;
}

export const useBossEventValue = (): BossEventState => {
  return useRecoilValue(bossEventState);
};

export const useBossEventController = (): BossEventController => {
  const setBossEvent = useSetRecoilState(bossEventState);

  /**
   * init
   */
  const init = async (): Promise<void> => {
    let res: any;
    try {
      res = await axios.post("/api/boss/get-event");
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response!.status === 500) return e.response!.data.battleResult;
        throw new Error(e.response!.data.message);
      }
      console.error(e);
      throw new Error("Unknown Error");
    }
    const eventKey = res.data.eventKey;
    const bbeId = res.data.bbeId;
    setBossEvent({ eventKey, bbeId });
  };

  /**
   * Reset
   */
  const reset = (): void => {
    setBossEvent({ eventKey: "", bbeId: "" });
  };

  const controller: BossEventController = {
    init,
    reset,
  };
  return controller;
};

export const useBossEventState = (): [BossEventState, BossEventController] => [
  useBossEventValue(),
  useBossEventController(),
];
