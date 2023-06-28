import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";

require("dotenv").config();

const {
  POLYGON_MUMBAI_ALCHEMY_KEY,
  PRIVATE_KEY,
  DEV_PRIVATE_KEY,
  LOCAL_PRIVATE_KEY,
  DISTRIBUTOR_PRIVATE_KEY,
  DEV_DISTRIBUTOR_PRIVATE_KEY,
  POLYGONSCAN_API,
} = process.env;

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
    mchMainnet: {
      url: "https://rpc.oasys.mycryptoheroes.net/",
      chainId: 29548,
      accounts: [PRIVATE_KEY as string, DISTRIBUTOR_PRIVATE_KEY as string],
      gasPrice: 0,
    },
    mchTestnet: {
      url: "https://rpc.oasys.sand.mchdfgh.xyz/",
      chainId: 420,
      accounts: [
        DEV_PRIVATE_KEY as string,
        DEV_DISTRIBUTOR_PRIVATE_KEY as string,
      ],
      gasPrice: 0,
    },
    local: {
      url: "http://localhost:8545",
      accounts: [
        LOCAL_PRIVATE_KEY as string,
        DEV_DISTRIBUTOR_PRIVATE_KEY as string,
      ],
    },
    mumbai: {
      url: POLYGON_MUMBAI_ALCHEMY_KEY,
      accounts: [
        DEV_PRIVATE_KEY as string,
        DEV_DISTRIBUTOR_PRIVATE_KEY as string,
      ],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API,
  },
};

export default config;
