import { deployErc20 } from "./Erc20";
import { deployPromptMonsters } from "./PromptMonsters";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const deploy = async (
  deployer: SignerWithAddress,
  promptMonstersWallet: SignerWithAddress,
) => {
  const { erc20 } = await deployErc20(deployer);

  const { promptMonsters } = await deployPromptMonsters(
    deployer,
    erc20.address,
    promptMonstersWallet,
  );

  return {
    promptMonsters,
    erc20,
  };
};
