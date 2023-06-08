import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { DISTRIBUTOR_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);

  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(DISTRIBUTOR_PROXY_ADDRESS);

  const startBlockHeight = 21342235;
  const endBlockHeight = 22542235;

  const createLogsTmp = await promptMonsters.queryFilter(
    promptMonsters.filters.MintedMonster(null, null, null),
    startBlockHeight,
    startBlockHeight + 1200000,
  );

  if (createLogsTmp.length === 0) return;

  const owners: (any | any)[][] = [];

  for (var i = 0; i < createLogsTmp.length; i++) {
    owners.push([
      createLogsTmp[i].args.newTokenId.toString(),
      createLogsTmp[i].args.tokenOwner,
    ]);
    const t = await createLogsTmp[i].getBlock();
  }

  console.log("");
  console.log(
    "---------------------------------- display owners --------------------------------------------------------------",
  );

  for (var i = 0; i < owners.length; i++) {
    console.log(owners[i][0] + ", " + owners[i][1]);
  }

  console.log("");
  console.log(
    "---------------------------------- execute distribution for present per mint ----------------------------------",
  );

  for (var i = 0; i < owners.length; i++) {
    const distribution = await distributor //.connect(addr1).を使ってdistributor用のウォレットで関数を実行する
      .connect(from)
      .distributeNativeToken(owners[i][1], {
        value: ethers.utils.parseEther("0.01"),
      });
    await distribution.wait();
  }

  console.log("");
  console.log(
    "---------------------------------- Done! ----------------------------------",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
