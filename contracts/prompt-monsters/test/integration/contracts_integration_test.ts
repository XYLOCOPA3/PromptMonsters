import { deploy } from "./Deployment/Deployment";
import { ethers } from "hardhat";

describe("Integration Test", function () {
  before(async () => {
    const [deployer, promptMonstersWallet, user1, user2] =
      await ethers.getSigners();

    const {
      promptMonsters,
      erc20,
      stamina,
      battle,
      battleOffSeason,
      battleS1,
    } = await deploy(deployer, promptMonstersWallet);
  });

  it("Deploy", async function () {});
});
