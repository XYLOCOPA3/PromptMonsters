import { useEffect, useLayoutEffect } from "react";

const layoutEffectOfSSR = () => {
  return typeof window !== "undefined" ? useLayoutEffect : useEffect;
};

export const useLayoutEffectOfSSR = layoutEffectOfSSR();
