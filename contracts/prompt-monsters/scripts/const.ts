import { ethers } from "ethers";

const STAGE = {
  PRODUCTION: "production",
  DEMO: "demo",
  DEVELOP: "develop",
  MUMBAI: "mumbai",
};

// --------------------------------------------------
// Battle
// --------------------------------------------------

export const BATTLE_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x9188b411F66E52cF17D9a2B92Cbc27c7b35a9aBC" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x2dbD40185E9b629Ee9373999B7E737fb84C4B86c" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x00cb1822ecbA725B17cb2Aa24bD1D5A760859E4C" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x395EEdDC9420e34Ee81dc8E361508b898a343f6e" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BattleOffSeason
// --------------------------------------------------

export const BATTLE_OFF_SEASON_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xCE48e1b308416F711DA2ea2FebDF6BC8d29459F6" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x534d55E50aEbC362C46396F653AC41A8f17b2A32" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x9A911e97ded3d9D3dF87039Ba301701Dd8A6f1Cf" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0xA041b751EE85105E441C5F8814FD4b0B474a058D" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BattleS1
// --------------------------------------------------

export const BATTLE_S1_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xdca2693a05946f5F82c3869f675daA91BFa91dce" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0xc79BB7EA1c8523779091C4c233665137461a3047" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0xa9d11fF4Ea7016882DF3111ec9298d6606337E4E" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x6C7F655670F5845D7F68E2c21Ae0c22F344E5036" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BossBattle
// --------------------------------------------------

export const BOSS_BATTLE_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x9BC30aA7E6352608bF556d8E30dCCF99d221Be8F" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0ab8a738c835C5F496753cE5FB9A5341bc5aa538" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0xBc4Ec1af944C327DE0c9F05AaAA78C82Be105b99" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0xc4652474aF5160563A16cDe9BDc07F0259FFE482" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BossBattleMch1
// --------------------------------------------------

export const BOSS_BATTLE_MCH_1_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xbc35D59b01EB90a418f3D555Fa38112224d94176" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0xa552Dfc121a54a8cd22773C016C3a69c9b37691d" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x705A4cDFe5Fa935e0228bd880902c916cf53D9Bb" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x5DA711CcA731BC8937bd3C70eB786054eD6b8e83" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// BossMonsterMchYoshka
// --------------------------------------------------

export const BOSS_MONSTER_MCH_YOSHKA_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x8aeB00028253fea900c80E2640f207f81E0556cD" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0xc365Fa73bA01793594Bf4E737d683bAC2518490f" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0xe8023CF925430ef4a1e98D7FfCf952d5B1Bb3c9c" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x1d0E2050E412734B2b4Bee781884598eFA3D5DBd" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const BOSS_MONSTER_MCH_YOSHKA_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x7789E4a1EB5700D6BfbF8A558eFa6aC66AE4d401" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const BOSS_MINT_PRICE = ethers.utils.parseEther("50");

// --------------------------------------------------
// Distributor
// --------------------------------------------------

export const DISTRIBUTOR_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x923e436feE3e17999C3B5bC4D3F3BD0468932c10" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0xF37916933241c997Fe08E4e205DFa9A5536aD2B7" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x4f3C95cfB16a9E614fAE778C3271E33C86b50c0C" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x6771Fbf20245CA6458913E416419Db104D27d5Db" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const DISTRIBUTOR_ERC20_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3" // mchMainnet (MCHC)
    : process.env.STAGE === STAGE.DEMO
    ? "0x4963d076a99b55ACe34B754D400dcDb99AA5990f" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x4963d076a99b55ACe34B754D400dcDb99AA5990f" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x6Ac6fb7d4A1eD651a9a6b4A338dB36Ae6eA5Db5f" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const DISTRIBUTOR_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xb506264B57B1e8371f94f06292eD5b670d25eaB1" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// Erc20
// --------------------------------------------------

export const ERC20_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3" // mchMainnet (MCHC)
    : process.env.STAGE === STAGE.DEMO
    ? "0x4963d076a99b55ACe34B754D400dcDb99AA5990f" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x4963d076a99b55ACe34B754D400dcDb99AA5990f" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x6Ac6fb7d4A1eD651a9a6b4A338dB36Ae6eA5Db5f" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// PromptMonsters
// --------------------------------------------------

export const PROMPT_MONSTERS_EXTERNAL_LINK = "https://prompt-monsters.com/";

export const PROMPT_MONSTERS_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x12C7aA85c8BE2b32bdCfC013Da08347EeE95c238" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x0ed094ac867F77e56777524B59C640157BEedF84" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x7bCc71C179079D759d88aF78ec012Ad9bEE79Adb" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x9e7390b8671700C03615c5a73059f0473319E733" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const PROMPT_MONSTERS_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x496921D85003b56CE36678F368EF7c488Dd00bf3" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const MINT_PRICE = ethers.utils.parseEther("50");

// --------------------------------------------------
// PromptMonstersExtension
// --------------------------------------------------

export const PROMPT_MONSTERS_EXTENSION_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x7EA9BF1D136A9F38680B25A1072F4EdF94A62BF7" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0xb67a019b7D1871401132badc51571049149fB513" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x3CB81109A58bd3BBC852d9232Fb01b6D88C1311B" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0xeba0F64c53A9B73EA27F26F19447B4A188301DfB" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// PromptMonstersImage
// --------------------------------------------------

export const PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xfCe6237F5CBB539bd3a116Dd9b949920aE01Df58" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x757731511815ddfd3c5e43DB29C33B22C43d431e" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x85c0535a4D8084ac3755DA711027d2646D501D65" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x324De10f916671FDeB61793164f3dAdE01DD673f" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

// --------------------------------------------------
// PromptMonstersItem
// --------------------------------------------------

export const PROMPT_MONSTERS_ITEM_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xCab65839D189F55314f40476c52513BF991Fb18A" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x30d8d59e82de015836F91d4A68Da6A0cE43E2010" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x210A4Ca14cA638A1e4f4C012b81d1599d59A32F6" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x5eDf509FE16B6c4a486e1fcF595b526b2e146382" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const PROMPT_MONSTERS_ITEM_EXTERNAL_LINK =
  "https://prompt-monsters.com/";

// --------------------------------------------------
// Stamina
// --------------------------------------------------

export const STAMINA_PROXY_ADDRESS =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0xA1485837B3958F61ce494f71f368CF5477C5C3FB" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x76C321d318a379F8F439Cae9a2a0eD267b0eA89A" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0xA33934a3286Edb7BD1b07ceA4720Dc5e24349127" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x71CdC2d8d92B38bFb650a74BF97Fea4d21399B4E" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const STAMINA_WALLET =
  process.env.STAGE === STAGE.PRODUCTION
    ? "0x7058e92D08BD82aa3E1D3A6d62D7734ad30719c1" // mchMainnet
    : process.env.STAGE === STAGE.DEMO
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-demo
    : process.env.STAGE === STAGE.DEVELOP
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // mchTestnet-develop
    : process.env.STAGE === STAGE.MUMBAI
    ? "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2" // polygon-mumbai
    : "0x0000000000000000000000000000000000000000"; // unknown

export const RESTORE_PRICE = ethers.utils.parseEther("5");
