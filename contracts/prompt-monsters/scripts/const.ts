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
    ? "0xE00E862858f0F76aA288654d115622375C47117B" // mchMainnet
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
    ? "0x1A9D1A265D6B819B865A98696798d3Be6b2C6890" // mchMainnet
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
    ? "0x883Ed8E11cD079Dfd4F6a099C7E0D38482068091" // mchMainnet
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
    ? "0x39e65ed32C3b4De62CE8D06AC6Fe82180aE390cC" // mchMainnet
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
    ? "0x3df891CCf98ED589C8B63f8faff61788A657a03b" // mchMainnet
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
    ? "0x7BE83F42D3210BaEE0a7901bc5eE4a847dAe110e" // mchMainnet
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
    ? "0x9671fC7d11407D78eF61C519dc38cE7F60A6B9E2" // mchMainnet (MCHC)
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
    ? "0xdb0616E38353149B3b5A88c4358cC42bAc1ca2C4" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const PROMPT_MONSTERS_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchMainnet
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
    ? "0x5c4AE53E605F0444D22c9393486F160983D8fdF8" // mchMainnet
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
    ? "0xDDA4dF4b0054844aBcf77Dec30C226eC54Fa043F" // mchMainnet
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
    ? "0xAA074532A70DAFF30ff6d4880A854B1307f7ed38" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const STAMINA_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x0000000000000000000000000000000000000000" // mchTestnet-develop
    : "0x0000000000000000000000000000000000000000"; // unknown

export const RESTORE_PRICE = ethers.utils.parseEther("5");
