import { ethers } from "ethers";

const STAGE = {
  PRODUCTION: "production",
  DEMO: "demo",
  DEVELOP: "develop",
};

// --------------------------------------------------
// Battle
// --------------------------------------------------

export const BATTLE_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x6FC068f9e25217a054c9ccf180e610d7727D17db" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BattleOffSeason
// --------------------------------------------------

export const BATTLE_OFF_SEASON_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xCc1b35874d3A6eF0FB63b3cDC265c7bCeE2C24d2" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BattleS1
// --------------------------------------------------

export const BATTLE_S1_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x21B11613829c5Bb8072fDA7Ed38fC5c5Ac8Ce714" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BossBattle
// --------------------------------------------------

export const BOSS_BATTLE_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xd717AE50569C21744Cd85078141570477E71900b" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BossBattleMch1
// --------------------------------------------------

export const BOSS_BATTLE_MCH_1_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xd73f38C35617d1b7dBCA918B7A0E040802cE07eC" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BossMonsterMchYoshka
// --------------------------------------------------

export const BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x0Fc908407c680fcBe384f7326CfFC76F4c88bbE8" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// Erc20
// --------------------------------------------------

export const ERC20_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xcC16a1AfB331ffda7A245e41845D6fAfe03C03EA" // mchMainnet (MCHC)
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown
// : "0x4d7761FdCD3cC12cBb4100A2F8CE97e9D51430aa"; // mchTestnet-demo

// --------------------------------------------------
// PromptMonsters
// --------------------------------------------------

export const PROMPT_MONSTERS_EXTERNAL_LINK = "https://prompt-monsters.com/";

export const PROMPT_MONSTERS_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xb5ACE40B20F887706A098cf6E844E768C9D55709" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const PROMPT_MONSTERS_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x496921D85003b56CE36678F368EF7c488Dd00bf3" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const MINT_PRICE = ethers.utils.parseEther("50");

// --------------------------------------------------
// PromptMonstersExtension
// --------------------------------------------------

export const PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x6c3c90C435E0918755faCA096259dD005bDc7f1E" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// PromptMonstersImage
// --------------------------------------------------

export const PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x11bb9E7bcfEf8FbDA5e68A105D3C5a2fE143210f" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// Stamina
// --------------------------------------------------

export const STAMINA_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xe5D24ab481751bcea767196107AB93e37Cb144B5" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const STAMINA_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x7058e92D08BD82aa3E1D3A6d62D7734ad30719c1" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const RESTORE_PRICE = ethers.utils.parseEther("5");
