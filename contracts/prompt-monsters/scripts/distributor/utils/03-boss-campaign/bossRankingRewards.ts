import { IPromptMonstersExtension } from "../../../../typechain-types";
import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../../../const";
import { readFileSync } from "fs";
import { ethers } from "hardhat";

const PROMPT_MONSTERS_DEPLOY_BH = 21342235;
const PROMPT_MONSTERS_LAST_MINTED_BH = 24002182;
const RANKING_STD = 10;

const REWARDED_MONSTERS: IPromptMonstersExtension.MonsterExtensionStruct[] = [
  // 1位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで1位となったユーザーに送られる特別なモンスター。",
    skills: [
      "デジタルノヴァ",
      "ダブルシグネチャーリカバリー",
      "バイナリブースター",
      "ネットワークノイズ",
    ],
    lv: 1,
    hp: 40,
    atk: 20,
    def: 20,
    inte: 20,
    mgr: 15,
    agl: 15,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 2位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "Yoshka",
    flavor:
      "A super powerful enemy among those who gather data in the Cryptoworld. It speaks in gay slang. A special monster sent to the user who ranked second in the boss battle event.",
    skills: [
      "Digital Starlight",
      "Private Key Cure",
      "System Stabilizer",
      "Slow Data",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 15,
    agl: 15,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 3位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで3位となったユーザーに送られる特別なモンスター。",
    skills: [
      "デジタルブラックホール",
      "ハッシュパワーヒール",
      "ウイルスヴェール",
      "システムスランプ",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 15,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 4位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "Yoshka",
    flavor:
      "A super powerful enemy among those who gather data in the Cryptoworld. It speaks in gay slang. A special monster sent to the user who ranked fourth in the boss battle event.",
    skills: [
      "Digital Apocalypse",
      "Blockchain Revitalize",
      "Code Conditioner",
      "Data Blockade",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 5位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで5位となったユーザーに送られる特別なモンスター。",
    skills: [
      "データエクスプロージョン",
      "クリプトハートビート",
      "ネットワークノードブースト",
      "デジタルフリーズ",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 6位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで6位となったユーザーに送られる特別なモンスター。",
    skills: [
      "インフィニティコーディング",
      "ビットコインブレス",
      "データドーピング",
      "クリティカルデバフ",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 7位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで7位となったユーザーに送られる特別なモンスター。",
    skills: [
      "デジタルディザスター",
      "ディープウェブリジェネレーション",
      "ネットワークニトロ",
      "デジタルマルウェア",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 8位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで8位となったユーザーに送られる特別なモンスター。",
    skills: [
      "データデストロイヤー",
      "データドリヴンリペア",
      "システムスーパーチャージ",
      "デジタルフリーズ",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 9位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで9位となったユーザーに送られる特別なモンスター。",
    skills: [
      "クリプトシャードストーム",
      "トランザクションタッチ",
      "データドライブ",
      "クリティカルデバフ",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
  // 10位 ----------------------------------------
  {
    feature: "MCH,CryptoWorld,SuperPowerful,GaySlang",
    name: "ヨシュカ",
    flavor:
      "クリプトワールドのデータを集めるエネミーの中でも破格の超弩級エネミー。オネエ言葉でしゃべる。ボスバトルイベントで10位となったユーザーに送られる特別なモンスター。",
    skills: [
      "ディスクオブリビオン",
      "デジタルダイヤモンドデフェンス",
      "クリプトブースト",
      "データ封鎖",
    ],
    lv: 1,
    hp: 40,
    atk: 15,
    def: 20,
    inte: 20,
    mgr: 10,
    agl: 10,
    skillTypes: [101, 200, 1, 1],
    resurrectionPrompt: "",
  },
];

const IMAGE_URLS = [
  "https://ipfs.io/ipfs/bafkreifdxe3d3gckd6hnymoqxyglbgbs5pawz5fkdl7kgr2jtrpyg4gxvy",
  "https://ipfs.io/ipfs/bafkreiesmuhartekdlnv3r3tkem6b5yjokcw56jtljtlol43jiswftpb5u",
  "https://ipfs.io/ipfs/bafkreiganzeqfzzqikoxuguno5srsbygk7c4qrjxhgjs6pax6x7dq6wd3a",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
  "https://ipfs.io/ipfs/bafkreie647f6q2j42ybljdl5653caa5mnsvsi7miwze4y2mm7auy2hsgby",
];

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  console.log(
    "-------------------- get monster ID per ranking position --------------------",
  );

  const csv = readFileSync(
    "scripts/boss-battle/utils/total/20230626-044931.csv",
    {
      encoding: "utf8",
    },
  );
  const CSV = require("comma-separated-values");
  const rowList = new CSV(csv, { header: true, cast: false }).parse();
  let rankingMonsterIDs: number[] = [];
  for (let i = 0; i < RANKING_STD; i++) {
    rankingMonsterIDs.push(rowList[i].ID);
  }
  console.log(rankingMonsterIDs);

  console.log("-------------------- get owner's address --------------------");

  const startBlockHeight = PROMPT_MONSTERS_DEPLOY_BH;
  const endBlockHeight = PROMPT_MONSTERS_LAST_MINTED_BH;
  const transferEvents = await promptMonsters.queryFilter(
    promptMonsters.filters.Transfer(null, null, null),
    startBlockHeight,
    endBlockHeight,
  );

  if (transferEvents.length === 0) {
    console.error(`Transferイベントが見つかりませんでした。`);
    return;
  }

  const owners: { address: string; tokenId: string }[] = [];
  let cnt = 0;
  for (let i = 0; i < transferEvents.length; i++) {
    if (transferEvents[i].args.from === ethers.constants.AddressZero) {
      owners.push({
        address: transferEvents[i].args.to,
        tokenId: transferEvents[i].args.tokenId.toString(),
      });
      console.log(owners[cnt].tokenId, owners[cnt].address);
      cnt++;
      continue;
    }
    const tokenId = Number(transferEvents[i].args.tokenId);
    owners[tokenId].address = transferEvents[i].args.to;
    console.log("Transfer!", owners[tokenId].tokenId, owners[tokenId].address);
  }

  console.log(
    "-------------------- execute distribution for ranking rewards --------------------",
  );

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    "報酬配布を実行しても良い場合はyesと入力してください。: ",
    async (answer: string) => {
      if (answer !== "yes") {
        console.error("報酬配布中止");
        rl.close();
        return;
      }
      for (let i = 0; i < RANKING_STD; i++) {
        let rewardedMonster = REWARDED_MONSTERS[i];
        rewardedMonster.resurrectionPrompt =
          ethers.Wallet.createRandom().address;
        console.log(
          i + 1,
          owners[rankingMonsterIDs[i]].tokenId,
          owners[rankingMonsterIDs[i]].address,
          rewardedMonster,
        );
        // await (
        //   await promptMonsters
        //     .connect(from)
        //     .mintOnlyGameRole(
        //       owners[rankingMonsterIDs[i]].address,
        //       rewardedMonster,
        //       IMAGE_URLS[i],
        //     )
        // ).wait();
      }
      console.log("対象ユーザーへ報酬が配布されました。");

      console.log("-------------------- Done! --------------------");
      rl.close();
    },
  );
  rl.on("close", () => {
    process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
