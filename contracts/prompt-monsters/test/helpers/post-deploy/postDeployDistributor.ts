import { Distributor } from "../../../typechain-types";

export async function postDeployDistributor(
  distributor: Distributor,
  erc20Address: string,
  distributorWallet: string,
) {
  await (await distributor.setERC20Address(erc20Address)).wait();
  await (await distributor.setDistributorWallet(distributorWallet)).wait();
  return {
    distributor,
  };
}
