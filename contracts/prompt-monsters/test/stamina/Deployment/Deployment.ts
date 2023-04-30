import { deployStamina } from "./Stamina";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { stamina, promptMonsters, erc20 } = await loadFixture(deployStamina);

  return {
    stamina,
    promptMonsters,
    erc20,
  };
}
