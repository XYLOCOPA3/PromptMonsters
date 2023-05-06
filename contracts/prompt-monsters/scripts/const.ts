import { ethers } from "ethers";

const IS_PRODUCTION = process.env.IS_PRODUCTION === "false";

// --------------------------------------------------
// Battle
// --------------------------------------------------

export const BATTLE_PROXY_ADDRESS = IS_PRODUCTION
  ? "0x9188b411F66E52cF17D9a2B92Cbc27c7b35a9aBC" // mchMainnet
  : "0x2dbD40185E9b629Ee9373999B7E737fb84C4B86c"; // mchTestnet

// --------------------------------------------------
// BattleOffSeason
// --------------------------------------------------

export const BATTLE_OFF_SEASON_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xCE48e1b308416F711DA2ea2FebDF6BC8d29459F6" // mchMainnet
  : "0x534d55E50aEbC362C46396F653AC41A8f17b2A32"; // mchTestnet

// --------------------------------------------------
// BattleS1
// --------------------------------------------------

export const BATTLE_S1_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xdca2693a05946f5F82c3869f675daA91BFa91dce" // mchMainnet
  : "0xc79BB7EA1c8523779091C4c233665137461a3047"; // mchTestnet

// --------------------------------------------------
// PromptMonsters
// --------------------------------------------------

export const PROMPT_MONSTERS_EXTERNAL_LINK = "https://prompt-monsters.com/";

export const PROMPT_MONSTERS_PROXY_ADDRESS = IS_PRODUCTION
  ? "0x12C7aA85c8BE2b32bdCfC013Da08347EeE95c238" // mchMainnet
  : "0x0ed094ac867F77e56777524B59C640157BEedF84"; // mchTestnet
// "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // local node
// "0xe6B107017D265F6cD61509C0C578abac44832f2c"; // sandverse
// "0xB6982232e0464A6201dFC2635E05Ff1CB0FAA9A2"; // mumbai
// "0x2fB0455276cB8577458a97033E9cb7245aa3CAD3"; // linea

export const PROMPT_MONSTERS_WALLET =
  "0x496921D85003b56CE36678F368EF7c488Dd00bf3";

export const MINT_PRICE = ethers.utils.parseEther("50");

// --------------------------------------------------
// Stamina
// --------------------------------------------------

export const STAMINA_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xA1485837B3958F61ce494f71f368CF5477C5C3FB" // mchMainnet
  : "0x76C321d318a379F8F439Cae9a2a0eD267b0eA89A"; // mchTestnet

// --------------------------------------------------
// Mock
// --------------------------------------------------

export const MCHC_ADDRESS = IS_PRODUCTION
  ? "0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3" // mchMainnet
  : "0x4d7761FdCD3cC12cBb4100A2F8CE97e9D51430aa"; // mchTestnet
// "0x5FbDB2315678afecb367f032d93F642f64180aa3" // local node
