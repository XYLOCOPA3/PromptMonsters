import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import { HardhatUserConfig } from "hardhat/config";

require("dotenv").config();

const { POLYGON_MUMBAI_ALCHEMY_KEY, PRIVATE_KEY, POLYGONSCAN_API } =
  process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    mumbai: {
      url: POLYGON_MUMBAI_ALCHEMY_KEY,
      accounts: [PRIVATE_KEY as string],
    },
    linea: {
      url: `https://rpc.goerli.linea.build/`,
      accounts: [PRIVATE_KEY as string],
    },
    sandverse: {
      url: "https://rpc.sandverse.oasys.games/",
      chainId: 20197,
      accounts: [PRIVATE_KEY as string],
      gasPrice: 0,
    },
    mchMainnet: {
      url: "https://rpc.oasys.mycryptoheroes.net/",
      chainId: 29548,
      accounts: [PRIVATE_KEY as string],
      gasPrice: 0,
    },
    mchTestnet: {
      url: "https://rpc.oasys.sand.mchdfgh.xyz/",
      chainId: 420,
      accounts: [PRIVATE_KEY as string],
      gasPrice: 0,
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API,
  },
};

export default config;
