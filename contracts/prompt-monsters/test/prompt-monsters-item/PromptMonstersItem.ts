import { deployPromptMonstersItem } from "../helpers/deploy/deployPromptMonstersItem";
import { postDeployPromptMonstersItem } from "../helpers/post-deploy/postDeployPromptMonstersItem";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PromptMonstersItem", function () {
  async function init() {
    const { promptMonstersItem } = await loadFixture(deployPromptMonstersItem);

    await postDeployPromptMonstersItem(
      promptMonstersItem,
      "https://prompt-monsters.com/",
    );

    return {
      promptMonstersItem,
    };
  }

  describe("Deployment", function () {
    it("deploy", async function () {
      const { promptMonstersItem } = await loadFixture(init);
      expect(promptMonstersItem.address).to.not.equal(
        ethers.constants.AddressZero,
        "zero address",
      );
    });
  });

  describe("Main Logic", function () {
    // TODO: Main Logic のテストコードを書く
  });
});
