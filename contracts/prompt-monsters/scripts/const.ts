import { ethers } from "ethers";

// demo環境に変更したい場合は.envのIS_PRODUCTIONをfalseにする
// ここを直接変更しないこと
const IS_PRODUCTION = process.env.IS_PRODUCTION === "true";
const IS_DEMO_MUMBAI = process.env.IS_DEMO_MUMBAI === "true";

// --------------------------------------------------
// Battle
// --------------------------------------------------

export const BATTLE_PROXY_ADDRESS = IS_PRODUCTION
  ? "0x9188b411F66E52cF17D9a2B92Cbc27c7b35a9aBC" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0xcc3D4D2FfB0c84631dFFe9ad1Dc0e00880005003" // mumbai
  : "0x263491c4195bc2b52C8db4aC90bEA2A91EB35e7b"; // sandverse
// : "0x2dbD40185E9b629Ee9373999B7E737fb84C4B86c"; // mchTestnet

// --------------------------------------------------
// BattleOffSeason
// --------------------------------------------------

export const BATTLE_OFF_SEASON_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xCE48e1b308416F711DA2ea2FebDF6BC8d29459F6" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0x00cb1822ecbA725B17cb2Aa24bD1D5A760859E4C" // mumbai
  : "0x9A911e97ded3d9D3dF87039Ba301701Dd8A6f1Cf"; // sandverse
// : "0x534d55E50aEbC362C46396F653AC41A8f17b2A32"; // mchTestnet

// --------------------------------------------------
// BattleS1
// --------------------------------------------------

export const BATTLE_S1_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xdca2693a05946f5F82c3869f675daA91BFa91dce" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0x9A911e97ded3d9D3dF87039Ba301701Dd8A6f1Cf" // mumbai
  : "0xa9d11fF4Ea7016882DF3111ec9298d6606337E4E"; // sandverse
// : "0xc79BB7EA1c8523779091C4c233665137461a3047"; // mchTestnet

// --------------------------------------------------
// PromptMonsters
// --------------------------------------------------

export const PROMPT_MONSTERS_EXTERNAL_LINK = "https://prompt-monsters.com/";

export const PROMPT_MONSTERS_PROXY_ADDRESS = IS_PRODUCTION
  ? "0x12C7aA85c8BE2b32bdCfC013Da08347EeE95c238" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0x756024Cc282399Ce177e7aD28a051577FdDAd941" // mumbai
  : "0xBc4Ec1af944C327DE0c9F05AaAA78C82Be105b99"; // sandverse
// : "0x0ed094ac867F77e56777524B59C640157BEedF84"; // mchTestnet
// "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // local node
// "0x2fB0455276cB8577458a97033E9cb7245aa3CAD3"; // linea

export const PROMPT_MONSTERS_WALLET = IS_PRODUCTION
  ? "0x496921D85003b56CE36678F368EF7c488Dd00bf3" // mchMainnet
  : "0x24a3A61ce4d7a52aE0F589f44CE0e61aE3a433b2"; // sandverse && mumbai
// : "0x496921D85003b56CE36678F368EF7c488Dd00bf3" // mchTestnet

export const MINT_PRICE = ethers.utils.parseEther("50");

// --------------------------------------------------
// PromptMonstersImage
// --------------------------------------------------

export const PROMPT_MONSTERS_IMAGE_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xfCe6237F5CBB539bd3a116Dd9b949920aE01Df58" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0xDe6feA77f2743dC4a9EA96b5f2175b11FC3773eb" // mumbai
  : "0x09e7D584A6ba8fA0a6C815d4e4F261732a7b23D5"; // sandverse
// : "0x757731511815ddfd3c5e43DB29C33B22C43d431e"; // mchTestnet

// --------------------------------------------------
// Stamina
// --------------------------------------------------

export const STAMINA_PROXY_ADDRESS = IS_PRODUCTION
  ? "0xA1485837B3958F61ce494f71f368CF5477C5C3FB" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0x26147BECd49858893F51F5547A0715E977ED32c9" // mumbai
  : "0x705A4cDFe5Fa935e0228bd880902c916cf53D9Bb"; // sandverse
// : "0x76C321d318a379F8F439Cae9a2a0eD267b0eA89A"; // mchTestnet

export const RESTORE_PRICE = ethers.utils.parseEther("5");

// --------------------------------------------------
// Mock
// --------------------------------------------------

export const MOCK_ERC20_ADDRESS = IS_PRODUCTION
  ? "0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3" // mchMainnet
  : IS_DEMO_MUMBAI
  ? "0x705A4cDFe5Fa935e0228bd880902c916cf53D9Bb" // mumbai
  : "0x6b97Ed2a2AC3A74Fa5206732af618dA4d4EaC6B7"; // sandverse
// : "0x4d7761FdCD3cC12cBb4100A2F8CE97e9D51430aa"; // mchTestnet
// "0x5FbDB2315678afecb367f032d93F642f64180aa3" // local node
