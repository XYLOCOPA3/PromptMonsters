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

export const mchVerseTestnet = {
  id: 420,
  name: "MCH Verse Testnet",
  network: "mchVerseTestnet",
  nativeCurrency: {
    decimals: 18,
    name: "Oasys",
    symbol: "OAS",
  },
  rpcUrls: {
    public: { http: ["https://rpc.oasys.sand.mchdfgh.xyz/"] },
    default: { http: ["https://rpc.oasys.sand.mchdfgh.xyz/"] },
  },
  blockExplorers: {
    default: {
      name: "SnowTrace",
      url: "https://explorer.oasys.sand.mchdfgh.xyz/",
    },
  },
} as const satisfies Chain;

export const mchVerseMainnet = {
  id: 29548,
  name: "MCH Verse Mainnet",
  network: "mchVerseMainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Oasys",
    symbol: "OAS",
  },
  rpcUrls: {
    public: { http: ["https://rpc.oasys.mycryptoheroes.net/"] },
    default: { http: ["https://rpc.oasys.mycryptoheroes.net/"] },
  },
  blockExplorers: {
    default: {
      name: "SnowTrace",
      url: "https://explorer.oasys.mycryptoheroes.net/",
    },
  },
} as const satisfies Chain;

// export const mchVerse = mchVerseTestnet;

export const mchVerse =
  process.env.NEXT_PUBLIC_IS_PRODUCTION === "true"
    ? mchVerseMainnet
    : mchVerseTestnet;
