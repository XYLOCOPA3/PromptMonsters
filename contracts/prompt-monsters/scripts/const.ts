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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet (MCHC)
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const PROMPT_MONSTERS_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
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
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const STAMINA_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x0000000000000000000000000000000000000000" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const RESTORE_PRICE = ethers.utils.parseEther("5");
