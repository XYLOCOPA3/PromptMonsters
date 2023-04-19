import { Provider } from "@wagmi/core";
import { useProvider } from "wagmi";

export interface ProviderController {
  login: () => Promise<void>;
}

export const useProviderValue = (): Provider => {
  return useProvider();
};

export const useProviderController = (): ProviderController => {
  /**
   * Login
   */
  const login = async (): Promise<void> => {};

  const controller: ProviderController = {
    login,
  };
  return controller;
};

export const useProviderState = (): [Provider, ProviderController] => [
  useProviderValue(),
  useProviderController(),
];
