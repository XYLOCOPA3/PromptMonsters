import {
  BATTLE_PROXY_ADDRESS,
  PROMPT_MONSTERS_PROXY_ADDRESS,
  STAMINA_PROXY_ADDRESS,
  BATTLE_S1_PROXY_ADDRESS,
} from "../../const";
import { ethers } from "hardhat";

export async function main() {
  const Stamina = await ethers.getContractFactory("TestS");
  const stamina = Stamina.attach(STAMINA_PROXY_ADDRESS);
  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const Battle = await ethers.getContractFactory("Battle");
  const battle = Battle.attach(BATTLE_PROXY_ADDRESS);
  const BattleS1 = await ethers.getContractFactory("BattleS1");
  const battles1 = BattleS1.attach(BATTLE_S1_PROXY_ADDRESS);

  // const monsterTimeStd = await stamina.timeStd(monsterId);
  // console.log(`monsterTimeStd: ${new Date(Number(monsterTimeStd) * 1000)}`);

  // const promiseAll = Promise.all([
  //   this.wallet.getCurrentBlockHeight(),
  //   this.communityPortal.communitySupply(),
  // ]);
  // const list = await promiseAll;
  // const currentBlockHeight = startBlockHeight;
  // const communityTotalSupply = list[1];

  // const monsterId = 1;
  const monsterId = 293;
  // const monsterId = 328;
  const startBlockHeight = 21342240;
  // const startBlockHeight = 21460228;

  // const createLogsTmp = await stamina.queryFilter(
  //   stamina.filters.ConsumeStamina(monsterId, null, null),
  //   startBlockHeight,
  //   startBlockHeight + 10000,
  // );

  // const japanTime = new Date().toLocaleString("ja-JP", {
  //   timeZone: "Asia/Tokyo",
  // });
  // console.log(japanTime);
  // console.log(createLogsTmp);
  // if (createLogsTmp.length === 0) return;
  // console.log(
  //   new Date(Number(createLogsTmp[0].args.newTimeStd) * 1000).toLocaleString(
  //     "ja-JP",
  //     {
  //       timeZone: "Asia/Tokyo",
  //     },
  //   ),
  // );

  const battleLogs = await battle.getSeasonBattleDataByMonsterId(1, monsterId);
  for (let i = 0; i < battleLogs.length; i++) {
    console.log(
      new Date(Number(battleLogs[i].timestamp) * 1000).toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
      }),
    );
  }

  // const monsterIds = [];
  // for (let i = 0; i < 521; i++) {
  //   monsterIds.push(i);
  // }
  // const monsters = await promptMonsters.getMonsters(monsterIds);
  // for (let i = 0; i < monsters.length; i++) {
  //   console.log(`${i}: ${monsters[i].name}`);
  // }

  // const battleLog2 = await battles1.battleData(1);
  // console.log(
  //   new Date(Number(battleLog2.timestamp) * 1000).toLocaleString("ja-JP", {
  //     timeZone: "Asia/Tokyo",
  //   }),
  // );

  // const battleLog1 = await battles1.battleData(0);
  // console.log(
  //   new Date(Number(battleLog1.timestamp) * 1000).toLocaleString("ja-JP", {
  //     timeZone: "Asia/Tokyo",
  //   }),
  // );

  // let createLogs: ethers.EventLog[] = [];
  // while (createLogs.length < communityTotalSupply) {
  //   let endBlockHeight = startBlockHeight + MAX_REQ_BLOCK_HEIGHT;
  //   if (endBlockHeight >= currentBlockHeight) {
  //     endBlockHeight = currentBlockHeight;
  //     createLogs = [...createLogs, ...(createLogsTmp as ethers.EventLog[])];
  //     break;
  //   }
  //   const createLogsTmp = await this.communityPortal.queryFilter(
  //     this.communityPortal.filters.Create(COMMUNITY_PORTAL_ADDRESS),
  //     startBlockHeight,
  //     endBlockHeight,
  //   );
  //   startBlockHeight = endBlockHeight + 1;
  //   createLogs = [...createLogs, ...(createLogsTmp as ethers.EventLog[])];
  // }
  // if (BigInt(createLogs.length) !== communityTotalSupply)
  //   console.log("コミュニティ一覧に過不足が生じています。");
  // return createLogs;

  // const monster = await promptMonsters.getMonsters([monsterId]);
  // console.log(`monster: ${monster}`);

  // const matchCount = await battle.getSeasonMatchCount(1, monsterId);
  // const winCount = await battle.getSeasonWinCount(1, monsterId);
  // console.log(`matchCount: ${matchCount}`);
  // console.log(`winCount: ${winCount}`);

  // /**
  //  * Createイベントログを取得
  //  * @return {Promise<CreateEvent[]>} Createイベントログ
  //  */
  // getCreateEvents = async (): Promise<CreateEvent[]> => {
  //   const createLogs: ethers.EventLog[] = await this._getAllCreateLogs();
  //   const events: CreateEvent[] = [];
  //   for (let i = 0; i < createLogs.length; i++) {
  //     const createLog = createLogs[i];
  //     events.push(this._toCreateEvent(createLog));
  //   }
  //   return events;
  // };

  // /**
  //  * 全てのCreateイベントログを取得
  //  * @return {Promise<ethers.EventLog[]>} 全てのCreateイベントログ
  //  */
  // private _getAllCreateLogs = async (): Promise<ethers.EventLog[]> => {
  //   let startBlockHeight = START_BLOCK_HEIGHT;
  //   const promiseAll = Promise.all([
  //     this.wallet.getCurrentBlockHeight(),
  //     this.communityPortal.communitySupply(),
  //   ]);
  //   const list = await promiseAll;
  //   const currentBlockHeight = list[0];
  //   const communityTotalSupply = list[1];
  //   let createLogs: ethers.EventLog[] = [];
  //   while (createLogs.length < communityTotalSupply) {
  //     let endBlockHeight = startBlockHeight + MAX_REQ_BLOCK_HEIGHT;
  //     if (endBlockHeight >= currentBlockHeight) {
  //       endBlockHeight = currentBlockHeight;
  //       const createLogsTmp = await this.communityPortal.queryFilter(
  //         this.communityPortal.filters.Create(COMMUNITY_PORTAL_ADDRESS),
  //         startBlockHeight,
  //         endBlockHeight,
  //       );
  //       createLogs = [...createLogs, ...(createLogsTmp as ethers.EventLog[])];
  //       break;
  //     }
  //     const createLogsTmp = await this.communityPortal.queryFilter(
  //       this.communityPortal.filters.Create(COMMUNITY_PORTAL_ADDRESS),
  //       startBlockHeight,
  //       endBlockHeight,
  //     );
  //     startBlockHeight = endBlockHeight + 1;
  //     createLogs = [...createLogs, ...(createLogsTmp as ethers.EventLog[])];
  //   }
  //   if (BigInt(createLogs.length) !== communityTotalSupply)
  //     console.log("コミュニティ一覧に過不足が生じています。");
  //   return createLogs;
  // };

  // console.log("Before: ");
  // const role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("GAME_ROLE"));
  // const oldRoleMemberCount = await stamina.getRoleMemberCount(role);
  // for (let i = 0; i < Number(oldRoleMemberCount); i++) {
  //   console.log(await stamina.getRoleMember(role, i));
  // }
  // await (await stamina.grantRole(role, BATTLE_PROXY_ADDRESS)).wait();
  // console.log("After : ");
  // const newRoleMemberCount = await stamina.getRoleMemberCount(role);
  // for (let i = 0; i < Number(newRoleMemberCount); i++) {
  //   console.log(await stamina.getRoleMember(role, i));
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
