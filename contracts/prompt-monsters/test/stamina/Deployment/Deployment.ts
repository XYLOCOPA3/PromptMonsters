import { deployStamina } from "./Stamina";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

export async function deploy() {
  const { stamina } = await loadFixture(deployStamina);

  return {
    stamina,
  };
}
