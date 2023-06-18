import { ethers } from "hardhat";

export const getWallets = async (cntWallet: number) => {
  const mnemonic =
    process.env.STAGE === "production"
      ? process.env.GAME_ROLE_MNEMONIC
      : process.env.DEV_GAME_ROLE_MNEMONIC;
  console.log("mnemonic", mnemonic);
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic!);

  const wallets: any = [];
  for (let i = 0; i < cntWallet; i++) {
    const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
    wallets.push(wallet);
  }
  return wallets;
};

export const getNowDate = () => {
  // 現在時刻（日本標準時刻）
  // フォーマットは YYYYMMDD-HHMMSS とする
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");
  const formattedDate = `${year}${month}${day}-${hour}${minute}${second}`;
  const nowJST = now.toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  return [nowJST, formattedDate];
};
