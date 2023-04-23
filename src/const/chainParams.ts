import { Chain } from "wagmi";

// export const CHAINID_MUMBAI = "0x13881";
export const CHAINID_MUMBAI = 80001;
export const CHAINID_LINEA = "0xe704";

export const oasysSand = {
  id: 20197,
  name: "Sandverse",
  network: "sandverse",
  nativeCurrency: {
    decimals: 18,
    name: "Oasys",
    symbol: "OAS",
  },
  rpcUrls: {
    public: { http: ["https://rpc.sandverse.oasys.games/"] },
    default: { http: ["https://rpc.sandverse.oasys.games/"] },
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://scan.sandverse.oasys.games/" },
  },
} as const satisfies Chain;
