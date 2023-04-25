import { PROMPT_MONSTERS_EXTERNAL_LINK, MCHC_PROXY_ADDRESS } from "../const";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const mintPrice: BigNumber = ethers.utils.parseEther("100");

module.exports = [PROMPT_MONSTERS_EXTERNAL_LINK, MCHC_PROXY_ADDRESS, mintPrice];
