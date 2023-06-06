import { PROMPT_MONSTERS_PROXY_ADDRESS } from "../const";
import { DISTRIBUTOR_PROXY_ADDRESS } from "../const";
import { ethers } from "hardhat";

export async function main() {
  const [deployer, from] = await ethers.getSigners();
  console.log("account: ", deployer.address);
  console.log("from account: ", from.address);

  // const PromptMonsters = await ethers.getContractFactory("PromptMonsters");
  // const promptMonsters = PromptMonsters.attach(PROMPT_MONSTERS_PROXY_ADDRESS);
  const Distributor = await ethers.getContractFactory("Distributor");
  const distributor = Distributor.attach(DISTRIBUTOR_PROXY_ADDRESS);

  const totalSupply = 4; // 940;
  console.log(`totalSupply: ${totalSupply}`);

  const owners: (any | any)[][] = [
    [0, "0x019281ce34F8b8739991713D5E09D0C290B53886"],
    [1, "0x019281ce34F8b8739991713D5E09D0C290B53886"],
    [2, "0x31F31693723c4397cb8A978A19A95B82c72f4212"],
    [3, "0x4833C2fB6F00787c7F5f60a7F1a8aD9e191648C8"],
  ];

  console.log("");
  console.log(
    "---------------------------------- execute distribution for present per mint ----------------------------------",
  );

  for (var i = 0; i < totalSupply; i++) {
    const distribution = await distributor //.connect(addr1).を使ってdistributor用のウォレットで関数を実行する
      .connect(from)
      .distributeNativeToken(owners[i][1], {
        value: ethers.utils.parseEther("0.01"),
      });
    await distribution.wait();
    //console.log("[" + i + ',"' + (await promptMonsters.ownerOf(i)) + '"],');
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
