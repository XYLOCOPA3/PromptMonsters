import { deployDistributor } from "./Distributor";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { distributor, promptMonsters, erc20 } = await loadFixture(
    deployDistributor,
  );

  return {
    distributor,
    promptMonsters,
    erc20,
  };
}
