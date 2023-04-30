import { deploy } from "./Deployment/Deployment";
import { ethers } from "hardhat";

describe("Integration Test", function () {
  before(async () => {
    const [deployer, promptMonstersWallet, user1, user2] =
      await ethers.getSigners();

    const { erc20, promptMonsters } = await deploy(
      deployer,
      promptMonstersWallet,
    );
  });

  it("Deploy", async function () {});
});
